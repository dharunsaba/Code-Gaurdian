import React from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  label: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  label,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative rounded-lg border border-border bg-secondary/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            {readOnly ? 'output' : 'input'}
          </span>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "w-full h-64 p-4 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none",
            readOnly && "cursor-default text-primary"
          )}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
