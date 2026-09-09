import { Switch, Route, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { LanguageProvider } from '@/lib/language-context';
import { AlertProvider } from '@/lib/alert-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

import { Home } from '@/pages/Home';
import { Doctors } from '@/pages/Doctors';
import { Services } from '@/pages/Services';
import { Packages } from '@/pages/Packages';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Gallery } from '@/pages/Gallery';
import { Booking } from '@/pages/Booking';
import { PatientPortal } from '@/pages/PatientPortal';
import { AdminDashboard } from '@/pages/AdminDashboard';

export function App() {
  const [location] = useLocation();
  const isAdminView = location.startsWith('/admin') || location.startsWith('/app');

  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <LanguageProvider>
          {isAdminView ? (
            <AdminDashboard />
          ) : (
            <div className="min-h-screen flex flex-col bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
              <Header />
              <main className="flex-1 flex flex-col">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/doctors" component={Doctors} />
                  <Route path="/services" component={Services} />
                  <Route path="/departments" component={Services} />
                  <Route path="/packages" component={Packages} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/gallery" component={Gallery} />
                  <Route path="/book" component={Booking} />
                  <Route path="/patient" component={PatientPortal} />
                  <Route path="/admin" component={AdminDashboard} />
                  <Route path="/app/:rest*" component={AdminDashboard} />
                  <Route component={Home} />
                </Switch>
              </main>
              <Footer />
            </div>
          )}
        </LanguageProvider>
      </AlertProvider>
    </QueryClientProvider>
  );
}

export default App;
