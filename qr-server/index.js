const { QRCodeCanvas } = require('@loskir/styled-qr-code-node');
const cors = require('cors');
const express = require('express');

const options = {
    "width": 400,
    "height": 400,
    "margin": 0,
    "qrOptions": {
        "typeNumber": "0",
        "mode": "Byte",
        "errorCorrectionLevel": "Q"
    },
    "imageOptions": {
        "hideBackgroundDots": false,
        "imageSize": 0.5,
        "margin": 0
    },
    "dotsOptions": {
        "type": "square",
        "color": "#000000"
    },
    "backgroundOptions": {
        "color": "#ffffff"
    },
    "image": "./logo.png",
    "dotsOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#000000",
            "color2": "#000000",
            "rotation": "0"
        }
    },
    "cornersSquareOptions": {
        "type": "square",
        "color": "#000000"
    },
    "cornersSquareOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#000000",
            "color2": "#000000",
            "rotation": "0"
        }
    },
    "cornersDotOptions": {
        "type": "square",
        "color": "#000000"
    },
    "cornersDotOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#000000",
            "color2": "#000000",
            "rotation": "0"
        }
    },
    "backgroundOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#ffffff",
            "color2": "#ffffff",
            "rotation": "0"
        }
    }
}

const app = express();
app.use(cors());
const port = 8000;


// Endpoint to generate QR code
app.get('/generate', async (req, res) => {
    // Extract data from query params or body
    const { url } = req.query;

    try {
        const qrCode = new QRCodeCanvas({
            data: url,
            ...options
        });

        const dataUrl = await qrCode.toDataUrl('png');

        // Send image as response

        res.send(dataUrl);
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).send('Failed to generate QR code');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
