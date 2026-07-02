const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const beritaList = [
  {
    slug: 'article-submission-camp',
    tanggal: '27 Juni 2026',
    judul: 'LPPM Universitas Diponegoro Selenggarakan Kegiatan Article Submission Camp',
    ringkasan:
      'Kegiatan ini mendorong peningkatan publikasi internasional melalui pendampingan intensif.',
    gambar:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    sumber:
      'https://lppm.undip.ac.id/2026/06/27/lppm-universitas-diponegoro-selenggarakan-kegiatan-article-subsmission-camp-untuk-dorong-peningkatan-publikasi-internasional/'
  },
  {
    slug: 'hibah-pengabdian',
    tanggal: '30 Juni 2026',
    judul: 'Pengumuman Hibah Pengabdian Masyarakat',
    ringkasan:
      'Program hibah dibuka untuk mendorong dampak langsung kepada masyarakat sekitar kampus.',
    gambar:
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
    sumber: 'https://lppm.undip.ac.id/'
  },
  {
    slug: 'seminar-luaran-penelitian',
    tanggal: '28 Juni 2026',
    judul: 'Seminar Luaran Penelitian',
    ringkasan:
      'Seminar ini menjadi wadah publikasi hasil penelitian dan kolaborasi antar dosen.',
    gambar:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    sumber: 'https://lppm.undip.ac.id/'
  }
];

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Beranda',
    beritaList
  });
});

app.get('/berita/:slug', (req, res) => {
  const berita = beritaList.find((item) => item.slug === req.params.slug);

  if (!berita) {
    return res.status(404).render('404-berita', {
      title: '404 - Berita Tidak Ditemukan',
      slug: req.params.slug
    });
  }

  return res.render('detail-berita', {
    title: berita.judul,
    berita
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
