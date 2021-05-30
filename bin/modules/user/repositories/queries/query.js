
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

  async findAllClass(document) {
    const validateData = [document.limit, document.page];
    const query = `SELECT * FROM kelas WHERE name LIKE "%${document.search}%" OR wali_kelas LIKE "%${document.search}%" LIMIT ? OFFSET ?`;
    const result = await this.db.findData(query, validateData);
    return result;
  }

}

module.exports = Query;
