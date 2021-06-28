
const User = require('./domain');
const Mysql = require('../../../../helpers/databases/mysql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mysql(config.get('/mysqlConfig'));
const user = new User(db);

const getAllClass = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllClass(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getAllSiswa = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllSiswa(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaTentangDiri = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaTentangDiri(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaKompetensi = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaKompetensi(payload);
    return result;
  };
  const result = await getData();
  return result;
};

module.exports = {
  getAllClass,
  getAllSiswa,
  getSiswaTentangDiri,
  getSiswaKompetensi,
};
