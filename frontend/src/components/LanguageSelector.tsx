import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Language
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 bg-secondary border-border">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value} className="hover:bg-secondary">
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
