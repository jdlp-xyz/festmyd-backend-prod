import { getFrontendToken } from "../services/directus/admin/getFrontendToken.js";
export const getSingleContentRoute = async (req, res) => {
    const contentId = req.params.contentId;
    const token = await getFrontendToken();
    // Asegurarse de que contentId está presente
    if (!contentId) {
        return res.status(400).json({
            success: false,
            message: "Falta el ID de contenido"
        });
    }
    // Hacer el fetch a Directus
    try {
        const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/contenidos/${contentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error("Error fetching content:", await response.text());
            return res.status(404).json({
                success: false,
                message: "Contenido no encontrado"
            });
        }
        const data = await response.json();
        if (!data.data) {
            console.error("Unexpected content data format:", data);
            return res.status(500).json({
                success: false,
                message: "Formato de datos inesperado"
            });
        }
        // Responder con los datos del contenido
        res.json({
            success: true,
            message: `Contenido con ID ${contentId} obtenido`,
            data: data.data
        });
    }
    catch (error) {
        console.error(`Error al obtener contenido con ID ${contentId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error al obtener contenido",
            error: process.env.NODE_ENV === "development" ? error.message : "Error interno"
        });
    }
};
