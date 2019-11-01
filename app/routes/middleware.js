const paths = require("./paths").routes;
const employeeController = require("../controllers").employeeController;
const loginController = require('../controllers').loginController;

module.exports = app => {

  app.get(paths.apiEndPoints.basePath, (req, res) =>
    res.status(200).send({
      message: "Welcome to the Auto Rescue Assistance Api"
    })
  );

  //Authentication
  app.post(paths.apiEndPoints.auth.basePath, loginController.login)

  //Employee Crud
  app.get(paths.apiEndPoints.employee.basePath, loginController.authenticationGaurd, employeeController.getEmployess);
  app.get(paths.apiEndPoints.employee.employeeId, loginController.authenticationGaurd, employeeController.getEmployeebyId);

};