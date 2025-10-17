import { getVenue } from './getVenue.js';
import { getFreeSeatsNumber } from './getFreeSeatsNumber.js';
export const getEventDates = async (eventId, accessToken) => {
    const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/fechasEventos?filter[eventosRel][_eq]=${eventId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        console.error("Error fetching event dates:", await response.text());
        return [];
    }
    // Parsear los datos de la respuesta (solo una vez)
    const data = (await response.json());
    //console.log("Fetch successful:", data);
    // Comprobar que data es un array
    if (!Array.isArray(data.data)) {
        console.error("Unexpected data format:", data);
        return [];
    }
    // Parseo
    // Usar Promise.all para manejar las operaciones async correctamente
    const eventDatePromises = data.data.map(async (element) => {
        const eventDate = {
            eventDateId: element.fechasId,
            isPublished: element.estaPublicado,
            eventId: element.eventosRel,
            date: element.fecha,
            seats: element.asientos,
            availableSeats: await getFreeSeatsNumber(element.fechasId, accessToken),
            time: element.hora?.substring(0, 5) || "00:00",
            venue: await getVenue(element.espacioCultural, accessToken),
            isSoldOut: element.estaAgotado,
        };
        return eventDate;
    });
    const resolvedEventDates = await Promise.all(eventDatePromises);
    // Filtrar solo las fechas de eventos publicadas
    const eventDates = resolvedEventDates.filter((eventDate) => eventDate.isPublished);
    return eventDates;
};
