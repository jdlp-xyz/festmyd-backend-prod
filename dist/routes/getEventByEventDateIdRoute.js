import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
import { getEventByEventDateId } from '../services/directus/getters/getEventByEventDateId.js';
export const getEventByEventDateIdRoute = async (req, res) => {
    // Ahora el token está proporcionado por una función externa.
    const token = await getFrontendToken();
    // Consumir el ID directamente desde los parámetros de la ruta
    const eventDateId = req.params.eventDateId;
    try {
        const eventdate = await getEventByEventDateId(eventDateId, token);
        if (!eventdate) {
            return res.status(404).json({
                success: false,
                message: 'Fecha de evento no encontrada'
            });
        }
        // Respuesta 
        res.json({
            success: true,
            message: `Evento con ID ${eventDateId} encontrado`,
            data: eventdate
        });
    }
    catch (error) {
        console.error(`Error al obtener evento con ID ${eventDateId}:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener evento',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};
