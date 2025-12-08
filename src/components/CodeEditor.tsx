import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  code: string;
  language: 'javascript' | 'python';
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const customTheme = EditorView.theme({
  '&': {
    backgroundColor: 'hsl(222 47% 5%)',
    height: '100%',
  },
  '.cm-gutters': {
    backgroundColor: 'hsl(222 47% 8%)',
    borderRight: '1px solid hsl(217 33% 20%)',
    color: 'hsl(215 20% 45%)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'hsl(217 33% 12%)',
  },
  '.cm-activeLine': {
    backgroundColor: 'hsl(217 33% 10% / 0.5)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'hsl(160 84% 39% / 0.2) !important',
  },
  '.cm-cursor': {
    borderLeftColor: 'hsl(160 84% 39%)',
    borderLeftWidth: '2px',
  },
  '.cm-content': {
    caretColor: 'hsl(160 84% 39%)',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '14px',
    lineHeight: '1.6',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
});

export function CodeEditor({ code, language, onChange, readOnly = false }: CodeEditorProps) {
  const extensions = [
    language === 'javascript' ? javascript({ jsx: true }) : python(),
    customTheme,
    EditorView.lineWrapping,
  ];

  const handleChange = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-editor-bg">
      <CodeMirror
        value={code}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        onChange={handleChange}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
        }}
        className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:scrollbar-thin"
      />
    </div>
  );
}

// Export for testing
export function validateCode(code: string, language: 'javascript' | 'python'): { valid: boolean; error?: string } {
  if (!code.trim()) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  if (language === 'javascript') {
    // Basic syntax check for JS
    try {
      new Function(code);
      return { valid: true };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  }

  // For Python, we can't validate in the browser, so just check for basic structure
  return { valid: true };
}

export function getLanguageFromFilename(filename: string): 'javascript' | 'python' {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'py') return 'python';
  return 'javascript';
}
