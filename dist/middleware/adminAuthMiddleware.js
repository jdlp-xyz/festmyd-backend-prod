import { validateToken } from '../services/directus/admin/validateToken.js';
export const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Obtener el token de autorización del encabezado
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación no proporcionado o formato incorrecto',
            });
        }
        // Extraer el token
        const token = authHeader.split(' ')[1];
        console.log('Token de administrador extraído:', token);
        // Validar si el token es válido usando Directus
        const { isValid, role } = await validateToken(token);
        if (!isValid) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado',
            });
        }
        // Chequear que el rol en la base de datos tenga la suficiente autoridad
        if (role !== 'admin' && role !== 'equipo') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
            });
        }
        console.log('Token de administrador verificado:', token);
        // Si llegamos aquí, el token es válido
        next();
    }
    catch (error) {
        console.error('Error en middleware de autenticación admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar autenticación de administrador',
            error: error.message
        });
    }
};
