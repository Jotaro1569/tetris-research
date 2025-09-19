// scripts/download-geoip-db.js
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const tar = require('tar');

const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY;
const DB_PATH = path.join(process.cwd(), 'GeoLite2-Country.mmdb');

async function downloadGeoIPDB() {
  if (!MAXMIND_LICENSE_KEY) {
    console.error('MAXMIND_LICENSE_KEY environment variable is required');
    process.exit(1);
  }

  // Check if database already exists and is recent (less than 7 days old)
  if (fs.existsSync(DB_PATH)) {
    const stats = fs.statSync(DB_PATH);
    const age = Date.now() - stats.mtime.getTime();
    const daysSinceModified = age / (1000 * 60 * 60 * 24);
    
    if (daysSinceModified < 7) {
      console.log('Database is recent, skipping download');
      return;
    }
  }

  console.log('Downloading MaxMind GeoLite2-Country database...');
  
  const url = `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const tempPath = path.join(process.cwd(), 'temp-geoip.tar.gz');
      const fileStream = fs.createWriteStream(tempPath);
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        console.log('Download complete, extracting...');
        
        // Extract the tar.gz file
        tar.extract({
          file: tempPath,
          cwd: process.cwd(),
          filter: (path) => path.endsWith('.mmdb')
        }).then(() => {
          // Find the extracted .mmdb file
          const extractedFiles = fs.readdirSync(process.cwd())
            .filter(file => file.startsWith('GeoLite2-Country_'))
            .map(dir => {
              const mmdbPath = path.join(process.cwd(), dir, 'GeoLite2-Country.mmdb');
              if (fs.existsSync(mmdbPath)) {
                return mmdbPath;
              }
              return null;
            })
            .filter(Boolean);

          if (extractedFiles.length > 0) {
            // Move the .mmdb file to the root directory
            fs.copyFileSync(extractedFiles[0], DB_PATH);
            console.log('Database extracted successfully');
            
            // Clean up extracted directory and temp file
            const extractedDir = path.dirname(extractedFiles[0]);
            fs.rmSync(extractedDir, { recursive: true, force: true });
            fs.unlinkSync(tempPath);
            
            resolve();
          } else {
            reject(new Error('Could not find .mmdb file in extracted archive'));
          }
        }).catch(reject);
      });
      
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

if (require.main === module) {
  downloadGeoIPDB()
    .then(() => {
      console.log('GeoIP database ready');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to download GeoIP database:', error);
      process.exit(1);
    });
}

module.exports = downloadGeoIPDB;