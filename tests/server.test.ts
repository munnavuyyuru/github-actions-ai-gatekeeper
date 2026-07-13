import request from 'supertest';
import { app } from '../src/server';

describe('API Endpoints', () => {
  it('should respond to GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
  });

  describe('POST /api/v1/search', () => {
    it('should return 400 for non-string query', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ query: 123 });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Query must be a string' });
    });

    it('should return empty array for empty string query', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ query: '' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return matching documents for valid string query', async () => {
      const response = await request(app)
        .post('/api/v1/search')
        .send({ query: 'MFA' });
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].content.toLowerCase()).toContain('mfa');
    });
  });

  describe('GET /api/v1/documents', () => {
    it('should return sanitized filename for numeric query param (Express converts to string)', async () => {
      const response = await request(app)
        .get('/api/v1/documents')
        .query({ filename: 123 });
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('123');
    });

    it('should return 400 for missing filename', async () => {
      const response = await request(app).get('/api/v1/documents');
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Filename must be a string' });
    });

    it('should return 400 for empty filename after sanitization', async () => {
      const response = await request(app)
        .get('/api/v1/documents')
        .query({ filename: '' });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid filename' });
    });

    it('should sanitize path traversal attempts', async () => {
      const response = await request(app)
        .get('/api/v1/documents')
        .query({ filename: '../etc/passwd' });
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('passwd');
    });

    it('should return sanitized filename for valid path', async () => {
      const response = await request(app)
        .get('/api/v1/documents')
        .query({ filename: 'document.txt' });
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('document.txt');
    });
  });

  describe('Global Error Handler', () => {
    it('should return generic error for unhandled exception', async () => {
      const response = await request(app).get('/api/v1/error');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'An internal server error occurred' });
    });
  });
});