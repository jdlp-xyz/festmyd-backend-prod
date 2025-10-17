import { getEventDates } from '../getters/getEventDates.js';
import { getEventosFile } from '../getters/getEventosFile.js';
export const parseEventData = async (eventData, token, params) => {
    if (params.fullDescription) {
        // Lógica para obtener la descripción completa
        const event = {
            eventId: eventData?.eventoId,
            isPublished: eventData?.estaPublicado,
            name: eventData?.Nombre || "noname",
            shortDescription: eventData?.descripcionCorta,
            fullDescription: eventData?.descripcionCompleta,
            dates: await getEventDates(eventData?.eventoId, token),
            audience: eventData?.audiencia,
            eventType: eventData?.tipoDeEvento,
            smallCardImageUrl: "https://admin.festmyd.esmeralda-cw.com/assets/" + eventData?.poster,
            isFeatured: false, // No está implementado en la base de datos
            keywords: eventData?.palabrasClave,
            filmExtendedData: {
                director: eventData?.directora,
                duration: eventData?.duracion,
            },
            videoUrl: eventData?.videoUrl,
            linkOndaMedia: eventData?.linkOndamedia,
            officialWebsiteUrl: eventData?.sitioWeb,
            imageGalleryUrls: await Promise.all(eventData.galeriaDeImagenes?.map((imageId) => getEventosFile(imageId, token)) || []),
        };
        return event;
    }
    else {
        // Lógica para obtener la descripción corta
        const event = {
            eventId: eventData?.eventoId,
            isPublished: eventData?.estaPublicado,
            name: eventData?.Nombre,
            shortDescription: eventData?.descripcionCorta,
            dates: await getEventDates(eventData?.eventoId, token),
            audience: eventData?.audiencia,
            eventType: eventData?.tipoDeEvento,
            smallCardImageUrl: "https://admin.festmyd.esmeralda-cw.com/assets/" + eventData?.poster,
            isFeatured: false, // No está implementado en la base de datos
            keywords: eventData?.palabrasClave,
            linkOndaMedia: eventData?.linkOndamedia,
        };
        return event;
    }
};
