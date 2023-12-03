export function createScanAlertEmail(itemName: string, scanDateTime: string, itemPageUrl: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                }
                .email-content {
                    background-color: #ffffff;
                    padding: 20px;
                    margin: 20px auto;
                    border-radius: 8px;
                    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
                }
                .alert-message {
                    background-color: #f6f6f6;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #cccccc;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #333333;
                }
                .item-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #4a4a4a;
                }
                .scan-datetime {
                    font-size: 16px;
                    margin: 10px 0;
                }
                .item-link {
                    display: inline-block;
                    color: #ffffff;
                    padding: 10px 15px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-content">
                    <div class="alert-message">
                        Alert: Your item "${itemName}" has been scanned!
                    </div>
                    <p class="item-name">${itemName}</p>
                    <p class="scan-datetime">Scan Date & Time: ${new Date(scanDateTime).toLocaleString()}</p>
                    <a href="${itemPageUrl}" class="item-link">View Item Details</a>
                </div>
            </div>
        </body>
        </html>
    `;
}

