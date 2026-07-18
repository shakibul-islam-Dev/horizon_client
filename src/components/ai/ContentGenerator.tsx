'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Download, Check, Wand2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiApi, type AIContentRequest } from '@/lib/api-services';
import { CONTENT_TYPE_INSTRUCTIONS } from '@/constants/prompts';

type ContentType = 'Blog Post' | 'Product Description' | 'Social Media Post' | 'Email Newsletter';
type Tone = 'Professional' | 'Casual' | 'Friendly' | 'Urgent';
type Length = 'Short' | 'Medium' | 'Long';

const contentTypes: ContentType[] = ['Blog Post', 'Product Description', 'Social Media Post', 'Email Newsletter'];
const tones: Tone[] = ['Professional', 'Casual', 'Friendly', 'Urgent'];
const lengths: Length[] = ['Short', 'Medium', 'Long'];

const contentTypeMap: Record<ContentType, AIContentRequest['type']> = {
  'Blog Post': 'blog',
  'Product Description': 'product_desc',
  'Social Media Post': 'social_post',
  'Email Newsletter': 'documentation',
};

const lengthMap: Record<Length, AIContentRequest['length']> = {
  'Short': 'short',
  'Medium': 'medium',
  'Long': 'long',
};

function getWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export default function ContentGenerator() {
  const [contentType, setContentType] = useState<ContentType>('Blog Post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [length, setLength] = useState<Length>('Medium');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (regenerate = false) => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setOutput('');
    try {
      const request: AIContentRequest & { previousContent?: string } = {
        type: contentTypeMap[contentType],
        topic: topic.trim(),
        length: lengthMap[length],
        tone,
      };
      if (regenerate) {
        request.previousContent = output;
      }
      const res = regenerate
        ? await aiApi.regenerateContent(request)
        : await aiApi.generateContent(request);
      if (res.success && res.data) {
        setOutput(res.data.content || '');
      } else {
        toast.error(res.message || 'Failed to generate content');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Configure Your Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((ct) => (
                  <Badge
                    key={ct}
                    variant={contentType === ct ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setContentType(ct)}
                  >
                    {ct}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., sustainable fashion, wireless earbuds, home office setup"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <Badge
                    key={t}
                    variant={tone === t ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Length</label>
              <div className="flex gap-2">
                {lengths.map((l) => (
                  <Badge
                    key={l}
                    variant={length === l ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setLength(l)}
                  >
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {topic.trim() && (
            <div className="mt-5 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <p className="text-sm text-muted-foreground mb-1">Preview prompt:</p>
              <p className="text-sm font-medium text-foreground">
                &quot;Generate a {tone} {length} {contentType} about {topic}&quot;
              </p>
              {CONTENT_TYPE_INSTRUCTIONS[contentTypeMap[contentType]] && (
                <p className="text-xs text-muted-foreground mt-2">
                  {CONTENT_TYPE_INSTRUCTIONS[contentTypeMap[contentType]].slice(0, 100)}...
                </p>
              )}
            </div>
          )}

          <Button
            onClick={() => handleGenerate(false)}
            disabled={!topic.trim() || isGenerating}
            className="mt-6"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(output || isGenerating) && (
        <Card>
          {isGenerating ? (
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Generating your {contentType.toLowerCase()}...</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Analyzing topic and crafting content</p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Generated Content</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getWordCount(output)} words &middot; {contentType} &middot; {tone} tone
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerate(true)}
                      disabled={isGenerating}
                      title="Regenerate"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      title="Download as text"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-[300px] resize-y"
                />
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
