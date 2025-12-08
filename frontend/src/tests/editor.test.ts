import { describe, it, expect } from 'vitest';
import { validateCode, getLanguageFromFilename } from '../components/CodeEditor';

describe('CodeEditor utilities', () => {
  describe('validateCode', () => {
    it('should return invalid for empty code', () => {
      const result = validateCode('', 'javascript');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code cannot be empty');
    });

    it('should return invalid for whitespace-only code', () => {
      const result = validateCode('   \n\t  ', 'javascript');
      expect(result.valid).toBe(false);
    });

    it('should validate correct JavaScript code', () => {
      const code = 'const x = 1; console.log(x);';
      const result = validateCode(code, 'javascript');
      expect(result.valid).toBe(true);
    });

    it('should detect invalid JavaScript syntax', () => {
      const code = 'const x = ; invalid syntax';
      const result = validateCode(code, 'javascript');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should accept Python code without validation', () => {
      const code = 'def hello():\n    print("world")';
      const result = validateCode(code, 'python');
      expect(result.valid).toBe(true);
    });
  });

  describe('getLanguageFromFilename', () => {
    it('should return javascript for .js files', () => {
      expect(getLanguageFromFilename('test.js')).toBe('javascript');
    });

    it('should return javascript for .jsx files', () => {
      expect(getLanguageFromFilename('component.jsx')).toBe('javascript');
    });

    it('should return javascript for .ts files', () => {
      expect(getLanguageFromFilename('app.ts')).toBe('javascript');
    });

    it('should return python for .py files', () => {
      expect(getLanguageFromFilename('script.py')).toBe('python');
    });

    it('should return javascript for unknown extensions', () => {
      expect(getLanguageFromFilename('file.txt')).toBe('javascript');
    });

    it('should handle files without extension', () => {
      expect(getLanguageFromFilename('Makefile')).toBe('javascript');
    });
  });
});
