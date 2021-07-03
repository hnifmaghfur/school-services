
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
    const validatePayload = validator.isValidPayload(payload, queryModel.getAllClass);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getAllClass(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Class', httpError.UNAUTHORIZED);
  }
};

const getAllSiswa = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.query;
    const validatePayload = validator.isValidPayload(payload, queryModel.getAllSiswa);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getAllSiswa(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Class', httpError.UNAUTHORIZED);
  }
};

const getAllDataSiswa = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.query;
    const validatePayload = validator.isValidPayload(payload, queryModel.getAllDataSiswa);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getAllDataSiswa(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Class', httpError.UNAUTHORIZED);
  }
};

const getSiswaTentangDiri = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaTentangDiri(result.data);
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

const getSiswaTempatTinggal = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaTempatTinggal(result.data);
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

const getSiswaPendidikan = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaPendidikan(result.data);
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

const getSiswaKesehatan = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaKesehatan(result.data);
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

const getSiswaHobi = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaHobi(result.data);
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

const getSiswaOrangTua = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaOrangTua(result.data);
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

const getSiswaPindah = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaPindah(result.data);
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

const getSiswaKompetensi = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaKompetensi(result.data);
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
  getAllSiswa,
  getAllDataSiswa,
  getSiswaTentangDiri,
  getSiswaTempatTinggal,
  getSiswaPendidikan,
  getSiswaKesehatan,
  getSiswaHobi,
  getSiswaOrangTua,
  getSiswaPindah,
  getSiswaKompetensi,
  addClass,
  registerUser
};
