const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Belajar Node.js',
    nama: 'Siswa SMA',
    pesan: 'Halo, ini HTML sederhana dari Handlebars.'
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
