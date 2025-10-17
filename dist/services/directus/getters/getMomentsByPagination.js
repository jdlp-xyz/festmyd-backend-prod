export const getMomentsByPagination = async (offset, limit, token) => {
    // Construir la URL con los parámetros de paginación
    const url = new URL('https://admin.festmyd.esmeralda-cw.com/items/galeria');
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());
    // Hacer la petición
    const galeryFetch = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    // Procesar la respuesta
    let momentsData = null;
    if (galeryFetch.ok) {
        momentsData = await galeryFetch.json();
        momentsData = momentsData.data; // Acceder a la propiedad 'data'
    }
    else {
        return null;
    }
    console.log("getMomentsByPagination: Moments data from directus: ", momentsData);
    const moments = momentsData;
    return moments;
};
