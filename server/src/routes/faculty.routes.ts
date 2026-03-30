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

const DESIGNATION_ORDER = ['Director', 'Principal', 'Vice Principal', 'Head Teacher', 'Teacher', 'PET', 'Librarian', 'Other'];
const SINGLE_DESIGNATIONS = ['Director', 'Principal', 'Vice Principal'];

function sortByDisplayOrder<T extends { displayOrder: number; name: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const ao = a.displayOrder || 0;
    const bo = b.displayOrder || 0;
    if (ao === 0 && bo === 0) return a.name.localeCompare(b.name);
    if (ao === 0) return 1;
    if (bo === 0) return -1;
    return ao - bo || a.name.localeCompare(b.name);
  });
}

router.get('/faculty', async (_req: Request, res: Response) => {
  try {
    const faculty = await prisma.facultyMember.findMany({
      where: { isActive: true },
      select: { id: true, name: true, designation: true, gender: true, photoUrl: true, department: true, displayOrder: true },
    });

    const sorted = sortByDisplayOrder(faculty);

    const grouped: { designation: string; members: typeof faculty }[] = [];
    const placed = new Set<string>();

    for (const d of DESIGNATION_ORDER) {
      const members = sorted.filter(f => f.designation === d);
      if (members.length > 0) {
        grouped.push({ designation: d, members });
        members.forEach(m => placed.add(m.id));
      }
    }

    const customMembers = sorted.filter(f => !placed.has(f.id));
    if (customMembers.length > 0) {
      const customGroups = new Map<string, typeof faculty>();
      for (const m of customMembers) {
        if (!customGroups.has(m.designation)) customGroups.set(m.designation, []);
        customGroups.get(m.designation)!.push(m);
      }
      for (const [designation, members] of customGroups) {
        grouped.push({ designation, members });
      }
    }

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

router.get('/faculty/:id', async (req: Request, res: Response) => {
  try {
    const member = await prisma.facultyMember.findUnique({ where: { id: req.params.id } });
    if (!member || !member.isActive) return res.status(404).json({ error: 'Not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty member' });
  }
});

router.get('/admin/faculty', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const faculty = await prisma.facultyMember.findMany();
    res.json(sortByDisplayOrder(faculty));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

router.post('/faculty', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, designation, gender, department, qualification, experience, email, phone, bio, joiningDate, displayOrder } = req.body;
    if (!name || !designation) return res.status(400).json({ error: 'Name and designation are required' });

    if (SINGLE_DESIGNATIONS.includes(designation.trim())) {
      const existing = await prisma.facultyMember.findFirst({
        where: { designation: designation.trim(), isActive: true },
      });
      if (existing) {
        return res.status(400).json({
          error: `Only one ${designation.trim()} is allowed. "${existing.name}" already holds this position.`,
        });
      }
    }

    let photoUrl: string | undefined;
    let photoKey: string | undefined;
    if (req.file) {
      try {
        const result = await uploadToS3(req.file, 'faculty');
        photoUrl = result.s3Url;
        photoKey = result.s3Key;
      } catch (uploadErr) {
        console.error('S3 upload failed for faculty photo:', uploadErr);
      }
    }

    const member = await prisma.facultyMember.create({
      data: {
        name: name.trim(),
        designation: designation.trim(),
        gender: gender?.trim() || 'Male',
        department: department?.trim(),
        qualification: qualification?.trim(),
        experience: experience?.trim(),
        email: email?.trim(),
        phone: phone?.trim(),
        bio: bio?.trim(),
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        photoUrl,
        photoKey,
      },
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: 'Create failed' });
  }
});

router.put('/faculty/:id', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.facultyMember.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    let photoUrl = existing.photoUrl;
    let photoKey = existing.photoKey;
    if (req.file) {
      if (existing.photoKey) await deleteFromS3(existing.photoKey);
      const result = await uploadToS3(req.file, 'faculty');
      photoUrl = result.s3Url;
      photoKey = result.s3Key;
    }

    const { name, designation, gender, department, qualification, experience, email, phone, bio, joiningDate, displayOrder } = req.body;

    if (designation && SINGLE_DESIGNATIONS.includes(designation.trim()) && designation.trim() !== existing.designation) {
      const holder = await prisma.facultyMember.findFirst({
        where: { designation: designation.trim(), isActive: true, id: { not: req.params.id } },
      });
      if (holder) {
        return res.status(400).json({
          error: `Only one ${designation.trim()} is allowed. "${holder.name}" already holds this position.`,
        });
      }
    }

    const member = await prisma.facultyMember.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(designation && { designation: designation.trim() }),
        ...(gender && { gender: gender.trim() }),
        ...(department !== undefined && { department: department?.trim() || null }),
        ...(qualification !== undefined && { qualification: qualification?.trim() || null }),
        ...(experience !== undefined && { experience: experience?.trim() || null }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(joiningDate !== undefined && { joiningDate: joiningDate ? new Date(joiningDate) : null }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) || 0 }),
        photoUrl,
        photoKey,
      },
    });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.patch('/faculty/:id/toggle', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const current = await prisma.facultyMember.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.facultyMember.update({
      where: { id: req.params.id },
      data: { isActive: !current.isActive },
    });
    res.json({ isActive: updated.isActive });
  } catch (err) {
    res.status(500).json({ error: 'Toggle failed' });
  }
});

router.patch('/faculty/:id/order', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { displayOrder } = req.body;
    if (displayOrder === undefined) return res.status(400).json({ error: 'displayOrder is required' });

    await prisma.facultyMember.update({
      where: { id: req.params.id },
      data: { displayOrder: parseInt(displayOrder) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Reorder failed' });
  }
});

router.delete('/faculty/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const member = await prisma.facultyMember.findUnique({ where: { id: req.params.id } });
    if (!member) return res.status(404).json({ error: 'Not found' });

    if (member.photoKey) await deleteFromS3(member.photoKey);
    await prisma.facultyMember.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
