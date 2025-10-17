export const parseReservationFromDirectus = (reservationData, getMetadata) => {
    let parsedReservation = {
        reservationId: reservationData?.reservacionId,
        eventDateId: reservationData?.fechaEventoId,
        seatsReserved: reservationData?.asientosReservados,
        user: {
            id: reservationData?.usuarioId,
            name: reservationData?.nombreUsuario,
            email: reservationData?.usuarioEmail,
            isUserIdRut: reservationData?.isUsuarioIdRUT
        },
        status: reservationData?.chequeada ? "confirmed" : "pending",
        createdAt: reservationData?.date_created,
        updatedAt: reservationData?.date_updated,
    };
    if (getMetadata) {
        return parsedReservation;
    }
    else {
        return parsedReservation;
    }
};
