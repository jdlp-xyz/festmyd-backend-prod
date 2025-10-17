import { postReservation } from '../services/directus/manipulation/postReservation.js';
import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
import { validateReservation } from '../services/directus/manipulation/validateReservation.js';
import { sendEmailUponReservation } from '../services/resend/sendEmailUponReservation.js';
export const makeReservationRoute = async (req, res) => {
    const token = await getFrontendToken();
    // Validar que se reciban los datos necesarios
    if (!req.body || !req.body.eventDateId || !req.body.seatsReserved || !req.body.user) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos necesarios para la reserva'
        });
    }
    const reservation = {
        eventDateId: req.body.eventDateId.toString(),
        seatsReserved: req.body.seatsReserved,
        user: {
            name: req.body.user.name,
            email: req.body.user.email,
            id: req.body.user.id || null,
            isUserIdRut: req.body.user.isRut || null
        },
        status: 'pending' // Estado inicial de la reserva
    };
    console.log("Recibiendo solicitud de reservación desde frontend: ", reservation);
    // Validar la reserva
    const isReservationValid = await validateReservation(reservation, token);
    console.log("Validación de reserva: ", isReservationValid);
    // Si la reserva no es válida, devolver un error
    if (!isReservationValid.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Reserva inválida',
            error: isReservationValid.error
        });
    }
    else {
        // Si la reserva es válida, guardar en la base de datos
        try {
            const savedReservation = await postReservation(reservation, token);
            console.log("Reserva guardada:", savedReservation);
            // enviar correo de confirmación
            await sendEmailUponReservation(savedReservation);
            return res.status(201).json({
                success: true,
                message: 'Reserva creada correctamente',
                data: savedReservation
            });
        }
        catch (error) {
            console.error('Error al guardar la reserva:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la reserva',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
};
