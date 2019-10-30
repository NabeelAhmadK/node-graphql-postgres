const logger = require("../../utils/logger");

var randtoken = require("rand-token");
var Long = require("long");
var util = require("util");
var fs = require("fs");
var moment = require("moment");

var DataUtils = {};

module.exports.DataUtils = DataUtils;

DataUtils.generateToken = function(chunkCount, chunkLen) {
  var token = "";

  for (var count = 0; count < chunkCount; count++) {
    token += (count > 0 ? "-" : "") + randtoken.generate(chunkLen);
  }

  return token;
};

var seqNumCounter = 0;

DataUtils.genSeqNum = function(workerId, numToAppend) {
  var seqNum = new Date().getTime();

  if (workerId != undefined && !isNaN(workerId)) seqNum += workerId;

  if (numToAppend != undefined) seqNum += numToAppend;

  seqNum += ("0" + seqNumCounter).slice(-2);
  seqNumCounter = (seqNumCounter + 1) % 100;

  return seqNum;
};

DataUtils.genMsgId = function(workerId, numToAppend) {
  return DataUtils.genSeqNum(workerId, numToAppend);
};

DataUtils.nomalizeToParam = function(queryParams) {
  var toList;

  if (queryParams.to instanceof Array) {
    toList = [];

    for (var toIndex = 0; toIndex < queryParams.to.length; toIndex++) {
      toList = toList.concat(queryParams.to[toIndex].split(","));
    }
  } else {
    toList = queryParams.to.split(",");
  }

  if (toList.length == 1) {
    queryParams.to = toList[0];
  } else {
    queryParams.to = toList;
  }
};

DataUtils.objectKeysToLowerCase = function(obj) {
  for (var key in obj) {
    var _key = key.toLowerCase();

    if (_key == key) continue;

    if (obj[_key]) {
      obj[_key] = [].concat(obj[_key]).concat(obj[key]);
    } else {
      obj[_key] = obj[key];
    }
    obj[key] = null;
    delete obj[key];
  }
};

DataUtils.getArrayDistinctItems = function(itemsArray) {
  var distinctItems = {};

  for (var index = 0; index < itemsArray.length; index++) {
    var item = itemsArray[index];
    if (item) {
      distinctItems[item] = item;
    }
  }

  return Object.keys(distinctItems).map(function(key) {
    return distinctItems[key];
  });
};

DataUtils.getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

DataUtils.printException = function(logger, err) {
  if (err) {
    if (err.stack) logger.error("stack-trace: " + err.stack);

    if (err instanceof DataException) {
      logger.error(
        util.format("errno = %d, message %s", err.errno, err.message)
      );
    } else {
      logger.error(err.toString());
    }
  } else {
    logger.error("Unhandled exception...");
  }
};

DataUtils.printObjValue = function(logger, value) {
  logger.debug("---------------------");
  logger.debug(value);
  logger.debug("---------------------");
};

DataUtils.handleException = function(logger, err) {
  var errRespObj = {};

  if (err) {
    if (err instanceof DataException) {
      errRespObj.statusCode = err.errno;
      errRespObj.statusPhrase = err.message;
    } else {
      logger.error("exception caught: " + err.stack);
      errRespObj.statusCode = ErrCodes.GENERAL_ERROR;
      errRespObj.statusPhrase = err.toString();
    }
  } else {
    errRespObj.statusCode = ErrCodes.GENERAL_ERROR;
    errRespObj.statusPhrase = "Unhandled exception";
  }

  logger.error("exception caught: " + JSON.stringify(errRespObj, null, 4));

  return errRespObj;
};

DataUtils.formatPage = function(
  records,
  addMetaData,
  pageNum,
  pageSize,
  header,
  totalResults
) {
  if (addMetaData) {
    var metadata = {};

    var _pageNum = pageNum || 1;
    var _pageSize = pageSize || 4000;

    _pageNum = parseInt(_pageNum);
    _pageSize = parseInt(_pageSize);
    var listings;
    var respObj = { statusCode: 0 };

    if (arguments.length < 6) {
      metadata.totalPages = Math.ceil(records.length / _pageSize);
      metadata.totalResults = records.length;
      var start = (_pageNum - 1) * _pageSize;
      var end = _pageNum * _pageSize;
    } else {
      metadata.totalPages = Math.ceil(totalResults / _pageSize);
      metadata.totalResults = totalResults;
    }

    metadata.currentPage = _pageNum;
    metadata.pageSize = _pageSize;

    if (header && header.statusMessage) respObj.statusMessage = "";

    respObj._metadata = metadata;

    if (header) {
      for (var key in header) {
        respObj[key] = header[key];
      }
    }
    if (arguments.length < 6) {
      respObj.listings = records.slice(start, end);
    } else {
      respObj.listings = records;
    }
    return respObj;
  } else {
    var respObj = { statusCode: 0 };

    if (header) {
      for (var key in header) {
        respObj[key] = header[key];
      }
    }

    respObj.listings = records;

    return respObj;
  }
};

DataUtils.paginate = function(page, itemsPerPage) {
  let offset = (page - 1) * itemsPerPage;
  let limit = itemsPerPage;
  pageObj = {
    offset: offset,
    limit: limit
  };
  return pageObj;
};

DataUtils.formatResp = function(data) {
  var responeObj = { statusCode: 0, id: "" };

  for (var key in data) {
    responeObj[key] = data[key];
  }

  if (!data.id) delete responeObj.id;

  return responeObj;
};
DataUtils.formatRespForNoDataAndArray = function(data) {
  var responeObj = { statusCode: 0 };
  var responseData;

  if (util.isArray(data) && data.length > 0) responseData = data[0];
  else responseData = data;

  for (var key in responseData) {
    responeObj[key] = responseData[key];
  }

  return responeObj;
};

DataUtils.formatUserName = function(name) {
  var _name = "";

  if (name && name.firstName) {
    _name = name.firstName;
  }

  return _name;
};

DataUtils.selectRandomArrayChunk = function(array) {
  var middleElement = parseInt(array.length);

  var startElement = parseInt(Math.random() * middleElement + 1);

  return array.slice(startElement, startElement * 2);
};

DataUtils.filterByStringParam = function(array, paramName, paramVal) {
  var response = [];

  for (var index = 0; index < array.length; index++) {
    if (array[index][paramName] == paramVal) {
      response.push(array[index]);
    }
  }

  return response;
};

DataUtils.filterByIntParam = function(array, paramSelect, paramVal, cmpType) {
  var response = [];

  for (var index = 0; index < array.length; index++) {
    if (cmpType == "EQ") {
      if (parseInt(paramSelect(array[index])) == parseInt(paramVal)) {
        response.push(array[index]);
      }
    } else if (cmpType == "LT") {
      if (parseInt(paramSelect(array[index])) < parseInt(paramVal)) {
        response.push(array[index]);
      }
    } else if (cmpType == "LE") {
      if (parseInt(paramSelect(array[index])) <= parseInt(paramVal)) {
        response.push(array[index]);
      }
    } else if (cmpType == "GT") {
      if (parseInt(paramSelect(array[index])) > parseInt(paramVal)) {
        response.push(array[index]);
      }
    } else if (cmpType == "GE") {
      if (parseInt(paramSelect(array[index])) >= parseInt(paramVal)) {
        response.push(array[index]);
      }
    }
  }

  return response;
};

DataUtils.createSocialUser = function(user) {
  var _user = {
    lastName: "string",
    name: "string",
    password: "string",
    photo: "string",
    remoteId: 0,
    roles: []
  };

  if (user.name) {
    _user.name = user.name.firstName;
    _user.lastName = user.name.lastName;
  }

  _user.password = user.password;
  _user.photo = user.photoFileId;

  return _user;
};

DataUtils.createSocialCompany = function(company) {
  var _company = {
    name: "string",
    description: "string"
  };

  _company.name = company.name;
  _company.description = company.description;

  return _company;
};

DataUtils.createGWId = function(clientId, origIP) {
  return (
    "RT" + ("00000000" + clientId).slice(-8) + "-" + DataUtils.ipToHex(origIP)
  );
};

DataUtils.JSON_stringify = function(s, emit_unicode) {
  var json = JSON.stringify(s);
  return emit_unicode
    ? json
    : json.replace(/[\u007f-\uffff]/g, function(c) {
        return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
      });
};

DataUtils.createTermTG = function(rateCardData) {
  return (
    rateCardData.platformId +
    rateCardData.rateCard +
    "-RT" +
    ("00000000" + rateCardData.routeNo).slice(-8) +
    "D"
  );
};

DataUtils.extractIPV4 = function(address) {
  var prefix = "::ffff:";
  if (address.indexOf(prefix) >= 0) {
    return address.substr(prefix.length);
  } else {
    return address;
  }
};

DataUtils.unixTimestampToDateString = function(unixTimestamp, dateFormat) {
  if (unixTimestamp) {
    let rDate = moment(unixTimestamp).format(dateFormat);
    logger.info("dateToUnixTimestamp [%s] to [%s]", unixTimestamp, rDate);
    return rDate;
  }
  return "";
};

DataUtils.dateToUnixTimestamp = function(dateToConvert, dateFormat) {
  if (dateToConvert) {
    let rDate = moment(dateToConvert, dateFormat).valueOf();
    logger.info("dateToUnixTimestamp [%s] to [%s]", dateToConvert, rDate);
    return rDate;
  }
  return "";
};
function getArrayElement(array, index, splitBy, subIndex, defaultVal) {
  var element = "";
  if (array[index]) {
    var token = array[index].split(splitBy);
    if (token[subIndex]) {
      element = token[subIndex];
    } else {
      element = defaultVal;
    }
  } else {
    element = defaultVal;
  }

  return element;
}

DataUtils.parseDlvryMsg = function(message, dataCoding, msgIdFormat) {
  var dlvryMsg = {};

  if (message && dataCoding == 0) {
    var msgTokens = message.split(" ");
    dlvryMsg.id = applyMsgConvRules(
      getArrayElement(msgTokens, 0, ":", 1, "undefined"),
      msgIdFormat
    );
    dlvryMsg.sub = getArrayElement(msgTokens, 1, ":", 1, "undefined"); //msgTokens[1].split(':')[1];
    dlvryMsg.dlvrd = getArrayElement(msgTokens, 2, ":", 1, "undefined"); //msgTokens[2].split(':')[1];
    dlvryMsg.submitDate = convertDlvDate(
      getArrayElement(msgTokens, 4, ":", 1, "000000000000")
    ); //convertDlvDate(msgTokens[4].split(':')[1])
    dlvryMsg.doneDate = convertDlvDate(
      getArrayElement(msgTokens, 6, ":", 1, "000000000000")
    ); //convertDlvDate(msgTokens[6].split(':')[1]);
    dlvryMsg.stat = getArrayElement(msgTokens, 7, ":", 1, "undefined"); //msgTokens[7].split(':')[1];
    dlvryMsg.err = getArrayElement(msgTokens, 8, ":", 1, "undefined"); //msgTokens[8].split(':')[1];
    dlvryMsg.text = getArrayElement(msgTokens, 9, ":", 1, "undefined"); //msgTokens[9].split(':')[1];
  } else {
    dlvryMsg.id = "undefined";
    dlvryMsg.sub = "undefined";
    dlvryMsg.dlvrd = "undefined";
    dlvryMsg.submitDate = convertDlvDate("000000000000");
    dlvryMsg.doneDate = convertDlvDate("000000000000");
    dlvryMsg.stat = "undefined";
    dlvryMsg.err = "undefined";
    dlvryMsg.text = "undefined";
  }

  return dlvryMsg;
};

function convertDlvDate(dateStr) {
  var date = new Date();

  date.setFullYear("20" + dateStr.substr(0, 2));
  date.setMonth(parseInt(dateStr.substr(2, 2)) - 1);
  date.setDate(dateStr.substr(4, 2));

  date.setHours(dateStr.substr(6, 2));
  date.setMinutes(dateStr.substr(8, 2));
  if (dateStr.length == 12) {
    date.setSeconds(dateStr.substr(10, 2));
  }

  return date;
}

function applyMsgConvRules(rcvdMsgId, msgIdFormat) {
  var msgId;

  if (!msgIdFormat || msgIdFormat.length == 0) {
    if (!isNaN(rcvdMsgId)) {
      var longId = Long.fromString(rcvdMsgId, true, 10);
      if (longId.toString() == rcvdMsgId) {
        msgId = longId.toString(16).toUpperCase();
      } else {
        msgId = rcvdMsgId;
      }
    } else {
      msgId = rcvdMsgId;
    }
  } else {
    var rules = msgIdFormat.split(":");
    var type = rules[0].toLowerCase();
    var maxLen = rules[1];
    var padding = rules[2];
    var strCase = rules[3];

    if (type == "hex") {
      var longId = Long.fromString(rcvdMsgId, true, 10);
      var hexStr = longId.toString(16);

      if (maxLen && maxLen.length > 0) {
        var length = parseInt(maxLen);

        if (!padding || padding.length == 0) {
          padding = "0";
        }

        msgId = (padding.repeat(length) + hexStr).slice(-1 * length);
      } else {
        msgId = hexStr;
      }

      if (strCase && strCase.length > 0) {
        strCase = strCase.toLowerCase();
        if (strCase == "upper") {
          msgId = msgId.toUpperCase();
        } else if (strCase == "lower") {
          msgId = msgId.toLowerCase();
        }
      } else {
        msgId = msgId.toUpperCase();
      }
    } else if (type == "string") {
      if (maxLen && maxLen.length > 0) {
        var length = parseInt(maxLen);

        if (!padding || padding.length == 0) {
          padding = "0";
        }

        msgId = (padding.repeat(length) + rcvdMsgId).slice(-1 * length);
      } else {
        msgId = rcvdMsgId;
      }

      if (strCase && strCase.length > 0) {
        strCase = strCase.toLowerCase();
        if (strCase == "upper") {
          msgId = msgId.toUpperCase();
        } else if (strCase == "lower") {
          msgId = msgId.toLowerCase();
        }
      }
    } else {
      msgId = rcvdMsgId;
    }
  }

  return msgId;
}

DataUtils.convertToUnixTimestamp = function(strTimestamp) {
  let uTimestamp = 0;
  if (strTimestamp) {
    uTimestamp = new Date(strTimestamp).getTime();
  }

  return uTimestamp;
};

DataUtils.calculateBalance = function(acctData) {
  return (
    acctData.totalGrossProfit +
    acctData.totalCredit +
    acctData.totalKickback -
    (acctData.totalConsumption +
      acctData.totalKickbackPayment +
      acctData.totalGrossProfitPayment)
  );
};

DataUtils.getAcctTemplate = function() {
  return {
    totalCredit: 0,
    totalPayment: 0,
    totalKickback: 0,
    totalConsumption: 0,
    totalCreditPayment: 0,
    totalKickbackPayment: 0,
    totalGrossProfit: 0,
    totalGrossProfitPayment: 0,
    totalReservedAmount: 0,
    totalPayable: 0
  };
};
