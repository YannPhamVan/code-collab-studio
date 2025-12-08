import { Participant } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  const onlineCount = participants.filter((p) => p.isOnline).length;

  return (
    <div className="glass-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-primary" />
          Participants
        </h3>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {onlineCount} online
        </Badge>
      </div>

      <div className="space-y-3">
        {participants.map((participant) => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </div>
    </div>
  );
}

function ParticipantCard({ participant }: { participant: Participant }) {
  const initials = participant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
      <div className="relative">
        <Avatar className="h-10 w-10 border-2 border-border">
          <AvatarImage src={participant.avatar} alt={participant.name} />
          <AvatarFallback className="bg-primary/20 text-sm font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
            participant.isOnline ? 'bg-success' : 'bg-muted-foreground'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{participant.name}</p>
        <p className="text-xs text-muted-foreground">
          Score: <span className="font-mono text-primary">{participant.score}</span>
        </p>
      </div>
    </div>
  );
}
