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

  async countKelas(document) {
    const validateData = [];
    const query = 'SELECT COUNT(kelas_id) as jumlah_kelas FROM kelas';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async countSiswa(document) {
    const validateData = [document.kelas_id];
    const query = `SELECT COUNT(isi_kelas.siswa_id) as jumlah_siswa FROM siswa JOIN isi_kelas ON siswa.siswa_id = isi_kelas.siswa_id JOIN kelas ON isi_kelas.kelas_id = kelas.kelas_id WHERE siswa.nama_siswa LIKE "%${document.search}%" OR siswa.NISN LIKE "%${document.search}%" OR siswa.NIS LIKE "%${document.search}%" AND kelas.kelas_id = ?`;
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

  async findAllTempatTinggal(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM tempat_tinggal_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllPendidikan(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM pendidikan_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllKesehatan(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM kesehatan_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllHobi(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM hobi_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllOrangTua(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM orang_tua_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllPindahan(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM pindah_siswa WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findMapelPengetahuan(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM mapel_pengetahuan WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findMapelKeterampilan(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM mapel_keterampilan WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findMapelSikap(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM mapel_sikap WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAbsen(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM kehadiran WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

  async findAllSiswa(document) {
    const validateData = [document.kelas_id, document.limit, document.page];
    const query = `SELECT kelas.kelas_id, siswa.siswa_id, siswa.nama_siswa, siswa.NISN, siswa.NIS, siswa.jenis_kelamin,kelas.nama_kelas, kelas.tahun_ajaran FROM siswa JOIN isi_kelas ON siswa.siswa_id = isi_kelas.siswa_id JOIN kelas ON isi_kelas.kelas_id = kelas.kelas_id WHERE siswa.nama_siswa LIKE "%${document.search}%" OR siswa.NISN LIKE "%${document.search}%" OR siswa.NIS LIKE "%${document.search}%" AND kelas.kelas_id = ? LIMIT ? OFFSET ?`;
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
