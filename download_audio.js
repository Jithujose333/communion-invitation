const fs = require('fs');
const path = require('path');
const https = require('https');

const targetUrl = 'https://youtu.be/Hh6KeSAOu5A';
const dest = path.join(__dirname, 'frontend', 'public', 'communion_song.mp3');

console.log('Requesting download link from Cobalt tools API...');

const postData = JSON.stringify({
  url: targetUrl,
  downloadMode: 'audio',
  audioFormat: 'mp3',
  youtubeVideoCodec: 'h264'
});

const req = https.request({
  hostname: 'subito-c.meowing.de',
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let body = '';
  console.log('API Status Code:', res.statusCode);
  console.log('API Response Headers:', res.headers);
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('API Response status:', data.status);
      if (data.status === 'redirect' || data.status === 'stream' || data.url) {
        const downloadUrl = data.url;
        console.log('Downloading file from URL...');
        
        const file = fs.createWriteStream(dest);
        
        // Handle potential redirects for downloading
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
            });
          }).on('error', (err) => {
            fs.unlink(dest, () => {});
            console.error('Error downloading file:', err.message);
          });
        };
        
        downloadFile(downloadUrl);
      } else {
        console.error('Error: Unexpected status from Cobalt:', body);
      }
    } catch (err) {
      console.error('Error parsing response:', err.message, body);
    }
  });
});

req.on('error', (err) => {
  console.error('API Request error:', err.message);
});

req.write(postData);
req.end();
