
const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const commonUtil = require('../../../../helpers/utils/common');
const dateFormat = require('dateformat');
const logger = require('../../../../helpers/utils/logger');
const uuid = require('uuid').v4;
const { NotFoundError, UnauthorizedError, ConflictError, InternalServerError } = require('../../../../helpers/error');
const validate = require('validate.js');

const algorithm = 'aes-256-cbc';
const secretKey = 'sekolahan@jambi1';

class User {

  constructor(db){
    this.command = new Command(db);
    this.query = new Query(db);
  }

  async generateCredential(payload) {
    const ctx = 'login';
    const { username, password } = payload;
    const user = await this.query.findOneUser({ username });
    if (validate.isEmpty(user.data)) {
      logger.log(ctx, 'failed get data user', 'user not found');
      return wrapper.error(new NotFoundError('user not found'));
    }
    const userId = user.data[0].user_id;
    const userName = user.data[0].username;
    const pass = await commonUtil.decrypt(user.data[0].password, algorithm, secretKey);
    if (username !== userName || pass !== password) {
      logger.log(ctx, 'wrong password', 'verify password');
      return wrapper.error(new UnauthorizedError('Password invalid!'));
    }
    const data = {
      username,
      userId
    };
    const token = await jwtAuth.generateToken(data);
    logger.log(ctx, 'success login', 'login');
    return wrapper.data(token);
  }

  async register(payload) {
    const ctx = 'Register-User';
    const { username, password, isActive } = payload;
    const user = await this.query.findOneUser({ username });

    if (!validate.isEmpty(user.data)) {
      logger.log(ctx, 'user already exist', 'check user');
      return wrapper.error(new ConflictError('user already exist'));
    }

    const chiperPwd = await commonUtil.encrypt(password, algorithm, secretKey);
    const data = {
      user_id: uuid(),
      username,
      password: chiperPwd,
      isActive,
      createdAt: dateFormat(new Date(), 'isoDateTime'),
      updatedAt: dateFormat(new Date(), 'isoDateTime'),
    };

    const result = await this.command.insertOneUser(data);
    if (result.affectedRows == 0) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add user', 'insert user');
    return wrapper.data('success');

  }

  async addClass(payload) {
    const ctx = 'Add-Class';
    const { namaKelas, walikelas, tahunAjaran } = payload;

    const kelas = await this.query.findOneClass({ nama_kelas: namaKelas, wali_kelas: walikelas, tahun_ajaran: tahunAjaran });
    if (!validate.isEmpty(kelas.data)) {
      logger.log(ctx, 'kelas already exist', 'check kelas');
      return wrapper.error(new ConflictError('Kelas sudah ada.'));
    }

    const data = {
      kelas_id: uuid(),
      nama_kelas: namaKelas,
      wali_kelas: walikelas,
      tahun_ajaran: tahunAjaran,
      createdAt: dateFormat(new Date(), 'isoDateTime'),
      updatedAt: dateFormat(new Date(), 'isoDateTime'),
    };

    const result = await this.command.insertOneClass(data);
    if (result.affectedRows == 0) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add class', 'insert class');
    return wrapper.data('success');

  }

}

module.exports = User;
