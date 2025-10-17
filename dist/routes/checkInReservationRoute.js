import { getReservationById } from '../services/directus/getters/getReservationById.js';
import { updateReservationCheck } from '../services/directus/manipulation/updateReservationCheck.js';
export const checkInReservationRoute = async (req, res) => {
    //const pocketBaseService = getPocketBaseService();
    // Validar que se reciban los datos necesarios
    if (!req.body || !req.body.reservationId || !req.body.eventDateId) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos necesarios para la reserva'
        });
    }
    // Obtener el bearer token de la solicitud
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación no proporcionado o formato incorrecto',
        });
    }
    const token = authHeader.split(' ')[1];
    const reservationId = req.body.reservationId;
    const receivedEventDateId = parseInt(req.body.eventDateId);
    try {
        // Log timestamp for better tracking
        const now = new Date();
        console.log(`[${now.toISOString()}] Starting check-in process for reservation...`);
        console.log("Token recibido: ", token);
        console.log("Id de reserva recibido: ", reservationId);
        console.log("Id de evento recibido: ", receivedEventDateId, typeof receivedEventDateId);
        // Verificar si la reserva existe
        const reservation = await getReservationById(reservationId, token);
        // Si la reserva no existe, devolver un error 404
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }
        console.log("Id en la reserva: ", reservation.eventDateId, typeof reservation.eventDateId, "Id recibido: ", receivedEventDateId);
        // Si la reserva corresponde al mismo evento
        if (parseInt(reservation.eventDateId) !== receivedEventDateId) {
            return res.status(400).json({
                success: false,
                message: 'La reserva no corresponde a este evento'
            });
        }
        //Si la reserva ya está chequeada
        const isReservationChecked = reservation.status === "confirmed";
        if (isReservationChecked) {
            console.log("📛 La reserva ya está confirmada");
            return res.status(400).json({
                success: false,
                message: 'La reserva ya ha sido chequeada'
            });
        }
        reservation.status = 'confirmed'; // Cambiar el estado de la reserva a "confirmada"
        // Update database
        await updateReservationCheck(reservationId, token);
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar check-in: ' + error,
            error: error
        });
    }
    // Si todo está bien, devolver una respuesta exitosa
    res.json({
        success: true,
        message: 'Check-in registrado exitosamente',
        data: { reservationId }
    });
};
