import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
    it('cn merges class names correctly', () => {
        expect(cn('c1', 'c2')).toBe('c1 c2');
        expect(cn('c1', { c2: true, c3: false })).toBe('c1 c2');
    });

    it('cn handles tailwind conflicts', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });
});
