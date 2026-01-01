import React, { useState } from 'react';
import { format } from 'date-fns';
import { Users, MapPin, Calendar, Check, X, Clock, UserPlus, Footprints, Shield } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Run } from '@/types';
import { cn } from '@/lib/utils';

const UserCard: React.FC<{ user: User; onApprove: () => void; onReject: () => void }> = ({ 
  user, 
  onApprove, 
  onReject 
}) => {
  return (
    <div className="bg-card rounded-3xl shadow-soft p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onApprove}
          className="flex-1 h-11 rounded-2xl bg-success hover:bg-success/90 text-success-foreground font-bold"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          onClick={onReject}
          variant="outline"
          className="flex-1 h-11 rounded-2xl border-2 border-destructive text-destructive hover:bg-destructive/10 font-bold"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};

const RunRequestCard: React.FC<{ run: Run; onApprove: () => void; onReject: () => void }> = ({ 
  run, 
  onApprove, 
  onReject 
}) => {
  const runDate = new Date(run.date);

  return (
    <div className="bg-card rounded-3xl shadow-soft p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-warning/20 text-warning-foreground rounded-full text-sm font-bold">
          Pending
        </span>
        <span className="text-sm text-muted-foreground">
          by {run.creatorName}
        </span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{run.location}</h3>
          <p className="text-sm text-muted-foreground">{run.program}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {format(runDate, 'MMM d, yyyy')}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {format(runDate, 'h:mm a')}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onApprove}
          className="flex-1 h-11 rounded-2xl bg-success hover:bg-success/90 text-success-foreground font-bold"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          onClick={onReject}
          variant="outline"
          className="flex-1 h-11 rounded-2xl border-2 border-destructive text-destructive hover:bg-destructive/10 font-bold"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { 
    getPendingUsers, 
    getPendingRuns, 
    approveUser, 
    rejectUser, 
    approveRun, 
    rejectRun,
    users 
  } = useBackend();

  const pendingUsers = getPendingUsers();
  const pendingRuns = getPendingRuns();
  const totalMembers = users.filter(u => u.isApproved).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">Manage members and run requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-3xl shadow-soft p-4 text-center">
          <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-extrabold text-foreground">{totalMembers}</p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
        <div className="bg-card rounded-3xl shadow-soft p-4 text-center">
          <UserPlus className="h-6 w-6 mx-auto mb-2 text-warning" />
          <p className="text-2xl font-extrabold text-foreground">{pendingUsers.length}</p>
          <p className="text-xs text-muted-foreground">Pending Users</p>
        </div>
        <div className="bg-card rounded-3xl shadow-soft p-4 text-center">
          <Footprints className="h-6 w-6 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-extrabold text-foreground">{pendingRuns.length}</p>
          <p className="text-xs text-muted-foreground">Pending Runs</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 rounded-2xl bg-muted p-1 mb-6">
          <TabsTrigger 
            value="users" 
            className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-soft"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Users ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger 
            value="runs" 
            className="rounded-xl font-bold data-[state=active]:bg-card data-[state=active]:shadow-soft"
          >
            <Footprints className="h-4 w-4 mr-2" />
            Runs ({pendingRuns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-0">
          {pendingUsers.length === 0 ? (
            <div className="bg-card rounded-3xl p-8 text-center shadow-soft">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-bold text-lg mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending user approvals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map((user, index) => (
                <div key={user.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <UserCard
                    user={user}
                    onApprove={() => approveUser(user.id)}
                    onReject={() => rejectUser(user.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="runs" className="mt-0">
          {pendingRuns.length === 0 ? (
            <div className="bg-card rounded-3xl p-8 text-center shadow-soft">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-bold text-lg mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending run requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRuns.map((run, index) => (
                <div key={run.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <RunRequestCard
                    run={run}
                    onApprove={() => approveRun(run.id)}
                    onReject={() => rejectRun(run.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
