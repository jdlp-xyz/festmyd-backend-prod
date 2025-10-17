export const healthCheckRoute = (req, res) => {
    res.json({
        success: true,
        message: 'Backend del Festival de Cine funcionando correctamente',
        timestamp: new Date().toISOString()
    });
};
