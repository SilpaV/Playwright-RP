fs = require("fs");
const parser = require("xml2json");
let total;
let failed;
let skipped;
let passed;
let fileName = "./reports/reportE2E.xml";
let fileNameDev = "./reports/reportRPDev.xml";
let existingXMLReportName;

function getTestCountsFromXML() {
  if (fs.existsSync(fileName)) {
    existingXMLReportName = fileName;
  } else existingXMLReportName = fileNameDev;

  fs.readFile(existingXMLReportName, function (err, data) {
    var json = parser.toJson(data);
    var jsonData = JSON.parse(json);

    // console.log("to json ->", jsonData);
    total = jsonData.testsuites.tests;
    failed = jsonData.testsuites.failures;
    skipped = jsonData.testsuites.skipped;
    passed = total - failed - skipped;
  });

  return { total, failed, skipped, passed };
}

module.exports = {
  getTestCountsFromXML,
};

getTestCountsFromXML();
