const Employee = require("../../model/").model.Employee;
const logger = require("../../utils/logger");

const getEmployeeListings = async options => {
  try {
    let obj = {};
    let totalCount = null;
    let model = Employee.query(options.tranx);
    obj.count = totalCount;
    totalCount = await model.clone().count();
    obj.count = totalCount[0]["count"];

    if ("pageNum" in options.pagging && "pageSize" in options.pagging) {
      totalCount = await model.clone().count();
      obj.count = totalCount[0]["count"];
      let offset = DataUtils.setOffset(
        options.pagging.pageNum,
        options.pagging.pageSize
      );
      model.offset(offset).limit(options.pagging.pageSize);
    }

    model.orderBy("mod_date", "DESC");

    let data = await model.clone().select();
    logger.info("<========= Query for get Carrier listing =========> ");

    obj.data = data;

    return obj;
  } catch (err) {
    throw err;
  }
};

const EmployeeFunctionUtils = {};
EmployeeFunctionUtils.getEmployeeListings = getEmployeeListings;

module.exports = EmployeeFunctionUtils;
