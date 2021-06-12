
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
    const kelas = await this.query.findAllClass(searching);
    if (kelas.err) {
      logger.log(ctx, kelas.err, 'user not found');
      return wrapper.error(new NotFoundError('Can not find user'));
    }


    const data = kelas.data.map((item, index) => {
      return {
        nomor: index + 1,
        kelas: item.nama_kelas,
        walikelas: item.walikelas,
        tahunAjaran: item.tahun_ajaran
      };
    });
    return wrapper.data(data);
  }

}

module.exports = User;
