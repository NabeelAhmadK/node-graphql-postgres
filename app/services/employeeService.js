const DButils = require("../core-utils/db-utils").DBUtils;
const Employee = require("../../model/").model.Employee;
const logger = require("../../logger/logger");
const employeeFunctions = require("../mw-dal").EmployeeFunctions;
const dataUtils = require("../core-utils").DataUtils;


const getEmployees = async (req, res) => {
  let tranx;

  try {
    tranx = await DButils.beginTransaction();

    let options = {
      tranx: tranx,
      pagging: {}
    };

    let response = await employeeFunctions.getEmployeeListings(options);

    response = dataUtils.formatPage(response.data, true, null, null, null, response.count);
    tranx.commit();

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    tranx.rollback();
    res.status(500).send(err);
  }
};

const getEmployeebyId = async (req, res) => {
  let tranx;

  try {

    tranx = await DButils.beginTransaction();

    let options = {
      tranx: tranx,
      params: req.params
    };

    let response = await employeeFunctions.getEmployeebyId(options);

    response = dataUtils.formatRespForNoDataAndArray(response)
    tranx.commit();

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    tranx.rollback();
    res.status(500).send(err);
  }
}

const employeeService = {};
employeeService.getEmployees = getEmployees;
employeeService.getEmployeebyId = getEmployeebyId;

module.exports = employeeService;