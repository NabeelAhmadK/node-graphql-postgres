let basePath = "/employee/api/v1";

let routes = {
  apiEndPoints: {
    basePath: basePath,
    auth: {
      basePath: basePath + "/login"
    },
    employee: {
      basePath: basePath + "/employee",
      employeeId: basePath + "/employee/:employeeId",
      dietData: basePath + "/user/:patientId/diet",
      appointment: basePath + "/patient/appointment/make"
    }
  }
};

module.exports = {
  routes
};