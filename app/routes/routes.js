const paths = require("./paths").routes;

module.exports = app => {
  app.get(paths.apiEndPoints.basePath, (req, res) =>
    res.status(200).send({
      message: "Welcome to the Auto Rescue Assistance Api"
    })
  );
};
