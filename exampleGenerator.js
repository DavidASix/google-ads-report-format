const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let testWidth = 0;
    let initialY = y;

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return y > initialY ? y + lineHeight : y + lineHeight;
}

async function generateAdMockup(data, outputDir) {
    return new Promise((resolve, reject) => {
        const canvasWidth = 800;
        const padding = { top: 30, bottom: 30, left: 50, right: 50 };
        const contentWidth = canvasWidth - padding.left - padding.right;

        // Create a temporary canvas to calculate the height
        const tempCanvas = createCanvas(canvasWidth, 1000);
        const tempCtx = tempCanvas.getContext('2d');

        // Calculate the height required for the content
        tempCtx.font = 'bold 20px Arial';
        const titleY = wrapText(tempCtx, `${data.headlines[0]} - ${data.headlines[1]}`, padding.left, padding.top + 70, contentWidth, 30);

        tempCtx.font = '14px Arial';
        const adDescription = `${data.descriptions[0]} ${data.descriptions[1]}`;
        const adSnippets = data.snippets.join(', ');
        const adCallouts = data.calloutTexts.join('. ');
        const adFullDescription = `${adDescription} ${adSnippets}. ${adCallouts}`;
        const descriptionY = wrapText(tempCtx, adFullDescription, padding.left, titleY, contentWidth, 20);

        const canvasHeight = descriptionY + padding.bottom;

        // Create the final canvas with the calculated height
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sponsored Text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('Sponsored', padding.left, padding.top);

        // Add grey circle
        ctx.fillStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(padding.left + 10, padding.top + 30, 12.5, 0, Math.PI * 2, true);
        ctx.fill();

        // Get the client name and URL from client.json
        const clientPath = path.join(__dirname, 'assets', 'client.json');
        const client = JSON.parse(fs.readFileSync(clientPath, 'utf8'));

        // Client name and URL
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(client.example.title, padding.left + 30, padding.top + 25);
        ctx.fillStyle = '#444444';
        ctx.fillText(client.example.url, padding.left + 30, padding.top + 40);

        // Ad Title
        ctx.fillStyle = '#1a0dab';
        ctx.font = 'bold 20px Arial';
        wrapText(ctx, `${data.headlines[0]} - ${data.headlines[1]}`, padding.left, padding.top + 70, contentWidth, 30);

        // Ad Description
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        wrapText(ctx, adFullDescription, padding.left, titleY, contentWidth, 20);

        // Save the image with a random file name
        const outputFilePath = path.join(outputDir, `adMockup-${uuidv4()}.png`);
        const out = fs.createWriteStream(outputFilePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => resolve(outputFilePath));
        out.on('error', (err) => reject(err));
    });
}

module.exports = generateAdMockup;
