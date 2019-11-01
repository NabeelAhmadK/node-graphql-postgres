const employeeService = require("../services").employeeService;
const employeeController = {};

employeeController.getEmployess = (req, res) => {
  employeeService.getEmployees(req, res);
};

employeeController.getEmployeebyId = (req, res) => {
  employeeService.getEmployeebyId(req, res);
}

module.exports = employeeController;