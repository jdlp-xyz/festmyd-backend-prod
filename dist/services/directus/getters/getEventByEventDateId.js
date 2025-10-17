import { getEventById } from "./getEventById.js";
import { getEventDateById } from "./getEventDateById.js";
export const getEventByEventDateId = async (eventDateId, token) => {
    try {
        const eventDate = await getEventDateById(eventDateId, token);
        if (!eventDate) {
            return null;
        }
        const evento = await getEventById(eventDate?.eventId, token);
        return evento;
    }
    catch (error) {
        console.error('Error getting event by event date ID:', error);
        return null;
    }
};
