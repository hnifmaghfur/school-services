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

module.exports = {
  templateExcel,
  templateExcelJs,
};
