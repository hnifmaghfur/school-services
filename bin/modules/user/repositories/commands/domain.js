
const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const commonUtil = require('../../../../helpers/utils/common');
const dateFormat = require('dateformat');
const logger = require('../../../../helpers/utils/logger');
const now = dateFormat(new Date().toLocaleString(), 'isoDateTime');
const uuid = require('uuid').v4;
const { NotFoundError, UnauthorizedError, ConflictError } = require('../../../../helpers/error');
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
    // const user = await this.query.findOneUser({ username });
    // if (user.err) {
    //   logger.log(ctx, user.err, 'user not found');
    //   return wrapper.error(new NotFoundError('user not found'));
    // }
    // const userId = user.data[0].user_id;
    // const userName = user.data[0].username;
    // const pass = await commonUtil.decrypt(user.data[0].password, algorithm, secretKey);
    // if (username !== userName || pass !== password) {
    //   return wrapper.error(new UnauthorizedError('Password invalid!'));
    // }
    // const data = {
    //   username,
    //   userId
    // };
    // const token = await jwtAuth.generateToken(data);
    return wrapper.data({id:uuid(), date: dateFormat(now, 'isoDateTime')});
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
      isActive
    };

    const { data:result } = await this.command.insertOneUser(data);
    return wrapper.data(result);

  }

}

module.exports = User;
