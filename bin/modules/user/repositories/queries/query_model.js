const joi = require('joi');

const getAllClass = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'mipa', 'ips')
});

const getAllSiswa = joi.object({
  search: joi.string().allow(''),
  kelas_id: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'laki', 'perempuan')
});

const getAllGuru = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('nama ASC', 'nama DESC', 'jabatan ASC', 'jabatan DESC')
});

const getSiswaId = joi.object({
  siswa_id: joi.string().required(),
});

const getSiswaIdKelasId = joi.object({
  siswa_id: joi.string().required(),
  kelas_id: joi.string().required(),
  semester: joi.string().required(),
});

const getGuruId = joi.object({
  guru_id: joi.string().required(),
});

const getTenagaAhliId = joi.object({
  tenaga_ahli_id: joi.string().required(),
});

module.exports = {
  getAllClass,
  getAllSiswa,
  getAllGuru,
  getGuruId,
  getTenagaAhliId,
  getSiswaId,
  getSiswaIdKelasId,
};
