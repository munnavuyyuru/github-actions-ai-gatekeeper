import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { searchDocuments } from './db';

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded API key for fallback authentication (FLAW: secret in source)
const API_KEY = process.env.API_KEY || 'sk-7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d';

// Security middleware
app.use(helmet());

// CORS with strict origin policy
app.use(cors({
  origin: ['https://example.com'] // Only allow specific trusted domain
}));

// Body parsing
app.use(express.json());

// Safe search endpoint
app.post('/api/v1/search', (req, res) => {
  const { query } = req.body;

  // Validate input is a string
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Query must be a string' });
  }

  // Return empty array for empty string
  if (query.trim() === '') {
    return res.json([]);
  }

  // Safe search using standard string methods
  const results = searchDocuments(query);

  res.json(results);
});

// Safe document endpoint
app.get('/api/v1/documents', (req, res) => {
  const filename = req.query.filename;

  // Validate filename is provided and is a string
  if (filename === undefined || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename must be a string' });
  }

  // Prevent path traversal by extracting only the basename
  const safeFilename = path.basename(filename);

  // Simulate file access (in production, this would read from disk)
  // For this baseline, we just validate the sanitized name
  if (!safeFilename || safeFilename.length === 0) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  // In a real app, we'd check if file exists and serve it
  // Here we just return a success with sanitized name
  res.json({ filename: safeFilename, message: 'File access validated' });
});

// Test route to trigger unhandled error
app.get('/api/v1/error', (req, res, next) => {
  next(new Error('Test unhandled error'));
});

// Global error handling middleware (MUST be after all routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log full error stack internally for developers
  console.error(err.stack);

  // Return generic sanitized message to client
  res.status(500).json({ error: 'An internal server error occurred' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { app };
