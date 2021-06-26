const joi = require('joi');

const getAll = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
});

const getSiswaId = joi.object({
  siswa_id: joi.string().required(),
});

module.exports = {
  getAll,
  getSiswaId
};
