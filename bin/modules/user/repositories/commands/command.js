
class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOneUser(document){
    const validateData = [document.user_id, document.username, document.password, document.isActive];
    const query = `INSERT INTO user (user_id, username, password,isActive) 
    VALUES (?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }
}

module.exports = Command;
