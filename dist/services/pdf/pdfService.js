import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { generateQRCode } from './generateQrCode.js';
import { TicketDocument } from './ticketDocument.js';
import { getFrontendToken } from '../directus/admin/getFrontendToken.js';
import { getReservationById } from '../directus/getters/getReservationById.js';
import { getEventById } from '../directus/getters/getEventById.js';
import { getEventDateById } from '../directus/getters/getEventDateById.js';
//import { getPocketBaseService } from '../pocketBaseService.js';
export const generateTicketPDF = async (reservationId) => {
    try {
        console.log('🎫 Generando PDF para reservación:', reservationId);
        // Initialize PocketBase service here when the function is called
        //const pbService = getPocketBaseService();
        const token = await getFrontendToken();
        // Generar QR code con el ID de la reservación
        const qrCodeDataUrl = await generateQRCode(reservationId);
        // Recopilar la información
        // Obtener la reservación y el evento asociado
        const reservation = await getReservationById(reservationId, token);
        // Chequear que el ID de la fecha del evento existe
        if (!reservation.eventDateId)
            throw new Error("Event date ID not found");
        const eventDate = await getEventDateById(reservation.eventDateId.toString(), token);
        if (!eventDate)
            throw new Error("Event date not found");
        const event = await getEventById(eventDate.eventId, token);
        if (!event)
            throw new Error("Event not found");
        // Verificar que todos los datos necesarios están disponibles
        if (!eventDate.venue)
            throw new Error("Venue information not found");
        //
        console.log('📄 Información de la reservación obtenida:', reservation);
        console.log('📅 Información de la fecha del evento obtenida:', eventDate);
        console.log('🎟️ Información del evento obtenida:', event);
        const document = React.createElement(TicketDocument, {
            reservation: reservation,
            event: event,
            eventDate: eventDate,
            qrCodeDataUrl: qrCodeDataUrl
        });
        // Renderizar a buffer
        const pdfBuffer = await renderToBuffer(document);
        console.log('✅ PDF generado exitosamente');
        return pdfBuffer;
    }
    catch (error) {
        console.error('❌ Error al generar PDF:', error);
        throw error;
    }
};
