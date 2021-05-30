const crypto = require('crypto');
const iv = crypto.randomBytes(16);

class Key {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }
  generateKey() {
    let newKey = crypto.createHash('sha256').update(String(this.secretKey)).digest('base64').substr(0, 32);
    return newKey;
  }
}

const getLastFromURL = async (url) => {
  let name = decodeURI(url).split('/').pop();
  name = name.replace(/(\r\n|\n|\r)/gm, '');
  return String(name);
};

const encrypt = async (text, algorithm, secretKey) => {
  const key = new Key(secretKey);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key.generateKey()), iv);
  let crypted = cipher.update(text);
  crypted = Buffer.concat([crypted, cipher.final()]);
  return iv.toString('hex') + ':' + crypted.toString('hex');
};

const decrypt = async (text, algorithm, secretKey) => {
  const key = new Key(secretKey);
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key.generateKey()), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
module.exports = {
  getLastFromURL,
  encrypt,
  decrypt
};
