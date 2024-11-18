const express = require('express');
const path = require('path');
const api = require('./routes/api');

const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL; // dodano
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000; // dodano

//app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static('public'));

app.use('/api', api);

/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/ // -> zamijenjeno s novim kodom za render

if (externalUrl) {
  const hostname = '0.0.0.0'; //ne 127.0.0.1
  app.listen(port, hostname, () => {
  console.log(`Server locally running at http://${hostname}:${port}/ and from 
  outside on ${externalUrl}`);
  });
} else {
  https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function () {
  console.log(`Server running at https://localhost:${port}/`);
  });
}