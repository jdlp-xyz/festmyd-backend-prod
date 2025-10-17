import { parseReservationFromDirectus } from '../parsing/parseReservationFromDirectus.js';
export const getReservationById = async (reservationId, token, getMetadata) => {
    // Si no se especifica getMetadata, se establece en false
    if (getMetadata === undefined || getMetadata === null)
        getMetadata = false;
    // Hacer el fetch
    const reservationFetch = await fetch("https://admin.festmyd.esmeralda-cw.com/items/reservaciones/" + reservationId, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    // Inicializar variable para almacenar la información de la reservación
    let reservationData = null;
    if (reservationFetch.ok) {
        reservationData = await reservationFetch.json();
        reservationData = reservationData.data;
    }
    else {
        console.error("❌ Error al obtener la reservación:", reservationFetch.statusText);
    }
    const parsedReservation = parseReservationFromDirectus(reservationData, getMetadata);
    return parsedReservation;
};
