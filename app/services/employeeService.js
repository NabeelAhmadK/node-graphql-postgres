const DButils = require("../core-utils/db-utils").DBUtils;
const dbConnection = require("../../dbconfig");
DButils.initDB(dbConnection);
const Employee = require("../../model/").model.Employee;
const logger = require("../../utils/logger");
const getEmployees = async (req, res) => {
  let tranx;
  try {
    tranx = await DButils.beginTransaction();
    
    let obj = {};
    let totalCount = null;
    let model = Employee.query(tranx);
    obj.count = totalCount;
    totalCount = await model.clone().count();
    obj.count = totalCount[0]['count'];
    console.log(model);
    // if (('pageNum' in options.pagging) && ('pageSize' in options.pagging)) {
    //     totalCount = await model.clone().count();
    //     obj.count = totalCount[0]['count'];
    //     let offset = DataUtils.setOffset(options.pagging.pageNum, options.pagging.pageSize);
    //     model.offset(offset).limit(options.pagging.pageSize);
    // }
    model.orderBy("mod_date", "DESC");

    let data = await model.clone().select();
    logger.info(
      "<========= Query for get Carrier listing =========> ",
      model.clone().select()
    );


    obj.data = data;

    console.log(obj);
    tranx.commit();
    res.status(200).send(obj);
  } catch (err) {
    console.log(err);
    tranx.rollback();
    res.status(500).send(err);
  }
};

const employeeService = {};
employeeService.getEmployees = getEmployees;

module.exports = employeeService;
