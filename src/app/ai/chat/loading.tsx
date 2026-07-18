import { Diamond } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Diamond className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Loading Chat</h1>
      </div>
    </div>
  );
}
