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

const PUBLIC_SELECT = {
  id: true, name: true, fatherName: true, gender: true, percentage: true,
  board: true, year: true, rollNumber: true, dob: true, admissionNo: true,
  photoUrl: true, className: true,
};

router.get('/results/years', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.studentResult.findMany({
      where: { isActive: true },
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' },
    });
    res.json(rows.map(r => r.year));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch years' });
  }
});

router.get('/results', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const board = (req.query.board as string) || 'CBSE';
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const where = { year, board, isActive: true };
    const [data, total] = await Promise.all([
      prisma.studentResult.findMany({
        where,
        orderBy: { percentage: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: PUBLIC_SELECT,
      }),
      prisma.studentResult.count({ where }),
    ]);

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

router.get('/admin/results', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const board = req.query.board as string | undefined;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    const where: any = {};
    if (year) where.year = year;
    if (board) where.board = board;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      prisma.studentResult.findMany({
        where,
        orderBy: { percentage: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.studentResult.count({ where }),
    ]);

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

router.post('/results', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, fatherName, gender, percentage, board, year, rollNumber, dob, admissionNo, contactNumber } = req.body;
    if (!name || !fatherName || !gender || !percentage || !board || !year) {
      return res.status(400).json({ error: 'Name, father name, gender, percentage, board, and year are required' });
    }

    let photoUrl: string | undefined;
    let photoKey: string | undefined;
    if (req.file) {
      try {
        const result = await uploadToS3(req.file, `results/${year}`);
        photoUrl = result.s3Url;
        photoKey = result.s3Key;
      } catch (uploadErr) {
        console.error('S3 upload failed for result photo:', uploadErr);
      }
    }

    const student = await prisma.studentResult.create({
      data: {
        name: name.trim(),
        fatherName: fatherName.trim(),
        gender: gender.trim(),
        percentage: parseFloat(percentage),
        board: board.trim(),
        year: parseInt(year),
        rollNumber: rollNumber?.trim(),
        dob: dob ? new Date(dob) : undefined,
        admissionNo: admissionNo?.trim(),
        contactNumber: contactNumber?.trim(),
        photoUrl,
        photoKey,
      },
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: 'Create failed' });
  }
});

router.put('/results/:id', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.studentResult.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    let photoUrl = existing.photoUrl;
    let photoKey = existing.photoKey;
    if (req.file) {
      if (existing.photoKey) await deleteFromS3(existing.photoKey);
      const result = await uploadToS3(req.file, `results/${existing.year}`);
      photoUrl = result.s3Url;
      photoKey = result.s3Key;
    }

    const { name, fatherName, gender, percentage, board, year, rollNumber, dob, admissionNo, contactNumber } = req.body;
    const student = await prisma.studentResult.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(fatherName && { fatherName: fatherName.trim() }),
        ...(gender && { gender: gender.trim() }),
        ...(percentage && { percentage: parseFloat(percentage) }),
        ...(board && { board: board.trim() }),
        ...(year && { year: parseInt(year) }),
        ...(rollNumber !== undefined && { rollNumber: rollNumber?.trim() || null }),
        ...(dob !== undefined && { dob: dob ? new Date(dob) : null }),
        ...(admissionNo !== undefined && { admissionNo: admissionNo?.trim() || null }),
        ...(contactNumber !== undefined && { contactNumber: contactNumber?.trim() || null }),
        photoUrl,
        photoKey,
      },
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/results/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const student = await prisma.studentResult.findUnique({ where: { id: req.params.id } });
    if (!student) return res.status(404).json({ error: 'Not found' });

    if (student.photoKey) await deleteFromS3(student.photoKey);
    await prisma.studentResult.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
