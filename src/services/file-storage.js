const fs = require('fs');
const { storage } = require('pkgcloud');
const storageConfig = require('../config/storage');

const CONTAINER_NAME = 'guwuappspace1'; // NO ESTOY SEGURO de si este es el valor que debe tener

class FileStorage {
  constructor() {
    try {
      this.client = storage.createClient(storageConfig);
      console.log('storageConfig ', storageConfig);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Cloud file storage service could not be initialized. No upload or download support will be available. Error: ${e.message}`);
      this.noClientError = new Error('No cloud file storage service available');
    }
  }

  upload(fileData, remotePath) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        console.log('00000001');
        reject(this.noClientError);
      }
      console.log('1111111111');
      const writeStream = this.client.upload({ container: CONTAINER_NAME, remotePath });
      console.log('11222222222');
      writeStream.on('error', reject);
      console.log('111133333333333');
      writeStream.on('success', resolve);
      console.log('111144444444');
      const fileStream = fs.createReadStream(fileData.path);
      console.log('111115555555555555');
      fileStream.pipe(writeStream);
      console.log('11111666666666666');
    });
  }

  download(remotePath) {
    if (!this.client) {
      return Promise.reject(this.noClientError);
    }
    return this.client.download({ container: CONTAINER_NAME, remote: remotePath });
  }
}

module.exports = new FileStorage();
