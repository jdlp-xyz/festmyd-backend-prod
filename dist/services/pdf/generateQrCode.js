import QRCode from 'qrcode';
export async function generateQRCode(data) {
    try {
        return await QRCode.toDataURL(data, {
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
    }
    catch (error) {
        console.error('Error generando QR code:', error);
        throw error;
    }
}
