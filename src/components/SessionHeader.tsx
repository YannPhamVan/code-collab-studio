import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { Play, Copy, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SessionHeaderProps {
  sessionId: string;
  language: 'javascript' | 'python';
  onLanguageChange: (language: 'javascript' | 'python') => void;
  onRun: () => void;
  isRunning: boolean;
}

export function SessionHeader({
  sessionId,
  language,
  onLanguageChange,
  onRun,
  isRunning,
}: SessionHeaderProps) {
  const navigate = useNavigate();

  const copySessionLink = () => {
    const url = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'Session link has been copied to clipboard.',
    });
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-lg font-semibold text-foreground">Coding Session</h1>
          <p className="text-xs text-muted-foreground font-mono">
            ID: {sessionId.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector value={language} onChange={onLanguageChange} />

        <Button
          variant="outline"
          size="sm"
          onClick={copySessionLink}
          className="border-border bg-secondary/50 hover:bg-secondary"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-border bg-secondary/50 hover:bg-secondary"
          onClick={() => window.open(`/session/${sessionId}`, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open New Tab
        </Button>

        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow min-w-[100px]"
        >
          {isRunning ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Running
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
