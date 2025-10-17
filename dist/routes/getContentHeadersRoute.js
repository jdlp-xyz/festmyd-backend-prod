import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
/** Ruta para obtener los escabezados de los contenidos */
export const getContentHeadersRoute = async (req, res) => {
    try {
        // Obtener el token de acceso para el frontend
        const token = await getFrontendToken();
        const allContentHeaders = [];
        const fields = ["contenidoId", "estaPublicado", "titulo", "bajada", "imagenBanner", "tipoDePublicacion", "linkExterno", "etiquetaLink"];
        const query = "?fields=" + fields.join(",");
        console.log("Query para obtener los encabezados de contenido:", query);
        // Hacer una petición manual de los eventos con fetch
        const contentHeadersFetch = await fetch("https://admin.festmyd.esmeralda-cw.com/items/contenidos" + query, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Respuesta de la petición de encabezados de contenido:", contentHeadersFetch);
        let contentHeadersData = null;
        if (contentHeadersFetch.ok) {
            contentHeadersData = await contentHeadersFetch.json();
        }
        // Procesar los eventos obtenidos en el formato de entrega
        for (const contentHeaderData of contentHeadersData.data) {
            allContentHeaders.push(contentHeaderData);
        }
        // Filtrar solo los eventos que estan publicados
        const publishedContentHeaders = allContentHeaders.filter((contentHeader) => contentHeader.estaPublicado);
        const structuredContentHeaders = {
            staticPages: publishedContentHeaders.filter(ch => ch.tipoDePublicacion === "paginaEstatica"),
            news: publishedContentHeaders.filter(ch => ch.tipoDePublicacion === "noticia"),
            featuredBanner: publishedContentHeaders.filter(ch => ch.tipoDePublicacion === "bannerDestacado")[0] || null, // Solo uno
        };
        // Devolver la respuesta
        res.json({
            success: true,
            message: "Lista de escabezados de contenidos",
            data: structuredContentHeaders,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los encabezados de contenido",
            error: process.env.NODE_ENV === "development"
                ? error instanceof Error
                    ? error.message
                    : String(error)
                : "Error interno",
        });
    }
};
