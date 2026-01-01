import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, Shield, LogOut, Menu, X, User } from 'lucide-react';
import { useBackend } from '@/context/MockBackendContext';
import { Button } from '@/components/ui/button';
import fbcLogo from '@/assets/fbc-logo.jpg';
import { cn } from '@/lib/utils';

const AppLayout: React.FC = () => {
  const { authState, logout, getPendingUsers, getPendingRuns } = useBackend();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pendingUsersCount = authState.user?.role === 'admin' ? getPendingUsers().length : 0;
  const pendingRunsCount = authState.user?.role === 'admin' ? getPendingRuns().length : 0;
  const totalPending = pendingUsersCount + pendingRunsCount;

  const navItems = [
    { path: '/dashboard', label: 'Runs', icon: Home },
    { path: '/create-run', label: 'Create', icon: Plus },
    ...(authState.user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: Shield, badge: totalPending }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-card shadow-soft sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={fbcLogo} alt="FBC Running Club" className="h-10 w-auto rounded-xl" />
          <span className="text-xl font-bold text-primary">FBC Running Club</span>
        </div>
        
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              onClick={() => navigate(item.path)}
              className={cn(
                'gap-2 rounded-2xl',
                isActive(item.path) && 'bg-primary text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-1 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">{authState.user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{authState.user?.role}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-2xl">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card shadow-soft sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={fbcLogo} alt="FBC Running Club" className="h-8 w-auto rounded-lg" />
          <span className="text-lg font-bold text-primary">FBC</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{authState.user?.name}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-2xl"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card shadow-lg z-40 p-4 animate-slide-up">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="justify-start gap-3 rounded-2xl"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
            <hr className="my-2 border-border" />
            <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 rounded-2xl text-destructive">
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-2 py-2 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative',
                isActive(item.path) 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-muted-foreground"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
