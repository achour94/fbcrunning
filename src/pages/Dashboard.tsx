import React from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { MapPin, Calendar, Users, Clock, Plus, Footprints } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Run } from '@/types';
import { cn } from '@/lib/utils';

const RunCard: React.FC<{ run: Run }> = ({ run }) => {
  const { authState, joinRun, leaveRun, users } = useBackend();
  const isJoined = authState.user ? run.attendees.includes(authState.user.id) : false;
  const runDate = new Date(run.date);
  const isPastRun = isPast(runDate) && !isToday(runDate);

  const getDateLabel = () => {
    if (isToday(runDate)) return 'Today';
    if (isTomorrow(runDate)) return 'Tomorrow';
    return format(runDate, 'EEE, MMM d');
  };

  const handleToggleJoin = () => {
    if (isJoined) {
      leaveRun(run.id);
    } else {
      joinRun(run.id);
    }
  };

  return (
    <div className={cn(
      "bg-card rounded-3xl shadow-soft p-5 transition-all duration-300 hover:shadow-glow animate-slide-up",
      isPastRun && "opacity-60"
    )}>
      {/* Date Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "px-3 py-1 rounded-full text-sm font-bold",
          isToday(runDate) 
            ? "bg-accent text-accent-foreground" 
            : isTomorrow(runDate)
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}>
          {getDateLabel()}
        </span>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {format(runDate, 'h:mm a')}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{run.location}</h3>
          <p className="text-sm text-muted-foreground">{run.program}</p>
        </div>
      </div>

      {/* Organizer */}
      <p className="text-xs text-muted-foreground mb-4">
        Organized by <span className="font-semibold text-foreground">{run.creatorName}</span>
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold">{run.attendees.length}</span>
          <span className="text-muted-foreground">runners</span>
        </div>

        {!isPastRun && (
          <Button
            onClick={handleToggleJoin}
            variant={isJoined ? "outline" : "default"}
            className={cn(
              "rounded-2xl font-bold min-h-[44px] px-6",
              isJoined 
                ? "border-2 border-primary text-primary hover:bg-primary/10" 
                : "bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow-accent"
            )}
          >
            {isJoined ? 'Leave' : 'Join Run'}
          </Button>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { getApprovedRuns, authState } = useBackend();
  const navigate = useNavigate();
  const runs = getApprovedRuns();

  const upcomingRuns = runs.filter(run => {
    const runDate = new Date(run.date);
    return !isPast(runDate) || isToday(runDate);
  });

  const pastRuns = runs.filter(run => {
    const runDate = new Date(run.date);
    return isPast(runDate) && !isToday(runDate);
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Hey, {authState.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">Ready to hit the road? Check out upcoming runs.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-5 text-primary-foreground">
          <Footprints className="h-8 w-8 mb-2 opacity-80" />
          <p className="text-3xl font-extrabold">{upcomingRuns.length}</p>
          <p className="text-sm opacity-80">Upcoming Runs</p>
        </div>
        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-5 text-secondary-foreground">
          <Calendar className="h-8 w-8 mb-2 opacity-80" />
          <p className="text-3xl font-extrabold">{runs.filter(r => r.attendees.includes(authState.user?.id || '')).length}</p>
          <p className="text-sm opacity-80">Runs Joined</p>
        </div>
      </div>

      {/* Upcoming Runs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Upcoming Runs</h2>
          <Button 
            onClick={() => navigate('/create-run')}
            className="rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold min-h-[44px] shadow-glow-accent"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Run
          </Button>
        </div>

        {upcomingRuns.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 text-center shadow-soft">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">No upcoming runs</h3>
            <p className="text-muted-foreground mb-4">Be the first to create a run!</p>
            <Button 
              onClick={() => navigate('/create-run')}
              className="rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              Create Run
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingRuns.map((run, index) => (
              <div key={run.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <RunCard run={run} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Runs */}
      {pastRuns.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Past Runs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastRuns.slice(0, 6).map((run) => (
              <RunCard key={run.id} run={run} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
