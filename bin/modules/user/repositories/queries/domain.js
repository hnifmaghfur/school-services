
const Query = require('./query');
const wrapper = require('../../../../helpers/utils/wrapper');
const logger = require('../../../../helpers/utils/logger');
const { NotFoundError, InternalServerError } = require('../../../../helpers/error');
const validate = require('validate.js');
const uuid = require('uuid').v4;
const dateFormat = require('dateformat');

class User {

  constructor(db){
    this.query = new Query(db);
  }

  async viewAllClass(payload) {
    const ctx = 'getAllClass';
    const { search, page, limit, sort,tab } = payload;
    const tabAll = '(nama_kelas LIKE "%ipa%" OR nama_kelas LIKE "%ips%")';
    const tabNorm = `nama_kelas LIKE "%${tab}%"`;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
      tab: tab == 'all' ? tabAll : tabNorm
    };

    const kelas = await this.query.findAllClass(searching);
    if (kelas.err || validate.isEmpty(kelas.data)) {
      logger.log(ctx, kelas.err, 'user not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }

    const count = await this.query.countKelas(searching);

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

  async viewListKelas() {
    const ctx = 'getListKelas';

    const kelas = await this.query.findListKelas();
    if (kelas.err || validate.isEmpty(kelas.data)) {
      logger.log(ctx, 'error', 'user not found');
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const data = kelas.data.map((item, index) => {
      return {
        kelas_id: item.kelas_id,
        kelas: item.nama_kelas,
      };
    });

    return wrapper.data(data);
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
    if (siswa.err || validate.isEmpty(siswa.data)) {
      logger.log(ctx, ('find siswa'), 'user not found');
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

  async viewAllGuru(payload) {
    const ctx = 'getAllGuru';
    const { search, page, limit, sort } = payload;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
    };

    const guru = await this.query.findAllGuru(searching);
    if (guru.err || validate.isEmpty(guru.data)) {
      logger.log(ctx, 'search guru', 'guru not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }

    const count = await this.query.countGuru(searching);

    const data = guru.data;

    const meta = {
      page: parseInt(page),
      data: guru.data.length,
      totalPage: Math.ceil(count.data[0].jumlah_guru / parseInt(limit)),
      totalData: count.data[0].jumlah_guru
    };

    logger.log(ctx, 'success', 'get all guru');
    return wrapper.paginationData(data, meta);
  }

  async viewAllTenagaAhli(payload) {
    const ctx = 'getAllTenagaAhli';
    const { search, page, limit, sort } = payload;
    const searching = {
      search: search ? search : '',
      limit: parseInt(limit),
      page: (parseInt(page) - 1) * parseInt(limit),
      sort,
    };

    const tenagaAhli = await this.query.findAllTenagaAhli(searching);
    if (tenagaAhli.err || validate.isEmpty(tenagaAhli.data)) {
      logger.log(ctx, 'search tenaga ahli', 'tenaga ahli not found');
      return wrapper.paginationData([], {page: 0, data: 0, totalPage: 0, totalData:0} );
    }

    const count = await this.query.countTenagaAhli(searching);

    const data = tenagaAhli.data;

    const meta = {
      page: parseInt(page),
      data: tenagaAhli.data.length,
      totalPage: Math.ceil(count.data[0].jumlah_tenaga_ahli / parseInt(limit)),
      totalData: count.data[0].jumlah_tenaga_ahli
    };

    logger.log(ctx, 'success', 'get all tenaga ahli');
    return wrapper.paginationData(data, meta);
  }

  async viewGuru(payload) {
    const ctx = 'getGuru';
    const { guru_id } = payload;

    const guru = await this.query.findOneGuru({ guru_id });
    if (guru.err || validate.isEmpty(guru.data)) {
      logger.log(ctx, 'find guru', 'guru not found');
      return wrapper.error(new NotFoundError('Guru not Found'));
    }

    delete guru.data[0].createdAt;
    delete guru.data[0].updatedAt;

    const data = guru.data[0];

    logger.log(ctx, 'success', 'get all guru');
    return wrapper.data(data);
  }

  async viewTenagaAhli(payload) {
    const ctx = 'getTenagaAhli';
    const { tenaga_ahli_id } = payload;

    const tenagaAhli = await this.query.findOneTenagaAhli({ tenaga_ahli_id });
    if (tenagaAhli.err || validate.isEmpty(tenagaAhli.data)) {
      logger.log(ctx, 'find tenaga ahli', 'tenaga ahli not found');
      return wrapper.error(new NotFoundError('Tenaga Ahli not Found'));
    }

    delete tenagaAhli.data[0].createdAt;
    delete tenagaAhli.data[0].updatedAt;

    const data = tenagaAhli.data[0];

    logger.log(ctx, 'success', 'get tenaga ahli');
    return wrapper.data(data);
  }

  async viewAllDataSiswa(payload) {
    const ctx = 'getAllSiswa';
    const { search, limit, page, sort, tab } = payload;
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

  async viewSiswaData(payload) {
    const ctx = 'getSiswaTentangDiri';
    const { siswa_id, kelas_id } = payload;

    const siswa = await this.query.findDataSiswa({ siswa_id, kelas_id });
    if (siswa.err || validate.isEmpty(siswa.data)) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new NotFoundError('Can not find siswa'));
    }

    const data = siswa.data[0];

    const result = {
      name: data.name,
      kelas: data.kelas,
      NISN: data.NISN,
      NIS: data.NIS
    };

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(result);
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

    const dataSiswa = siswa.data.map(item => {
      if (item.type_ortu === '1') {
        item.type_ortu = 'ayah';
        delete item.hubungan_wali;
      } else if (item.type_ortu === '2') {
        item.type_ortu = 'ibu';
        delete item.hubungan_wali;
      } else {
        item.type_ortu = 'wali';
      }

      delete item.ortu_id;
      delete item.createdAt;
      delete item.updatedAt;

      return item;
    });

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
    const { siswa_id, kelas_id } = payload;

    const mapelPengetahuan = await this.query.findMapelPengetahuan({ siswa_id, kelas_id });
    if (mapelPengetahuan.err) {
      logger.log(ctx, mapelPengetahuan.err, 'mapel pengetahuan not found');
      return wrapper.error(new NotFoundError('Can not find mapel pengetahuan'));
    }

    const mapelKeterampilan = await this.query.findMapelKeterampilan({ siswa_id, kelas_id });
    if (mapelKeterampilan.err) {
      logger.log(ctx, mapelKeterampilan.err, 'mapel keterampilan not found');
      return wrapper.error(new NotFoundError('Can not find mapel keterampilan'));
    }

    const mapelSikap = await this.query.findMapelSikap({ siswa_id, kelas_id });
    if (mapelSikap.err) {
      logger.log(ctx, mapelSikap.err, 'mapel sikap not found');
      return wrapper.error(new NotFoundError('Can not find mapel sikap'));
    }

    const absen = await this.query.findAbsen({ siswa_id, kelas_id });
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
