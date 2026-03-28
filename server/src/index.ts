import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import authRoutes from './routes/auth.routes';
import galleryRoutes from './routes/gallery.routes';
import facultyRoutes from './routes/faculty.routes';
import resultsRoutes from './routes/results.routes';
import contactRoutes from './routes/contact.routes';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api', galleryRoutes);
app.use('/api', facultyRoutes);
app.use('/api', resultsRoutes);
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export const handler = serverless(app);
export default app;
