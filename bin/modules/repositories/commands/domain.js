/* eslint-disable max-len */

const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../helpers/utils/wrapper');
const jwtAuth = require('../../../auth/jwt_auth_helper');
const commonUtil = require('../../../helpers/utils/common');
const dateFormat = require('dateformat');
const logger = require('../../../helpers/utils/logger');
const uuid = require('uuid').v4;
const { InternalServerError, ConflictError, NotFoundError } = require('../../../helpers/error');
const xlsx = require('xlsx');
const validate = require('validate.js');
const fs = require('fs');
const config = require('../../../infra/configs/global_config');
const templateExcel = require('../../../helpers/utils/excel');

const algorithm = 'aes-256-cbc';
const secretKey = 'sekolahan@jambi1';

class User {

  constructor(db) {
    this.command = new Command(db);
    this.query = new Query(db);
    dateFormat.i18n = {
      dayNames: [
        'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab',
        'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
      ],
      monthNames: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ],
      timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
      ]
    };
  }

  async generateCredential(payload) {
    const ctx = 'login';
    const { username, password } = payload;
    const user = await this.query.findOneUser({ username });
    if (validate.isEmpty(user.data)) {
      logger.log(ctx, 'failed get data user', 'user not found');
      return wrapper.error(new InternalServerError('user not found'));
    }
    const userId = user.data.user_id;
    const userName = user.data.username;
    const pass = await commonUtil.decrypt(user.data.password, algorithm, secretKey);
    if (username !== userName || pass !== password) {
      logger.log(ctx, 'wrong password', 'verify password');
      return wrapper.error(new InternalServerError('Password invalid!'));
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
      return wrapper.error(new InternalServerError('user already exist'));
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
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add user', 'insert user');
    return wrapper.data('success');
  }

  async addClass(payload) {
    const ctx = 'Add-Class';
    const { kelas_id, guru_id, namaKelas, jurusan, walikelas, tahunAjaran } = payload;

    const wKelas = await this.query.findOneGuru({ guru_id });
    if (wKelas.err) {
      return wrapper.error(new NotFoundError('Wali Kelas tidak ditemukan'));
    }

    let name = `${namaKelas} ${jurusan}`;

    const searching = {
      namaKelas: name,
      walikelas,
      guru_id,
      tahunAjaran,
      isActive: true
    };

    const kelas = await this.query.findOneClass(searching);
    if (!validate.isEmpty(kelas.data)) {
      logger.log(ctx, 'kelas already exist', 'check kelas');
      return wrapper.error(new InternalServerError('Kelas sudah ada.'));
    }

    const kelasId = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let jenis_kelas;

    if (namaKelas === 'X') {
      jenis_kelas = 10;
    } else if (namaKelas === 'XI') {
      jenis_kelas = 11;
    } else if (namaKelas === 'XII') {
      jenis_kelas = 12;
    }


    const data = {
      guru_id,
      jenis_kelas,
      nama_kelas: name,
      wali_kelas: walikelas,
      tahun_ajaran: tahunAjaran,
    };

    let result;
    if (kelas_id) {
      result = await this.command.patchOneClass({ kelas_id }, { ...data, updatedAt });
    } else {
      result = await this.command.insertOneClass({ kelas_id: kelasId, ...data, isActive: true, createdAt, updatedAt });
    }
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add class', 'insert class');
    return wrapper.data('success');

  }

  async addTentangDiri(payload) {
    const ctx = 'Add-Tentang-Diri';
    const { alumni, siswa_id, kelas_id, NIS, NISN, image, nama_lengkap, nama_panggilan, ttl, jenis_kelamin, agama, kewarganegaraan, anak_ke, jml_sdr_kandung, jml_sdr_tiri, jml_sdr_angkat, status_anak, status_ortu, bahasa, pihak_dihubungi, penanggung_biaya, pkh, kks, kps } = payload;

    let edit = false;
    let idSiswa = uuid();

    if (siswa_id) {
      edit = true;
    }

    const validateKelas = await this.query.findOneClass({ kelas_id, isActive: true });
    if (validateKelas.err || validate.isEmpty(validateKelas.data)) {
      logger.log(ctx, 'kelas tidak ada', 'validate kelas');
      return wrapper.error(new InternalServerError('Kelas tidak terdaftar'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let dataTentangDiri = {
      kelas_id,
      NISN,
      NIS,
      image: image.includes('http') ? image : await this.uploadData({ file: image, type: 'image' }),
      nama_lengkap,
      nama_panggilan,
      ttl,
      jenis_kelamin,
      agama,
      kewarganegaraan,
      anak_ke,
      jml_sdr_kandung,
      jml_sdr_tiri,
      jml_sdr_angkat,
      status_anak,
      status_ortu,
      bahasa,
      pihak_dihubungi,
      penanggung_biaya,
      pkh,
      kks,
      kps,
      updatedAt,
    };

    let tentang;

    if (edit) {
      tentang = await this.command.patchOneTentangDiri({ siswa_id }, dataTentangDiri);
    } else {
      const tentang_id = uuid();
      tentang = await this.command.insertOneTentangDiri({ tentang_id, siswa_id: idSiswa, ...dataTentangDiri, isActive: alumni ? false : true, isDelete: false, createdAt, updatedAt });
    }

    if (tentang.err) {
      logger.log(ctx, 'failed upload data', 'insert tentang');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add siswa', 'insert siswa');
    return wrapper.data({ siswa_id: siswa_id || idSiswa });
  }

  async addTempatTinggal(payload) {
    const ctx = 'Add-Tempat-Tinggal';
    const { alumni, siswa_id, alamat, no_telephone, tinggal_di, jarak_ke_sekolah } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let data = {
      alamat,
      no_telephone,
      tinggal_di,
      jarak_ke_sekolah,
      updatedAt
    };

    let result;

    const checkTempat = await this.query.findOneTempatTinggal({ siswa_id });
    if (!checkTempat.data) {
      result = await this.command.patchOneTempat({ siswa_id }, data);
    } else {
      const tempat_id = uuid();
      result = await this.command.insertOneTempatTinggal({ tempat_id, ...data, createdAt });
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert tempat tinggal');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add tempat tinggal siswa', 'insert tempat tinggal siswa');
    return wrapper.data({ siswa_id });
  }

  async addPendidikan(payload) {
    const ctx = 'Add-Pendidikan';
    const { alumni, siswa_id, tanggal_diterima, lulus_dari, tanggal_no_ijazah, tanggal_no_stl, lama_belajar, nilai_skhun } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      tanggal_diterima,
      lulus_dari,
      tanggal_no_ijazah,
      tanggal_no_stl,
      lama_belajar,
      nilai_skhun,
      updatedAt
    };

    let result;

    const checkPendidikan = await this.query.findOnePendidikan({ siswa_id });
    if (!checkPendidikan.data) {
      result = await this.command.patchOnePendidikan({ siswa_id }, data);
    } else {
      const pendidikan_id = uuid();
      result = await this.command.insertOnePendidikan({ pendidikan_id, ...data, createdAt });
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert pendidikan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add pendidikan siswa', 'insert Pendidikan siswa');
    return wrapper.data({ siswa_id });
  }

  async addKesehatan(payload) {
    const ctx = 'Add-Kesehatan';
    const { alumni, siswa_id, gol_darah, kelainan_jasmani, tinggi_berat_badan, nama_penyakit, tahun_sakit, lama_sakit } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      gol_darah,
      kelainan_jasmani,
      tinggi_berat_badan,
      nama_penyakit,
      tahun_sakit,
      lama_sakit,
      updatedAt
    };

    let result;

    const checkKesehatan = await this.query.findOneKesehatan({ siswa_id });
    if (!checkKesehatan.data) {
      result = await this.command.patchOneKesehatan({ siswa_id }, data);
    } else {
      const kesehatan_id = uuid();
      result = await this.command.insertOneKesehatan({ kesehatan_id, ...data, createdAt });
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert kesehatan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add kesehatan siswa', 'insert kesehatan siswa');
    return wrapper.data({ siswa_id });
  }

  async addOrangTua(payload) {
    const ctx = 'Add-Orang-Tua';
    const { siswa_id, alumni, data } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let edit = false;
    let validateEdit = [];

    const checkOrtu = await this.query.findManyOrangTua({ siswa_id });
    if (!validate.isEmpty(checkOrtu.data)) {
      edit = true;
      checkOrtu.data.map(item => {
        if (item.type_ortu == '1') {
          validateEdit.push({
            ortu_id: item.ortu_id,
            type: 'ayah'
          });
        } else if (item.type_ortu == '2') {
          validateEdit.push({
            ortu_id: item.ortu_id,
            type: 'ibu'
          });
        } else {
          validateEdit.push({
            ortu_id: item.ortu_id,
            type: 'wali'
          });
        }
      });
    }

    const payloads = await Promise.all(data.map(item => {
      let ortu_id = uuid();
      let type_ortu = item.type === 'ayah' ? '1' : item.type === 'ibu' ? '2' : '3';

      if (edit) {
        validateEdit.map(value => {
          if (value.type === item.type) {
            ortu_id = value.ortu_id;
          }
        });
      }

      let dataOrtu = {
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
        updatedAt,
        createdAt
      };

      return dataOrtu;
    }));

    let result;

    if (edit) {
      let count = 0;
      await Promise.all(payloads.map(async item => {
        delete item.createdAt;
        const result = await this.command.updateOneOrtu({ siswa_id, ortu_id: item.ortu_id }, item);
        if (result.err) {
          return count++;
        }
      }));
      result = count > 0 ? { err: `update error sejumlah ${count}`, data: [] } : { err: false, data: 'success' };
    } else {
      result = await this.command.insertManyOrtu(payloads);
    }

    if (result.err) {
      logger.log(ctx, result.err, 'insert orang tua');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add orang tua siswa', 'insert orang tua siswa');
    return wrapper.data({ siswa_id });
  }

  async addHobi(payload) {
    const ctx = 'Add-Hobi';
    const { alumni, siswa_id, olahraga, seni, organisasi, lain } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const hobi_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      olahraga,
      seni,
      organisasi,
      lain,
      updatedAt
    };

    let result;

    const checkHobi = await this.query.findOneHobi({ siswa_id });
    if (!checkHobi.data) {
      result = await this.command.patchOneHobi({ siswa_id }, data);
    } else {
      result = await this.command.insertOneHobi({ hobi_id, ...data, createdAt });
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert hobi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add hobi siswa', 'insert hobi siswa');
    return wrapper.data({ siswa_id });
  }

  async addPindah(payload) {
    const ctx = 'Add-Pindah';
    const { alumni, siswa_id, pindah_sekolah, pindah_alasan, diterima_di, diterima_program, meninggalkan_di, meninggalkan_program, meninggalkan_alasan, akhir_tamat_belajar, akhir_sttb } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const pindah_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
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
      updatedAt
    };

    let result;

    const checkPindahan = await this.query.findOnePindahan({ siswa_id });
    if (!checkPindahan.data) {
      result = await this.command.patchOnePindahan({ siswa_id }, data);
    } else {
      result = await this.command.insertOnePindahan({ pindah_id, ...data, createdAt });
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert pindah');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add pindah siswa', 'insert pindah siswa');
    return wrapper.data({ siswa_id });
  }

  async addKompetensi(payload) {
    const ctx = 'Add-Kompetensi';
    const { alumni, siswa_id, kelas_id, semester, kompetensi_id, kelompokA, kelompokB, kelompokC, kelompokCLintas, absen } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const validateKelas = await this.query.findOneClass({ kelas_id, isActive: true });
    if (validateKelas.err || validate.isEmpty(validateKelas.data)) {
      logger.log(ctx, 'kelas tidak ada', 'validate kelas');
      return wrapper.error(new InternalServerError('Kelas tidak terdaftar'));
    }

    let kompetensiId = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');


    let data = {
      kelompokA,
      kelompokB,
      kelompokC,
      kelompokCLintas,
      absen,
    };

    let result = {};

    if (kompetensi_id) {
      data = { data: { ...data, updatedAt }, kompetensi_id };
      result = await this.command.updateOneKompetensi(data);
    } else {

      const cKomp = await this.query.findKompetensi({ siswa_id, kelas_id, semester });
      if (!validate.isEmpty(cKomp.data)) {
        logger.error(ctx, 'data already exist', 'insert new kompetensi');
        return wrapper.error(new InternalServerError('data telah ada, silahkan ganti semester.'));
      }
      const cKompClass = await this.query.countKompetensi({ siswa_id, kelas_id });
      if (cKompClass > 2) {
        logger.error(ctx, 'data already exist', 'insert new kompetensi');
        return wrapper.error(new InternalServerError('data telah ada, silahkan ganti kelas'));
      }
      data = { kompetensi_id: kompetensiId, siswa_id, kelas_id, namaKelas: validateKelas.data.nama_kelas, semester, ...data, createdAt, updatedAt };
      result = await this.command.insertOneKompetensi(data);
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert kompetensi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add kompetensi siswa', 'insert kompetensi siswa');
    return wrapper.data('success');
  }

  async addBantuan(payload) {
    const ctx = 'Add-Bantuan';
    const { alumni, siswa_id, pkh, kks, kps } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false, isActive: alumni ? false : true });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const result = await this.command.patchOneBantuan({ siswa_id }, { pkh, kks, kps, updatedAt });
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Bantuan');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Bantuan siswa', 'insert Bantuan siswa');
    return wrapper.data('success');

  }

  async addPrestasi(payload) {
    const ctx = 'Add-Prestasi';
    const { siswa_id, prestasi_id, judul, deskripsi, file } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id, isDelete: false });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const updatedAt = dateFormat(new Date(), 'isoDateTime');
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const prestasiId = uuid();
    const data = {
      judul,
      deskripsi,
      file: await this.uploadData({ file, type: 'pdf' }),
      updatedAt
    };

    let result;

    if (prestasi_id) {
      result = await this.command.patchOnePrestasi({ prestasi_id }, data);
    } else {
      result = await this.command.insertOnePrestasi({ prestasi_id: prestasiId, siswa_id, ...data, createdAt });
    }
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Prestasi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Prestasi siswa', 'insert Prestasi siswa');
    return wrapper.data('success');
  }

  async deletePrestasi(payload) {
    const ctx = 'Delete-Prestasi';
    const { prestasi_id } = payload;

    const validateSiswa = await this.query.findOnePrestasi({ prestasi_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'prestasi not found', 'validate siswa');
      return wrapper.error(new InternalServerError('prestasi Not Found'));
    }

    const result = await this.command.deletePrestasi({ prestasi_id });
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'delete Prestasi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Prestasi siswa', 'delete Prestasi siswa');
    return wrapper.data('success');
  }

  async addJabatan(payload) {
    const ctx = 'Add-Jabatan';
    const { guru_id, jabatan_id, judul, deskripsi, file } = payload;

    const validateGuru = await this.query.findOneGuru({ guru_id, isDelete: false });
    if (validateGuru.err || validate.isEmpty(validateGuru.data)) {
      logger.log(ctx, 'guru not found', 'validate guru');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const updatedAt = dateFormat(new Date(), 'isoDateTime');
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const jabatanId = uuid();
    const data = {
      judul,
      deskripsi,
      file: await this.uploadData({ file, type: 'pdf' }),
      updatedAt
    };

    let result;

    if (jabatan_id) {
      result = await this.command.patchOneJabatan({ jabatan_id }, data);
    } else {
      result = await this.command.insertOneJabatan({ jabatan_id: jabatanId, guru_id, ...data, createdAt });
    }
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Jabatan');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Jabatan', 'insert Jabatan');
    return wrapper.data('success');
  }

  async addJabatanAhli(payload) {
    const ctx = 'Add-Jabatan';
    const { tenaga_ahli_id, jabatan_id, judul, deskripsi, file } = payload;

    const validateGuru = await this.query.findOneTenagaAhli({ tenaga_ahli_id, isDelete: false });
    if (validateGuru.err || validate.isEmpty(validateGuru.data)) {
      logger.log(ctx, 'guru not found', 'validate guru');
      return wrapper.error(new InternalServerError('Siswa Not Found'));
    }

    const updatedAt = dateFormat(new Date(), 'isoDateTime');
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const jabatanId = uuid();
    const data = {
      judul,
      deskripsi,
      file: await this.uploadData({ file, type: 'pdf' }),
      updatedAt
    };

    let result;

    if (jabatan_id) {
      result = await this.command.patchOneJabatan({ jabatan_id }, data);
    } else {
      result = await this.command.insertOneJabatan({ jabatan_id: jabatanId, tenaga_ahli_id, ...data, createdAt });
    }
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Jabatan');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Jabatan', 'insert Jabatan');
    return wrapper.data('success');
  }

  async deleteJabatan(payload) {
    const ctx = 'Delete-Jabatan';
    const { jabatan_id } = payload;

    const validateGuru = await this.query.findOneJabatan({ jabatan_id });
    if (validateGuru.err || validate.isEmpty(validateGuru.data)) {
      logger.log(ctx, 'jabatan not found', 'validate guru');
      return wrapper.error(new InternalServerError('jabatan Not Found'));
    }

    const result = await this.command.deleteJabatan({ jabatan_id });
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'delete Jabatan');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Jabatan', 'delete Jabatan');
    return wrapper.data('success');
  }

  async addGuru(payload) {
    const ctx = 'Add-Guru';
    const { nip_kapreg, guru_id } = payload;
    if (payload.image) {
      payload.image = await this.uploadData({ type: 'image', file: payload.image });
    }

    let guruId = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let result;
    if (guru_id) {
      result = await this.command.updateOneGuru({ guru_id }, { ...payload, updatedAt });
    } else {
      const data = { guru_id: guruId, ...payload, createdAt, updatedAt, isDelete: false };
      result = await this.command.insertOneGuru(data);
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Guru');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Guru siswa', 'insert Guru siswa');
    return wrapper.data('success');
  }

  async addTenagaAhli(payload) {
    const ctx = 'Add-Tenaga-Ahli';
    const { nip_kapreg, tenaga_ahli_id } = payload;
    if (payload.image) {
      payload.image = await this.uploadData({ type: 'image', file: payload.image });
    }

    let tenaga_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    let result;
    if (tenaga_ahli_id) {
      result = await this.command.updateOneTenagaAhli({ tenaga_ahli_id, isDelete: false }, { ...payload, updatedAt });
    } else {
      const data = { tenaga_ahli_id: tenaga_id, ...payload, createdAt, updatedAt, isDelete: false };
      result = await this.command.insertOneTenagaAhli(data);
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Tenaga Ahli');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Tenaga Ahli siswa', 'insert Tenaga Ahli siswa');
    return wrapper.data('success');
  }

  async importSiswa(payload) {
    const ctx = 'Import-siswa';
    const { file } = payload;
    if (validate.isEmpty(file.name)) {
      return wrapper.error(new InternalServerError('Input file first, please!!'));
    }

    if (file.name.slice(file.name.length - 5, file.name.length) != '.xlsx') {
      return wrapper.error(new InternalServerError('Format tidak sesuai'));
    }

    const workbook = xlsx.readFile(file.path);
    const sheets = workbook.SheetNames;
    const sheetContent = xlsx.utils.sheet_to_json(workbook.Sheets[sheets[0]]);

    let countData = 0;
    let errorData = 0;
    let duplicate = 0;

    await Promise.all(sheetContent.map(async (item, index) => {

      const checkUser = await this.query.findOneTentangDiri({ isDelete: false, $or: [{ NISN: item.NISN }, { NIS: item.NIS }] });
      if (!validate.isEmpty(checkUser.data)) {
        logger.log(ctx, 'validate data siswa', 'check siswa');
        return duplicate++;
      }

      const siswa_id = uuid();
      const tentang_id = uuid();
      const tempat_id = uuid();
      const pendidikan_id = uuid();
      const kesehatan_id = uuid();
      const hobi_id = uuid();
      const ortu_id_ayah = uuid();
      const ortu_id_ibu = uuid();
      const ortu_id_wali = uuid();
      const pindah_id = uuid();
      const createdAt = dateFormat(new Date(), 'isoDateTime');
      const updatedAt = dateFormat(new Date(), 'isoDateTime');

      const dataTentangDiri = {
        tentang_id,
        siswa_id,
        kelas_id: '',
        NISN: `${item.nisn}`,
        NIS: `${item.nis}`,
        image: '',
        nama_lengkap: item.nama_lengkap,
        nama_panggilan: item.nama_panggilan,
        ttl: item.ttl,
        jenis_kelamin: item.jenis_kelamin.toUpperCase() == 'LAKI-LAKI' ? 'Laki-Laki' : 'Perempuan',
        agama: item.agama.toUpperCase(),
        kewarganegaraan: item.kewarganegaraan,
        anak_ke: item.anak_ke + '',
        jml_sdr_kandung: item.jml_sdr_kandung + '',
        jml_sdr_tiri: item.jml_sdr_tiri + '',
        jml_sdr_angkat: item.jml_sdr_angkat + '',
        status_anak: item.status_anak,
        bahasa: item.bahasa,
        pihak_dihubungi: item.pihak_dihubungi,
        penanggung_biaya: item.penanggung_biaya,
        kps: item.kps,
        pkh: `${item.pkh}`,
        kks: `${item.kks}`,
        isActive: true,
        isDelete: false,
        createdAt,
        updatedAt,
      };

      const dataTempatTinggal = {
        siswa_id,
        tempat_id,
        alamat: item.alamat,
        no_telephone: item.no_telephone,
        tinggal_di: item.tinggal_di,
        jarak_ke_sekolah: item.jarak_ke_sekolah,
        createdAt,
        updatedAt
      };

      const dataPendidikan = {
        siswa_id,
        pendidikan_id,
        tanggal_diterima: item.tanggal_diterima,
        lulus_dari: item.lulus_dari,
        tanggal_no_ijazah: item.tanggal_no_ijazah,
        tanggal_no_stl: item.tanggal_no_stl,
        lama_belajar: item.lama_belajar,
        nilai_skhun: item.nilai_skhun,
        createdAt,
        updatedAt
      };

      const dataKesehatan = {
        siswa_id,
        kesehatan_id,
        gol_darah: item.gol_darah,
        kelainan_jasmani: item.kelainan_jasmani,
        tinggi_berat_badan: item.tinggi_berat_badan,
        nama_penyakit: item.nama_penyakit,
        tahun_sakit: item.tahun_sakit,
        lama_sakit: item.lama_sakit,
        createdAt,
        updatedAt
      };

      const dataHobi = {
        hobi_id,
        siswa_id,
        olahraga: item.olahraga,
        seni: item.seni,
        organisasi: item.organisasi,
        lain: item.lain,
        createdAt,
        updatedAt
      };

      const dataOrtu_ayah = {
        siswa_id,
        ortu_id: ortu_id_ayah,
        type_ortu: '1',
        nama: item.nama_ayah,
        TTL: item.ttl_ayah,
        agama: item.agama_ayah,
        kewarganegaraan: item.kewarganegaraan_ayah,
        pendidikan: item.pendidikan_ayah,
        pekerjaan: item.pekerjaan_ayah,
        gol_pekerjaan: item.gol_pekerjaan_ayah,
        penghasilan: item.penghasilan_ayah,
        alamat: item.alamat_ayah,
        no_telpon: item.no_telpon_ayah,
        status: item.status_ayah,
        status_nikah: item.status_nikah_ayah,
        tahun_meninggal: item.tahun_meninggal_ayah,
        hubungan_wali: '',
        createdAt,
        updatedAt
      };

      const dataOrtu_ibu = {
        siswa_id,
        ortu_id: ortu_id_ibu,
        type_ortu: '2',
        nama: item.nama_ibu,
        TTL: item.ttl_ibu,
        agama: item.agama_ibu,
        kewarganegaraan: item.kewarganegaraan_ibu,
        pendidikan: item.pendidikan_ibu,
        pekerjaan: item.pekerjaan_ibu,
        gol_pekerjaan: item.gol_pekerjaan_ibu,
        penghasilan: item.penghasilan_ibu,
        alamat: item.alamat_ibu,
        no_telpon: item.no_telpon_ibu,
        status: item.status_ibu,
        status_nikah: item.status_nikah_ibu,
        tahun_meninggal: item.tahun_meninggal_ibu,
        hubungan_wali: '',
        createdAt,
        updatedAt
      };

      const dataOrtu_wali = {
        siswa_id,
        ortu_id: ortu_id_wali,
        type_ortu: '3',
        nama: item.nama_wali,
        TTL: item.ttl_wali,
        agama: item.agama_wali,
        kewarganegaraan: item.kewarganegaraan_wali,
        pendidikan: item.pendidikan_wali,
        pekerjaan: item.pekerjaan_wali,
        gol_pekerjaan: item.gol_pekerjaan_wali,
        penghasilan: item.penghasilan_wali,
        alamat: item.alamat_wali,
        no_telpon: item.no_telpon_wali,
        status: '',
        status_nikah: '',
        tahun_meninggal: '',
        hubungan_wali: item.hubungan_wali,
        createdAt,
        updatedAt
      };

      const dataPindah = {
        pindah_id,
        siswa_id,
        pindah_sekolah: item.pindah_sekolah,
        pindah_alasan: item.pindah_alasan,
        diterima_di: item.diterima_di,
        diterima_program: item.diterima_program,
        meninggalkan_di: item.meninggalkan_di,
        meninggalkan_program: item.meninggalkan_program,
        meninggalkan_alasan: item.meninggalkan_alasan,
        akhir_tamat_belajar: item.akhir_tamat_belajar,
        akhir_sttb: item.akhir_sttb,
        createdAt,
        updatedAt
      };

      const tentang = await this.command.insertOneTentangDiri(dataTentangDiri);
      if (tentang.err) {
        logger.log(ctx, 'failed upload data', 'insert tentang');
        return errorData++;
      }

      const tempatTinggal = await this.command.insertOneTempatTinggal(dataTempatTinggal);
      if (tempatTinggal.err) {
        logger.log(ctx, 'failed upload data', 'insert tempat tinggal');
        return errorData++;
      }

      const pendidikan = await this.command.insertOnePendidikan(dataPendidikan);
      if (pendidikan.err) {
        logger.log(ctx, 'failed upload data', 'insert pendidikan');
        return errorData++;
      }

      const kesehatan = await this.command.insertOneKesehatan(dataKesehatan);
      if (kesehatan.err) {
        logger.log(ctx, 'failed upload data', 'insert kesehatan');
        return errorData++;
      }
      const hobi = await this.command.insertOneHobi(dataHobi);
      if (hobi.err) {
        logger.log(ctx, 'failed upload data', 'insert hobi');
        return errorData++;
      }

      const ortu = await this.command.insertManyOrtu([dataOrtu_ayah, dataOrtu_ibu, dataOrtu_wali]);
      if (ortu.err) {
        logger.log(ctx, 'failed upload data', 'insert orang tua');
        return errorData++;
      }

      const pindah = await this.command.insertOnePindahan(dataPindah);
      if (pindah.err) {
        logger.log(ctx, 'failed upload data', 'insert pindah');
        return errorData++;
      }

      countData++;
    }));

    if (errorData > 0) {
      logger.log(ctx, 'failed upload excel siswa', 'upload excel siswa');
      return wrapper.data(`${errorData} error penambahan.`);
    }

    let successMessage = `${countData} berhasil ditambahkan.`;

    if (duplicate > 0) {
      successMessage = `${countData} berhasil ditambahkan & ${duplicate} data sama.`;
    }

    logger.log(ctx, 'success upload excel siswa', 'upload excel siswa');
    return wrapper.data(successMessage);
  }

  async exportRaport(payload) {
    const ctx = 'Export-Report';
    const { alumni, siswa_id, kelas_id, type } = payload;
    const fData = await this.query.findManyKompetensi({ siswa_id });
    if (fData.err) {
      logger.error(ctx, 'failed get data', 'get data kompetensi');
      return wrapper.error(new InternalServerError('data not found'));
    }

    const dSiswa = await this.query.findOneSiswa({ siswa_id, isActive: alumni ? false : true });
    if (dSiswa.err) {
      logger.error(ctx, 'failed get data', 'get data siswa');
      return wrapper.error(new InternalServerError('data not found'));
    }

    const data = fData.data;
    const siswaData = {
      nama: dSiswa.data.nama_lengkap,
      nisn: dSiswa.data.NISN,
      nis: dSiswa.data.NIS,
    };

    const dataKelas = await Promise.all(data.map(async item => {
      const kelas = await this.query.findOneClass({ kelas_id: item.kelas_id, isActive: true });
      if (!validate.isEmpty(kelas.err)) {
        return {
          namaKelas: item.namaKelas,
          tahunAjaran: kelas.data.tahun_ajaran,
          jenis_kelas: 0,
          semester: Number(item.semester)
        };
      }
      return {
        namaKelas: item.namaKelas,
        tahunAjaran: '-',
        jenis_kelas: kelas.data.jenis_kelas,
        semester: Number(item.semester)
      };
    }));

    const ids = dataKelas.map(i => i.namaKelas);
    const kelasData = dataKelas.filter(({ namaKelas }, index) => !ids.includes(namaKelas, index + 1));

    const excel = await templateExcel.templateExcelJs({ data, siswaData, kelasData });
    if (excel.err) {
      logger.error(ctx, 'failed create excel', 'create excel');
      return wrapper.error(new InternalServerError('Gagal memuat raport'));
    }

    return wrapper.data(excel.data);
  }

  async exportSiswa(payload) {
    const ctx = 'Export-Siswa';
    const { kelas_id } = payload;

    const kelas = await this.query.findOneClass({ kelas_id });
    if (kelas.err) {
      return wrapper.error(new NotFoundError('Kelas not found'));
    }

    const waliKelas = await this.query.findOneGuru({ guru_id: kelas.data.guru_id });
    if (waliKelas.err) {
      return wrapper.error(new NotFoundError('Wali kelas not found'));
    }

    const kepalaSekolah = await this.query.findOneGuru({ $or: [{ 'jabatan': new RegExp('kepala sekolah', 'i') }], isDelete: false });

    const namaWKelas = waliKelas.data.nama;
    const nipWKelas = waliKelas.data.nip_karpeg;
    const namaKelas = kelas.data.nama_kelas;
    const namaKepala = kepalaSekolah.data.nama || '';
    const nipKepala = kepalaSekolah.data.nip_karpeg || '';

    const tahunAjaran = kelas.data.tahun_ajaran;
    const jurusan = kelas.data.nama_kelas.split(' ')[1] || '-';

    const dataExcelHeader = {
      namaKelas,
      namaWKelas: `: ${namaWKelas}`,
      nipWKelas: `: ${nipWKelas}`,
      namaKepala: `: ${namaKepala}`,
      nipKepala: `: ${nipKepala}`,
      tahun: `DAFTAR NAMA SISWA SMA NEGERI 1 KOTA JAMBI TAHUN PELAJARAN ${tahunAjaran}`,
      jurusan: `JURUSAN : ${jurusan}`,
      bulan: dateFormat(new Date(), 'mmmm yyyy')
    };

    const siswa = await this.query.findManySiswa({ kelas_id }, { nama_lengkap: 1 });
    if (siswa.err) {
      return wrapper.error(new NotFoundError('Siswa belum ada di kelas ini'));
    }
    const dataExcelSiswa = await Promise.all(siswa.data.map(async item => {
      const siswa_id = item.siswa_id;
      const address = await this.query.findOneTempatTinggal({ siswa_id });
      const alamat = validate.isEmpty(address.data.alamat) ? '' : address.data.alamat;
      let dataIbu = { nama: '', pekerjaan: '' };
      let dataAyah = { nama: '', pekerjaan: '', noTelp: '' };
      const ortu = await this.query.findManyOrangTua({ siswa_id, type_ortu: { $in: ['1', '2'] } });
      if (!validate.isEmpty(ortu.data)) {
        ortu.data.forEach(i => {
          if (i.type_ortu === '1') {
            dataAyah.nama = i.nama;
            dataAyah.pekerjaan = i.pekerjaan;
            dataAyah.noTelp = i.no_telpon;
          } else {
            dataIbu.nama = i.nama;
            dataIbu.pekerjaan = i.pekerjaan;
          }
        });
      }
      return {
        nama_kelas: namaKelas,
        nis: item.NIS,
        nisn: item.NISN,
        nama: item.nama_lengkap,
        ttl: item.ttl,
        jk: item.jenis_kelamin.charAt(0).toUpperCase(),
        agama: item.agama,
        alamat,
        nama_ayah: dataAyah.nama,
        pekerjaan_ayah: dataAyah.pekerjaan,
        noTelp_ayah: dataAyah.noTelp,
        nama_ibu: dataIbu.nama,
        pekerjaan_ibu: dataIbu.pekerjaan
      };
    }));

    const excel = await templateExcel.templateExcelSiswa({ header: dataExcelHeader, data: dataExcelSiswa });
    if (excel.err) {
      logger.error(ctx, 'failed create excel', 'create excel');
      return wrapper.error(new InternalServerError('Gagal memuat raport'));
    }

    return wrapper.data(excel.data);
  }

  async exportDataSiswa(payload) {
    const ctx = 'Export-data-Siswa';
    const { siswa_id } = payload;

    const tentangData = await this.query.findOneSiswa({ siswa_id, isDelete: false });
    if (tentangData.err) {
      return wrapper.error(new NotFoundError('Siswa not found'));
    }

    const alamatData = await this.query.findOneTempatTinggal({ siswa_id });
    const orgData = await this.query.findManyOrangTua({ siswa_id });
    const pendidikanData = await this.query.findOnePendidikan({ siswa_id });
    const kesehatanData = await this.query.findOneKesehatan({ siswa_id });
    const hobiData = await this.query.findOneHobi({ siswa_id });
    const pindahData = await this.query.findOnePindahan({ siswa_id });

    let ayah = {};
    let ibu = {};
    let wali = {};

    orgData.data.forEach(item => {
      if (item.type_ortu === '1') {
        return ayah = item;
      } else if (item.type_ortu === '2') {
        return ibu = item;
      }
      return wali = item;


    });

    const data = {
      tentang: tentangData.data,
      alamat: alamatData.data,
      orangtua: { ayah, ibu, wali },
      pendidikan: pendidikanData.data,
      kesehatan: kesehatanData.data,
      hobi: hobiData.data,
      pindah: pindahData.data
    };


    const excel = await templateExcel.templateExcelDataSiswa(data);
    if (excel.err) {
      logger.error(ctx, 'failed create excel', 'create excel');
      return wrapper.error(new InternalServerError('Gagal memuat raport'));
    }

    return wrapper.data(excel.data);
  }

  async toAlumni(payload) {
    const { siswa_id } = payload;

    const cSiswa = await this.query.findOneSiswa({ siswa_id, isActive: true });
    if (cSiswa.err) {
      return wrapper.error(new NotFoundError('siswa not found'));
    }

    const result = await this.command.updateAlumni({ siswa_id });
    if (result.err) {
      return wrapper.error(new InternalServerError('internal server error'));
    }

    return wrapper.data('success change alumni');
  }

  async deleteData(payload) {
    const { id, type } = payload;

    const tipe = type === 'tenaga_ahli' ? 'tenagaAhli' : type === 'kelas' ? 'class' : type === 'siswa' ? 'tentangDiri' : 'guru';

    const cSiswa = await this.query.findOneDelete({ [`${type}_id`]: id }, { type: tipe });
    if (cSiswa.err) {
      return wrapper.error(new NotFoundError(`${type} not found`));
    }

    const result = await this.command.deleteData({ [`${type}_id`]: id }, { type: tipe });
    if (result.err) {
      return wrapper.error(new InternalServerError('internal server error'));
    }

    return wrapper.data(`success delete ${type}`);
  }

  async uploadData(data) {
    const ctx = 'upload-data';
    const { type, file } = data;
    const createFile = type === 'image' ? 'images/original' : type;
    const imgName = uuid();
    const path = `./files/${createFile}/${imgName}.${type === 'image' ? 'png' : 'pdf'}`;
    const image = config.get('/fileUrl') + `${createFile}/${imgName}.${type === 'image' ? 'png' : 'pdf'}`;
    fs.writeFileSync(path, file.split(';base64,')[1], { encoding: 'base64' });
    fs.createReadStream(`./files/${createFile}/${imgName}.${type === 'image' ? 'png' : 'pdf'}`);
    return image;
  }

}

module.exports = User;
