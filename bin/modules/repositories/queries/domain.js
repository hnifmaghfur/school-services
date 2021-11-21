
const Query = require('./query');
const wrapper = require('../../../helpers/utils/wrapper');
const logger = require('../../../helpers/utils/logger');
const { InternalServerError } = require('../../../helpers/error');
const validate = require('validate.js');
const uuid = require('uuid').v4;
const dateFormat = require('dateformat');

class User {

  constructor(db) {
    this.query = new Query(db);
  }

  async viewAllClass(payload) {
    const ctx = 'getAllClass';
    const { search, page, limit, sort, tab } = payload;
    const stat = {
      limit: parseInt(limit),
      page: parseInt(page),
    };

    let sorting = {};
    if (sort == 'ASC') {
      sorting = { nama_kelas: 1 };
    } else {
      sorting = { nama_kelas: -1 };
    }

    let searching = {
      isActive: true,
      $or: [
        { 'nama_kelas': new RegExp(`${search || ''}`, 'i') },
        { 'wali_kelas': new RegExp(`${search || ''}`, 'i') },
        { 'tahun_ajaran': new RegExp(`${search || ''}`, 'i') },
      ],
    };

    if (tab != 'all') {
      searching = {
        ...searching,
        nama_kelas: { $in: [new RegExp(`${tab || ''}`, 'i')] }
      };
    }

    const kelas = await this.query.findAllClass(sorting, stat, searching);
    if (kelas.err || validate.isEmpty(kelas.data)) {
      logger.log(ctx, kelas.err, 'user not found');
      return wrapper.paginationData([], { page: 0, data: 0, totalPage: 0, totalData: 0 });
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
      totalPage: Math.ceil(count.data / parseInt(limit)),
      totalData: count.data
    };

    return wrapper.paginationData(data, meta);
  }

  async viewOneClass(payload) {
    const ctx = 'getOneClass';
    const { kelas_id } = payload;

    const kelas = await this.query.findOneClass({ kelas_id, isActive: true });
    if (kelas.err || validate.isEmpty(kelas.data)) {
      logger.log(ctx, 'error', 'kelas not found');
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const data = kelas.data;
    data.jurusan = data.nama_kelas.split(' ')[1] + ' ' + data.nama_kelas.split(' ')[2];
    data.tahun_ajaran_awal = data.tahun_ajaran.split('-')[0];
    data.tahun_ajaran_akhir = data.tahun_ajaran.split('-')[1];

    if (data.jenis_kelas == 10) {
      data.nama_kelas = 'X';
    } else if (data.jenis_kelas == 11) {
      data.nama_kelas = 'XI';
    } else {
      data.nama_kelas = 'XII';
    }

    delete data._id;
    delete data.tahun_ajaran;
    delete data.jenis_kelas;
    delete data.isActive;
    delete data.createdAt;
    delete data.updatedAt;

    return wrapper.data(data);
  }

  async viewListKelas() {
    const ctx = 'getListKelas';

    const kelas = await this.query.findListKelas({ isActive: true });
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

  async viewKelasKompetensi(payload) {
    const ctx = 'getKelasKompetensi';

    const siswa = await this.query.findOneSiswa({ ...payload, isDelete: false });
    if (siswa.err) {
      logger.log(ctx, 'error', 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa not found'));
    }

    const addKelas = await this.query.findOneClass({ kelas_id: siswa.data.kelas_id, isActive: true });
    if (addKelas.err || validate.isEmpty(addKelas.data)) {
      logger.log(ctx, 'error', 'kelas not found');
      return wrapper.error(new InternalServerError('Internal server error'));
    }

    const kelas = await this.query.findManyKompetensi(payload);
    if (kelas.err || validate.isEmpty(kelas.data)) {
      logger.log(ctx, 'error', 'kelas di Kompetensi not found');
      return wrapper.data([{ kelas_id: addKelas.data.kelas_id, kelas: addKelas.data.nama_kelas }]);
    }

    let data = [];

    kelas.data.map(item => {
      return data.push({
        kelas_id: item.kelas_id,
        kelas: item.namaKelas,
      });
    });

    if (validate.isEmpty(data.find(item => item.kelas_id == siswa.data.kelas_id))) {
      data.push({
        kelas_id: siswa.data.kelas_id,
        kelas: addKelas.data.nama_kelas || 'Kelas tidak ada'
      });
    }

    const ids = data.map(o => o.kelas_id);
    const filtered = data.filter(({ kelas_id }, index) => !ids.includes(kelas_id, index + 1));

    return wrapper.data(filtered);
  }

  async viewAllSiswa(payload) {
    const ctx = 'getAllSiswa';
    const { search, page, limit, kelas_id, sort, tab, alumni } = payload;

    const stat = {
      limit: parseInt(limit),
      page: parseInt(page),
    };

    let sorting = {};
    if (sort == 'ASC') {
      sorting = { nama_lengkap: 1 };
    } else {
      sorting = { nama_lengkap: -1 };
    }

    let searching = {
      isDelete: false,
      $or: [
        { 'nama_lengkap': new RegExp(`${search || ''}`, 'i') },
        { 'NISN': new RegExp(`${search || ''}`, 'i') },
        { 'NIS': new RegExp(`${search || ''}`, 'i') },
      ],
    };

    if (kelas_id) {
      searching = { ...searching, kelas_id };
    }

    if (tab != 'all') {
      searching = {
        ...searching,
        jenis_kelamin: { $in: [new RegExp(`${tab || ''}`, 'i')] }
      };
    }

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const siswa = await this.query.findAllSiswa(sorting, stat, searching);
    if (siswa.err || validate.isEmpty(siswa.data)) {
      logger.log(ctx, ('find siswa'), 'user not found');
      return wrapper.paginationData([], { page: 0, data: 0, totalPage: 0, totalData: 0 });
    }

    const count = await this.query.countSiswa(searching);

    const data = await Promise.all(siswa.data.map(async item => {
      let nama_kelas = 'Belum ada kelas';
      let tahun_ajaran = 'Belum ada kelas';
      const dataKelas = await this.query.findOneClass({ kelas_id: item.kelas_id, isActive: true });
      if (dataKelas.data) {
        nama_kelas = dataKelas.data.nama_kelas;
        tahun_ajaran = dataKelas.data.tahun_ajaran;
      }

      return {
        'kelas_id': item.kelas_id || 'Belum ada kelas',
        'siswa_id': item.siswa_id,
        'nama_siswa': item.nama_lengkap,
        'NISN': item.NISN,
        'NIS': item.NIS,
        'jenis_kelamin': item.jenis_kelamin,
        nama_kelas,
        tahun_ajaran
      };
    }));

    const meta = {
      page: parseInt(page),
      data: siswa.data.length,
      totalPage: Math.ceil(count.data / parseInt(limit)),
      totalData: count.data
    };

    logger.log(ctx, 'success', 'get all siswa');
    return wrapper.paginationData(data, meta);
  }

  async viewAllGuru(payload) {
    const ctx = 'getAllGuru';
    const { search, page, limit, sort } = payload;
    const stat = {
      limit: parseInt(limit),
      page: parseInt(page),
    };

    let sorting = {};

    if (sort == 'nama ASC') {
      sorting = { nama: 1 };
    } else if (sort == 'nama DESC') {
      sorting = { nama: -1 };
    } else if (sort == 'jabatan ASC') {
      sorting = { jabatan: 1 };
    } else if (sort == 'jabatan DESC') {
      sorting = { jabatan: -1 };
    }

    let searching = {
      isDelete: false,
      $or: [
        { 'nama': new RegExp(`${search || ''}`, 'i') },
        { 'nip_karpeg': new RegExp(`${search || ''}`, 'i') },
        { 'jabatan': new RegExp(`${search || ''}`, 'i') },
      ],
    };

    const guru = await this.query.findAllGuru(sorting, stat, searching);
    if (guru.err || validate.isEmpty(guru.data)) {
      logger.log(ctx, 'search guru', 'guru not found');
      return wrapper.paginationData([], { page: 0, data: 0, totalPage: 0, totalData: 0 });
    }

    const count = await this.query.countGuru(searching);

    const data = guru.data.map(item => {
      return {
        guru_id: item.guru_id,
        NIP: item.nip_karpeg.substring(0, 20) || '-',
        nama: item.nama,
        jabatan: item.jabatan
      };
    });

    const meta = {
      page: parseInt(page),
      data: guru.data.length,
      totalPage: Math.ceil(count.data / parseInt(limit)),
      totalData: count.data
    };

    logger.log(ctx, 'success', 'get all guru');
    return wrapper.paginationData(data, meta);
  }

  async viewAllTenagaAhli(payload) {
    const ctx = 'getAllTenagaAhli';
    const { search, page, limit, sort } = payload;
    const stat = {
      limit: parseInt(limit),
      page: parseInt(page),
    };

    let sorting = {};

    if (sort == 'nama ASC') {
      sorting = { nama: 1 };
    } else if (sort == 'nama DESC') {
      sorting = { nama: -1 };
    } else if (sort == 'jabatan ASC') {
      sorting = { jabatan: 1 };
    } else if (sort == 'jabatan DESC') {
      sorting = { jabatan: -1 };
    }

    let searching = {
      isDelete: false,
      $or: [
        { 'nama': new RegExp(`${search || ''}`, 'i') },
        { 'nip_karpeg': new RegExp(`${search || ''}`, 'i') },
        { 'jabatan': new RegExp(`${search || ''}`, 'i') },
      ],
    };
    const tenagaAhli = await this.query.findAllTenagaAhli(sorting, stat, searching);
    if (tenagaAhli.err || validate.isEmpty(tenagaAhli.data)) {
      logger.log(ctx, 'search tenaga ahli', 'tenaga ahli not found');
      return wrapper.paginationData([], { page: 0, data: 0, totalPage: 0, totalData: 0 });
    }

    const count = await this.query.countTenagaAhli(searching);

    const data = tenagaAhli.data.map(item => {
      return {
        tenaga_ahli_id: item.tenaga_ahli_id,
        NIP: item.nip_karpeg.substring(0, 20) || '-',
        nama: item.nama,
        jabatan: item.jabatan
      };
    });

    const meta = {
      page: parseInt(page),
      data: tenagaAhli.data.length,
      totalPage: Math.ceil(count.data / parseInt(limit)),
      totalData: count.data
    };

    logger.log(ctx, 'success', 'get all tenaga ahli');
    return wrapper.paginationData(data, meta);
  }

  async viewGuru(payload) {
    const ctx = 'getGuru';
    const { guru_id } = payload;

    const guru = await this.query.findOneGuru({ guru_id, isDelete: false });
    if (guru.err || validate.isEmpty(guru.data)) {
      logger.log(ctx, 'find guru', 'guru not found');
      return wrapper.error(new InternalServerError('Guru not Found'));
    }

    delete guru.data._id;
    delete guru.data.createdAt;
    delete guru.data.updatedAt;

    const data = guru.data;

    logger.log(ctx, 'success', 'get all guru');
    return wrapper.data(data);
  }

  async viewTenagaAhli(payload) {
    const ctx = 'getTenagaAhli';
    const { tenaga_ahli_id } = payload;

    const tenagaAhli = await this.query.findOneTenagaAhli({ tenaga_ahli_id, isDelete: false });
    if (tenagaAhli.err || validate.isEmpty(tenagaAhli.data)) {
      logger.log(ctx, 'find tenaga ahli', 'tenaga ahli not found');
      return wrapper.error(new InternalServerError('Tenaga Ahli not Found'));
    }

    delete tenagaAhli.data._id;
    delete tenagaAhli.data.createdAt;
    delete tenagaAhli.data.updatedAt;

    const data = tenagaAhli.data;

    logger.log(ctx, 'success', 'get tenaga ahli');
    return wrapper.data(data);
  }

  async viewSiswaData(payload) {
    const ctx = 'getSiswa';
    const { siswa_id, kelas_id } = payload;

    const siswa = await this.query.findDataSiswa({ siswa_id, kelas_id, isActive: true, isDelete: true });
    if (siswa.err || validate.isEmpty(siswa.data)) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
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
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const siswa = await this.query.findOneTentangDiri(searching);
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const kelas = await this.query.findOneClass({ kelas_id: siswa.data.kelas_id, isActive: true });

    const dataSiswa = siswa.data;
    dataSiswa.nama_kelas = validate.isEmpty(kelas.err) ? kelas.data.nama_kelas : 'Belum ada kelas';
    delete dataSiswa._id;
    delete dataSiswa.isActive;
    delete dataSiswa.isDelete;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

  async viewSiswaTempatTinggal(payload) {
    const ctx = 'getSiswaTempatTinggal';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findOneTempatTinggal({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data;
    delete dataSiswa._id;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

  async viewSiswaPendidikan(payload) {
    const ctx = 'getSiswaPendidikan';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findOnePendidikan({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data;
    delete dataSiswa._id;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

  async viewSiswaKesehatan(payload) {
    const ctx = 'getSiswaKesehatan';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findOneKesehatan({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data;
    delete dataSiswa._id;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

  async viewSiswaHobi(payload) {
    const ctx = 'getSiswaHobi';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findOneHobi({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data;
    delete dataSiswa._id;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }

  async viewSiswaOrangTua(payload) {
    const ctx = 'getSiswaOrangTua';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    //khusus orang tua ada wali juga, tolong cek lagi, type 1 = ayah 2=ibu 3=wali

    const siswa = await this.query.findManyOrangTua({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data.map(item => {
      if (item.type_ortu === '1') {
        item.type = 'ayah';
        delete item.hubungan_wali;
      } else if (item.type_ortu === '2') {
        item.type = 'ibu';
        delete item.hubungan_wali;
      } else {
        item.type = 'wali';
        delete item.status;
        delete item.status_nikah;
        delete item.tahun_meninggal;
      }

      delete item.ortu_id;
      delete item.type_ortu;
      delete item._id;
      delete item.createdAt;
      delete item.updatedAt;

      return item;
    });

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }
  async viewSiswaPindah(payload) {
    const ctx = 'getSiswaPindah';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findOnePindahan({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const dataSiswa = siswa.data;
    delete dataSiswa._id;
    delete dataSiswa.createdAt;
    delete dataSiswa.updatedAt;

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.data(dataSiswa);
  }
  async viewSiswaPrestasi(payload) {
    const ctx = 'getSiswaPrestasi';
    const { siswa_id, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const siswa = await this.query.findManyPrestasi({ siswa_id });
    if (siswa.err) {
      logger.log(ctx, siswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Can not find siswa'));
    }

    const data = siswa.data.map(item => {
      delete item._id;
      delete item.updatedAt;
      delete item.createdAt;

      return item;
    });

    logger.log(ctx, 'success', 'get tentang siswa');
    return wrapper.paginationData(data);
  }

  async viewSiswaKompetensi(payload) {
    const ctx = 'getSiswaKompetensi';
    const { siswa_id, kelas_id, semester, alumni } = payload;

    let searching = { siswa_id, isDelete: false };

    if (alumni) {
      searching = { ...searching, isActive: false };
    } else {
      searching = { ...searching, isActive: true };
    }

    const cSiswa = await this.query.findOneTentangDiri(searching);
    if (cSiswa.err) {
      logger.log(ctx, cSiswa.err, 'siswa not found');
      return wrapper.error(new InternalServerError('Siswa tidak ditemukan'));
    }

    const dataMapel = await this.query.findKompetensi({ siswa_id, kelas_id, semester });
    if (dataMapel.err) {
      logger.log(ctx, 'Internal Server Error', 'mapel pengetahuan not found');
      return wrapper.error(new InternalServerError('Can not find mapel pengetahuan'));
    }

    const data = dataMapel.data;

    logger.log(ctx, 'success', 'get kompetensi siswa');
    return wrapper.data(data);
  }

  async viewRekapitulasi(payload) {
    const ctx = 'getRekapitulasi';
    const { type } = payload;

    let searching = {};

    if (type === 'X') {
      searching = { jenis_kelas: 10 };
    } else if (type === 'XI') {
      searching = { jenis_kelas: 11 };
    } else if (type === 'XII') {
      searching = { jenis_kelas: 12 };
    } else {
      searching = { kelas_id: type };
    }

    const dKelas = await this.query.findManyClass(searching);
    if (dKelas.err) {
      logger.log(ctx, 'Internal Server Error', 'Class not found');
      return wrapper.error(new InternalServerError('Can not find Class'));
    }

    const data = await Promise.all(dKelas.data.map(async item => {
      let laki = 0;
      let perempuan = 0;
      let islam = 0;
      let khatolik = 0;
      let protestan = 0;
      let hindu = 0;
      let budha = 0;
      let tahun_lahir = [];
      let laki_mampu = 0;
      let perempuan_mampu = 0;
      let kps = 0;
      let non_kps = 0;

      const dSiswa = await this.query.findManySiswa({ kelas_id: item.kelas_id, isActive: true });
      if (!validate.isEmpty(dSiswa.data)) {
        await Promise.all(dSiswa.data.map(async value => {
          let mampu = false;
          if (value.jenis_kelamin.toLowerCase() == 'laki-laki') {
            laki++;
            if (value.pkh.length > 1 || value.kks.length > 1 || value.kps.toLowerCase() === 'ada') {
              laki_mampu++;
              mampu = true;
            }
          } else {
            perempuan++;
            if (value.pkh.length > 1 || value.kks.length > 1 || value.kps.toLowerCase() === 'ada') {
              perempuan_mampu++;
              mampu = true;
            }
          }

          if (mampu) {
            if (value.kps.toLowerCase() === 'ada') {
              kps++;
            } else {
              non_kps++;
            }
          }

          if (value.agama.toLowerCase() == 'islam') {
            islam++;
          } else if (value.agama.toLowerCase() == 'khatoik') {
            khatolik++;
          } else if (!validate.isEmpty(value.agama.match(/kristen/i))) {
            protestan++;
          } else if (value.agama.toLowerCase() == 'hindu') {
            hindu++;
          } else if (value.agama.toLowerCase() == 'budha') {
            budha++;
          } else if (value.agama.toLowerCase() == 'protestan') {
            protestan++;
          }
          tahun_lahir.push(value.ttl.substring(value.ttl.length - 4));
        }));
      }

      const rekap_tahun = tahun_lahir.reduce((x, i) => { x[i] = (x[i] || 0) + 1; return x; }, {});
      const keyData = Object.keys(rekap_tahun);
      const temp = new Array(10);
      const rKey = temp.length - keyData.length;
      let rTahun_lahir = [];
      for (let i = rKey - 2; i > 0; i--) {
        const value = (parseInt(keyData[0]) - i).toString();
        rTahun_lahir.push({ [value]: '' });
      }

      //get map data object
      for (let [key, value] of Object.entries(rekap_tahun)) {
        rTahun_lahir.push({ [key]: value });
      }

      rTahun_lahir.push({ [(parseInt(keyData[keyData.length - 1]) + 1).toString()]: '' });
      rTahun_lahir.push({ [(parseInt(keyData[keyData.length - 1]) + 2).toString()]: '' });

      return {
        kelas_id: item.kelas_id,
        nama_kelas: item.nama_kelas,
        data: laki + perempuan > 0 ? true : false,
        kelamin: { L: laki, P: perempuan, total: laki + perempuan },
        agama: {
          islam,
          khatolik,
          protestan,
          hindu,
          budha,
          total: islam + khatolik + protestan + hindu + budha
        },
        tahun_kelahiran: rTahun_lahir,
        tidak_mampu: {
          L: laki_mampu,
          P: perempuan_mampu,
          total: laki_mampu + perempuan_mampu,
          kps,
          non_kps
        }
      };
    }));

    const cError = data.includes(item => item.data === true);
    if (cError) {
      logger.log(ctx, 'Internal Server Error', 'Siswa not found');
      return wrapper.error(new InternalServerError('Can not find Siswa'));
    }

    const tahun = data[data.findIndex(item => item.data === true)].tahun_kelahiran;

    const result = data.map(item => {
      if (!item.data) {
        item.tahun_kelahiran = tahun.flatMap(item => {
          return { [Object.keys(item)]: '' };
        });
      }

      delete item.data;
      return item;
    });

    logger.log(ctx, 'success', 'get kompetensi siswa');
    return wrapper.data(result);
  }

}

module.exports = User;

