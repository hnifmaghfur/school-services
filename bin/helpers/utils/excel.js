/* eslint-disable no-irregular-whitespace */
const excel4node = require('excel4node');
const excelJs = require('exceljs');
const style = require('./excelStyle');

const templateExcel = async (payload) => {
  const excelData = payload;
  const title = 'III.  LAPORAN CAPAIAN KOMPETENSI PESERTA DIDIK';
  const wb = new excel4node.Workbook();
  const ws = wb.addWorksheet('Raport');
  ws.row(3).freeze();
  ws.column(1).setWidth(3.11);
  ws.column(2).setWidth(5);
  ws.column(3).setWidth(5);
  ws.column(4).setWidth(15);
  ws.column(6).setWidth(30);
  ws.column(7).setWidth(15);
  ws.column(8).setWidth(30);
  ws.column(9).setWidth(30);
  ws.column(11).setWidth(25);
  ws.column(12).setWidth(25);
  ws.column(13).setWidth(25);
  ws.column(14).setWidth(25);
  ws.column(15).setWidth(20);
  ws.column(16).setWidth(35);
  ws.row(3).setHeight(20);
  const tableTitle = wb.createStyle(style.tTitleStyle);
  const tableHeader = wb.createStyle(style.tHeaderStyle);

  ws.cell(1, 1, 1, 33, true).string(title).style(tableTitle);
  ws.cell(3, 1, 3, 1, true).string('NO').style(tableHeader);
  ws.cell(3, 2, 3, 2, true).string('Ticket').style(tableHeader);
  ws.cell(3, 3, 3, 3, true).string('Date Created').style(tableHeader);
  ws.cell(3, 4, 3, 4, true).string('Tower').style(tableHeader);
  ws.cell(3, 5, 3, 5, true).string('Unit').style(tableHeader);
  ws.cell(3, 6, 3, 6, true).string('Tenant Name').style(tableHeader);
  ws.cell(3, 7, 3, 7, true).string('Tenant Phone Number').style(tableHeader);
  ws.cell(3, 8, 3, 8, true).string('Complaint').style(tableHeader);
  ws.cell(3, 9, 3, 9, true).string('Description').style(tableHeader);
  ws.cell(3, 10, 3, 10, true).string('Category').style(tableHeader);
  ws.cell(3, 11, 3, 14, true).string('Status').style(tableHeader);
  ws.cell(3, 15, 3, 15, true).string('Engineer Name').style(tableHeader);
  ws.cell(3, 16, 3, 16, true).string('Engineer Solution').style(tableHeader);

  return wb;
};

const templateExcelJs = async (payload) => {
  const { data, siswaData, kelasData } = payload;
  const template = './excel/template_raport.xlsx';
  try {
    let tempData = [];
    let wb = new excelJs.Workbook();
    await wb.xlsx.readFile(template);
    let ws = wb.getWorksheet('Raport');
    let tempWS = wb.getWorksheet('option');

    //konten row 3
    ws.mergeCells('F3:K3');
    ws.mergeCells('Q3:S3');
    ws.mergeCells('X3:AA3');
    ws.getCell('F3').value = siswaData.nama;
    ws.getCell('Q3').value = siswaData.nis;
    ws.getCell('X3').value = siswaData.nisn;
    ws.getRow(3).commit();


    //content nilai
    data.map((item, index) => {
      const rPengetahuan = 8 + (index * 3);
      const rKeterampilan = 9 + (index * 3);
      const rSikap = 10 + (index * 3);

      tempData.push({
        position: rPengetahuan,
        namaKelas: item.namaKelas
      });

      //kelompok A
      for (let i = 3; i <= 8; i++) {
        const name = tempWS.getCell(`A${i}`).value;
        item.kelompokA.map(value => {
          if (value.mapel == name) {
            const row = ws.getRow(parseInt(tempWS.getCell(`B${i}`).value));
            const peng = row.getCell(rPengetahuan);
            const ket = row.getCell(rKeterampilan);
            const sik = row.getCell(rSikap);
            peng.value = value.nilai;
            ket.value = value.keterangan;
            sik.value = '';
            peng.alignment = { vertical: 'middle', horizontal: 'center' };
            peng.font = { bold: true };
            ket.alignment = { vertical: 'middle', horizontal: 'center' };
            ket.font = { bold: true };
            sik.alignment = { vertical: 'middle', horizontal: 'center' };
            sik.font = { bold: true };
            row.commit();
          }
        });
      }

      //kelompok B
      for (let i = 11; i <= 13; i++) {
        const name = tempWS.getCell(`A${i}`).value;
        item.kelompokB.map(value => {
          if (value.mapel == name) {
            const row = ws.getRow(parseInt(tempWS.getCell(`B${i}`).value));
            const peng = row.getCell(rPengetahuan);
            const ket = row.getCell(rKeterampilan);
            const sik = row.getCell(rSikap);
            peng.value = value.nilai;
            ket.value = value.keterangan;
            sik.value = '';
            peng.alignment = { vertical: 'middle', horizontal: 'center' };
            peng.font = { bold: true };
            ket.alignment = { vertical: 'middle', horizontal: 'center' };
            ket.font = { bold: true };
            sik.alignment = { vertical: 'middle', horizontal: 'center' };
            sik.font = { bold: true };
            row.commit();
          }
        });
      }

      //kelompok C
      for (let i = 16; i <= 23; i++) {
        const name = tempWS.getCell(`A${i}`).value;
        item.kelompokC.map(value => {
          if (value.mapel == name) {
            const row = ws.getRow(parseInt(tempWS.getCell(`B${i}`).value));
            const peng = row.getCell(rPengetahuan);
            const ket = row.getCell(rKeterampilan);
            const sik = row.getCell(rSikap);
            peng.value = value.nilai;
            ket.value = value.keterangan;
            sik.value = '';
            peng.alignment = { vertical: 'middle', horizontal: 'center' };
            peng.font = { bold: true };
            ket.alignment = { vertical: 'middle', horizontal: 'center' };
            ket.font = { bold: true };
            sik.alignment = { vertical: 'middle', horizontal: 'center' };
            sik.font = { bold: true };
            row.commit();
          }
        });
      }

      //kelompok C Lintas
      for (let i = 26; i <= 37; i++) {
        const name = tempWS.getCell(`A${i}`).value;
        item.kelompokCLintas.map(value => {
          if (value.mapel == name) {
            const row = ws.getRow(parseInt(tempWS.getCell(`B${i}`).value));
            const peng = row.getCell(rPengetahuan);
            const ket = row.getCell(rKeterampilan);
            const sik = row.getCell(rSikap);
            peng.value = value.nilai;
            ket.value = value.keterangan;
            sik.value = '';
            peng.alignment = { vertical: 'middle', horizontal: 'center' };
            peng.font = { bold: true };
            ket.alignment = { vertical: 'middle', horizontal: 'center' };
            ket.font = { bold: true };
            sik.alignment = { vertical: 'middle', horizontal: 'center' };
            sik.font = { bold: true };
            row.commit();
          }
        });
      }

      //Absen
      const alpha = ws.getRow(42);
      const izin = ws.getRow(43);
      const sakit = ws.getRow(44);

      alpha.getCell(rPengetahuan).value = item.absen.alpha + ' Hari';
      izin.getCell(rPengetahuan).value = item.absen.izin + ' Hari';
      sakit.getCell(rPengetahuan).value = item.absen.sakit + ' Hari';

      alpha.commit();
      izin.commit();
      sakit.commit();

    });

    //semester dan kelas
    const ids = tempData.map(i => i.namaKelas);
    const tempKelas = tempData.filter(({ namaKelas }, index) => !ids.includes(namaKelas, index + 1));

    tempKelas.map(item => {
      kelasData.map(value => {
        if (item.namaKelas == value.namaKelas) {
          const tahunAjaran = ws.getRow(5);
          const namaKelas = ws.getRow(6);
          tahunAjaran.getCell(item.position).value = value.tahunAjaran;
          namaKelas.getCell(item.position).value = value.namaKelas;
          tahunAjaran.commit();
          namaKelas.commit();
        }
      });
    });

    wb.removeWorksheet('option');

    //local
    // const saveFile = `./excel/download/${siswaData.nisn + '_' + siswaData.nama}.xlsx`;
    // wb.xlsx.writeFile(saveFile);
    // return { data: saveFile, err: '' };

    const buffer = await wb.xlsx.writeBuffer();
    return { data: buffer, err: '' };

  } catch (err) {
    return { data: '', err };
  }

};

const templateExcelSiswa = async (payload) => {
  const { header, data } = payload;
  const template = './excel/template_siswa.xlsx';
  try {
    let wb = new excelJs.Workbook();
    await wb.xlsx.readFile(template);
    let ws = wb.getWorksheet('Sheet1');

    //content header
    ws.mergeCells('E3:H3');
    ws.mergeCells('E4:H4');
    ws.mergeCells('E5:H5');
    ws.mergeCells('E6:H6');
    ws.getCell('A1').value = header.tahun;
    ws.getCell('E3').value = header.namaKepala;
    ws.getCell('E4').value = header.nipKepala;
    ws.getCell('E5').value = header.namaWKelas;
    ws.getCell('E6').value = header.nipWKelas;
    ws.getCell('M3').value = header.bulan.toUpperCase();
    ws.getCell('M6').value = header.jurusan;

    //content body
    data.map((item, index) => {
      ws.getCell(`A${13 + index}`).value = index + 1;
      ws.getCell(`B${13 + index}`).value = item.nama_kelas;
      ws.getCell(`C${13 + index}`).value = item.nis;
      ws.getCell(`D${13 + index}`).value = item.nisn;
      ws.getCell(`E${13 + index}`).value = item.nama;
      ws.getCell(`F${13 + index}`).value = item.ttl;
      ws.getCell(`G${13 + index}`).value = item.jk;
      ws.getCell(`H${13 + index}`).value = item.agama;
      ws.getCell(`I${13 + index}`).value = item.alamat;
      ws.getCell(`J${13 + index}`).value = item.nama_ayah;
      ws.getCell(`K${13 + index}`).value = item.pekerjaan_ayah;
      ws.getCell(`L${13 + index}`).value = item.noTelp_ayah;
      ws.getCell(`M${13 + index}`).value = item.nama_ibu;
      ws.getCell(`N${13 + index}`).value = item.pekerjaan_ibu;
    });

    // const saveFile = `./excel/download/${header.namaKelas}.xlsx`;
    // wb.xlsx.writeFile(saveFile);
    // return { data: saveFile, err: '' };

    const buffer = await wb.xlsx.writeBuffer();
    return { data: buffer, err: '' };

  } catch (err) {
    return { data: '', err };
  }

};

const templateExcelDataSiswa = async (payload) => {
  const data = payload;
  const template = './excel/template_data_siswa.xlsx';
  const siswa = data.tentang;
  const alamat = data.alamat;
  const ayah = data.orangtua.ayah;
  const ibu = data.orangtua.ibu;
  const wali = data.orangtua.wali;
  const pendidikan = data.pendidikan;
  const kesehatan = data.kesehatan;
  const hobi = data.hobi;
  const pindah = data.pindah;

  try {
    let wb = new excelJs.Workbook();
    await wb.xlsx.readFile(template);
    let ws = wb.getWorksheet('Buku Induk Siswa');

    //content siswa
    ws.getCell('E3').value = siswa.NIS;
    ws.getCell('N3').value = siswa.NISN;
    ws.getCell('F7').value = siswa.nama_lengkap;
    ws.getCell('F8').value = siswa.nama_panggilan;
    ws.getCell('F9').value = siswa.ttl;
    ws.getCell('F10').value = siswa.jenis_kelamin;
    ws.getCell('F11').value = siswa.agama;
    ws.getCell('F12').value = siswa.anak_ke;
    ws.getCell('F13').value = siswa.jml_sdr_kandung;
    ws.getCell('F14').value = siswa.jml_sdr_tiri;
    ws.getCell('F15').value = siswa.jml_sdr_angkat;
    ws.getCell('F16').value = siswa.status_anak;
    ws.getCell('F17').value = siswa.bahasa;
    ws.getCell('F18').value = siswa.pihak_dihubungi;
    ws.getCell('F19').value = siswa.penanggung_biaya;

    //constent alamat
    ws.getCell('F23').value = alamat.alamat;
    ws.getCell('F24').value = alamat.no_telephone;
    ws.getCell('F25').value = alamat.tinggal_di;
    ws.getCell('F26').value = alamat.jarak_ke_sekolah;

    //content pendidikan
    ws.getCell('F29').value = pendidikan.tanggal_diterima;
    ws.getCell('F31').value = pendidikan.lulus_dari;
    ws.getCell('F32').value = pendidikan.tanggal_no_ijazah;
    ws.getCell('F33').value = pendidikan.tanggal_no_stl;
    ws.getCell('F34').value = pendidikan.lama_belajar;
    ws.getCell('F35').value = pendidikan.nilai_skhun;

    //content kesehatan
    ws.getCell('F38').value = kesehatan.gol_darah;
    ws.getCell('F39').value = kesehatan.kelainan_jasmani;
    ws.getCell('F40').value = kesehatan.tinggi_berat_badan;
    ws.getCell('F42').value = kesehatan.nama_penyakit;
    ws.getCell('F43').value = kesehatan.tahun_sakit;
    ws.getCell('F44').value = kesehatan.lama_sakit;

    //content hobi
    ws.getCell('F47').value = hobi.olahraga;
    ws.getCell('F48').value = hobi.seni;
    ws.getCell('F49').value = hobi.organisasi;
    ws.getCell('F50').value = hobi.lain;

    //content orangtua
    //ayah
    ws.getCell('F54').value = ayah.nama || '-';
    ws.getCell('F55').value = ayah.TTL || '-';
    ws.getCell('F56').value = ayah.agama || '-';
    ws.getCell('F57').value = ayah.kewarganegaraan || '-';
    ws.getCell('F58').value = ayah.pendidikan || '-';
    ws.getCell('F59').value = ayah.pekerjaan || '-';
    ws.getCell('M5').value = ayah.gol_pekerjaan || '-';
    ws.getCell('M6').value = ayah.penghasilan || '-';
    ws.getCell('M7').value = ayah.alamat || '-';
    ws.getCell('M9').value = ayah.no_telpon || '-';
    ws.getCell('M10').value = ayah.status || '-';
    ws.getCell('M11').value = ayah.status_nikah || '-';
    ws.getCell('M12').value = ayah.tahun_meninggal || '-';

    //ibu
    ws.getCell('M15').value = ibu.nama || '-';
    ws.getCell('M16').value = ibu.TTL || '-';
    ws.getCell('M17').value = ibu.agama || '-';
    ws.getCell('M18').value = ibu.kewarganegaraan || '-';
    ws.getCell('M19').value = ibu.pendidikan || '-';
    ws.getCell('M20').value = ibu.pekerjaan || '-';
    ws.getCell('M21').value = ibu.gol_pekerjaan || '-';
    ws.getCell('M22').value = ibu.penghasilan || '-';
    ws.getCell('M23').value = ibu.alamat || '-';
    ws.getCell('M24').value = ibu.no_telpon || '-';
    ws.getCell('M25').value = ibu.status || '-';
    ws.getCell('M26').value = ibu.status_nikah || '-';
    ws.getCell('M27').value = ibu.tahun_meninggal || '-';

    //wali
    ws.getCell('M30').value = wali.nama || '-';
    ws.getCell('M31').value = wali.TTL || '-';
    ws.getCell('M32').value = wali.agama || '-';
    ws.getCell('M33').value = wali.kewarganegaraan || '-';
    ws.getCell('M34').value = wali.pendidikan || '-';
    ws.getCell('M35').value = wali.pekerjaan || '-';
    ws.getCell('M36').value = wali.gol_pekerjaan || '-';
    ws.getCell('M37').value = wali.penghasilan || '-';
    ws.getCell('M38').value = wali.alamat || '-';
    ws.getCell('M40').value = wali.no_telpon || '-';
    ws.getCell('M41').value = wali.hubungan_wali || '-';


    //content pindahan
    ws.getCell('M45').value = pindah.pindah_sekolah;
    ws.getCell('M46').value = pindah.pindah_alasan;
    ws.getCell('M49').value = pindah.diterima_di;
    ws.getCell('M50').value = pindah.diterima_program;
    ws.getCell('M53').value = pindah.meninggalkan_di;
    ws.getCell('M54').value = pindah.meninggalkan_program;
    ws.getCell('M55').value = pindah.meninggalkan_alasan;
    ws.getCell('M58').value = pindah.akhir_tamat_belajar;
    ws.getCell('M59').value = pindah.akhir_sttb;



    const saveFile = `./excel/download/${siswa.NISN + '_DATA_' + siswa.nama_lengkap}.xlsx`;
    wb.xlsx.writeFile(saveFile);
    return { data: saveFile, err: '' };

    // const buffer = await wb.xlsx.writeBuffer();
    // return { data: buffer, err: '' };

  } catch (err) {
    return { data: '', err };
  }

};

module.exports = {
  templateExcel,
  templateExcelJs,
  templateExcelSiswa,
  templateExcelDataSiswa,
};
