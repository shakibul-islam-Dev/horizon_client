'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search items...', initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    onSearch(trimmed);
  }, [query, onSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200">
      <div className="pl-4 text-muted-foreground">
        <Search className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-3 pr-2 pl-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
      />
      <div className="pr-1.5">
        <Button variant="default" size="sm" onClick={handleSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
}
