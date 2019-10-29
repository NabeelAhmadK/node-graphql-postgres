const express = require("express");
// const logger = require('morgan');
const logger = require("../utils/logger");
const http = require("http");

const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();

logger.debug("Overriding 'Express' logger");
app.use(require("morgan")({ stream: logger.stream }));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
const port = parseInt(process.env.PORT, 10) || 8000;
app.set("port", port);

if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}
app.use(bodyParser.json({ type: "application/json" }));

require("./routes/routes")(app);
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);

const server = http.createServer(app);
server.listen(port);

module.exports = app;
