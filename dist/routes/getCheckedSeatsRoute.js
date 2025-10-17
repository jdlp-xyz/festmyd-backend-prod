import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
import { getEventDateById } from '../services/directus/getters/getEventDateById.js';
import { getReservationsForEventDate } from '../services/directus/getters/getReservationsForEventDate.js';
export const getCheckedSeatsRoute = async (req, res) => {
    // Ahora el token está proporcionado por una función externa.
    const token = await getFrontendToken();
    const eventDateId = req.params.eventDateId;
    // Obtener el eventDateId desde los parámetros de la ruta
    const eventDate = await getEventDateById(eventDateId, token);
    if (!eventDate) {
        console.error(`Fecha de evento con ID ${eventDateId} no encontrada.`);
    }
    else {
        console.log(`Fecha de evento con ID ${eventDateId} encontrada:`, eventDate);
    }
    const eventDateReservations = await getReservationsForEventDate(eventDateId, token, false);
    console.log(`Reservas encontradas para la fecha de evento ${eventDateId}:`, eventDateReservations.length);
    // Contar los asientos reservados
    let reservedSeatsNumber = 0;
    if (eventDateReservations && eventDateReservations.length > 0) {
        eventDateReservations.forEach(reservation => {
            if (reservation.seatsReserved) {
                reservedSeatsNumber += reservation.seatsReserved;
            }
        });
    }
    console.log(`Número total de asientos reservados para la fecha de evento ${eventDateId}:`, reservedSeatsNumber);
    // Contar los asientos ya chequeados
    let checkedSeatsNumber = 0;
    // Filtrar las reservas que ya fueron chequeadas
    const checkedReservations = eventDateReservations.filter(reservation => reservation.status === "confirmed");
    if (checkedReservations && checkedReservations.length > 0) {
        checkedReservations.forEach(reservation => {
            if (reservation.seatsReserved) {
                checkedSeatsNumber += reservation.seatsReserved;
            }
        });
    }
    const responsePayload = {
        totalSeats: eventDate?.seats || 0,
        reservedSeats: reservedSeatsNumber,
        checkedSeats: checkedSeatsNumber
    };
    // Respuesta
    return res.status(200).json({
        success: true,
        message: `Número de asientos reservados para la fecha de evento ${eventDateId}`,
        data: responsePayload
    });
};
