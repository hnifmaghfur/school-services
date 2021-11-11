const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const project = require('../../package.json');
const jwtAuth = require('../auth/jwt_auth_helper');
const basicAuth = require('../auth/basic_auth_helper');
const wrapper = require('../helpers/utils/wrapper');
const handler = require('../modules/handlers/api_handler');
const mongoConnectionPooling = require('../helpers/databases/mongodb/connection');

function AppServer() {
  this.server = restify.createServer({
    name: `${project.name}-server`,
    version: project.version
  });

  this.server.serverKey = '';
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser());
  this.server.use(restify.plugins.authorizationParser());
  this.server.get('/public/*', restify.plugins.serveStatic({
    directory: __dirname
  }));

  // required for CORS configuration
  const corsConfig = corsMiddleware({
    // preflightMaxAge: 5,
    origins: ['*'],
    // ['*'] -> to expose all header, any type header will be allow to access
    // X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
  });

  this.server.pre(corsConfig.preflight);
  this.server.use(corsConfig.actual);

  // anonymous can access the end point, place code bellow
  this.server.get('/', (req, res) => {
    wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
  });

  // authenticated client can access the end point, place code bellow
  //admin
  this.server.post('/admin/v1/login', basicAuth.isAuthenticated, handler.postDataLogin);
  this.server.post('/admin/v1/register', basicAuth.isAuthenticated, handler.registerUser);

  //kelas
  this.server.post('/kelas/v1/add', jwtAuth.verifyToken, handler.addClass);
  this.server.get('/kelas/v1/all', jwtAuth.verifyToken, handler.getAllClass);
  this.server.get('/kelas/v1/one/:kelas_id', jwtAuth.verifyToken, handler.getOneClass);

  //siswa Get
  this.server.get('/siswa/v1/all', jwtAuth.verifyToken, handler.getAllSiswa);
  this.server.get('/siswa/v1/tentang-diri', jwtAuth.verifyToken, handler.getSiswaTentangDiri);
  this.server.get('/siswa/v1/tempat-tinggal', jwtAuth.verifyToken, handler.getSiswaTempatTinggal);
  this.server.get('/siswa/v1/pendidikan', jwtAuth.verifyToken, handler.getSiswaPendidikan);
  this.server.get('/siswa/v1/kesehatan', jwtAuth.verifyToken, handler.getSiswaKesehatan);
  this.server.get('/siswa/v1/hobi', jwtAuth.verifyToken, handler.getSiswaHobi);
  this.server.get('/siswa/v1/orang-tua', jwtAuth.verifyToken, handler.getSiswaOrangTua);
  this.server.get('/siswa/v1/pindah', jwtAuth.verifyToken, handler.getSiswaPindah);
  // this.server.get('/siswa/v1/bantuan/:siswa_id', jwtAuth.verifyToken, handler.getSiswaBantuan);
  this.server.get('/siswa/v1/kompetensi', jwtAuth.verifyToken, handler.getSiswaKompetensi);

  //siswa post
  this.server.post('/siswa/v1/tentang-diri', jwtAuth.verifyToken, handler.addTentangDiri);
  this.server.post('/siswa/v1/tempat-tinggal', jwtAuth.verifyToken, handler.addTempatTinggal);
  this.server.post('/siswa/v1/pendidikan', jwtAuth.verifyToken, handler.addPendidikan);
  this.server.post('/siswa/v1/kesehatan', jwtAuth.verifyToken, handler.addKesehatan);
  this.server.post('/siswa/v1/hobi', jwtAuth.verifyToken, handler.addHobi);
  this.server.post('/siswa/v1/orang-tua', jwtAuth.verifyToken, handler.addOrangTua);
  this.server.post('/siswa/v1/pindah', jwtAuth.verifyToken, handler.addPindah);
  this.server.post('/siswa/v1/kompetensi', jwtAuth.verifyToken, handler.addKompetensi);
  this.server.post('/siswa/v1/bantuan', jwtAuth.verifyToken, handler.addBantuan);

  //guru
  this.server.get('/guru/v1/all', jwtAuth.verifyToken, handler.getAllGuru);
  this.server.get('/guru/v1/detail/:guru_id', jwtAuth.verifyToken, handler.getGuru);
  this.server.post('/guru/v1/add', jwtAuth.verifyToken, handler.addGuru);

  //tenaga ahli
  this.server.get('/tenaga-ahli/v1/all', jwtAuth.verifyToken, handler.getAllTenagaAhli);
  this.server.get('/tenaga-ahli/v1/detail/:tenaga_ahli_id', jwtAuth.verifyToken, handler.getTenagaAhli);
  this.server.post('/tenaga-ahli/v1/add', jwtAuth.verifyToken, handler.addTenagaAhli);

  //addOns
  this.server.get('/siswa/v1/', jwtAuth.verifyToken, handler.getSiswaData);
  this.server.patch('/item/v1/delete', jwtAuth.verifyToken, handler.deleteData);
  this.server.post('/siswa/v1/alumni', jwtAuth.verifyToken, handler.switchAlumni);
  this.server.get('/kelas/v1/list-kelas', jwtAuth.verifyToken, handler.getListKelas);
  this.server.get('/kelas/v1/kompetensi/:siswa_id', jwtAuth.verifyToken, handler.getKelasKompetensi);
  this.server.post('/siswa/v1/import', jwtAuth.verifyToken, handler.importSiswa);
  this.server.post('/siswa/v1/export-raport', jwtAuth.verifyToken, handler.exportRaport);
  this.server.get('/kelas/v1/rekapitulasi', jwtAuth.verifyToken, handler.getRekapitulasi);

  //Initiation
  mongoConnectionPooling.init();
}

module.exports = AppServer;
