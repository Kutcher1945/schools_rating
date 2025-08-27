// Mock user data for testing
export interface MockUser {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
}

// Mock users database
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Adilan Akhramovich',
    email: 'demo@example.com',
    password: 'demo123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Adilan Akhramovich',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Adilan Akhramovich',
    email: 'admin@example.com',
    password: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
]

// Mock authentication functions
export const mockAuth = {
  // Login function
  login: async (email: string, password: string): Promise<{ success: boolean; user?: MockUser; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Invalid password' }
    }
    
    // Store user in localStorage for session persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }))
    }
    
    return { success: true, user }
  },

  // Signup function
  signup: async (name: string, email: string, password: string): Promise<{ success: boolean; user?: MockUser; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }
    
    // Create new user
    const newUser: MockUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=100&h=100&fit=crop&crop=face`
    }
    
    // Add to mock database
    mockUsers.push(newUser)
    
    // Store user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      }))
    }
    
    return { success: true, user: newUser }
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    if (typeof window === 'undefined') return null
    
    const stored = localStorage.getItem('mockUser')
    return stored ? JSON.parse(stored) : null
  },

  // Logout function
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser')
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('mockUser') !== null
  }
}