import { getLanguageFromFilename } from '../components/CodeEditor';

export interface ExecutionResult {
    output: string;
    isError: boolean;
}

const TIMEOUT_MS = 5000;

export class Executor {
    static async run(code: string, language: 'javascript' | 'python'): Promise<ExecutionResult> {
        return new Promise((resolve) => {
            let worker: Worker;
            let timeoutId: NodeJS.Timeout;
            let outputBuffer: string[] = [];

            try {
                if (language === 'javascript') {
                    // Vite worker import
                    worker = new Worker(new URL('./workers/javascript-worker.ts', import.meta.url), {
                        type: 'module',
                    });
                } else {
                    worker = new Worker(new URL('./workers/python-worker.ts', import.meta.url), {
                        type: 'module',
                    });
                }

                timeoutId = setTimeout(() => {
                    worker.terminate();
                    resolve({ output: 'Error: Execution timed out (limit: 5s)', isError: true });
                }, TIMEOUT_MS);

                worker.onmessage = (e) => {
                    const { type, output, error } = e.data;

                    if (type === 'success') {
                        if (output) outputBuffer.push(output);
                        clearTimeout(timeoutId);
                        worker.terminate();
                        resolve({ output: outputBuffer.join('\n'), isError: false });
                    } else if (type === 'error') {
                        clearTimeout(timeoutId);
                        worker.terminate();
                        resolve({ output: error || 'Unknown error', isError: true });
                    } else if (type === 'stdout') {
                        outputBuffer.push(output);
                    } else if (type === 'stderr') {
                        // Python stderr
                        outputBuffer.push(`[Error] ${output}`);
                    }
                };

                worker.onerror = (err) => {
                    clearTimeout(timeoutId);
                    worker.terminate();
                    resolve({ output: `Worker Error: ${err.message}`, isError: true });
                };

                worker.postMessage({ code });

            } catch (err: any) {
                resolve({ output: `Failed to start execution: ${err.message}`, isError: true });
            }
        });
    }
}
