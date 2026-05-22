import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../index'
import prisma from '../lib/prisma'

describe('Organization Endpoints', () => {
  let authToken: string
  let userId: string

  beforeAll(async () => {
    // Clean up test data
    await prisma.team.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()

    // Create a test user with admin role
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'orgtest@example.com',
        password: hashedPassword,
        name: 'Org Test User',
        role: 'admin'
      }
    })
    userId = user.id

    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'orgtest@example.com',
        password: 'password123'
      })
    
    authToken = response.body.token
  })

  afterAll(async () => {
    await prisma.team.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('GET /api/org/projects', () => {
    it('should get all projects', async () => {
      const response = await request(app)
        .get('/api/org/projects')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should reject without auth', async () => {
      const response = await request(app)
        .get('/api/org/projects')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/org/projects', () => {
    it('should create a new project with admin role', async () => {
      const response = await request(app)
        .post('/api/org/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'A test project'
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('Test Project')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/org/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/org/teams', () => {
    it('should get all teams', async () => {
      const response = await request(app)
        .get('/api/org/teams')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('POST /api/org/teams', () => {
    it('should create a new team with admin role', async () => {
      const response = await request(app)
        .post('/api/org/teams')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Team'
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('Test Team')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/org/teams')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          memberIds: [userId]
        })

      expect(response.status).toBe(400)
    })
  })
})
