import { getEventDateById } from "./getEventDateById.js";
import { getReservationsForEventDate } from "./getReservationsForEventDate.js";
export const getFreeSeatsNumber = async (eventDateId, token) => {
    try {
        // Obtener los asientos maximos designados para la fecha del evento
        const eventDate = await getEventDateById(eventDateId, token);
        // Cersiorarse de que eventDate funciona correctamente
        if (!eventDate) {
            throw new Error('Fecha de evento no encontrada');
        }
        else {
            console.log("GetFreeSeatsNumber: Fecha de evento encontrada:", eventDate);
        }
        // Asientos totales designados para el evento
        const totalSeats = eventDate.seats;
        // Si los asientos totales no están definidos, no podemos calcular disponibilidad
        if (totalSeats === undefined || totalSeats === null) {
            console.error("GetFreeSeatsNumber: El evento no tiene definido el número de asientos totales");
            throw new Error('El evento no tiene definido el número de asientos totales');
        }
        // Asientos disponibles ya definidos en la base de datos
        const availableSeatsInDB = eventDate.availableSeats;
        // Si hay un valor definido en la base de datos, lo usamos
        if (availableSeatsInDB !== null && availableSeatsInDB !== undefined) {
            console.log("GetFreeSeatsNumber: Usando asientos disponibles de la DB:", availableSeatsInDB);
            return availableSeatsInDB;
        }
        // Si no hay valor en DB, calculamos basado en reservaciones
        try {
            const reservationList = await getReservationsForEventDate(eventDateId, token);
            console.log("GetFreeSeatsNumber: Reservaciones encontradas:", reservationList.length);
            // Calcular el total de asientos reservados sumando los asientos de cada reservación
            let totalReservedSeats = 0;
            reservationList.forEach(reservation => {
                totalReservedSeats += reservation.seatsReserved || 0;
            });
            console.log(`GetFreeSeatsNumber: Total de asientos reservados: ${totalReservedSeats}`);
            const availableSeats = totalSeats - totalReservedSeats;
            console.log(`GetFreeSeatsNumber: Calculando asientos disponibles: ${totalSeats} - ${totalReservedSeats} = ${availableSeats}`);
            return availableSeats;
        }
        catch (error) {
            console.error("GetFreeSeatsNumber: Error al obtener reservaciones:", error);
            // En caso de error, asumimos que todos los asientos están disponibles
            return totalSeats;
        }
    }
    catch (error) {
        console.error("GetFreeSeatsNumber: Error general:", error);
        throw new Error('Error al obtener los asientos disponibles');
    }
};
