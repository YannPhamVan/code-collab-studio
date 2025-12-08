/**
 * API client for collaborative coding interview platform
 * All HTTP and WebSocket calls are centralized here
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface Session {
  id: string;
  code: string;
  language: 'javascript' | 'python';
  participants: Participant[];
  createdAt: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  score: number;
  joinedAt: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface LeaderboardEntry {
  rank: number;
  participant: Participant;
  solvedProblems: number;
  totalTime: number;
}

// API Configuration
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? 'http://localhost:8000/api' : '/api';
const WS_BASE_URL = isDev
  ? 'ws://localhost:8000/ws'
  : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

// Stubbed HTTP endpoints
export const api = {
  // Session management
  async createSession(): Promise<Session> {
    // Stubbed - returns mock session
    console.log('[API] Creating new session...');
    return {
      id: uuidv4(),
      code: getDefaultCode('javascript'),
      language: 'javascript',
      participants: [],
      createdAt: new Date().toISOString(),
    };
  },

  async getSession(sessionId: string): Promise<Session | null> {
    // Stubbed - returns mock session
    console.log(`[API] Fetching session: ${sessionId}`);
    return {
      id: sessionId,
      code: getDefaultCode('javascript'),
      language: 'javascript',
      participants: getMockParticipants(),
      createdAt: new Date().toISOString(),
    };
  },

  async updateSessionCode(sessionId: string, code: string): Promise<void> {
    // Stubbed - would update session code
    console.log(`[API] Updating code for session: ${sessionId}`);
  },

  async updateSessionLanguage(sessionId: string, language: 'javascript' | 'python'): Promise<void> {
    // Stubbed - would update session language
    console.log(`[API] Updating language to ${language} for session: ${sessionId}`);
  },

  // Code execution
  async executeCode(code: string, language: 'javascript' | 'python'): Promise<CodeExecutionResult> {
    // Stubbed - simulates code execution
    console.log(`[API] Executing ${language} code...`);
    await simulateDelay(1000);

    return {
      success: true,
      output: `> Running ${language} code...\n\nHello, World!\n\nExecution completed successfully.`,
      executionTime: 42,
    };
  },

  // Leaderboard
  async getLeaderboard(sessionId: string): Promise<LeaderboardEntry[]> {
    // Stubbed - returns mock leaderboard
    console.log(`[API] Fetching leaderboard for session: ${sessionId}`);
    return getMockLeaderboard();
  },

  // Participants
  async joinSession(sessionId: string, name: string): Promise<Participant> {
    // Stubbed - would add participant to session
    console.log(`[API] ${name} joining session: ${sessionId}`);
    return {
      id: uuidv4(),
      name,
      isOnline: true,
      score: 0,
      joinedAt: new Date().toISOString(),
    };
  },

  async leaveSession(sessionId: string, participantId: string): Promise<void> {
    // Stubbed - would remove participant from session
    console.log(`[API] Participant ${participantId} leaving session: ${sessionId}`);
  },
};

// WebSocket client
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private handlers: Map<string, ((data: unknown) => void)[]> = new Map();

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${WS_BASE_URL}/${this.sessionId}`;
      console.log(`[WS] Connecting to ${wsUrl}...`);

      // In development, we'll simulate the connection
      if (process.env.NODE_ENV === 'development' || !window.WebSocket) {
        console.log('[WS] Using mock WebSocket connection');
        this.simulateMockConnection();
        resolve();
        return;
      }

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[WS] Connected successfully');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[WS] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WS] Connection error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WS] Connection closed');
          this.attemptReconnect();
        };
      } catch (error) {
        console.log('[WS] WebSocket not available, using mock');
        this.simulateMockConnection();
        resolve();
      }
    });
  }

  private simulateMockConnection(): void {
    console.log('[WS] Mock connection established');

    // Simulate periodic updates
    setInterval(() => {
      this.handleMessage({
        type: 'participant_update',
        data: getMockParticipants(),
      });
    }, 5000);
  }

  private handleMessage(message: { type: string; data: unknown }): void {
    const handlers = this.handlers.get(message.type) || [];
    handlers.forEach(handler => handler(message.data));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[WS] Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    }
  }

  on(event: string, handler: (data: unknown) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  off(event: string, handler: (data: unknown) => void): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(type: string, data: unknown): void {
    const message = JSON.stringify({ type, data });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.log('[WS] Mock send:', { type, data });
    }
  }

  sendCodeUpdate(code: string): void {
    this.send('code_update', { code });
  }

  sendLanguageChange(language: 'javascript' | 'python'): void {
    this.send('language_change', { language });
  }

  sendCursorPosition(position: { line: number; column: number }): void {
    this.send('cursor_position', position);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
  }
}

// Helper functions
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDefaultCode(language: 'javascript' | 'python'): string {
  if (language === 'javascript') {
    return `// Welcome to the Collaborative Coding Interview!
// Write your solution below

function solution(input) {
  // Your code here
  console.log("Hello, World!");
  return input;
}

// Test your solution
solution("test");
`;
  }

  return `# Welcome to the Collaborative Coding Interview!
# Write your solution below

def solution(input):
    # Your code here
    print("Hello, World!")
    return input

# Test your solution
solution("test")
`;
}

function getMockParticipants(): Participant[] {
  return [
    {
      id: '1',
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      isOnline: true,
      score: 850,
      joinedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Miller',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      isOnline: true,
      score: 720,
      joinedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: '3',
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      isOnline: false,
      score: 680,
      joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: '4',
      name: 'Emily Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      isOnline: true,
      score: 590,
      joinedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ];
}

function getMockLeaderboard(): LeaderboardEntry[] {
  const participants = getMockParticipants().sort((a, b) => b.score - a.score);
  return participants.map((participant, index) => ({
    rank: index + 1,
    participant,
    solvedProblems: Math.floor(participant.score / 100),
    totalTime: Math.floor(Math.random() * 3600) + 600,
  }));
}
