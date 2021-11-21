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

  async patchOneClass(data, document) {
    this.db.setCollection('class');
    const result = await this.db.upsertOne({ kelas_id: data.kelas_id }, {
      $set: document
    });
    return result;
  }

  async insertOneTentangDiri(document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneTentangDiri(data, document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
      $set: document
    });
    return result;
  }

  async patchOneBantuan(data, document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
      $set: {
        pkh: document.pkh,
        kks: document.kks,
        kps: document.kps,
        updatedAt: document.updatedAt,
      }
    });
    return result;
  }

  async insertOnePrestasi(document) {
    this.db.setCollection('prestasi');
    const result = await this.db.insertOne(document);
    return result;
  }

  async deletePrestasi(document) {
    this.db.setCollection('prestasi');
    const result = await this.db.delete(document);
    return result;
  }

  async patchOnePrestasi(data, document) {
    this.db.setCollection('prestasi');
    const result = await this.db.upsertOne({ prestasi_id: data.prestasi_id }, {
      $set: document
    });
    return result;
  }


  async insertOneTempatTinggal(document) {
    this.db.setCollection('tempatTinggal');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOneTempat(data, document) {
    this.db.setCollection('tempatTinggal');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
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

  async patchOneKesehatan(data, document) {
    this.db.setCollection('kesehatan');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
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

  async patchOneHobi(data, document) {
    this.db.setCollection('hobi');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
      $set: document
    });
    return result;
  }

  async insertOnePindahan(document) {
    this.db.setCollection('pindah');
    const result = await this.db.insertOne(document);
    return result;
  }

  async patchOnePindahan(data, document) {
    this.db.setCollection('pindah');
    const result = await this.db.upsertOne({ siswa_id: data.siswa_id }, {
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

  async updateOneGuru(data, document) {
    this.db.setCollection('guru');
    const result = await this.db.upsertOne({ guru_id: data.guru_id }, {
      $set: document
    });
    return result;
  }

  async updateOneTenagaAhli(data, document) {
    this.db.setCollection('tenagaAhli');
    const result = await this.db.upsertOne({ tenaga_ahli_id: data.tenaga_ahli_id }, {
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

  async updateAlumni(document) {
    this.db.setCollection('tentangDiri');
    const result = await this.db.upsertOne({ siswa_id: document.siswa_id }, {
      $set: {
        isActive: false
      }
    });
    return result;
  }

  async updateOneOrtu(data, document) {
    this.db.setCollection('orangTua');
    const result = await this.db.upsertOne({ ortu_id: data.ortu_id }, {
      $set: document
    });
    return result;
  }

  async deleteData(parameter, data) {
    const { type } = data;
    const document = type === 'class' ? { isActive: false } : { isDelete: true };
    this.db.setCollection(type);
    const result = await this.db.upsertOne(parameter, {
      $set: document
    });
    return result;
  }

}

module.exports = Command;
