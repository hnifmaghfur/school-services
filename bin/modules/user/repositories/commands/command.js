/* eslint-disable max-len */

class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOneUser(document){
    this.db.setCollection('users');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneClass(document){
    this.db.setCollection('class');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneTentangDiri(document){
    this.db.setCollection('tentangDiri');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneTempatTinggal(document){
    this.db.setCollection('tempatTinggal');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOnePendidikan(document){
    this.db.setCollection('pendidikan');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneKesehatan(document){
    this.db.setCollection('kesehatan');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertManyOrtu(document){
    this.db.setCollection('orangTua');
    const result = await this.db.insertMany(document);
    return result;
  }

  async insertOneHobi(document){
    this.db.setCollection('hobi');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOnePindah(document){
    this.db.setCollection('pindah');
    const result = await this.db.insertOne(document);
    return result;
  }
}

module.exports = Command;
