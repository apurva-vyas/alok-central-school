import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const entry = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile?.trim() || null,
        message: message.trim(),
      },
    });
    res.status(201).json({ success: true, id: entry.id });
  } catch (err) {
    console.error('Contact form submission failed:', err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

router.get('/admin/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    const [data, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count(),
    ]);

    res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.patch('/admin/messages/:id/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const msg = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ isRead: msg.isRead });
  } catch (err) {
    res.status(404).json({ error: 'Message not found' });
  }
});

router.delete('/admin/messages/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Message not found' });
  }
});

export default router;
