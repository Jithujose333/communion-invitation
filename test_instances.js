const fs = require('fs');
const path = require('path');
const https = require('https');

const targetUrl = 'https://youtu.be/Hh6KeSAOu5A';
const dest = path.join(__dirname, 'frontend', 'public', 'communion_song.mp3');

const instances = [
  'apicobalt.mgytr.top',
  'api.qwkuns.me',
  'melon.clxxped.lol',
  'lime.clxxped.lol',
  'nuko-c.meowing.de',
  'subito-c.meowing.de'
];

const postData = JSON.stringify({
  url: targetUrl,
  downloadMode: 'audio',
  audioFormat: 'mp3',
  youtubeVideoCodec: 'h264'
});

async function testInstance(hostname) {
  return new Promise((resolve) => {
    console.log(`Testing instance: ${hostname}...`);
    
    const req = https.request({
      hostname: hostname,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 5000
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.status === 'redirect' || data.status === 'stream' || data.url) {
            console.log(`SUCCESS! Instance ${hostname} returned download URL.`);
            resolve({ success: true, url: data.url });
          } else {
            console.log(`Failed for ${hostname}:`, data.error?.code || body.substring(0, 100));
            resolve({ success: false });
          }
        } catch (e) {
          console.log(`Parsing failed for ${hostname}:`, e.message);
          resolve({ success: false });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`Request error for ${hostname}:`, err.message);
      resolve({ success: false });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`Timeout for ${hostname}`);
      resolve({ success: false });
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const inst of instances) {
    const result = await testInstance(inst);
    if (result.success && result.url) {
      console.log(`Starting download from URL: ${result.url}`);
      const file = fs.createWriteStream(dest);
      
      const downloadFile = (url) => {
        https.get(url, (fileRes) => {
          if (fileRes.statusCode === 302 || fileRes.statusCode === 301) {
            console.log('Redirected to:', fileRes.headers.location);
            downloadFile(fileRes.headers.location);
            return;
          }
          
          fileRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Download complete! Saved to:', dest);
            process.exit(0);
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => {});
          console.error('Error downloading file:', err.message);
        });
      };
      
      downloadFile(result.url);
      return;
    }
  }
  console.log('No working Cobalt instances found.');
}

run();
