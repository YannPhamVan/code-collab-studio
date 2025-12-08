import { LeaderboardEntry } from '@/lib/api';
import { Trophy, Medal, Clock } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRankStyle(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
    case 2:
      return 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/50';
    case 3:
      return 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-600/50';
    default:
      return 'bg-secondary/30 border-transparent';
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-orange-600" />;
    default:
      return (
        <span className="flex h-5 w-5 items-center justify-center text-sm font-bold text-muted-foreground">
          {rank}
        </span>
      );
  }
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="glass-panel p-4">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Leaderboard</h3>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.participant.id}
            className={`flex items-center gap-3 rounded-lg border p-3 transition-all hover:scale-[1.02] ${getRankStyle(
              entry.rank
            )}`}
          >
            <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(entry.rank)}</div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {entry.participant.name}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono text-primary">{entry.solvedProblems} solved</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(entry.totalTime)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold gradient-text">{entry.participant.score}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
