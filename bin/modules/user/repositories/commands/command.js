/* eslint-disable max-len */

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

  async insertOneIsiKelas(document){
    const validateData = [document.siswa_id, document.kelas_id, document.createdAt, document.updatedAt];
    const query = `INSERT INTO isi_kelas (siswa_id, kelas_id, createdAt, updatedAt) 
    VALUES (?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneSiswa(document){
    const validateData = [document.siswa_id, document.NISN, document.NIS, document.nama_siswa , document.jenis_kelamin, document.createdAt, document.updatedAt];
    const query = `INSERT INTO siswa (siswa_id, NISN, NIS, nama_siswa, jenis_kelamin, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneTentangDiri(document){
    const validateData = [ document.tentang_id, document.siswa_id, document.nama_lengkap, document.nama_panggilan,document.tanggal_lahir, document.kelamin, document.agama, document.kewarganegaraan, document.anak_ke, document.jml_sdr_kandung, document.jml_sdr_tiri, document.status_anak, document.bahasa_sehari, document.pihak_dihubungi, document.penanggung_biaya, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO tentang_siswa (tentang_id, siswa_id, nama_lengkap, nama_panggilan, tanggal_lahir, kelamin, agama, kewarganegaraan, anak_ke, jml_sdr_kandung, jml_sdr_tiri, status_anak, bahasa_sehari, pihak_dihubungi, penanggung_biaya, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneTempatTinggal(document){
    const validateData = [ document.tempat_id, document.siswa_id, document.alamat, document.no_telephone,document.tinggal_di, document.jarak_ke_sekolah, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO tempat_tinggal_siswa (tempat_id, siswa_id, alamat, no_telephone, tinggal_di, jarak_ke_sekolah, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOnePendidikan(document){
    const validateData = [ document.pendidikan_id, document.siswa_id, document.tanggal_diterima, document.lulus_dari,document.tanggal_ijazah, document.no_ijazah, document.tanggal_STL, document.no_STL, document.lama_belajar, document.nilai_SKHUN, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO pendidikan_siswa (pendidikan_id, siswa_id, tanggal_diterima, lulus_dari, tanggal_ijazah, no_ijazah, tanggal_STL, no_STL, lama_belajar, nilai_SKHUN, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneKesehatan(document){
    const validateData = [ document.kesehatan_id, document.siswa_id, document.gol_darah, document.kelainan_jasmani,document.tinggi_badan, document.berat_badan, document.nama_penyakit, document.tahun_sakit, document.lama_sakit, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO kesehatan_siswa (kesehatan_id, siswa_id, gol_darah, kelainan_jasmani, tinggi_badan, berat_badan, nama_penyakit, tahun_sakit, lama_sakit, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneOrtu(document){
    const validateData = [ document.ortu_id, document.siswa_id, document.type_ortu, document.nama, document.TTL, document.agama, document.kewarganegaraan, document.pendidikan, document.pekerjaan, document.gol_pekerjaan, document.penghasilan, document.alamat, document.no_telpon, document.status, document.status_nikah, document.tahun_meninggal, document.hubungan_wali, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO orang_tua_siswa (ortu_id, siswa_id, type_ortu, nama, TTL, agama, kewarganegaraan, pendidikan, pekerjaan, gol_pekerjaan, penghasilan, alamat, no_telpon, status, status_nikah, tahun_meninggal, hubungan_wali, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOneHobi(document){
    const validateData = [ document.hobi_id, document.siswa_id, document.organisasi, document.seni, document.olahraga, document.lain, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO hobi_siswa (hobi_id, siswa_id, organisasi, seni, olahraga, lain, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }

  async insertOnePindah(document){
    const validateData = [ document.pindah_id, document.siswa_id, document.pindah_sekolah, document.pindah_alasan, document.diterima_di, document.diterima_program, document.meninggalkan_di, document.meninggalkan_program, document.meninggalkan_alasan, document.akhir_tamat_belajar, document.akhir_sttb, document.createdAt, document.updatedAt ];
    const query = `INSERT INTO pindah_siswa (pindah_id, siswa_id, pindah_sekolah, pindah_alasan, diterima_di, diterima_program, meninggalkan_di, meninggalkan_program, meninggalkan_alasan, akhir_tamat_belajar, akhir_sttb, createdAt, updatedAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await this.db.insertOne(query, validateData);
    return result;
  }
}

module.exports = Command;
