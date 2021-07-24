/* eslint-disable max-len */

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
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add class', 'insert class');
    return wrapper.data('success');

  }

  async addTentangDiri(payload) {
    const ctx = 'Add-Tentang-Diri';
    const { kelas_id, NIS, NISN, nama_lengkap, nama_panggilan, ttl, jenis_kelamin, agama, kewarganegaraan, anak_ke, jml_sdr_kandung, jml_sdr_tiri, status_anak, bahasa, pihak_dihubungi, penanggung_biaya } = payload;

    const siswa_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const dataIsiKelas = {
      siswa_id,
      kelas_id,
      createdAt,
      updatedAt
    };

    const dataSiswa = {
      siswa_id,
      nama_siswa: nama_lengkap,
      NIS,
      NISN,
      jenis_kelamin,
      createdAt,
      updatedAt,
    };

    const dataTentangDiri = {
      tentang_id: uuid(),
      siswa_id,
      nama_lengkap,
      nama_panggilan,
      tanggal_lahir : ttl,
      kelamin: jenis_kelamin,
      agama,
      kewarganegaraan,
      anak_ke,
      jml_sdr_kandung,
      jml_sdr_tiri,
      status_anak,
      bahasa_sehari: bahasa,
      pihak_dihubungi,
      penanggung_biaya,
      createdAt,
      updatedAt,
    };

    const isiKelas = await this.command.insertOneIsiKelas(dataIsiKelas);
    if (isiKelas.data.affectedRows == 0 || isiKelas.error) {
      logger.log(ctx, 'failed upload data', 'insert isi kelas');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    const siswa = await this.command.insertOneSiswa(dataSiswa);
    if (siswa.data.affectedRows == 0 || siswa.error) {
      logger.log(ctx, 'failed upload data', 'insert siswa');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    const tentang = await this.command.insertOneTentangDiri(dataTentangDiri);
    if (tentang.data.affectedRows == 0 || tentang.error) {
      logger.log(ctx, 'failed upload data', 'insert tentang');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add siswa', 'insert siswa');
    return wrapper.data({ siswa_id });

  }

  async addTempatTinggal(payload) {
    const ctx = 'Add-Tempat-Tinggal';
    const { siswa_id, alamat, no_telephone, tinggal_di, jarak_ke_sekolah } = payload;

    const tempat_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      siswa_id,
      tempat_id,
      alamat,
      no_telephone,
      tinggal_di,
      jarak_ke_sekolah,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOneTempatTinggal(data);
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert tempat tinggal');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add tempat tinggal siswa', 'insert tempat tinggal siswa');
    return wrapper.data({ siswa_id });
  }

  async addPendidikan(payload) {
    const ctx = 'Add-Pendidikan';
    const { siswa_id, tanggal_diterima, lulus_dari, tgl_no_ijazah, tgl_no_STL, lama_belajar, nilai_SKHUN } = payload;

    const pendidikan_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      siswa_id,
      pendidikan_id,
      tanggal_diterima,
      lulus_dari,
      tanggal_ijazah: tgl_no_ijazah.split('/')[0].trim(),
      no_ijazah: tgl_no_ijazah.split('/')[1].trim(),
      tanggal_STL: tgl_no_STL.split('/')[0].trim(),
      no_STL: tgl_no_STL.split('/')[1].trim(),
      lama_belajar,
      nilai_SKHUN,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOnePendidikan(data);
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert pendidikan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add pendidikan siswa', 'insert Pendidikan siswa');
    return wrapper.data({ siswa_id });
  }

  async addKesehatan(payload) {
    const ctx = 'Add-Kesehatan';
    const { siswa_id, gol_darah, kelainan_jasmani, tinggi_berat_badan, nama_penyakit, tahun_sakit, lama_sakit } = payload;

    const kesehatan_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      siswa_id,
      kesehatan_id,
      gol_darah,
      kelainan_jasmani,
      tinggi_badan: tinggi_berat_badan.split('/')[0].trim(),
      berat_badan: tinggi_berat_badan.split('/')[1].trim(),
      nama_penyakit,
      tahun_sakit,
      lama_sakit,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOneKesehatan(data);
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert kesehatan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add kesehatan siswa', 'insert kesehatan siswa');
    return wrapper.data({ siswa_id });
  }

  async addOrangTua(payload) {
    const ctx = 'Add-Hobi';
    const { siswa_id, data } = payload;

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const result = await Promise.all(data.map(async item => {

      const ortu_id = uuid();
      const type_ortu = item.type === 'ayah' ? '1' : item.type === 'ibu' ? '2' : '3';

      const dataOrtu = {
        siswa_id,
        ortu_id,
        type_ortu,
        nama: item.nama,
        TTL: item.TTL,
        agama: item.agama,
        kewarganegaraan: item.kewarganegaraan,
        pendidikan: item.pendidikan,
        pekerjaan: item.pekerjaan,
        gol_pekerjaan: item.gol_pekerjaan,
        penghasilan: item.penghasilan,
        alamat: item.alamat,
        no_telpon: item.no_telpon,
        status: item.status,
        status_nikah: item.status_nikah,
        tahun_meninggal: item.tahun_meninggal,
        hubungan_wali: validate.isEmpty(item.hubungan_wali) ? '' : item.hubungan_wali,
        createdAt,
        updatedAt
      };

      const result = await this.command.insertOneOrtu(dataOrtu);
      if (result.data.affectedRows == 0 || result.error) {
        logger.log(ctx, 'failed upload data', 'insert orang tua');
        return { insert: false };
      }

      return { insert: true };
    }));

    const errorInsert = result.find(item => item.insert == false);
    if (!validate.isEmpty(errorInsert)) {
      logger.log(ctx, 'failed upload data', 'insert ortu siswa');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add kesehatan siswa', 'insert kesehatan siswa');
    return wrapper.data({ siswa_id });
  }

  async addHobi(payload) {
    const ctx = 'Add-Hobi';
    const { siswa_id, olahraga, seni, organisasi, lain } = payload;

    const hobi_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      hobi_id,
      siswa_id,
      olahraga,
      seni,
      organisasi,
      lain,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOneHobi(data);
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert hobi siswa');
      return { insert: false };
    }

    logger.log(ctx, 'success add hobi siswa', 'insert hobi siswa');
    return wrapper.data({ siswa_id });
  }

  async addPindah(payload) {
    const ctx = 'Add-Pindah';
    const { siswa_id, pindah_sekolah, pindah_alasan, diterima_di, diterima_program, meninggalkan_di, meninggalkan_program, meninggalkan_alasan, akhir_tamat_belajar, akhir_sttb } = payload;

    const pindah_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      pindah_id,
      siswa_id,
      pindah_sekolah,
      pindah_alasan,
      diterima_di,
      diterima_program,
      meninggalkan_di,
      meninggalkan_program,
      meninggalkan_alasan,
      akhir_tamat_belajar,
      akhir_sttb,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOnePindah(data);
    if (result.data.affectedRows == 0 || result.error) {
      logger.log(ctx, 'failed upload data', 'insert pindah siswa');
      return { insert: false };
    }

    logger.log(ctx, 'success add pindah siswa', 'insert pindah siswa');
    return wrapper.data({ siswa_id });
  }
}

module.exports = User;
