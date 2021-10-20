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
    const recordset = await this.db.findAllData(sorting, stat.limit, stat.page, parameter);
    return recordset;
  }

  async findListKelas(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async countKelas(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async findAllSiswa(sorting, stat, parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findAllData(sorting, stat.limit, stat.page, parameter);
    return recordset;
  }

  async countSiswa(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async countGuru(parameter) {
    this.db.setCollection('guru');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async countTenagaAhli(parameter) {
    this.db.setCollection('tenagaAhli');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async findOneTentangDiri(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findOne(parameter);
    return recordset;
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
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async findManyClass(parameter) {
    this.db.setCollection('class');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async countKompetensi(parameter) {
    this.db.setCollection('kompetensi');
    const recordset = await this.db.countData(parameter);
    return recordset;
  }

  async findManyKompetensi(parameter) {
    this.db.setCollection('kompetensi');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async findManySiswa(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findMany(parameter);
    return recordset;
  }

  async findOnePindahan(parameter) {
    this.db.setCollection('pindah');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findKompetensi(parameter) {
    this.db.setCollection('kompetensi');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findAllGuru(sorting, stat, parameter) {
    this.db.setCollection('guru');
    const recordset = await this.db.findAllData(sorting, stat.limit, stat.page, parameter);
    return recordset;
  }

  async findAllTenagaAhli(sorting, stat, parameter) {
    this.db.setCollection('tenagaAhli');
    const recordset = await this.db.findAllData(sorting, stat.limit, stat.page, parameter);
    return recordset;
  }

  async findOneGuru(parameter) {
    this.db.setCollection('guru');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneTenagaAhli(parameter) {
    this.db.setCollection('tenagaAhli');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findOneSiswa(parameter) {
    this.db.setCollection('tentangDiri');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findAllIsiKelas(document) {
    const validateData = [document.siswa_id];
    const query = 'SELECT * FROM isi_kelas WHERE siswa_id = ?';
    const result = await this.db.findData(query, validateData);
    return result;
  }

}

module.exports = Query;
