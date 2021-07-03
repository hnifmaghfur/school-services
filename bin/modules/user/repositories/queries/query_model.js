const joi = require('joi');

const getAllClass = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'ipa', 'ips')
});

const getAllDataSiswa = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'laki', 'perempuan')
});

const getAllSiswa = joi.object({
  search: joi.string().allow(''),
  kelas_id: joi.string().required(),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'laki', 'perempuan')
});

const getSiswaId = joi.object({
  siswa_id: joi.string().required(),
});

module.exports = {
  getAllClass,
  getAllSiswa,
  getAllDataSiswa,
  getSiswaId
};
