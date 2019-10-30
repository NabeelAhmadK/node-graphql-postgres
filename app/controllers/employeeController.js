const employeeService = require("../services");
const employeeController = {};

employeeController.getEmployess = (req, res) => {
  employeeService.getEmployees(req, res);
};

module.exports = employeeController;
