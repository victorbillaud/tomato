export function createScanAlertEmail(itemName: string, scanDateTime: string, itemPageUrl: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Item Scan Alert</title>
            <style>
                /* Add your CSS styling here */
                body { font-family: Arial, sans-serif; }
                .alert-message { margin: 20px; padding: 10px; background-color: #f2f2f2; border: 1px solid #d4d4d4; }
                .item-name { font-weight: bold; }
                .scan-time { color: #555; }
                .item-link { margin-top: 20px; }
                a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="alert-message">
                <h1>Item Scan Alert</h1>
                <p>An item has been scanned:</p>
                <p class="item-name">Item: ${itemName}</p>
                <p class="scan-time">Scan Time: ${scanDateTime}</p>
                <div class="item-link">
                    <a href="${itemPageUrl}">Click here to view the item</a>
                </div>
            </div>
        </body>
        </html>
    `;
}
