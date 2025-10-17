export const validateToken = async (token) => {
    try {
        // Solicitud para obtener información del usuario
        const response = await fetch(`https://admin.festmyd.esmeralda-cw.com/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        // Validar y parsear la informacion
        let userData = null;
        if (response.ok) {
            userData = await response.json();
            userData = userData.data;
            console.log("Datos del usuario:", userData);
        }
        else {
            console.error("Error fetching user data:", response);
            return { isValid: false, role: undefined };
        }
        // Id del rol del usuario
        const userRoleId = userData?.role;
        // Diccionario de roles, hardcoded
        const roleReference = {
            "admin": "4cd88b94-cdce-4777-859d-2267773127a3",
            "equipo": "a59c5e6f-780c-44fb-9611-ac4ceb7d828b",
            "frontend": "3283e099-17df-4869-8c21-61c0f7d3d694"
        };
        const userRole = Object.keys(roleReference).find(key => roleReference[key] === userRoleId);
        // Si no se encuentra el rol, se considera no válido
        if (!userRole) {
            console.error("Unknown user role:", userRoleId);
            return { isValid: false, role: undefined };
        }
        // Si la respuesta es exitosa (200-299), el token es válido
        return { isValid: true, role: userRole };
    }
    catch (error) {
        console.error('Error validating token:', error);
        // Si hay cualquier error, el token no es válido
        return { isValid: false, role: undefined };
    }
};
