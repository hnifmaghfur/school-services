/* eslint-disable max-len */

const Query = require('../queries/query');
const Command = require('./command');
const wrapper = require('../../../../helpers/utils/wrapper');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const commonUtil = require('../../../../helpers/utils/common');
const dateFormat = require('dateformat');
const logger = require('../../../../helpers/utils/logger');
const uuid = require('uuid').v4;
const { NotFoundError, UnauthorizedError, ConflictError, InternalServerError, BadRequestError } = require('../../../../helpers/error');
const xlsx = require('xlsx');
const validate = require('validate.js');

const algorithm = 'aes-256-cbc';
const secretKey = 'sekolahan@jambi1';

class User {

  constructor(db) {
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
    const userId = user.data.user_id;
    const userName = user.data.username;
    const pass = await commonUtil.decrypt(user.data.password, algorithm, secretKey);
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
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add user', 'insert user');
    return wrapper.data('success');
  }

  async addClass(payload) {
    const ctx = 'Add-Class';
    const { namaKelas, walikelas, tahunAjaran } = payload;

    const validateKelas = await this.query.findOneClass({ namaKelas });
    if (!validate.isEmpty(validateKelas.data)) {
      const cActive = await this.command.updateStatusClass({ kelas_Id: cActive.data.kelas_id });
      if (cActive.err) {
        logger.log(ctx, 'Failed update class', 'update class');
      }
    }

    const data = {
      kelas_id: uuid(),
      nama_kelas: namaKelas,
      wali_kelas: walikelas,
      tahun_ajaran: tahunAjaran,
      isActive: true,
      createdAt: dateFormat(new Date(), 'isoDateTime'),
      updatedAt: dateFormat(new Date(), 'isoDateTime'),
    };

    const result = await this.command.insertOneClass(data);
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert user');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }
    logger.log(ctx, 'success add class', 'insert class');
    return wrapper.data('success');

  }

  async addTentangDiri(payload) {
    const ctx = 'Add-Tentang-Diri';
    const { kelas_id, NIS, NISN, image, nama_lengkap, nama_panggilan, ttl, jenis_kelamin, agama, kewarganegaraan, anak_ke, jml_sdr_kandung, jml_sdr_tiri, jml_sdr_angkat, status_anak, bahasa, pihak_dihubungi, penanggung_biaya } = payload;

    const validateSiswa = await this.query.findOneSiswa({ $or: [{ NIS }, { NISN }] });
    if (!validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa telah terdaftar', 'validate siswa');
      return wrapper.error(new ConflictError('NISN atau NIS siswa telah terdaftar'));
    }

    const validateKelas = await this.query.findOneClass({ kelas_id });
    if (validateKelas.err || validate.isEmpty(validateKelas.data)) {
      logger.log(ctx, 'kelas tidak ada', 'validate kelas');
      return wrapper.error(new NotFoundError('Kelas tidak terdaftar'));
    }

    const siswa_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const dataTentangDiri = {
      tentang_id: uuid(),
      siswa_id,
      kelas_id,
      NISN,
      NIS,
      image,
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
      bahasa,
      pihak_dihubungi,
      penanggung_biaya,
      createdAt,
      updatedAt,
    };

    const tentang = await this.command.insertOneTentangDiri(dataTentangDiri);
    if (tentang.err) {
      logger.log(ctx, 'failed upload data', 'insert tentang');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add siswa', 'insert siswa');
    return wrapper.data({ siswa_id });

  }

  async addTempatTinggal(payload) {
    const ctx = 'Add-Tempat-Tinggal';
    const { siswa_id, alamat, no_telephone, tinggal_di, jarak_ke_sekolah } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

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
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert tempat tinggal');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add tempat tinggal siswa', 'insert tempat tinggal siswa');
    return wrapper.data({ siswa_id });
  }

  async addPendidikan(payload) {
    const ctx = 'Add-Pendidikan';
    const { siswa_id, tanggal_diterima, lulus_dari, tanggal_no_ijazah, tanggal_no_stl, lama_belajar, nilai_skhun } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

    const pendidikan_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      siswa_id,
      pendidikan_id,
      tanggal_diterima,
      lulus_dari,
      tanggal_no_ijazah,
      tanggal_no_stl,
      lama_belajar,
      nilai_skhun,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOnePendidikan(data);
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert pendidikan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add pendidikan siswa', 'insert Pendidikan siswa');
    return wrapper.data({ siswa_id });
  }

  async addKesehatan(payload) {
    const ctx = 'Add-Kesehatan';
    const { siswa_id, gol_darah, kelainan_jasmani, tinggi_berat_badan, nama_penyakit, tahun_sakit, lama_sakit } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

    const kesehatan_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = {
      siswa_id,
      kesehatan_id,
      gol_darah,
      kelainan_jasmani,
      tinggi_berat_badan,
      nama_penyakit,
      tahun_sakit,
      lama_sakit,
      createdAt,
      updatedAt
    };

    const result = await this.command.insertOneKesehatan(data);
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert kesehatan');
      return wrapper.error(new InternalServerError('Internal Server Error'));
    }

    logger.log(ctx, 'success add kesehatan siswa', 'insert kesehatan siswa');
    return wrapper.data({ siswa_id });
  }

  async addOrangTua(payload) {
    const ctx = 'Add-Orang-Tua';
    const { siswa_id, data } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const payloads = await Promise.all(data.map(async item => {

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

      return dataOrtu;
    }));

    const result = await this.command.insertManyOrtu(payloads);
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert orang tua');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add orang tua siswa', 'insert orang tua siswa');
    return wrapper.data({ siswa_id });
  }

  async addHobi(payload) {
    const ctx = 'Add-Hobi';
    const { siswa_id, olahraga, seni, organisasi, lain } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

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
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert hobi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add hobi siswa', 'insert hobi siswa');
    return wrapper.data({ siswa_id });
  }

  async addPindah(payload) {
    const ctx = 'Add-Pindah';
    const { siswa_id, pindah_sekolah, pindah_alasan, diterima_di, diterima_program, meninggalkan_di, meninggalkan_program, meninggalkan_alasan, akhir_tamat_belajar, akhir_sttb } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

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
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert pindah');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add pindah siswa', 'insert pindah siswa');
    return wrapper.data({ siswa_id });
  }

  async addKompetensi(payload) {
    const ctx = 'Add-Kompetensi';
    const { siswa_id, kelas_id, semester, kompetensi_id, kelompokA, kelompokB, kelompokC, kelompokCLintas, absen } = payload;

    const validateSiswa = await this.query.findOneSiswa({ siswa_id });
    if (validateSiswa.err || validate.isEmpty(validateSiswa.data)) {
      logger.log(ctx, 'siswa not found', 'validate siswa');
      return wrapper.error(new NotFoundError('Siswa Not Found'));
    }

    const validateKelas = await this.query.findOneClass({ kelas_id });
    if (validateKelas.err || validate.isEmpty(validateKelas.data)) {
      logger.log(ctx, 'kelas tidak ada', 'validate kelas');
      return wrapper.error(new NotFoundError('Kelas tidak terdaftar'));
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
      data = { kompetensi_id: kompetensiId, siswa_id, kelas_id, semester, ...data, createdAt, updatedAt };
      result = await this.command.insertOneKompetensi(data);
    }

    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert kompetensi');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add kompetensi siswa', 'insert kompetensi siswa');
    return wrapper.data('success');
  }

  async addGuru(payload) {
    const ctx = 'Add-Guru';
    const { nip_kapreg } = payload;

    const validateGuru = await this.query.findOneGuru({ nip_kapreg });
    if (validateGuru.err || validate.isEmpty(validateGuru.data)) {
      logger.log(ctx, 'guru not found', 'validate guru');
      return wrapper.error(new NotFoundError('guru Not Found'));
    }

    let guru_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = { guru_id, ...payload, createdAt, updatedAt };

    const result = await this.command.insertOneGuru(data);
    if (result.err) {
      logger.log(ctx, 'failed upload data', 'insert Guru');
      return wrapper.error(new InternalServerError('internal server error'));
    }

    logger.log(ctx, 'success add Guru siswa', 'insert Guru siswa');
    return wrapper.data('success');
  }

  async addTenagaAhli(payload) {
    const ctx = 'Add-Tenaga-Ahli';
    const { nip_kapreg } = payload;

    const validateTenagaAhli = await this.query.findOneTenagaAhli({ nip_kapreg });
    if (validateTenagaAhli.err || validate.isEmpty(validateTenagaAhli.data)) {
      logger.log(ctx, 'Tenaga Ahli not found', 'validate Tenaga Ahli');
      return wrapper.error(new NotFoundError('guru Not Found'));
    }

    let tenaga_ahli_id = uuid();
    const createdAt = dateFormat(new Date(), 'isoDateTime');
    const updatedAt = dateFormat(new Date(), 'isoDateTime');

    const data = { tenaga_ahli_id, ...payload, createdAt, updatedAt };

    const result = await this.command.insertOneTenagaAhli(data);
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
      return wrapper.error(new BadRequestError('Input file first, please!!'));
    }

    if (file.name.slice(file.name.length - 5, file.name.length) != '.xlsx') {
      return wrapper.error(new BadRequestError('Format tidak sesuai'));
    }

    const workbook = xlsx.readFile(file.path);
    const sheets = workbook.SheetNames;
    const sheetContent = xlsx.utils.sheet_to_json(workbook.Sheets[sheets[0]]);

    let countData = 0;
    let errorData = 0;
    let duplicate = 0;

    await Promise.all(sheetContent.map(async (item, index) => {

      const checkUser = await this.query.findOneTentangDiri({ $or: { NISN: item.NISN, NIS: item.NIS } });
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
      const program_id = uuid();
      const createdAt = dateFormat(new Date(), 'isoDateTime');
      const updatedAt = dateFormat(new Date(), 'isoDateTime');

      const dataTentangDiri = {
        tentang_id,
        siswa_id,
        kelas_id: '',
        NISN: item.NISN,
        NIS: item.NIS,
        image: '',
        nama_lengkap: item.nama_lengkap,
        nama_panggilan: item.nama_panggilan,
        ttl: item.ttl,
        jenis_kelamin: item.jenis_kelamin,
        agama: item.agama,
        kewarganegaraan: item.kewarganegaraan,
        anak_ke: item.anak_ke,
        jml_sdr_kandung: item.jml_sdr_kandung,
        jml_sdr_tiri: item.jml_sdr_tiri,
        jml_sdr_angkat: item.jml_sdr_angkat,
        status_anak: item.status_anak,
        bahasa: item.bahasa,
        pihak_dihubungi: item.pihak_dihubungi,
        penanggung_biaya: item.penanggung_biaya,
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

      const pindah = await this.command.insertOnePindah(dataPindah);
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

}

module.exports = User;
