import { getEventById as fetchEventById } from '../services/directus/getters/getEventById.js';
import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
export const getEventByIdRoute = async (req, res) => {
    // Ahora el token está proporcionado por una función externa.
    const token = await getFrontendToken();
    // Consumir los datos de entrada en un nombre
    const eventId = req.params.id;
    try {
        const event = await fetchEventById(eventId, token);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        }
        // Respuesta 
        res.json({
            success: true,
            message: `Evento con ID ${eventId} encontrado`,
            data: event
        });
    }
    catch (error) {
        console.error(`Error al obtener evento con ID ${eventId}:`, error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener evento',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};
