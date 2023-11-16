import QRCode from 'qrcode';

const generateQRCode = async (data: string): Promise<string> => {
    const options = {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 200,
        color: {
            dark: '#000000',
            light: '#FFFFFF',
        },
    };
    return QRCode.toDataURL(data, options);
};

export default generateQRCode;