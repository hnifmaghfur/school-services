
class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOneUser(document){
    const validateData = [document.user_id, document.username, document.password, document.isActive, document.createdAt, document.updatedAt];
    const query = `INSERT INTO user (user_id, username, password,isActive, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneClass(document){
    const validateData = [document.kelas_id, document.nama_kelas, document.wali_kelas, document.tahun_ajaran, document.createdAt, document.updatedAt];
    const query = `INSERT INTO kelas (kelas_id, nama_kelas, wali_kelas, tahun_ajaran, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }
}

module.exports = Command;
