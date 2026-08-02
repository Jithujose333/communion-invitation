const https = require('https');

https.get('https://api.vevioz.com/apis/single/mp3?url=https://youtu.be/Hh6KeSAOu5A', (res) => {
  let body = '';
  console.log('Status:', res.statusCode);
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('Body snippet:', body.substring(0, 500));
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
