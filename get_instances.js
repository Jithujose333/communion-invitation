const https = require('https');

https.get('https://cobalt.directory/api/working?type=api', (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('API List:');
      console.log(JSON.stringify(data.data || data, null, 2));
    } catch (e) {
      console.log('Error parsing:', e.message, body);
    }
  });
});
