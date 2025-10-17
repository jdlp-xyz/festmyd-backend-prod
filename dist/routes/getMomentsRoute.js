import { getFrontendToken } from '../services/directus/admin/getFrontendToken.js';
import { getMomentsByPagination } from '../services/directus/getters/getMomentsByPagination.js';
export const getMomentsRoute = async (req, res) => {
    const { offset, limit } = req.params; // Obtener parámetros de la URL
    // Convertir a números si es necesario
    const offsetNum = parseInt(offset, 10);
    const limitNum = parseInt(limit, 10);
    // Validar que los parámetros existan
    if (offset === undefined || limit === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Los parámetros offset y limit son requeridos'
        });
    }
    // Validar que sean números válidos
    if (!Number.isInteger(offsetNum) || !Number.isInteger(limitNum) || offsetNum < 0 || limitNum <= 0) {
        return res.status(400).json({
            success: false,
            message: 'offset debe ser >= 0 y limit debe ser > 0'
        });
    }
    const token = await getFrontendToken();
    // TODO: Implementar lógica para obtener momentos de la BD
    const moments = await getMomentsByPagination(offsetNum, limitNum, token);
    res.status(200).json({
        success: true,
        data: moments,
        message: 'Momentos obtenidos correctamente'
    });
};
