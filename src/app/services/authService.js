const mockUsers = [
    {
      id: 1,
      email: 'user@example.com',
      password: 'password123', // In real app, never store plain passwords
      name: 'Test User',
      avatar: '/assets/images/faces/1.jpg'
    }
  ];
  
  export const loginWithEmail = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    
    return {
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        loginMethod: 'email'
      }
    };
  };
  
  export const loginWithGoogle = async (accessToken) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you would verify the Google token with your backend
    return {
      token: 'mock-jwt-token-google',
      user: {
        id: 2,
        name: 'Google User',
        email: 'googleuser@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        loginMethod: 'google'
      }
    };
  };
  
  export const validateToken = async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Very simple mock validation
    if (token.includes('mock-jwt-token')) {
      return {
        user: {
          id: token.includes('google') ? 2 : 1,
          name: token.includes('google') ? 'Google User' : 'Test User',
          email: token.includes('google') ? 'googleuser@example.com' : 'user@example.com',
          avatar: token.includes('google') 
            ? 'https://randomuser.me/api/portraits/men/1.jpg'
            : '/assets/images/faces/1.jpg',
          loginMethod: token.includes('google') ? 'google' : 'email'
        }
      };
    }
    throw new Error('Invalid token');
  };