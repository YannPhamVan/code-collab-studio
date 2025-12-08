/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent) => {
    const { code } = e.data;
    let logs: string[] = [];

    // Capture console.log
    const originalLog = console.log;
    console.log = (...args) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
    };

    // Capture console.error
    const originalError = console.error;
    console.error = (...args) => {
        logs.push(`[Error] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')}`);
    };

    try {
        // Basic sandboxing: undefined commonly used globals to prevent usage
        // Note: This is soft isolation. True isolation requires iframes or more complex setups, but sufficient for this demo.
        // We rely on Worker scope mainly.

        // Evaluate code
        // simple eval in worker scope
        // eslint-disable-next-line no-eval
        const result = eval(code);

        if (result !== undefined) {
            logs.push(String(result));
        }

        self.postMessage({ type: 'success', output: logs.join('\n') });
    } catch (err: any) {
        self.postMessage({ type: 'error', error: err.toString() });
    } finally {
        // Restore console just in case, though worker terminates anyway
        console.log = originalLog;
        console.error = originalError;
    }
};
