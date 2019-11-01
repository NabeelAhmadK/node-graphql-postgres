const express = require("express");
const logger = require("../logger/logger");
const http = require("http");
const redis = require('redis');
const bodyParser = require("body-parser");
var cors = require("cors");
const DButils = require("./core-utils/db-utils").DBUtils;
const dbConnection = require("../dbconfig");
const helmet = require('helmet');
DButils.initDB(dbConnection);

const app = express();
app.use(helmet())
logger.debug("Overriding 'Express' logger");
app.use(require("morgan")({
  stream: logger.stream
}));

app.use(cors());

app.use(bodyParser.json());

const port = parseInt(process.env.PORT, 10) || 8001;
app.set("port", port);

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

require("./routes/middleware")(app);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Unauthorized"
  })
);

const server = http.createServer(app);
server.listen(port);

module.exports = app;