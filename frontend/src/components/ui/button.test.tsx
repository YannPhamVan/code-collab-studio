import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './button';
import React from 'react';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies variant classes', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        expect(container.firstChild).toHaveClass('bg-destructive');
    });
});
