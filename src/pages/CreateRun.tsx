import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, FileText, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateRun: React.FC = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('06:00');
  const [program, setProgram] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createRun, authState } = useBackend();
  const navigate = useNavigate();
  const isAdmin = authState.user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!location || !date || !time || !program) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    
    if (dateTime < new Date()) {
      setError('Please select a future date and time');
      setIsLoading(false);
      return;
    }

    const result = createRun(location, dateTime.toISOString(), program);

    setTimeout(() => {
      setIsLoading(false);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to create run');
      }
    }, 500);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto animate-scale-in">
        <div className="bg-card rounded-3xl shadow-soft p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isAdmin ? 'Run Created!' : 'Run Submitted!'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isAdmin 
              ? 'Your run has been added to the schedule. Members can now join!'
              : 'Your run is waiting for admin approval. We\'ll notify you once it\'s approved!'
            }
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-bold"
            >
              View Runs
            </Button>
            <Button 
              onClick={() => {
                setSuccess(false);
                setLocation('');
                setDate('');
                setTime('06:00');
                setProgram('');
              }}
              className="flex-1 h-12 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get minimum date (today)
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Create a Run</h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin 
            ? 'Schedule a new run for the club'
            : 'Suggest a run - admin approval required'
          }
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-3xl shadow-soft p-6 md:p-8">
        {!isAdmin && (
          <Alert className="mb-6 rounded-2xl bg-secondary/50 border-secondary">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              As a member, your run will need admin approval before it appears on the schedule.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">Meeting Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="e.g., Central Park Main Entrance"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12 rounded-2xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10 h-12 rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program" className="text-sm font-semibold">Program Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="program"
                placeholder="e.g., Easy 5K recovery run followed by stretching"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="pl-10 min-h-[100px] rounded-2xl resize-none"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg shadow-glow-accent"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {isAdmin ? 'Create Run' : 'Submit for Approval'}
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRun;
