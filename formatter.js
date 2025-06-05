const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createPDF(data, outputFilePath, imageFileName) {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(outputFilePath));

    // Register the Roboto font
    const robotoPath = path.join(__dirname, 'assets', 'fonts', 'static', 'Roboto-Regular.ttf');
    const robotoItalicPath = path.join(__dirname, 'assets', 'fonts', 'static', 'Roboto-Italic.ttf');
    const robotoBoldPath = path.join(__dirname, 'assets', 'fonts', 'static', 'Roboto-Bold.ttf');
    const robotoBlackPath = path.join(__dirname, 'assets', 'fonts', 'static', 'Roboto-Black.ttf');
    doc.registerFont('Roboto', robotoPath);
    doc.registerFont('Roboto-Bold', robotoBoldPath);
    doc.registerFont('Roboto-Black', robotoBlackPath);
    doc.registerFont('Roboto-Italic', robotoItalicPath);

    // Add the logo
    const logoPath = path.join(__dirname, 'assets', 'logo.png');
    doc.image(logoPath, doc.page.width - 100, 20, { width: 80 });

    // Get the client name from client.json
    const clientPath = path.join(__dirname, 'assets', 'client.json');
    const client = JSON.parse(fs.readFileSync(clientPath, 'utf8'));

    // Get the descriptions from descriptions.json
    const descriptionsPath = path.join(__dirname, 'assets', 'descriptions.json');
    const descriptions = JSON.parse(fs.readFileSync(descriptionsPath, 'utf8'));

    // Title
    doc.font('Roboto-Black').fontSize(26).fillColor('#333').text('Red Oxford Online', { align: 'start', bold: true });
    doc.moveDown(0);
    doc.font('Roboto').fontSize(18).fillColor('#555').text('Google Ad Campaign', { align: 'start', bold: true });
    doc.moveDown(0.5);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(`${client.name}`, { align: 'start' });
    doc.moveDown(0.5);

    // Section Title Style
    const sectionTitleStyle = { fontSize: 18, fillColor: '#780202', bold: true };

    // Content Text Style
    const contentTextStyle = { fontSize: 10, fillColor: '#000' };

    // Headlines
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Headlines:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.headlines, { align: 'start' });
    doc.moveDown(0.5);
    data.headlines.forEach((headline) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${headline}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Descriptions
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Descriptions:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.descriptions, { align: 'start' });
    doc.moveDown(0.5);
    data.descriptions.forEach((description) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${description}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Keywords
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Keywords:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.keywords, { align: 'start' });
    doc.moveDown(0.5);
    data.keywords.forEach((keyword) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${keyword}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Negative Keywords
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Negative Keywords:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.negative_keywords, { align: 'start' });
    doc.moveDown(0.5);
    data.negativeKeywords.forEach((negativeKeyword) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${negativeKeyword}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Locations
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Locations:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.locations, { align: 'start' });
    doc.moveDown(0.5);
    data.locations.forEach((location) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• Location: ${location.location}, Reach: ${location.reach}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Snippets
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Snippets:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.snippets, { align: 'start' });
    doc.moveDown(0.5);
    data.snippets.forEach((snippet) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${snippet}`, { indent: 20 });
    });
    doc.moveDown(0.5);

    // Callout Texts
    doc.font('Roboto-Bold').fontSize(sectionTitleStyle.fontSize).fillColor(sectionTitleStyle.fillColor).text('Callout Texts:', { bold: sectionTitleStyle.bold });
    doc.moveDown(0.25);
    doc.font('Roboto-Italic').fontSize(10).fillColor('#333').text(descriptions.callout_texts, { align: 'start' });
    doc.moveDown(0.5);
    data.calloutTexts.forEach((calloutText) => {
        doc.font('Roboto').fontSize(contentTextStyle.fontSize).fillColor(contentTextStyle.fillColor).text(`• ${calloutText}`, { indent: 20 });
    });

    // Ad Example
    doc.moveDown(3);
    doc.font('Roboto-Bold').fontSize(18).fillColor('#780202').text('Ad Example', { align: 'center' });
    doc.moveDown(0.5);
    doc.image(imageFileName, { width: 500, align: 'center', valign: 'center' });

    doc.end();
}

module.exports = createPDF;
