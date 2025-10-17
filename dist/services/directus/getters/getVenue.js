export const getVenue = async (venueId, accessToken) => {
    //console.log("Get Venue: Fetching venues for", venueId, "with access token", accessToken);
    const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/espaciosCulturales/${venueId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        console.error("Error fetching venue:", await response.text());
        // Return default venue if fetch fails
        return {
            name: "Venue no disponible",
            description: "",
            address: "",
            city: ""
        };
    }
    const data = await response.json();
    if (!data.data) {
        console.error("Unexpected venue data format:", data);
        return {
            name: "Venue no disponible",
            description: "",
            address: "",
            city: ""
        };
    }
    const venueData = data.data;
    const venue = {
        name: venueData.nombre || "Venue no disponible",
        avatarImageUrl: venueData.avatar,
        description: "", // No hay descripción en los campos proporcionados
        address: venueData.direccion || "",
        city: venueData.ciudad || "",
        contactInfo: {
            website: venueData.link
        }
    };
    return venue;
};
