const API_BASE = "http://localhost:8000/routes";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle cases where server might not return JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If it's an auth error, clear token
        if (response.status === 401) {
          this.setToken(null);
        }
        
        throw new Error(`Server returned unexpected response: ${response.status}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Auto-logout if token is invalid
        if (response.status === 401) {
          this.setToken(null);
          window.dispatchEvent(new Event('unauthorized'));
        }
        
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      // Network errors or server down
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password) {
    return this.request('/register.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Notes endpoints
  async fetchNotes(since = null) {
    const params = since ? `?since=${encodeURIComponent(since)}` : '';
    return this.request(`/notes_list.php${params}`);
  }

  async addNote(noteData) {
    // Client-side validation before sending
    const validationError = validateNoteData(noteData);
    if (validationError) {
      throw new Error(validationError);
    }

    return this.request('/notes_add.php', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    const validationError = validateNoteData(noteData);
    if (validationError) {
      throw new Error(validationError);
    }

    return this.request('/update_note.php', {
      method: 'POST',
      body: JSON.stringify({ id, ...noteData }),
    });
  }

  async deleteNote(id) {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return this.request('/delete_note.php', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }
  async getUserInfo() {
    return this.request('/user_info.php');
  }
}

// Client-side note validation
function validateNoteData(noteData) {
  const { title = '', content = '' } = noteData;

  if (!title.trim() && !content.trim()) {
    return 'Note must have either title or content';
  }

  if (title.length > 255) {
    return 'Title must not exceed 255 characters';
  }

  if (content.length > 10000) {
    return 'Content must not exceed 10,000 characters';
  }

  // Check for potentially harmful content
  const harmfulPattern = /<script|javascript:|on\w+\s*=/i;
  if (harmfulPattern.test(title) || harmfulPattern.test(content)) {
    return 'Note contains potentially unsafe content';
  }

  return null;
}

export const apiClient = new ApiClient();