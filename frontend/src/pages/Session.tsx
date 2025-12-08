import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { CodeEditor } from '@/components/CodeEditor';
import { SessionHeader } from '@/components/SessionHeader';
import { ParticipantList } from '@/components/ParticipantList';
import { Leaderboard } from '@/components/Leaderboard';
import { OutputPanel } from '@/components/OutputPanel';
import { api, WebSocketClient, getDefaultCode, Session, Participant, LeaderboardEntry } from '@/lib/api';
import { Executor, ExecutionResult } from '@/lib/executor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Trophy } from 'lucide-react';

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  // Initialize session
  useEffect(() => {
    if (!sessionId) return;

    const initSession = async () => {
      const sessionData = await api.getSession(sessionId);
      if (sessionData) {
        setSession(sessionData);
        setCode(sessionData.code);
        setLanguage(sessionData.language);
        setParticipants(sessionData.participants);
      }

      const leaderboardData = await api.getLeaderboard(sessionId);
      setLeaderboard(leaderboardData);
    };

    initSession();
  }, [sessionId]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!sessionId) return;

    const client = new WebSocketClient(sessionId);

    client.connect().then(() => {
      client.on('code_update', (data) => {
        const { code: newCode } = data as { code: string };
        setCode(newCode);
      });

      client.on('participant_update', (data) => {
        setParticipants(data as Participant[]);
      });

      client.on('language_change', (data) => {
        const { language: newLang } = data as { language: 'javascript' | 'python' };
        setLanguage(newLang);
      });
    });

    setWsClient(client);

    return () => {
      client.disconnect();
    };
  }, [sessionId]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    wsClient?.sendCodeUpdate(newCode);
  }, [wsClient]);

  const handleLanguageChange = useCallback((newLanguage: 'javascript' | 'python') => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
    wsClient?.sendLanguageChange(newLanguage);
  }, [wsClient]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      // Execute code in browser securely
      const result = await Executor.run(code, language);
      setOutput(result);

      // Optional: Send run event to server if needed for metrics/logging in future
    } catch (error) {
      setOutput({
        isError: true,
        output: 'Failed to execute code. Please try again.',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Invalid session</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <SessionHeader
        sessionId={sessionId}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        isRunning={isRunning}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main editor area */}
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
            />
          </div>

          <div className="h-64 border-t border-border p-4">
            <OutputPanel result={output} isRunning={isRunning} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l border-border bg-card/30 p-4">
          <Tabs defaultValue="participants" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="participants" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="mr-2 h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="mr-2 h-4 w-4" />
                Rank
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto pt-4 scrollbar-thin">
              <TabsContent value="participants" className="m-0 h-full">
                <ParticipantList participants={participants} />
              </TabsContent>
              <TabsContent value="leaderboard" className="m-0 h-full">
                <Leaderboard entries={leaderboard} />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
