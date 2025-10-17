import { parseReservationFromDirectus } from "../parsing/parseReservationFromDirectus.js";
export const getReservationsForEventDate = async (eventDateId, token, getMetadata) => {
    // Si getMetadata no está definida, dejarla en false
    if (getMetadata === undefined || getMetadata === null)
        getMetadata = false;
    const reservationsFetch = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/reservaciones/?filter[fechaEventoId][_eq]=${eventDateId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    // Inicializar variable para almacenar la información de la reservación
    let reservationsData = null;
    if (reservationsFetch.ok) {
        reservationsData = await reservationsFetch.json();
        // console.log("Respuesta de reservaciones:", reservationsData);
        // Asegurarse que reservationsData.data existe y es un array
        if (!reservationsData.data || !Array.isArray(reservationsData.data)) {
            console.log("No se encontraron reservaciones o el formato de respuesta es inesperado");
            return []; // Retornar array vacío si no hay reservaciones
        }
        reservationsData = reservationsData.data;
    }
    else {
        console.error("Error en fetch de reservaciones:", await reservationsFetch.text());
        throw new Error('Error al obtener la lista de reservaciones');
    }
    // Array con las reservacones parseadas
    const parsedReservations = [];
    // Verificar si hay reservaciones para parsear
    if (reservationsData.length === 0) {
        console.log("No hay reservaciones para esta fecha de evento");
        return []; // Retornar array vacío
    }
    // Parsear cada reservación
    reservationsData.forEach((reservation) => {
        const parsedReservation = parseReservationFromDirectus(reservation, true);
        parsedReservations.push(parsedReservation);
    });
    // Retornar las reservaciones parseadas
    if (getMetadata) {
        return parsedReservations;
    }
    else {
        return parsedReservations;
    }
};
