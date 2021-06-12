const joi = require('joi');

const login = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  isActive : joi.boolean().default(true, 'Example If Need Default Value')
});

const addClass = joi.object({
  namaKelas: joi.string().required(),
  walikelas: joi.string().required(),
  tahunAjaran : joi.string().required()
});

module.exports = {
  login,
  addClass
};
