import { Resend } from "resend";
import { getEventByEventDateId } from "../directus/getters/getEventByEventDateId.js";
import { getFrontendToken } from "../directus/admin/getFrontendToken.js";
import { generateTicketPDF } from "../pdf/pdfService.js";
export const sendEmailUponReservation = async (reservation) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY no está configurado. No se puede enviar el correo electrónico.");
        return;
    }
    // Asegurarse de tener la reservación con ID
    if (!reservation.reservationId && !reservation.user?.email) {
        console.warn("⚠️ La reservación no tiene ID. No se puede enviar el correo electrónico.");
        return;
    }
    const frontEndToken = await getFrontendToken();
    if (!frontEndToken) {
        console.warn("⚠️ No se pudo obtener el token de frontend. No se puede enviar el correo electrónico.");
        return;
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const eventDateId = reservation.eventDateId;
    const event = await getEventByEventDateId(eventDateId, frontEndToken);
    const eventDate = event?.dates.find(date => date.eventDateId === eventDateId);
    if (!reservation.reservationId) {
        throw new Error("reservationId is required to generate the ticket PDF.");
    }
    const pdfAttachment = await generateTicketPDF(reservation.reservationId);
    const emailContent = `
        <p>Hola ${reservation.user?.name},</p>
        <p>Gracias por reservar tu entrada para <strong>${event?.name}</strong>.</p>
        <p>Adjunto a este correo encontrarás tu ticket en formato PDF. Recuerda llevarlo el día del evento en tu dispositivo móvil o impreso.</p>
        `;
    if (!reservation.user || !reservation.user.email) {
        console.warn("⚠️ La reservación no tiene un usuario o email válido. No se puede enviar el correo electrónico.");
        return;
    }
    const emailResponse = await resend.emails.send({
        from: "no-reply@festmyd.cl",
        to: [reservation.user.email],
        subject: "Confirmación de Reserva",
        html: emailContent,
        attachments: [
            {
                filename: `ticket-${reservation.reservationId}.pdf`,
                content: pdfAttachment,
                contentType: "application/pdf"
            }
        ]
    });
    console.log("✅ Correo de confirmación enviado:", emailResponse);
};
