const fs = require('fs');
const path = require('path');
const parseCSV = require('./parser');
const createPDF = require('./formatter');
const generateAdMockup = require('./exampleGenerator');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

function getLatestFile(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) return reject(err);

            const csvFiles = files.filter(file => file.endsWith('.csv'));
            if (csvFiles.length === 0) {
                return reject('No CSV files found in the input directory.');
            }

            const newestFile = csvFiles.reduce((latest, file) => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                return stats.mtime > latest.mtime ? { file, mtime: stats.mtime } : latest;
            }, { file: null, mtime: 0 }).file;

            resolve(path.join(dir, newestFile));
        });
    });
}

async function main() {
    try {
        const filePath = await getLatestFile(inputDir);
        const data = await parseCSV(filePath);
        const imageFileName = await generateAdMockup(data, outputDir);
        console.log('Parsed Content:', data);
        console.log('Ad Mockup created at:', imageFileName);

        const outputFilePath = path.join(outputDir, 'GoogleAdsReport.pdf');
        createPDF(data, outputFilePath, imageFileName);
        console.log('PDF created at:', outputFilePath);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
