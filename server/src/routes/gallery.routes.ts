import { Router, Request, Response } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { uploadToS3, deleteFromS3 } from '../lib/s3';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

router.get('/gallery/categories', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.galleryImage.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/gallery', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category as string;

    const images = await prisma.galleryImage.findMany({
      where,
      select: { id: true, title: true, category: true, alt: true, s3Url: true, date: true, displayOrder: true },
    });

    images.sort((a, b) => {
      const ao = a.displayOrder || 0;
      const bo = b.displayOrder || 0;
      if (ao === 0 && bo === 0) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (ao === 0) return 1;
      if (bo === 0) return -1;
      return ao - bo;
    });

    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.get('/admin/gallery', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const images = await prisma.galleryImage.findMany();
    images.sort((a, b) => {
      const ao = a.displayOrder || 0;
      const bo = b.displayOrder || 0;
      if (ao === 0 && bo === 0) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (ao === 0) return 1;
      if (bo === 0) return -1;
      return ao - bo;
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });
    const { category, alt, date, displayOrder } = req.body;
    if (!category) return res.status(400).json({ error: 'Category is required' });
    const title = req.body.title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[_\-]+/g, ' ');

    let s3Url: string;
    let s3Key: string;
    try {
      const result = await uploadToS3(req.file, 'gallery');
      s3Url = result.s3Url;
      s3Key = result.s3Key;
    } catch (uploadErr) {
      console.error('S3 upload failed:', uploadErr);
      return res.status(500).json({ error: 'Image upload failed. Check S3/storage credentials.' });
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        alt: alt?.trim() || title.trim(),
        s3Url,
        s3Key,
        date: date ? new Date(date) : new Date(),
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        uploadedBy: req.user?.id,
      },
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.put('/gallery/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, alt, date, displayOrder } = req.body;
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(category && { category: category.trim() }),
        ...(alt !== undefined && { alt: alt.trim() }),
        ...(date && { date: new Date(date) }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) || 0 }),
      },
    });
    res.json(image);
  } catch (err) {
    res.status(404).json({ error: 'Image not found' });
  }
});

router.patch('/gallery/:id/toggle', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const current = await prisma.galleryImage.findUnique({ where: { id: _req.params.id } });
    if (!current) return res.status(404).json({ error: 'Image not found' });

    const updated = await prisma.galleryImage.update({
      where: { id: _req.params.id },
      data: { isActive: !current.isActive },
    });
    res.json({ isActive: updated.isActive });
  } catch (err) {
    res.status(500).json({ error: 'Toggle failed' });
  }
});

router.delete('/gallery/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const image = await prisma.galleryImage.findUnique({ where: { id: req.params.id } });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await deleteFromS3(image.s3Key);
    await prisma.galleryImage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
