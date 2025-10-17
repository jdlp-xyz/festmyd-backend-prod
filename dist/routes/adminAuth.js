import { getToken } from '../services/directus/admin/getAdminToken.js';
export const adminAuth = async (req, res) => {
    const authHeader = req.headers.authorization;
    // Validar que se recibió el header de autorización
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(400).json({
            success: false,
            message: 'Se requiere autenticación básica (Basic Auth)'
        });
    }
    try {
        // Extraer y decodificar las credenciales del header Basic Auth
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        // Validar que se pudieron extraer las credenciales
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas en el header de autorización'
            });
        }
        //const pocketBaseService = getPocketBaseService();
        //const authData = await pocketBaseService.adminAuth(email, password);
        // Hacer auth con Directus
        const token = await getToken(email, password);
        // Enviar respuesta exitosa con el token que el cliente debe almacenar
        return res.status(200).json({
            success: true,
            message: 'Autenticación exitosa como administrador',
            token: token
        });
    }
    catch (error) {
        console.error('Error en autenticación de administrador:', error);
        // Respuesta de error
        return res.status(401).json({
            success: false,
            message: 'Error de autenticación',
            error: error.message || 'Credenciales inválidas'
        });
    }
};
