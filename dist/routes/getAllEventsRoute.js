import { parseEventData } from '../services/directus/parsing/parseEventData.js';
import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
// Define el tipo para un evento (ajusta según tu estructura)
// Define el schema de Directus
export const getAllEventsRoute = async (req, res) => {
    try {
        const token = await getFrontendToken();
        const allEvents = [];
        // 3. Hacer una petición manual de los eventos con fetch
        const eventsFetch = await fetch("https://admin.festmyd.esmeralda-cw.com/items/eventos", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        // Procesar la respuesta como un json
        let eventsData = null;
        if (eventsFetch.ok) {
            eventsData = await eventsFetch.json();
        }
        // Procesar los eventos obtenidos en el formato de entrega
        for (const eventData of eventsData.data) {
            const event = (await parseEventData(eventData, token, {
                fullDescription: false,
            }));
            allEvents.push(event);
        }
        // Filtrar solo los eventos que estan publicados
        const events = allEvents.filter((event) => event.isPublished);
        // Devolver la respuesta
        res.json({
            success: true,
            message: "Lista de eventos",
            data: events,
        });
    }
    catch (error) {
        console.error('Error en endpoint /events:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener eventos',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};
