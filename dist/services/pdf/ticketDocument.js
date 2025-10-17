import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatSpanishDate } from '../../utils/formatSpanishDate.js';
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ecd3d9ff',
        padding: 5,
        minHeight: '100%',
        justifyContent: 'flex-start',
    },
    header: {
        alignItems: 'center',
        padding: 6,
        //backgroundColor: '#F8F8F8',
        borderRadius: 12,
        marginBottom: 0,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    section: {
        margin: 0,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#FAFAFA',
        marginBottom: 12,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 2,
        textAlign: 'left',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
        textAlign: 'center',
    },
    value: {
        fontSize: 16,
        marginBottom: 6,
        textAlign: 'center',
    },
    qrCode: {
        alignSelf: 'center',
        marginVertical: 8,
        padding: 6,
        width: 180,
        height: 180,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    footer: {
        marginTop: 2,
        textAlign: 'center',
        fontSize: 12,
        color: '#555555',
    },
});
export const TicketDocument = ({ reservation, event, eventDate, qrCodeDataUrl }) => (React.createElement(Document, null,
    React.createElement(Page, { size: "A6", style: styles.page },
        React.createElement(View, { style: styles.header },
            qrCodeDataUrl && (React.createElement(Image, { src: qrCodeDataUrl, style: styles.qrCode })),
            React.createElement(Text, { style: { fontSize: 12, padding: 4 } }, reservation.reservationId?.substring(0, 8)),
            React.createElement(Text, { style: styles.title }, "FESTMYD 2025 - Ticket de ingreso"),
            React.createElement(View, { style: { height: 1, backgroundColor: '#000000', width: '100%', marginVertical: 8 } }),
            React.createElement(Text, { style: styles.infoText }, event.name),
            React.createElement(Text, { style: styles.infoText }, eventDate &&
                formatSpanishDate(eventDate?.date)[0] +
                    " " +
                    formatSpanishDate(eventDate?.date)[1] +
                    " de " +
                    formatSpanishDate(eventDate?.date)[2] +
                    ", " + eventDate.date.slice(0, 4)),
            React.createElement(Text, { style: styles.infoText }, eventDate.time + "hrs."),
            React.createElement(Text, { style: styles.infoText }, eventDate?.venue?.name || "N/A"),
            React.createElement(View, { style: { height: 1, backgroundColor: '#000000', width: '100%', marginVertical: 8 } }),
            React.createElement(Text, { style: styles.infoText },
                "Asientos: ",
                reservation.seatsReserved),
            React.createElement(Text, { style: styles.infoText },
                "Nombre: ",
                reservation.user?.name || "N/A")),
        React.createElement(View, { style: styles.footer },
            React.createElement(Text, null, "Presenta este ticket al ingresar.")))));
export default TicketDocument;
// {}
// // Pure component version - doesn't use hooks
// export const TicketPrintPure: React.FC<TicketProps> = ({
//   reservation,
//   event,
//   eventDate,
//   qrCodeDataUrl,
// }) => (
//   <Document>
//     <Page size="LETTER" style={styles.page}>
//       <View style={styles.header}>
//         <View
//           style={{
//             flexDirection: "row",
//             padding: 10,
//           }}
//         >
//           {/* QR Code */}
//           <View>
//             {qrCodeDataUrl && (
//               <Image src={qrCodeDataUrl} style={styles.qrCode} />
//             )}
//             <Text>{reservation.reservationId}</Text>
//           </View>
//           <View style={{ paddingLeft: 20 }}>
//             <Text style={{ fontSize: 16, fontWeight: "bold" }}>
//               5º Festival de Cine De Mujeres y Diversidades
//             </Text>
//             <Text style={{ fontSize: 12 }}>Ticket de Entrada</Text>
//             <Text style={{ paddingTop: 20, fontSize: 12 }}>
//               {event.eventType}
//             </Text>
//             <Text style={{ fontSize: 24, paddingTop: 5 }}>{event.name}</Text>
//             <Text style={{borderTop: '1px solid #CCCCCC', paddingTop: 5, fontSize: 14 }}>
//               {eventDate &&
//                 formatSpanishDate(eventDate?.date)[0] +
//                   " " +
//                   formatSpanishDate(eventDate?.date)[1] +
//                   " de " +
//                   formatSpanishDate(eventDate?.date)[2]+
//                   ", "+eventDate.date.slice(0,4)+" - " +
//                   eventDate.time + "hrs."}
//             </Text>
//             <Text style={{ fontSize: 12, paddingTop: 5 }}>
//               {eventDate?.venue.name || "N/A"}
//             </Text>
//             <Text style={{ fontSize: 12, marginTop: 20, paddingTop:5, borderTop: '1px solid #CCCCCC' }}>
//               Asientos Reservados: {reservation.seatsReserved}
//             </Text>
//             <Text style={{ fontSize: 12, paddingTop: 5 }}>
//               Nombre: {reservation.user?.name || "N/A"}
//             </Text>
//           </View>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text>{event.name}</Text>
//         <Text>{event.filmExtendedData?.director}</Text>
//         <Text>{event.audience}</Text>
//         <Text>{event.filmExtendedData?.genre}</Text>
//         <Text>{event.filmExtendedData?.duration}</Text>
//         <Text>{event.filmExtendedData?.cast?.join(", ")}</Text> 
//         <Text>{event.fullDescription}</Text>
//       </View>
//       <View style={styles.footer}>
//         <Text>Por favor presenta este ticket al ingresar al evento.</Text>
//       </View>
//     </Page>
//   </Document>
// );
// // Keep original for backward compatibility
// export const TicketPrint = TicketPrintPure;
