
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError } = require('../../../../helpers/error');

class User {

  constructor(db){
    this.query = new Query(db);
  }

  async viewAllClass(payload) {
    const ctx = 'getAllClass';
    const { search, page, limit } = payload;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit)
    };
    const user = await this.query.findAllClass(searching);
    if (user.err) {
      logger.log(ctx, user.err, 'user not found');
      return wrapper.error(new NotFoundError('Can not find user'));
    }
    const { data } = user;
    return wrapper.data(data);
  }

}

module.exports = User;
