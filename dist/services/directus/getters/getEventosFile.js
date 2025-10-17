export const getEventosFile = async (imageId, token) => {
    try {
        const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/eventos_files/${imageId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.error("Error fetching event image:", await response.text());
            return "";
        }
        let data = await response.json();
        data = data.data;
        console.log("Fetched event image data:", data);
        // Añadimos el prefijo de la URL
        const returnString = `https://admin.festmyd.esmeralda-cw.com/assets/${data.directus_files_id}`;
        return returnString;
    }
    catch (error) {
        console.error("Error fetching event image:", error);
        return "";
    }
};
