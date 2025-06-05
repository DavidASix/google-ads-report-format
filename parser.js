const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const headlines = [];
    const descriptions = [];
    const keywords = [];
    const negativeKeywords = [];
    const locations = [];
    const snippets = [];
    const calloutTexts = [];

    // Read and parse the CSV file with the correct encoding and delimiter
    fs.createReadStream(filePath, { encoding: "utf16le" })
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        // Extract headlines
        for (let i = 1; i <= 15; i++) {
          if (row[`Headline ${i}`]) {
            headlines.push(row[`Headline ${i}`]);
          }
        }

        // Extract descriptions
        for (let i = 1; i <= 4; i++) {
          if (row[`Description ${i}`]) {
            descriptions.push(row[`Description ${i}`]);
          }
        }

        // Extract keywords
        if (row["Keyword"] && row["Status"] === "Enabled") {
          if (!row["Criterion Type"].toLowerCase().includes("negative")) {
            keywords.push(row["Keyword"]);
          } else {
            negativeKeywords.push(row["Keyword"]);
          }
        }

        // Extract locations
        if (row["Location"] && row["Reach"]) {
          locations.push({ location: row["Location"], reach: row["Reach"] });
        }

        // Extract snippets
        if (row["Snippet Values"]) {
          snippets.push(...row["Snippet Values"].split("\r\n"));
        }

        // Extract callout text
        if (row["Callout text"]) {
          calloutTexts.push(row["Callout text"]);
        }
      })
      .on("end", () => {
        resolve({
          headlines,
          descriptions,
          keywords,
          negativeKeywords,
          locations,
          snippets,
          calloutTexts,
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = parseCSV;
