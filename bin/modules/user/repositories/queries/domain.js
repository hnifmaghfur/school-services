
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

    const count = await this.query.countKelas();

    const kelas = await this.query.findAllClass(searching);
    if (kelas.err) {
      logger.log(ctx, kelas.err, 'user not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }


    const data = kelas.data.map((item, index) => {
      return {
        kelas_id: item.kelas_id,
        nomor: index + 1,
        kelas: item.nama_kelas,
        walikelas: item.wali_kelas,
        tahunAjaran: item.tahun_ajaran
      };
    });

    const meta = {
      page: parseInt(page),
      data: kelas.data.length,
      totalPage: Math.ceil(count.data[0].jumlah_kelas / parseInt(limit)),
      totalData: count.data[0].jumlah_kelas
    };

    return wrapper.paginationData(data, meta);
  }

  async viewAllSiswa(payload) {
    const ctx = 'getAllSiswa';
    const { search, page, limit, kelas_id } = payload;
    const searching = {
      search: search ? search : '',
      kelas_id,
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit)
    };
    const siswa = await this.query.findAllSiswa(searching);
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'user not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }

    const count = await this.query.countSiswa(searching);

    const data = siswa.data;

    const meta = {
      page: parseInt(page),
      data: siswa.data.length,
      totalPage: Math.ceil(count.data[0].jumlah_siswa / parseInt(limit)),
      totalData: count.data[0].jumlah_siswa
    };

    logger.log(ctx, 'success', 'get all siswa');
    return wrapper.paginationData(data, meta);
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

  async viewSiswaKompetensi(payload) {
    const ctx = 'getSiswaKompetensi';
    const { siswa_id } = payload;

    const mapelPengetahuan = await this.query.findMapelPengetahuan({siswa_id});
    if (mapelPengetahuan.err) {
      logger.log(ctx, mapelPengetahuan.err, 'mapel pengetahuan not found');
      return wrapper.error(new NotFoundError('Can not find mapel pengetahuan'));
    }

    const mapelKeterampilan = await this.query.findMapelKeterampilan({siswa_id});
    if (mapelKeterampilan.err) {
      logger.log(ctx, mapelKeterampilan.err, 'mapel keterampilan not found');
      return wrapper.error(new NotFoundError('Can not find mapel keterampilan'));
    }

    const pengetahuan = mapelPengetahuan.data[0];
    const keterampilan = mapelKeterampilan.data[0];

    // const data = {

    // }

    logger.log(ctx, 'success', 'get kompetensi siswa');
    return wrapper.data(keterampilan);
  }

}

module.exports = User;
