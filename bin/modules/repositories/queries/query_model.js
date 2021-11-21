const joi = require('joi');

const getAllClass = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
  sort: joi.string().required().valid('ASC', 'DESC'),
  tab: joi.string().required().valid('all', 'mipa', 'ips')
});

const getOneClass = joi.object({
  kelas_id: joi.string().allow(''),
});

const getAllSiswa = joi.object({
  alumni: joi.string().allow(''),
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
  alumni: joi.string().allow(''),
});

const getSiswaIdKelasId = joi.object({
  siswa_id: joi.string().required(),
  kelas_id: joi.string().required(),
});

const getSiswaKompetensi = joi.object({
  siswa_id: joi.string().required(),
  kelas_id: joi.string().required(),
  semester: joi.string().required(),
  alumni: joi.string().allow(''),
});

const getGuruId = joi.object({
  guru_id: joi.string().required(),
});

const getTenagaAhliId = joi.object({
  tenaga_ahli_id: joi.string().allow(''),
  type: joi.string().allow(''),
  tahun_ajaran: joi.string().allow(''),
  alumni: joi.string().allow(''),
});

module.exports = {
  getAllClass,
  getOneClass,
  getAllSiswa,
  getAllGuru,
  getGuruId,
  getTenagaAhliId,
  getSiswaId,
  getSiswaIdKelasId,
  getSiswaKompetensi,
};
