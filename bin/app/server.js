const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const project = require('../../package.json');
const jwtAuth = require('../auth/jwt_auth_helper');
const basicAuth = require('../auth/basic_auth_helper');
const wrapper = require('../helpers/utils/wrapper');
const userHandler = require('../modules/user/handlers/api_handler');
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
  this.server.post('/admin/v1/login', basicAuth.isAuthenticated, userHandler.postDataLogin);
  this.server.post('/admin/v1/register', basicAuth.isAuthenticated, userHandler.registerUser);

  //kelas
  this.server.post('/kelas/v1/add', jwtAuth.verifyToken, userHandler.addClass);
  this.server.get('/kelas/v1/all', jwtAuth.verifyToken, userHandler.getAllClass);

  //siswa Get
  this.server.get('/siswa/v1/all', jwtAuth.verifyToken, userHandler.getAllSiswa);
  this.server.get('/siswa/v1/tentang-diri/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaTentangDiri);
  this.server.get('/siswa/v1/tempat-tinggal/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaTempatTinggal);
  this.server.get('/siswa/v1/pendidikan/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaPendidikan);
  this.server.get('/siswa/v1/kesehatan/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaKesehatan);
  this.server.get('/siswa/v1/hobi/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaHobi);
  this.server.get('/siswa/v1/orang-tua/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaOrangTua);
  this.server.get('/siswa/v1/pindah/:siswa_id', jwtAuth.verifyToken, userHandler.getSiswaPindah);
  this.server.get('/siswa/v1/kompetensi', jwtAuth.verifyToken, userHandler.getSiswaKompetensi);

  //siswa post
  this.server.post('/siswa/v1/tentang-diri', jwtAuth.verifyToken, userHandler.addTentangDiri);
  this.server.post('/siswa/v1/tempat-tinggal', jwtAuth.verifyToken, userHandler.addTempatTinggal);
  this.server.post('/siswa/v1/pendidikan', jwtAuth.verifyToken, userHandler.addPendidikan);
  this.server.post('/siswa/v1/kesehatan', jwtAuth.verifyToken, userHandler.addKesehatan);
  this.server.post('/siswa/v1/hobi', jwtAuth.verifyToken, userHandler.addHobi);
  this.server.post('/siswa/v1/orang-tua', jwtAuth.verifyToken, userHandler.addOrangTua);
  this.server.post('/siswa/v1/pindah', jwtAuth.verifyToken, userHandler.addPindah);
  this.server.post('/siswa/v1/kompetensi', jwtAuth.verifyToken, userHandler.addKompetensi);

  //guru
  this.server.get('/guru/v1/all', jwtAuth.verifyToken, userHandler.getAllGuru);
  this.server.get('/guru/v1/detail/:guru_id', jwtAuth.verifyToken, userHandler.getGuru);
  this.server.post('/guru/v1/', jwtAuth.verifyToken, userHandler.addGuru);

  //tenaga ahli
  this.server.get('/tenaga-ahli/v1/all', jwtAuth.verifyToken, userHandler.getAllTenagaAhli);
  this.server.get('/tenaga-ahli/v1/detail/:tenaga_ahli_id', jwtAuth.verifyToken, userHandler.getTenagaAhli);
  this.server.post('/tenaga-ahli/v1/', jwtAuth.verifyToken, userHandler.addTenagaAhli);

  //addOns
  this.server.get('/siswa/v1/', jwtAuth.verifyToken, userHandler.getSiswaData);
  this.server.get('/kelas/v1/list-kelas', jwtAuth.verifyToken, userHandler.getListKelas);
  this.server.post('/siswa/v1/import', jwtAuth.verifyToken, userHandler.importSiswa);


  //Initiation
  mongoConnectionPooling.init();
}

module.exports = AppServer;
