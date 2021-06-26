
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError } = require('../../../../helpers/error');
const validate = require('validate.js');
const uuid = require('uuid').v4;
const dateFormat = require('dateformat');

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

  async viewAllSiswa(payload) {
    const ctx = 'getAllSiswa';
    const { search, page, limit } = payload;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit)
    };
    const siswa = await this.query.findAllSiswa(searching);
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'user not found');
      return wrapper.error(new NotFoundError('Can not find user'));
    }

    let data = [];
    await Promise.all(siswa.data.map(async item => {
      const kelas = await this.query.findAllIsiKelas({ siswa_id: item.siswa_id });
      if (validate.isEmpty(kelas.err)) {
        await Promise.all(kelas.data.map( async value => {
        //   const dataSiswa = await this.query.findAllClassId({ kelas_id: value.kelas_id });
        //   if (validate.isEmpty(dataSiswa.err)) {
          data.push({
            kelas_id: value.kelas_id,
            siswa_id: item.siswa_id,
            NISN: item.NISN,
            NIS: item.NIS,
            name: item.nama_siswa,
            kelas: value.nama_kelas,
            jenis_kelamin: item.jenis_kelamin
          });
        //   }
        }));
      }

    }));


    logger.log(ctx, 'success', 'get all siswa');
    return wrapper.data(data);
  }

  async viewSiswaTentangDiri(payload) {
    const ctx = 'getSiswaTentangDiri';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllTentangDiri({siswa_id});
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new NotFoundError('Can not find siswa'));
    }

    const dataSiswa = siswa.data[0];
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

}

module.exports = User;
