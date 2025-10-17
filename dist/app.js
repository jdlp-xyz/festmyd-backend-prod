// Cargar variables de entorno
import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// Import all routes
import { healthCheckRoute } from './routes/healthCheckRoute.js';
import { getAllEventsRoute } from './routes/getAllEventsRoute.js';
import { getEventByIdRoute } from './routes/getEventByIdRoute.js';
import { downloadTicketRoute } from './routes/downloadTicketRoute.js';
import { makeReservationRoute } from './routes/makeReservationRoute.js';
import { checkInReservationRoute } from './routes/checkInReservationRoute.js';
import { adminAuth } from './routes/adminAuth.js';
import { getEventByEventDateIdRoute } from './routes/getEventByEventDateIdRoute.js';
import { getCheckedSeatsRoute } from './routes/getCheckedSeatsRoute.js';
import { downloadTicketExternalRoute } from './routes/downloadTicketExternalRoute.js';
import { getSingleContentRoute } from './routes/getSingleContentRoute.js';
import { getMomentsRoute } from './routes/getMomentsRoute.js';
// Import middleware
import { adminAuthMiddleware } from './middleware/adminAuthMiddleware.js';
import { getContentHeadersRoute } from './routes/getContentHeadersRoute.js';
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware de seguridad y parseo
app.use(helmet()); // Seguridad básica
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON
// Rutas públicas
app.get('/health', healthCheckRoute);
app.get("/events/all", getAllEventsRoute);
app.get("/events/single/:id", getEventByIdRoute);
app.get("/get/checkedseats/:eventDateId", getCheckedSeatsRoute);
app.get("/get/ticket/:reservationId", downloadTicketExternalRoute);
app.get("/content/headers", getContentHeadersRoute);
app.get("/content/single/:contentId", getSingleContentRoute);
app.get("/moments/:offset/:limit", getMomentsRoute);
app.get("/get/event-by-eventdate-id/:eventDateId", getEventByEventDateIdRoute);
app.post("/events/reserve", makeReservationRoute);
app.post("/downloadticket", downloadTicketRoute);
// Rutas de autenticación de admin
app.post("/auth", adminAuth);
// Rutas protegidas (requieren autenticación de admin)
app.post("/check-in", adminAuthMiddleware, checkInReservationRoute);
// Manejador de errores básico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎬 Servidor del Festival de Cine corriendo en puerto ${PORT}`);
});
export default app;
