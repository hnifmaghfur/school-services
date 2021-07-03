
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
    const { search, page, limit, sort, tab } = payload;
    const tabAll = '(nama_kelas LIKE "%ipa%" OR nama_kelas LIKE "%ips%")';
    const tabNorm = `nama_kelas LIKE "%${tab}%"`;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
      tab: tab == 'all' ? tabAll : tabNorm
    };

    const count = await this.query.countKelas(searching);

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
    const { search, page, limit, kelas_id, sort, tab } = payload;
    const tabAll = '(siswa.jenis_kelamin LIKE "%laki%" OR siswa.jenis_kelamin LIKE "%perempuan%")';
    const tabNorm = `siswa.jenis_kelamin LIKE "%${tab}%"`;
    const searching = {
      search: search ? search : '',
      kelas_id,
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
      tab: tab == 'all' ? tabAll : tabNorm
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

  async viewAllDataSiswa(payload) {
    const ctx = 'getAllSiswa';
    const { search, page, limit, sort, tab } = payload;
    const tabAll = '(siswa.jenis_kelamin LIKE "%laki%" OR siswa.jenis_kelamin LIKE "%perempuan%")';
    const tabNorm = `siswa.jenis_kelamin LIKE "%${tab}%"`;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
      tab: tab == 'all' ? tabAll : tabNorm
    };

    const siswa = await this.query.findAllDataSiswa(searching);
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }

    const count = await this.query.countSiswaAll(searching);

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

  async viewSiswaTempatTinggal(payload) {
    const ctx = 'getSiswaTempatTinggal';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllTempatTinggal({siswa_id});
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

  async viewSiswaPendidikan(payload) {
    const ctx = 'getSiswaPendidikan';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllPendidikan({siswa_id});
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

  async viewSiswaKesehatan(payload) {
    const ctx = 'getSiswaKesehatan';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllKesehatan({siswa_id});
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

  async viewSiswaHobi(payload) {
    const ctx = 'getSiswaHobi';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllHobi({siswa_id});
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

  async viewSiswaOrangTua(payload) {
    const ctx = 'getSiswaOrangTua';
    const { siswa_id } = payload;

    //khusus orang tua ada wali juga, tolong cek lagi, type 1 = ayah 2=ibu 3=wali

    const siswa = await this.query.findAllOrangTua({siswa_id});
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
  async viewSiswaPindah(payload) {
    const ctx = 'getSiswaPindah';
    const { siswa_id } = payload;

    const siswa = await this.query.findAllPindahan({siswa_id});
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

    const mapelPengetahuan = await this.query.findMapelPengetahuan({ siswa_id });
    if (mapelPengetahuan.err) {
      logger.log(ctx, mapelPengetahuan.err, 'mapel pengetahuan not found');
      return wrapper.error(new NotFoundError('Can not find mapel pengetahuan'));
    }

    const mapelKeterampilan = await this.query.findMapelKeterampilan({ siswa_id });
    if (mapelKeterampilan.err) {
      logger.log(ctx, mapelKeterampilan.err, 'mapel keterampilan not found');
      return wrapper.error(new NotFoundError('Can not find mapel keterampilan'));
    }

    const mapelSikap = await this.query.findMapelSikap({ siswa_id });
    if (mapelSikap.err) {
      logger.log(ctx, mapelSikap.err, 'mapel sikap not found');
      return wrapper.error(new NotFoundError('Can not find mapel sikap'));
    }

    const absen = await this.query.findAbsen({ siswa_id });
    if (absen.err) {
      logger.log(ctx, absen.err, 'absen not found');
      return wrapper.error(new NotFoundError('Can not find absen'));
    }

    const p = mapelPengetahuan.data[0];
    const k = mapelKeterampilan.data[0];
    const s = mapelSikap.data[0];

    const data = {
      Kelompok_A : [
        ['Pendidikan Agama & Budi Pekerti', p.agama, k.agama, s.agama],
        ['PPKn', p.pkn, k.pkn, s.pkn],
        ['Bahasa Indonesia', p.b_indo, k.b_indo, s.b_indo],
        ['Bahasa Inggris', p.b_ing, k.b_ing, s.b_ing],
      ],
      Kelompok_B: [
        ['Seni Budaya', p.seni, k.seni, s.seni],
        ['Penjas, Olahraga & Kesehatan', p.penjas, k.penjas, s.penjas],
        ['Prakarya & Kewirausahaan', p.prakarya, k.prakarya, s.prakarya],
      ],
      Kelompok_C_Peminatan: [
        ['Matematika', p.matematika_P, k.matematika_P, s.matematika_P],
        ['Biologi', p.biologi_P, k.biologi_P, s.biologi_P],
        ['Fisika', p.fisika_P, k.fisika_P, s.fisika_P],
        ['Kimia', p.kimia_P, k.kimia_P, s.kimia_P],
        ['Geografi', p.geografi_P, k.geografi_P, s.geografi_P],
        ['Sejarah', p.sejarah_P, k.sejarah_P, s.sejarah_P],
        ['Sosiologi', p.sosiologi_P, k.sosiologi_P, s.sosiologi_P],
        ['Ekonomi', p.ekonomi_P, k.ekonomi_P, s.ekonomi_P],
      ],
      Kelompok_C_Lintas_Peminatan: [
        ['Matematika', p.matematika_LP, k.matematika_LP, s.matematika_LP],
        ['Biologi', p.biologi_LP, k.biologi_LP, s.biologi_LP],
        ['Fisika', p.fisika_LP, k.fisika_LP, s.fisika_LP],
        ['Kimia', p.kimia_LP, k.kimia_P, s.kimia_LP],
        ['Geografi', p.geografi_LP, k.geografi_LP, s.geografi_LP],
        ['Sejarah', p.sejarah_LP, k.sejarah_LP, s.sejarah_LP],
        ['Sosiologi', p.sosiologi_LP, k.sosiologi_LP, s.sosiologi_LP],
        ['Ekonomi', p.ekonomi_LP, k.ekonomi_LP, s.ekonomi_LP],
        ['Bahasa & Sastra Indonesia', p.b_indo_LP, k.b_indo_LP, s.b_indo_LP],
        ['Bahasa & Sastra Inggris', p.b_ing_LP, k.b_ing_LP, s.b_ing_LP],
        ['Bahasa Asing Lain', p.b_asing_LP, k.b_asing_LP, s.b_asing_LP],
        ['Antropologi', p.antropologi_LP, k.antropologi_LP, s.antropologi_LP],
      ],
      Ketidak_hadiran: {
        sakit:  absen.data[0].sakit,
        izin:  absen.data[0].izin,
        tanpa_keterangan:  absen.data[0].tanpa_keterangan,
      }
    };

    logger.log(ctx, 'success', 'get kompetensi siswa');
    return wrapper.data(data);
  }

}

module.exports = User;
