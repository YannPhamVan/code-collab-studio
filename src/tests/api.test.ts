import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, WebSocketClient, getDefaultCode } from '../lib/api';

describe('API module', () => {
  describe('api.createSession', () => {
    it('should create a session with valid structure', async () => {
      const session = await api.createSession();
      
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('code');
      expect(session).toHaveProperty('language');
      expect(session).toHaveProperty('participants');
      expect(session).toHaveProperty('createdAt');
      expect(session.language).toBe('javascript');
      expect(Array.isArray(session.participants)).toBe(true);
    });

    it('should generate unique session IDs', async () => {
      const session1 = await api.createSession();
      const session2 = await api.createSession();
      
      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe('api.getSession', () => {
    it('should return a session with the provided ID', async () => {
      const sessionId = 'test-session-123';
      const session = await api.getSession(sessionId);
      
      expect(session).not.toBeNull();
      expect(session?.id).toBe(sessionId);
    });

    it('should include participants in the session', async () => {
      const session = await api.getSession('test');
      
      expect(session?.participants.length).toBeGreaterThan(0);
      expect(session?.participants[0]).toHaveProperty('id');
      expect(session?.participants[0]).toHaveProperty('name');
      expect(session?.participants[0]).toHaveProperty('isOnline');
      expect(session?.participants[0]).toHaveProperty('score');
    });
  });

  describe('api.executeCode', () => {
    it('should return execution result with success', async () => {
      const result = await api.executeCode('console.log("test")', 'javascript');
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('output');
      expect(result).toHaveProperty('executionTime');
      expect(result.success).toBe(true);
    });

    it('should include execution time', async () => {
      const result = await api.executeCode('print("test")', 'python');
      
      expect(typeof result.executionTime).toBe('number');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('api.getLeaderboard', () => {
    it('should return leaderboard entries', async () => {
      const leaderboard = await api.getLeaderboard('test-session');
      
      expect(Array.isArray(leaderboard)).toBe(true);
      expect(leaderboard.length).toBeGreaterThan(0);
    });

    it('should have properly ranked entries', async () => {
      const leaderboard = await api.getLeaderboard('test-session');
      
      for (let i = 0; i < leaderboard.length; i++) {
        expect(leaderboard[i].rank).toBe(i + 1);
      }
    });

    it('should include participant details in each entry', async () => {
      const leaderboard = await api.getLeaderboard('test-session');
      
      expect(leaderboard[0]).toHaveProperty('participant');
      expect(leaderboard[0]).toHaveProperty('solvedProblems');
      expect(leaderboard[0]).toHaveProperty('totalTime');
    });
  });

  describe('getDefaultCode', () => {
    it('should return JavaScript template for javascript', () => {
      const code = getDefaultCode('javascript');
      
      expect(code).toContain('function');
      expect(code).toContain('console.log');
    });

    it('should return Python template for python', () => {
      const code = getDefaultCode('python');
      
      expect(code).toContain('def');
      expect(code).toContain('print');
    });
  });
});

describe('WebSocketClient', () => {
  it('should create a client with session ID', () => {
    const client = new WebSocketClient('test-session');
    expect(client).toBeDefined();
  });

  it('should allow registering event handlers', () => {
    const client = new WebSocketClient('test-session');
    const handler = vi.fn();
    
    client.on('code_update', handler);
    // Handler should be registered without errors
    expect(true).toBe(true);
  });

  it('should allow unregistering event handlers', () => {
    const client = new WebSocketClient('test-session');
    const handler = vi.fn();
    
    client.on('code_update', handler);
    client.off('code_update', handler);
    // Should complete without errors
    expect(true).toBe(true);
  });

  it('should disconnect cleanly', () => {
    const client = new WebSocketClient('test-session');
    
    // Should not throw
    expect(() => client.disconnect()).not.toThrow();
  });
});
