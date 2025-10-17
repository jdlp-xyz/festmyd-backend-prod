export const updateReservationCheck = async (reservationId, token) => {
    // Llamada a la API de Directus para actualizar la reservación
    const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/items/reservaciones/${reservationId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chequeada: true
        })
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el estado de la reservación');
    }
    const updatedReservation = await response.json();
    console.log("Reservación actualizada:", updatedReservation);
    return updatedReservation;
};
