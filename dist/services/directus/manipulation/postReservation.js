import { reduceAvailableSeatsInEvent } from "./reduceAvailableSeatsInEvent.js";
//* Implementación de la función para crear una nueva reservación /
export const postReservation = async (reservation, token) => {
    // Parser entre el esquema del API y el esquema de directus
    const parseReservationToDirectus = (reservation) => {
        return {
            fechaEventoId: reservation.eventDateId?.toString() || "",
            asientosReservados: reservation.seatsReserved || 0,
            nombreUsuario: reservation.user?.name || "",
            chequeada: reservation.status === "confirmed",
            usuarioId: reservation.user?.id || "",
            isUsuarioIdRUT: reservation.user?.isUserIdRut || false,
            usuarioEmail: reservation.user?.email || ""
        };
    };
    const directusReservation = parseReservationToDirectus(reservation);
    // Llamada a la API de Directus para crear la reservación
    const response = await fetch('https://admin.festmyd.esmeralda-cw.com/items/reservaciones', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(directusReservation)
    });
    if (!response.ok) {
        throw new Error('Error al crear la reservación');
    }
    const createdReservation = await response.json();
    //console.log("Reservación creada:", createdReservation);
    const parsedCreatedReservationAnswer = {
        reservationId: createdReservation.data.reservacionId,
        eventDateId: createdReservation.data.fechaEventoId,
        seatsReserved: createdReservation.data.asientosReservados,
        user: {
            name: createdReservation.data.nombreUsuario,
            email: createdReservation.data.usuarioEmail,
            id: createdReservation.data.usuarioId,
            isUserIdRut: createdReservation.data.isUsuarioIdRUT
        },
        status: createdReservation.data.chequeada ? "confirmed" : "pending"
    };
    // Reducir los asientos disponibles en el evento
    await reduceAvailableSeatsInEvent(parsedCreatedReservationAnswer.eventDateId, parsedCreatedReservationAnswer.seatsReserved, token);
    return parsedCreatedReservationAnswer;
};
