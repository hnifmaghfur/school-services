/* eslint-disable max-len */

class Query {

  constructor(db) {
    this.db = db;
  }

  async findOneUser(document) {
    const validateData = [document.username];
    const query = 'SELECT * FROM user WHERE username = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findOneClass(document) {
    const validateData = [document.nama_kelas, document.wali_kelas, document.tahun_ajaran];
    const query = 'SELECT * FROM kelas WHERE nama_kelas = ? AND wali_kelas = ? AND tahun_ajaran = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllClass(document) {
    const validateData = [document.limit, document.page];
    const query = `SELECT * FROM kelas WHERE nama_kelas LIKE "%${document.search}%" OR wali_kelas LIKE "%${document.search}%" LIMIT ? OFFSET ?`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllClassId(document) {
    const validateData = [document.kelas_id];
    const query = 'SELECT * FROM kelas WHERE kelas_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllTentangDiri(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM tentang_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllSiswa(document) {
    const validateData = [document.limit, document.page];
    const query = `SELECT * FROM siswa WHERE nama_siswa LIKE "%${document.search}%" OR NISN LIKE "%${document.search}%" OR NIS LIKE "%${document.search}%" LIMIT ? OFFSET ?`;
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
