import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Code2, Users, Trophy, Zap, ArrowRight, Terminal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const session = await api.createSession();
      toast({
        title: 'Session created!',
        description: 'Redirecting to your coding session...',
      });
      navigate(`/session/${session.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-3xl" />
      
      {/* Animated orbs */}
      <div className="absolute left-20 top-40 h-72 w-72 animate-float rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-20 bottom-40 h-96 w-96 animate-float rounded-full bg-emerald-500/10 blur-3xl" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Terminal className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CodeCollab</span>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Zap className="h-4 w-4" />
            <span>Real-time collaborative coding</span>
          </div>

          <h1 className="animate-fade-in mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl" style={{ animationDelay: '0.1s' }}>
            Code together,{' '}
            <span className="gradient-text">succeed together</span>
          </h1>

          <p className="animate-fade-in mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.2s' }}>
            A collaborative coding interview platform where you can write, run, and debug code
            in real-time with your team. Perfect for technical interviews and pair programming.
          </p>

          <div className="animate-fade-in flex flex-col gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <Button
              size="lg"
              onClick={handleCreateSession}
              disabled={isCreating}
              className="group bg-primary text-primary-foreground hover:bg-primary/90 btn-glow h-14 px-8 text-lg"
            >
              {isCreating ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  Create Session
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="animate-fade-in mt-20 grid max-w-4xl gap-8 sm:grid-cols-3" style={{ animationDelay: '0.4s' }}>
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Live Code Editor"
              description="Syntax highlighting, autocomplete, and real-time collaboration"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Multi-participant"
              description="Invite team members and code together in real-time"
            />
            <FeatureCard
              icon={<Trophy className="h-6 w-6" />}
              title="Leaderboard"
              description="Track progress and compete with live scoring"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center text-sm text-muted-foreground">
          <p>Built for collaborative coding interviews</p>
        </footer>
      </div>
    </div>
  );
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/80">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
