// load config from.env
require('dotenv').config();

let appInsights = require("applicationinsights");
appInsights.setup(process.env.MICROSOFT_INSTRUMENTATIONKEY)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .start();; // assuming ikey in env var
let client = appInsights.defaultClient;

client.trackEvent("my custom event", {customProperty: "custom property value"});
//client.trackException(new Error("handled exceptions can be logged with this method"));
client.trackMetric("custom metric", 3);
client.trackTrace("trace message");



let http = require("http");
let fs = require('fs');
let server = http.createServer( (req, res) => {
  client.trackRequest(req, res); // Place at the beginning of your request handler
  // ファイルを読み込んだら、コールバック関数を実行する。
  fs.readFile('./index.html', 'utf-8', doReard);
  // コンテンツを表示する。
  function doReard(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  }
});

server.listen(8080);
