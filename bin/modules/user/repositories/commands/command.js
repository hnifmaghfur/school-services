/* eslint-disable max-len */

class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOneUser(document) {
    this.db.setCollection('users');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneClass(document) {
    this.db.setCollection('class');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneTentangDiri(document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneTentangDiri(siswa_id, document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertOneTempatTinggal(document) {
    this.db.setCollection('tempatTinggal');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneTempat(siswa_id, document) {
    this.db.setCollection('tempatTinggal');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertOnePendidikan(document) {
    this.db.setCollection('pendidikan');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOnePendidikan(siswa_id, document) {
    this.db.setCollection('pendidikan');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertOneKesehatan(document) {
    this.db.setCollection('kesehatan');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneKesehatan(siswa_id, document) {
    this.db.setCollection('kesehatan');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertManyOrtu(document) {
    this.db.setCollection('orangTua');
    const result = await this.db.insertMany(document);
    return result;
  }

  async insertOneHobi(document) {
    this.db.setCollection('hobi');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneHobi(siswa_id, document) {
    this.db.setCollection('hobi');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertOnePindahan(document) {
    this.db.setCollection('pindah');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOnePindahan(siswa_id, document) {
    this.db.setCollection('pindah');
    const result = await this.db.upsertOne(siswa_id, {
      $set: document
    });
    return result;
  }

  async insertOneKompetensi(document) {
    this.db.setCollection('kompetensi');
    const result = await this.db.insertOne(document);
    return result;
  }

  async insertOneGuru(document) {
    this.db.setCollection('guru');
    const result = await this.db.insertOne(document);
    return result;
  }

  async updateOneGuru(parameter, document) {
    this.db.setCollection('guru');
    const result = await this.db.upsertOne(parameter, {
      $set: document
    });
    return result;
  }

  async updateOneTenagaAhli(parameter, document) {
    this.db.setCollection('tenagaAhli');
    const result = await this.db.upsertOne(parameter, {
      $set: document
    });
    return result;
  }

  async insertOneTenagaAhli(document) {
    this.db.setCollection('tenagaAhli');
    const result = await this.db.insertOne(document);
    return result;
  }

  async updateOneKompetensi(document) {
    this.db.setCollection('kompetensi');
    const result = await this.db.upsertOne({ kompetensi_id: document.kompetensi_id }, {
      $set: document.data
    });
    return result;
  }

  async updateStatusClass(document) {
    this.db.setCollection('class');
    const result = await this.db.upsertOne({ kelas_id: document.kelas_id }, {
      $set: {
        isActive: false
      }
    });
    return result;
  }

  async updateOneOrtu(parameter, document) {
    this.db.setCollection('orangTua');
    const result = await this.db.upsertOne(parameter, {
      $set: document
    });
    return result;
  }

}

module.exports = Command;
