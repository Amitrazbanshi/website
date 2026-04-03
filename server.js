require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'Assert/images');
    const fs = require('fs');
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

// GET all content for public display
app.get('/api/content', async (req, res) => {
  try {
    const [gallery, services, skills, testimonials] = await Promise.all([
      prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.service.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.skill.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    ]);
    
    res.json({ gallery, services, skills, testimonials });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GALLERY ENDPOINTS
app.post('/api/gallery', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const newItem = await prisma.galleryItem.create({
      data: {
        src: req.file ? 'Assert/images/' + req.file.filename : (req.body.src || ''),
        alt: req.body.alt || 'Gallery Image',
        overlay: req.body.overlay || '',
        class: req.body.class || 'h-half',
        style: req.body.style || ''
      }
    });
    res.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/gallery/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    const updateData = {};
    if (req.file) updateData.src = 'Assert/images/' + req.file.filename;
    if (req.body.alt) updateData.alt = req.body.alt;
    if (req.body.overlay) updateData.overlay = req.body.overlay;
    
    const updatedItem = await prisma.galleryItem.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    res.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
  try {
    await prisma.galleryItem.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SERVICES ENDPOINTS
app.post('/api/services', requireAuth, async (req, res) => {
  try {
    const newService = await prisma.service.create({
      data: {
        icon: req.body.icon,
        title: req.body.title,
        desc: req.body.desc
      }
    });
    res.json({ success: true, item: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/services/:id', requireAuth, async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SKILLS ENDPOINTS
app.post('/api/skills', requireAuth, async (req, res) => {
  try {
    const newSkill = await prisma.skill.create({
      data: {
        name: req.body.name,
        pct: parseInt(req.body.pct)
      }
    });
    res.json({ success: true, item: newSkill });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/skills/:id', requireAuth, async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// TESTIMONIALS ENDPOINTS
app.post('/api/testimonials', requireAuth, async (req, res) => {
  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        quote: req.body.quote,
        avatar: req.body.avatar,
        name: req.body.name,
        role: req.body.role
      }
    });
    res.json({ success: true, item: newTestimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/testimonials/:id', requireAuth, async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// FEEDBACK ENDPOINT
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
      }
    });
    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all feedback (admin only)
app.get('/api/feedback', requireAuth, async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
