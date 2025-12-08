/* eslint-disable no-restricted-globals */
// Import Pyodide types if needed, but for worker we can use importScripts style or dynamic import if configured.
// Since we are in a standardized environment, we will use importScripts with a widely available CDN.


let pyodide: any = null;

async function loadPyodideAndPackages() {
    if (pyodide) return pyodide;

    // Load Pyodide (ESM)
    // @ts-ignore
    const { loadPyodide } = await import("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs");

    // @ts-ignore
    pyodide = await loadPyodide();
    return pyodide;
}

self.onmessage = async (e: MessageEvent) => {
    const { code } = e.data;

    try {
        const py = await loadPyodideAndPackages();

        // Redirect stdout
        py.setStdout({
            batched: (str: string) => {
                self.postMessage({ type: 'stdout', output: str });
            }
        });

        py.setStderr({
            batched: (str: string) => {
                self.postMessage({ type: 'stderr', output: str });
            }
        });

        // Run code
        await py.runPythonAsync(code);

        self.postMessage({ type: 'success' });

    } catch (err: any) {
        self.postMessage({ type: 'error', error: err.toString() });
    }
};
