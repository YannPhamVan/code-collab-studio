import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code2 } from 'lucide-react';

interface LanguageSelectorProps {
  value: 'javascript' | 'python';
  onChange: (value: 'javascript' | 'python') => void;
}

const languages = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
] as const;

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40 border-border bg-secondary/50 hover:bg-secondary">
        <Code2 className="mr-2 h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="border-border bg-popover">
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="cursor-pointer hover:bg-secondary focus:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
