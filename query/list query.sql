show tables;

select * from user;
select * from kelas;
select * from guru;
select * from tenaga_ahli;
select * from siswa;
select * from isi_kelas;
select * from tentang_siswa;
select * from tempat_tinggal_siswa;
select * from pendidikan_siswa;
select * from kesehatan_siswa;
select * from hobi_siswa;
select * from orang_tua_siswa;
select * from pindah_siswa;
select * from kehadiran;
select * from mapel_sikap;
select * from mapel_keterampilan;
select * from mapel_pengetahuan;


select kelas.kelas_id, siswa.siswa_id from siswa join isi_kelas on siswa.siswa_id = isi_kelas.siswa_id join kelas on isi_kelas.kelas_id = kelas.kelas_id where siswa.jenis_kelamin = 'Perempuan';

SELECT kelas.kelas_id, siswa.siswa_id, siswa.nama_siswa, siswa.NISN, siswa.NIS, siswa.jenis_kelamin,kelas.nama_kelas, kelas.tahun_ajaran 
FROM siswa JOIN isi_kelas ON siswa.siswa_id = isi_kelas.siswa_id JOIN kelas ON isi_kelas.kelas_id = kelas.kelas_id 
WHERE siswa.jenis_kelamin LIKE "%laki%" AND (siswa.nama_siswa LIKE "%%" OR siswa.NISN LIKE "%%" OR siswa.NIS LIKE "%%") ORDER BY siswa.nama_siswa ASC LIMIT 10 OFFSET 0;

select count(siswa_id) from siswa where jenis_kelamin = 'laki-laki';