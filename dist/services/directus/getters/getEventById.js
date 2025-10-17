import { parseEventData } from '../parsing/parseEventData.js';
export const getEventById = async (eventId, token) => {
    //  const token = await getFrontendToken();
    // Hacer la petición del archivo
    const eventsFetch = await fetch('https://admin.festmyd.esmeralda-cw.com/items/eventos/' + eventId, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    // Procesar la respuesta como un json
    let eventData = null;
    if (eventsFetch.ok) {
        eventData = await eventsFetch.json();
        eventData = eventData.data; // Asegurarse de acceder a la propiedad 'data'
    }
    else {
        return null;
    }
    console.log("GetEventbyId: Event data from directus: ", eventData);
    // Parsear los datos del evento
    const event = await parseEventData(eventData, token, { fullDescription: true });
    return event;
};
