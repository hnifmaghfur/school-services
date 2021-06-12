
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

}

module.exports = Query;
