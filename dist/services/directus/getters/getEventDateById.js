import { getVenue } from './getVenue.js';
export const getEventDateById = async (eventDateId, accessToken) => {
    const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/fechasEventos/${eventDateId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        console.error("Error fetching event date:", await response.text());
        return null;
    }
    // Parsear los datos de la respuesta
    const data = await response.json();
    // console.log("Fetch successful:", data);
    // Comprobar que data existe
    if (!data.data) {
        console.error("Unexpected data format:", data);
        return null;
    }
    const element = data.data;
    const eventDate = {
        isPublished: element.estaPublicado,
        eventDateId: element.fechasId,
        eventId: element.eventosRel,
        date: element.fecha,
        time: element.hora?.substring(0, 5) || "00:00",
        venue: await getVenue(element.espacioCultural, accessToken),
        seats: element.asientos,
        availableSeats: element.asientosDisponibles,
        isSoldOut: element.estaAgotado
    };
    return eventDate;
};
