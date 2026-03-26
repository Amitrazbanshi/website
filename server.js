const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const dataFile = path.join(__dirname, 'data.json');
function getData() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'Assert/images');
    if (!fs.existsSync(uploadDir)){ fs.mkdirSync(uploadDir, { recursive: true }); }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// AUTH
const ADMIN_USER = 'amit';
const ADMIN_PASS = 'amit123';
const TOKEN = 'valid-admin-token-123';

app.post('/api/login', (req, res) => {
  if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
    res.json({ success: true, token: TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

function requireAuth(req, res, next) {
  if (req.headers.authorization === `Bearer ${TOKEN}`) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized' });
  }
}

app.get('/api/content', (req, res) => {
  res.json(getData());
});

app.post('/api/gallery', requireAuth, upload.single('image'), (req, res) => {
  const data = getData();
  const newItem = {
    id: Date.now(),
    src: req.file ? 'Assert/images/' + req.file.filename : (req.body.src || ''),
    alt: req.body.alt || 'Gallery Image',
    overlay: req.body.overlay || '',
    class: req.body.class || 'h-half',
    style: req.body.style || ''
  };
  data.gallery.push(newItem);
  saveData(data);
  res.json({ success: true, item: newItem });
});

app.put('/api/gallery/:id', requireAuth, upload.single('image'), (req, res) => {
  const data = getData();
  const index = data.gallery.findIndex(g => g.id == req.params.id);
  if (index !== -1) {
    if (req.file) data.gallery[index].src = 'Assert/images/' + req.file.filename;
    if (req.body.alt) data.gallery[index].alt = req.body.alt;
    if (req.body.overlay) data.gallery[index].overlay = req.body.overlay;
    saveData(data);
    res.json({ success: true, item: data.gallery[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/gallery/:id', requireAuth, (req, res) => {
  const data = getData();
  data.gallery = data.gallery.filter(i => i.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});

app.post('/api/services', requireAuth, (req, res) => {
  const data = getData();
  const newService = {
    id: Date.now(),
    icon: req.body.icon,
    title: req.body.title,
    desc: req.body.desc
  };
  data.services.push(newService);
  saveData(data);
  res.json({ success: true, item: newService });
});

app.delete('/api/services/:id', requireAuth, (req, res) => {
  const data = getData();
  data.services = data.services.filter(i => i.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});


app.post('/api/skills', requireAuth, (req, res) => {
  const data = getData();
  const newObj = { id: Date.now(), name: req.body.name, pct: req.body.pct };
  data.skills.push(newObj);
  saveData(data);
  res.json({ success: true, item: newObj });
});
app.delete('/api/skills/:id', requireAuth, (req, res) => {
  const data = getData();
  data.skills = data.skills.filter(i => i.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});

app.post('/api/testimonials', requireAuth, (req, res) => {
  const data = getData();
  const newObj = { id: Date.now(), quote: req.body.quote, avatar: req.body.avatar, name: req.body.name, role: req.body.role };
  data.testimonials.push(newObj);
  saveData(data);
  res.json({ success: true, item: newObj });
});
app.delete('/api/testimonials/:id', requireAuth, (req, res) => {
  const data = getData();
  data.testimonials = data.testimonials.filter(i => i.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});
// END NEW ENDPOINTS

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
