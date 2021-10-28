
const User = require('./domain');
const Mongo = require('../../../helpers/databases/mongodb/db');
const config = require('../../../infra/configs/global_config');
const db = new Mongo(config.get('/mongoDbUrl'));
const user = new User(db);

const getAllClass = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllClass(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getOneClass = async (payload) => {
  const getData = async () => {
    const result = await user.viewOneClass(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getListKelas = async () => {
  const getData = async () => {
    const result = await user.viewListKelas();
    return result;
  };
  const result = await getData();
  return result;
};
const getKelasKompetensi = async (payload) => {
  const getData = async () => {
    const result = await user.viewKelasKompetensi(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getAllSiswa = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllSiswa(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getAllGuru = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllGuru(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getAllTenagaAhli = async (payload) => {
  const getData = async () => {
    const result = await user.viewAllTenagaAhli(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getGuru = async (payload) => {
  const getData = async () => {
    const result = await user.viewGuru(payload);
    return result;
  };
  const result = await getData();
  return result;
};

const getTenagaAhli = async (payload) => {
  const getData = async () => {
    const result = await user.viewTenagaAhli(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaData = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaData(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaTentangDiri = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaTentangDiri(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaTempatTinggal = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaTempatTinggal(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaPendidikan = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaPendidikan(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaKesehatan = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaKesehatan(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaHobi = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaHobi(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaOrangTua = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaOrangTua(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaPindah = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaPindah(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getSiswaKompetensi = async (payload) => {
  const getData = async () => {
    const result = await user.viewSiswaKompetensi(payload);
    return result;
  };
  const result = await getData();
  return result;
};
const getRekapitulasi = async (payload) => {
  const getData = async () => {
    const result = await user.viewRekapitulasi(payload);
    return result;
  };
  const result = await getData();
  return result;
};

module.exports = {
  getOneClass,
  getAllClass,
  getListKelas,
  getKelasKompetensi,
  getAllGuru,
  getGuru,
  getTenagaAhli,
  getAllTenagaAhli,
  getAllSiswa,
  getSiswaData,
  getSiswaTentangDiri,
  getSiswaTempatTinggal,
  getSiswaPendidikan,
  getSiswaKesehatan,
  getSiswaHobi,
  getSiswaOrangTua,
  getSiswaPindah,
  getSiswaKompetensi,
  getRekapitulasi
};
