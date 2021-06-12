
const wrapper = require('../../../helpers/utils/wrapper');
const commandHandler = require('../repositories/commands/command_handler');
const commandModel = require('../repositories/commands/command_model');
const queryHandler = require('../repositories/queries/query_handler');
const queryModel = require('../repositories/queries/query_model');
const logger = require('../../../helpers/utils/logger');
const validator = require('../../../helpers/utils/validator');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');

const postDataLogin = async (req, res) => {
  const payload = req.body;
  // eslint-disable-next-line no-console
  console.log(req.body);
  const validatePayload = validator.isValidPayload(payload, commandModel.login);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.postDataLogin(result.data);
  };

  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Login User')
      : wrapper.response(res, 'success', result, 'Login User', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const registerUser = async (req, res) => {
  const payload = req.body;
  const validatePayload = validator.isValidPayload(payload, commandModel.login);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.registerUser(result.data);
  };
  const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
    (result.err) ? wrapper.response(res, 'fail', result, 'Register User', httpError.CONFLICT)
      : wrapper.response(res, 'success', result, 'Register User', http.CREATED);
  };
  sendResponse(await postRequest(validatePayload));
};

const getAllClass = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.query;
    const validatePayload = validator.isValidPayload(payload, queryModel.getAll);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getAllClass(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.response(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Class', httpError.UNAUTHORIZED);
  }
};

const addClass = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addClass);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addClass(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Class')
        : wrapper.response(res, 'success', result, 'Add Class', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};

module.exports = {
  postDataLogin,
  getAllClass,
  addClass,
  registerUser
};
