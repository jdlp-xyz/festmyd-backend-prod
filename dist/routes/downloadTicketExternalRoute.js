import { generateTicketPDF } from '../services/pdf/pdfService.js';
// Ruta GET para descargar el ticket PDF usando reservationId en la URL
export const downloadTicketExternalRoute = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        console.log('📥 Descargando PDF externo para reservación:', reservationId);
        const pdfBuffer = await generateTicketPDF(reservationId);
        // Configurar headers para forzar descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="ticket-${reservationId}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('❌ Error en descarga PDF externa:', error);
        res.status(500).json({
            success: false,
            message: 'Error al descargar PDF',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};
