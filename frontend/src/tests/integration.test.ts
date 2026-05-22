import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import axios from 'axios'

const API_URL = 'http://localhost:4001/api'

describe('Frontend-Backend Integration', () => {
  let authToken: string
  let userId: string

  beforeAll(async () => {
    // Clean up by creating a test user with admin role
    const testEmail = `integration-${Date.now()}@example.com`
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        email: testEmail,
        password: 'integration123',
        name: 'Integration Test User',
        role: 'admin'
      })
    } catch (err) {
      // User might already exist
    }

    // Login to get token
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'integration123'
    })
    
    authToken = loginResponse.data.token
    userId = loginResponse.data.user.id
  })

  afterAll(async () => {
    // Cleanup would go here if we had a delete user endpoint
  })

  describe('Authentication', () => {
    it('should login and receive a valid token', async () => {
      expect(authToken).toBeTruthy()
      expect(userId).toBeTruthy()
    })

    it('should access protected routes with auth token', async () => {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      
      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
    })

    it('should reject unauthorized requests', async () => {
      try {
        await axios.get(`${API_URL}/tasks`)
        expect.fail('Should have thrown an error')
      } catch (err: any) {
        expect(err.response.status).toBe(401)
      }
    })
  })

  describe('Task Management', () => {
    let taskId: string
    let projectId: string

    beforeAll(async () => {
      // Create a project for testing
      const projectResponse = await axios.post(
        `${API_URL}/org/projects`,
        { name: 'Integration Test Project', description: 'Test project' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      projectId = projectResponse.data.id
    })

    it('should create a new task', async () => {
      const response = await axios.post(
        `${API_URL}/tasks`,
        {
          title: 'Integration Test Task',
          description: 'This is a test task',
          priority: 'high',
          status: 'TODO',
          projectId: projectId
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty('id')
      expect(response.data.title).toBe('Integration Test Task')
      taskId = response.data.id
    })

    it('should fetch tasks', async () => {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeGreaterThan(0)
    })

    it('should update a task', async () => {
      const response = await axios.patch(
        `${API_URL}/tasks/${taskId}`,
        { status: 'IN_PROGRESS' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(200)
      expect(response.data.status).toBe('IN_PROGRESS')
    })

    it('should delete a task', async () => {
      const response = await axios.delete(
        `${API_URL}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(204)
    })
  })

  describe('Project Management', () => {
    it('should create a new project', async () => {
      const response = await axios.post(
        `${API_URL}/org/projects`,
        { name: 'Test Project', description: 'A test project' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty('id')
      expect(response.data.name).toBe('Test Project')
    })

    it('should fetch projects', async () => {
      const response = await axios.get(`${API_URL}/org/projects`, {
        headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
    })
  })

  describe('Team Management', () => {
    it('should create a new team', async () => {
      const response = await axios.post(
        `${API_URL}/org/teams`,
        { name: 'Test Team' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty('id')
      expect(response.data.name).toBe('Test Team')
    })

    it('should fetch teams', async () => {
      const response = await axios.get(`${API_URL}/org/teams`, {
        headers: { Authorization: `Bearer ${authToken}` } }
      )

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
    })
  })
})
