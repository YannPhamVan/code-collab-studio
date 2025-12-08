import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, WebSocketClient } from './api';

describe('API Client', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('createSession returns mock session in dev', async () => {
        // Since api.ts implementation is currently just a stub/mock, we test that behavior
        const session = await api.createSession();
        expect(session.id).toBeDefined();
        expect(session.language).toBe('javascript');
    });
});

describe('WebSocketClient', () => {
    it('instantiates correctly', () => {
        const ws = new WebSocketClient('test-session');
        expect(ws).toBeDefined();
    });
});
