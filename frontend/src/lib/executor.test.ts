import { describe, it, expect, vi } from 'vitest';
import { Executor } from './executor';

// Mock Worker class
class MockWorker {
    onmessage: ((e: MessageEvent) => void) | null = null;
    onerror: ((e: ErrorEvent) => void) | null = null;

    postMessage(data: any) {
        const { code } = data;

        // Simulate async processing
        setTimeout(() => {
            if (this.onmessage) {
                if (code.includes('error')) {
                    this.onmessage({ data: { type: 'error', error: 'Mock Error' } } as MessageEvent);
                } else if (code.includes('loop')) {
                    // Do nothing to simulate timeout
                } else {
                    this.onmessage({ data: { type: 'success', output: 'Mock Output' } } as MessageEvent);
                }
            }
        }, 50);
    }

    terminate() { }
}

vi.stubGlobal('Worker', MockWorker);

describe('Executor', () => {
    it('should execute valid code successfully', async () => {
        const result = await Executor.run("console.log('test')", 'javascript');
        expect(result.isError).toBe(false);
        expect(result.output).toBe('Mock Output');
    });

    it('should handle execution errors', async () => {
        const result = await Executor.run("throw new Error('test')", 'javascript'); // The mock looks for "error" string
        // Note: Our mock logic above checks for 'error' string in code to trigger error path
        // Let's adjust mock usage or just rely on the fact that we look for 'error' keyword in code for this stub
        const errorResult = await Executor.run("code with error", 'javascript');
        expect(errorResult.isError).toBe(true);
        expect(errorResult.output).toBe('Mock Error');
    });

    it('should handle timeouts', async () => {
        // We need to use fake timers for this test to speed up 5s timeout
        vi.useFakeTimers();

        const promise = Executor.run("code loop", 'javascript');

        vi.advanceTimersByTime(6000);

        const result = await promise;
        expect(result.isError).toBe(true);
        expect(result.output).toContain('Execution timed out');

        vi.useRealTimers();
    });
});
