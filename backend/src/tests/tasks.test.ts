import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import app from '../index'
import prisma from '../lib/prisma'

describe('Task Endpoints', () => {
  let authToken: string
  let userId: string
  let projectId: string
  let taskId: string

  beforeAll(async () => {
    // Clean up test data
    await prisma.auditLog.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()

    // Create a test user with admin role
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'tasktest@example.com',
        password: hashedPassword,
        name: 'Task Test User',
        role: 'admin'
      }
    })
    userId = user.id

    // Create a project for the user
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'A test project',
        ownerId: userId
      }
    })
    projectId = project.id

    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tasktest@example.com',
        password: 'password123'
      })
    
    authToken = response.body.token
  })

  afterAll(async () => {
    await prisma.auditLog.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.task.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('GET /api/tasks', () => {
    it('should get all tasks with auth', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('should reject without auth', async () => {
      const response = await request(app)
        .get('/api/tasks')

      expect(response.status).toBe(401)
    })
  })

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'A test task',
          priority: 'high',
          status: 'TODO',
          projectId: projectId
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe('Test Task')
      taskId = response.body.id
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task'
        })

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/tasks/:id', () => {
    it('should update a task', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'IN_PROGRESS'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('IN_PROGRESS')
    })

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'DONE'
        })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task to delete
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Delete',
          projectId: projectId
        })

      expect(createResponse.status).toBe(201)

      const deleteResponse = await request(app)
        .delete(`/api/tasks/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(deleteResponse.status).toBe(204)
    })
  })
})
