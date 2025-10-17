import { getEventDateById } from "../getters/getEventDateById.js";
import { getFreeSeatsNumber } from "../getters/getFreeSeatsNumber.js";
export const reduceAvailableSeatsInEvent = async (eventDateId, seatsReserved, token) => {
    try {
        const eventDate = await getEventDateById(eventDateId, token);
        if (!eventDate) {
            throw new Error('Evento no encontrado');
        }
        console.log("Evento encontrado para reducir asientos:", eventDate);
        // Obtener asientos disponibles actuales (calculados correctamente)
        const availableSeats = await getFreeSeatsNumber(eventDateId, token);
        // Validar que haya suficientes asientos disponibles
        if (availableSeats < seatsReserved) {
            throw new Error(`No hay suficientes asientos disponibles (Disponibles: ${availableSeats}, Solicitados: ${seatsReserved})`);
        }
        const newAvailableSeats = availableSeats - seatsReserved;
        console.log(`Reduciendo asientos: ${availableSeats} - ${seatsReserved} = ${newAvailableSeats}`);
        const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/fechasEventos/${eventDateId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                asientosDisponibles: newAvailableSeats
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', response.status, errorText);
            throw new Error(`Error al reducir los asientos disponibles: ${response.status} ${errorText}`);
        }
        const updatedEvent = await response.json();
        console.log("Asientos disponibles actualizados:", updatedEvent);
        return updatedEvent;
    }
    catch (error) {
        console.error('Error in reduceAvailableSeatsInEvent:', error);
        throw error;
    }
};
