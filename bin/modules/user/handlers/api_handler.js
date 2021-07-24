
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

const getListKelas = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await queryHandler.getListKelas());
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
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Siswa', httpError.UNAUTHORIZED);
  }
};

const getAllGuru = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const getRequest = async () => {
      return queryHandler.getAllGuru();
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest());
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Guru', httpError.UNAUTHORIZED);
  }
};

const getAllTenagaAhli = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const getRequest = async () => {
      return queryHandler.getAllTenagaAhli();
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.paginationResponse(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest());
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Guru', httpError.UNAUTHORIZED);
  }
};

const getGuru = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getGuruId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getGuru(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.response(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Guru', httpError.UNAUTHORIZED);
  }
};
const getTenagaAhli = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.params;
    const validatePayload = validator.isValidPayload(payload, queryModel.getTenagaAhliId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getTenagaAhli(result.data);
    };

    const sendResponse = async (result) => {
      (result.err) ? wrapper.response(res, 'fail', result, 'failed get data')
        : wrapper.response(res, 'success', result, 'Success get data', http.OK);
    };
    sendResponse(await getRequest(validatePayload));
  } else {
    logger.log('GetAllClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Get All Guru', httpError.UNAUTHORIZED);
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

const getSiswaData = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.query;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaIdKelasId);
    const getRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return queryHandler.getSiswaData(result.data);
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
    const payload = req.query;
    const validatePayload = validator.isValidPayload(payload, queryModel.getSiswaIdKelasId);
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

const addTentangDiri = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addTentangDiri);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addTentangDiri(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Tentang Diri')
        : wrapper.response(res, 'success', result, 'Add Tentang Diri', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Tentang Diri', httpError.UNAUTHORIZED);
  }
};

const addTempatTinggal = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addTempatTinggal);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addTempatTinggal(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Tempat Tinggal')
        : wrapper.response(res, 'success', result, 'Add Tempat Tinggal', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};
const addPendidikan = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addPendidikan);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addPendidikan(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Pendidikan')
        : wrapper.response(res, 'success', result, 'Add Pendidikan', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};
const addKesehatan = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addKesehatan);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addKesehatan(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Kesehatan')
        : wrapper.response(res, 'success', result, 'Add Kesehatan', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};
const addHobi = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addHobi);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addHobi(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Hobi')
        : wrapper.response(res, 'success', result, 'Add Hobi', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};
const addOrangTua = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addOrangTua);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addOrangTua(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Orang Tua')
        : wrapper.response(res, 'success', result, 'Add Orang Tua', http.CREATED);
    };
    sendResponse(await postRequest(validatePayload));
  } else {
    logger.log('AddClass', 'You dont have access', 'userId failed');
    wrapper.response(res, 'fail', 'You dont have Access', 'Add Class', httpError.UNAUTHORIZED);
  }
};
const addPindah = async (req, res) => {
  const { userId } = req.token;
  if (userId) {
    const payload = req.body;
    const validatePayload = validator.isValidPayload(payload, commandModel.addPindah);
    const postRequest = async (result) => {
      if (result.err) {
        return result;
      }
      return commandHandler.addPindah(result.data);
    };
    const sendResponse = async (result) => {
    /* eslint no-unused-expressions: [2, { allowTernary: true }] */
      (result.err) ? wrapper.response(res, 'fail', result, 'Add Pindah')
        : wrapper.response(res, 'success', result, 'Add Pindah', http.CREATED);
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
  getListKelas,
  getAllSiswa,
  getAllDataSiswa,
  getSiswaData,
  getSiswaTentangDiri,
  getSiswaTempatTinggal,
  getSiswaPendidikan,
  getSiswaKesehatan,
  getSiswaHobi,
  getSiswaOrangTua,
  getSiswaPindah,
  getSiswaKompetensi,
  getAllGuru,
  getGuru,
  getAllTenagaAhli,
  getTenagaAhli,
  addClass,
  addTentangDiri,
  addTempatTinggal,
  addPendidikan,
  addKesehatan,
  addHobi,
  addOrangTua,
  addPindah,
  registerUser
};
