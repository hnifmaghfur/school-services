/* eslint-disable max-len */

class Query {

  constructor(db) {
    this.db = db;
  }

  async findOneUser(parameter) {
    this.db.setCollection('users');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneClass(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findAllClass(sorting, stat, parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.findAllData( sorting, stat.limit, stat.page, parameter );
    return recordset;
  }

  async findListKelas(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.findMany( parameter );
    return recordset;
  }

  async countKelas(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async findAllSiswa(sorting, stat, parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findAllData( sorting, stat.limit, stat.page, parameter );
    return recordset;
  }

  async countSiswa(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async countGuru(document) {
    const validateData = [];
    const query = `SELECT COUNT(guru_id) as jumlah_guru FROM guru WHERE nama LIKE "%${document.search}%" OR jabatan LIKE "%${document.search}%"`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async countTenagaAhli(document) {
    const validateData = [];
    const query = `SELECT COUNT(tenaga_ahli_id) as jumlah_tenaga_ahli FROM tenaga_ahli WHERE nama LIKE "%${document.search}%" OR jabatan LIKE "%${document.search}%"`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllClassId(document) {
    const validateData = [document.kelas_id];
    const query = 'SELECT * FROM kelas WHERE kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findOneTentangDiri(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findDataSiswa(document) {
    const validateData = [document.siswa_id, document.kelas_id];
    const query = 'SELECT siswa.nama_siswa AS name, kelas.nama_kelas as kelas, siswa.NISN AS NISN, siswa.NIS AS NIS FROM siswa JOIN isi_kelas ON siswa.siswa_id = isi_kelas.siswa_id JOIN kelas ON isi_kelas.kelas_id = kelas.kelas_id WHERE isi_kelas.siswa_id = ? AND isi_kelas.kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findOneTempatTinggal(parameter) {
    this.db.setCollection('tempatTinggal');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOnePendidikan(parameter) {
    this.db.setCollection('pendidikan');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneKesehatan(parameter) {
    this.db.setCollection('kesehatan');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneHobi(parameter) {
    this.db.setCollection('hobi');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findManyOrangTua(parameter) {
    this.db.setCollection('orangTua');
    const recordset = await this.db.findMany( parameter );
    return recordset;
  }

  async findOnePindahan(parameter) {
    this.db.setCollection('pindah');
    const recordset = await this.db.findOne( parameter );
    return recordset;
  }

  async findMapelPengetahuan(document) {
    const validateData = [document.siswa_id, document.kelas_id];
    const query = 'SELECT mapel_pengetahuan.* FROM mapel_pengetahuan JOIN isi_kelas ON mapel_pengetahuan.siswa_id = isi_kelas.siswa_id JOIN kelas ON kelas.kelas_id = isi_kelas.kelas_id WHERE isi_kelas.siswa_id = ? AND isi_kelas.kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findMapelKeterampilan(document) {
    const validateData = [document.siswa_id, document.kelas_id];
    const query = 'SELECT mapel_keterampilan.* FROM mapel_keterampilan JOIN isi_kelas ON mapel_keterampilan.siswa_id = isi_kelas.siswa_id JOIN kelas ON kelas.kelas_id = isi_kelas.kelas_id WHERE isi_kelas.siswa_id = ? AND isi_kelas.kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findMapelSikap(document) {
    const validateData = [document.siswa_id, document.kelas_id];
    const query = 'SELECT mapel_sikap.* FROM mapel_sikap JOIN isi_kelas ON isi_Kelas.siswa_id = mapel_sikap.siswa_id JOIN kelas ON kelas.kelas_id = isi_kelas.kelas_id WHERE isi_kelas.siswa_id = ? AND isi_kelas.kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAbsen(document) {
    const validateData = [document.siswa_id, document.kelas_id];
    const query = 'SELECT kehadiran.* FROM kehadiran JOIN isi_kelas ON kehadiran.siswa_id = isi_kelas.siswa_id JOIN kelas ON kelas.kelas_id = isi_kelas.kelas_id WHERE isi_kelas.siswa_id = ? AND isi_kelas.kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllGuru(document) {
    const validateData = [document.limit, document.page];
    const query = `SELECT guru_id, nip_karpeg, nama, jabatan FROM guru WHERE nama LIKE "%${document.search}%" OR jabatan LIKE "%${document.search}%" ORDER BY ${document.sort} LIMIT ? OFFSET ?`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllTenagaAhli(document) {
    const validateData = [document.limit, document.page];
    const query = `SELECT tenaga_ahli_id, nip_karpeg, nama, jabatan FROM tenaga_ahli WHERE nama LIKE "%${document.search}%" OR jabatan LIKE "%${document.search}%" ORDER BY ${document.sort} LIMIT ? OFFSET ?`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findOneGuru(document) {
    const validateData = [document.guru_id];
    const query = 'SELECT * FROM guru WHERE guru_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findOneTenagaAhli(document) {
    const validateData = [document.tenaga_ahli_id];
    const query = 'SELECT * FROM tenaga_ahli WHERE tenaga_ahli_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllIsiKelas(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM isi_kelas WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

}

module.exports = Query;
