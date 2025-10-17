import { getEventDateById } from "../getters/getEventDateById.js";
import { getFreeSeatsNumber } from "../getters/getFreeSeatsNumber.js";
import { getReservationsForEventDate } from "../getters/getReservationsForEventDate.js";
export const validateReservation = async (reservation, token) => {
    // Este es el objeto que se tiene que componer para la respuesta
    const response = { isValid: true, error: '' };
    // Revisar si hay un eventDateId es válido
    if (!reservation.eventDateId || typeof reservation.eventDateId !== 'string') {
        response.isValid = false;
        response.error = 'ID de fecha de evento no válido';
        return response;
    }
    // Consulta si el id de la fecha del evento existe en la base de datos
    const eventDate = await getEventDateById(reservation.eventDateId, token);
    if (!eventDate) {
        response.isValid = false;
        response.error = 'Fecha de evento no encontrada';
        return response;
    }
    // Revisar si hay un seatsReserved es válido
    if (!reservation.seatsReserved || typeof reservation.seatsReserved !== 'number') {
        response.isValid = false;
        response.error = 'Los asientos reservados deben ser un número válido';
        return response;
    }
    // Revisar si hay asientos reservados disponibles
    const availableSeats = await getFreeSeatsNumber(reservation.eventDateId, token);
    const areSeatsAvailable = availableSeats >= reservation.seatsReserved;
    if (!areSeatsAvailable) {
        response.isValid = false;
        response.error = "No hay suficientes asientos disponibles para la reserva";
        return response;
    }
    // Revisar si la misma reservación (por el mismo usuario y la misma pelicula) se ha hecho durante el último minuto
    const isReservationRepeated = false; // await checkIfReservationIsRepeated(reservation, token)
    if (isReservationRepeated) {
        response.isValid = false;
        response.error = "Reserva repetida. Espera un minuto para reservar más asientos en este evento.";
    }
    return response;
};
const checkIfReservationIsRepeated = async (reservation, token) => {
    // Tiempo actual en timestamp (milisegundos desde 1970)
    const actualTime = Date.now();
    console.log('Tiempo actual (ms):', actualTime);
    // Obtener la lista de reservaciones para el mismo evento
    const reservationsListWithMetadata = await getReservationsForEventDate(reservation.eventDateId, token, true);
    // Verificar si hay reservaciones en la lista
    if (!Array.isArray(reservationsListWithMetadata) || reservationsListWithMetadata.length === 0) {
        console.log('No hay reservaciones previas para este evento');
        return false;
    }
    // Función para convertir fecha ISO string a timestamp
    const parseISOToTimestamp = (isoString) => {
        return new Date(isoString).getTime();
    };
    // Constante: 2 minutos en milisegundos
    const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
    // Filtrar reservaciones hechas en los últimos 2 minutos
    const recentReservations = reservationsListWithMetadata.filter((reservationMeta) => {
        const reservationTimestamp = parseISOToTimestamp(reservationMeta.createdAt);
        const timeDifference = actualTime - reservationTimestamp;
        // Retorna true si la reservación fue hecha en los últimos 2 minutos
        return timeDifference >= 0 && timeDifference <= TWO_MINUTES_IN_MS;
    });
    console.log(`Reservaciones en los últimos 2 minutos: ${recentReservations.length}`);
    console.log('Detalles de reservaciones recientes:', recentReservations.map(r => ({
        createdAt: r.createdAt,
        timeDifference: `${Math.round((actualTime - parseISOToTimestamp(r.createdAt)) / 1000)}s ago`
    })));
    // Filtrar por el mismo usuario (si el campo está disponible)
    const sameUserRecentReservations = recentReservations.filter((reservationMeta) => {
        // Asumiendo que el usuario se identifica por email o ID
        return reservationMeta.user?.email === reservation.user?.email ||
            reservationMeta.user?.id === reservation.user?.id;
    });
    console.log(`Reservaciones del mismo usuario en los últimos 2 minutos: ${sameUserRecentReservations.length}`);
    // Si hay reservaciones del mismo usuario en los últimos 2 minutos, es repetida
    return sameUserRecentReservations.length > 0;
};
