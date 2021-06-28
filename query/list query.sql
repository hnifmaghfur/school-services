show tables;

select * from user;
select * from kelas;
select * from siswa;
select * from isi_kelas;
select * from tentang_siswa;
select * from tempat_tinggal_siswa;
select * from kehadiran;
select * from mapel_sikap;
select * from mapel_keterampilan;
select * from mapel_pengetahuan;


select kelas.kelas_id, siswa.siswa_id from siswa join isi_kelas on siswa.siswa_id = isi_kelas.siswa_id join kelas on isi_kelas.kelas_id = kelas.kelas_id where siswa.jenis_kelamin = 'Perempuan';

select count(siswa_id) from siswa where jenis_kelamin = 'laki-laki';