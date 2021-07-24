
const User = require('./domain');
const Mysql = require('../../../../helpers/databases/mysql/db');
const config = require('../../../../infra/configs/global_config');
const db = new Mysql(config.get('/mysqlConfig'));

const postDataLogin = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.generateCredential(payload);
  return postCommand(payload);
};

const registerUser = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.register(payload);
  return postCommand(payload);
};

const addClass = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addClass(payload);
  return postCommand(payload);
};

const addTentangDiri = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addTentangDiri(payload);
  return postCommand(payload);
};

const addTempatTinggal = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addTempatTinggal(payload);
  return postCommand(payload);
};

const addPendidikan = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addPendidikan(payload);
  return postCommand(payload);
};

const addKesehatan = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addKesehatan(payload);
  return postCommand(payload);
};

const addOrangTua = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addOrangTua(payload);
  return postCommand(payload);
};

const addHobi = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addHobi(payload);
  return postCommand(payload);
};

const addPindah = async (payload) => {
  const user = new User(db);
  const postCommand = async payload => user.addPindah(payload);
  return postCommand(payload);
};

module.exports = {
  postDataLogin,
  registerUser,
  addClass,
  addTentangDiri,
  addTempatTinggal,
  addPendidikan,
  addKesehatan,
  addOrangTua,
  addHobi,
  addPindah,
};
