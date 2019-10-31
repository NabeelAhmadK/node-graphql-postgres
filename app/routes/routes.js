const paths = require("./paths").routes;
const employeeController = require("../controllers").employeeController;
module.exports = app => {
  app.get(paths.apiEndPoints.basePath, (req, res) =>
    res.status(200).send({
      message: "Welcome to the Auto Rescue Assistance Api"
    })
  );

  app.get(
    paths.apiEndPoints.employee.basePath,
    employeeController.getEmployess
  );

  app.get(
    paths.apiEndPoints.employee.employeeId,
    employeeController.getEmployeebyId
  );
};