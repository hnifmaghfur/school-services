const joi = require('joi');

const login = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  isActive : joi.boolean().default(true, 'Example If Need Default Value')
});

const addClass = joi.object({
  namaKelas: joi.string().required(),
  walikelas: joi.string().required(),
  tahunAjaran : joi.string().required()
});

const addTentangDiri = joi.object({
  kelas_id: joi.string().required(),
  siswa_id: joi.string().required(),
  NIS: joi.string().required(),
  NISN: joi.string().required(),
  image: joi.string().required(),
  nama_lengkap : joi.string().required(),
  nama_panggilan : joi.string().required(),
  ttl: joi.string().required(),
  jenis_kelamin: joi.string().required(),
  agama: joi.string().required(),
  kewarganegaraan: joi.string().required(),
  anak_ke: joi.string().required(),
  jml_sdr_kandung: joi.string().required(),
  jml_sdr_tiri: joi.string().required(),
  jml_sdr_angkat: joi.string().required(),
  status_anak: joi.string().required(),
  bahasa: joi.string().required(),
  pihak_dihubungi: joi.string().required(),
  penanggung_biaya: joi.string().required(),
});

const addTempatTinggal = joi.object({
  siswa_id: joi.string().required(),
  alamat: joi.string().required(),
  no_telephone: joi.string().required(),
  tinggal_di : joi.string().required(),
  jarak_ke_sekolah : joi.string().required(),
});

const addPendidikan = joi.object({
  siswa_id: joi.string().required(),
  tanggal_diterima: joi.string().required(),
  lulus_dari: joi.string().required(),
  tanggal_no_ijazah : joi.string().required(),
  tanggal_no_stl : joi.string().required(),
  lama_belajar : joi.string().required(),
  nilai_skhun : joi.string().required(),
});

const addKesehatan = joi.object({
  siswa_id: joi.string().required(),
  gol_darah: joi.string().required(),
  kelainan_jasmani: joi.string().required(),
  tinggi_berat_badan: joi.string().required(),
  nama_penyakit: joi.string().required(),
  tahun_sakit: joi.string().required(),
  lama_sakit: joi.string().required(),
});

const addOrangTua = joi.object({
  siswa_id: joi.string().required(),
  data: joi.array().items(joi.object({
    type: joi.string().valid('ayah','ibu','wali').required(),
    nama: joi.string().required(),
    TTL: joi.string().required(),
    agama: joi.string().required(),
    kewarganegaraan: joi.string().required(),
    pendidikan: joi.string().required(),
    pekerjaan: joi.string().required(),
    gol_pekerjaan: joi.string().required(),
    penghasilan: joi.string().required(),
    alamat: joi.string().required(),
    no_telpon: joi.string().required(),
    status: joi.string().required(),
    status_nikah: joi.string().required(),
    tahun_meninggal: joi.string().required(),
    hubungan_wali: joi.string().allow(''),
  })),
});

const addHobi = joi.object({
  siswa_id: joi.string().required(),
  olahraga: joi.string().required(),
  seni: joi.string().required(),
  organisasi: joi.string().required(),
  lain: joi.string().required(),
});

const addPindah = joi.object({
  siswa_id: joi.string().required(),
  pindah_sekolah: joi.string().required(),
  pindah_alasan: joi.string().required(),
  diterima_di: joi.string().required(),
  diterima_program: joi.string().required(),
  meninggalkan_di: joi.string().required(),
  meninggalkan_program: joi.string().required(),
  meninggalkan_alasan: joi.string().required(),
  akhir_tamat_belajar: joi.string().required(),
  akhir_sttb: joi.string().required(),
});

const importSiswa = joi.object({
  file: joi.optional(),
});

const addKompetensi = joi.object({
  siswa_id: joi.string().required(),
  kelas_id: joi.string().required(),
  nilai: joi.array().required(),
  absen: joi.object({
    alpha: joi.string().required(),
    sakit: joi.string().required(),
    izin: joi.string().required(),
  })
});

module.exports = {
  login,
  addClass,
  addTentangDiri,
  addTempatTinggal,
  addPendidikan,
  addKesehatan,
  addOrangTua,
  addHobi,
  addPindah,
  addKompetensi,
  importSiswa,
};
