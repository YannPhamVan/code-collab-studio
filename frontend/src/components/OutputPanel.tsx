import { Terminal, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { CodeExecutionResult } from '@/lib/api';

interface OutputPanelProps {
  result: CodeExecutionResult | null;
  isRunning: boolean;
}

export function OutputPanel({ result, isRunning }: OutputPanelProps) {
  return (
    <div className="glass-panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Output</h3>
        </div>
        {result && (
          <div className="flex items-center gap-2 text-xs">
            {result.success ? (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Success
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                Error
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {result.executionTime}ms
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 scrollbar-thin">
        {isRunning ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Running code...</span>
          </div>
        ) : result ? (
          <pre
            className={`font-mono text-sm whitespace-pre-wrap ${
              result.success ? 'text-foreground' : 'text-destructive'
            }`}
          >
            {result.error || result.output}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Run" to execute your code and see the output here.
          </p>
        )}
      </div>
    </div>
  );
}
