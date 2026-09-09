import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Stethoscope, Loader2, CalendarDays, ArrowRight, ShieldCheck } from 'lucide-react';

export function Booking() {
  const [, setLocation] = useLocation();
  const [targetUrl, setTargetUrl] = useState('/patient?action=book-doctor');

  useEffect(() => {
    // 1. Extract any doctor/department query parameters passed to /book
    const searchParams = new URLSearchParams(window.location.search);
    const doctorParam = searchParams.get('doctor') || searchParams.get('doctorId') || '';

    // 2. Build target URL with doctor intent
    const query = doctorParam
      ? `?action=book-doctor&doctor=${encodeURIComponent(doctorParam)}`
      : '?action=book-doctor';
    const destination = `/patient${query}`;
    setTargetUrl(destination);

    // 3. Save intent to sessionStorage so PatientPortal picks it up across login steps
    try {
      sessionStorage.setItem(
        'pending_doctor_booking_intent',
        JSON.stringify({
          action: 'book-doctor',
          doctor: doctorParam,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }

    // 4. Instantly redirect:
    // If logged in: goes straight to /patient with doctor slot active
    // If not logged in: goes straight to /patient login screen, and once logged in, doctor slot is automatically active!
    const timer = setTimeout(() => {
      setLocation(destination);
    }, 150);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card shadow-card space-y-5 animate-fadeIn">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
          <Stethoscope className="h-8 w-8 animate-pulse text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-extrabold text-primary">
            Connecting to Doctor Booking...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Redirecting to Contai B.B. Health Clinic patient portal for doctor chamber serial tokens and slot selection.
          </p>
        </div>

        <div className="py-2 flex justify-center items-center gap-2 text-xs font-semibold text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Please wait a moment...</span>
        </div>

        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setLocation(targetUrl)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 px-4 text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Click here if not redirected automatically</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Secure Central Database & Instant Token System</span>
        </div>
      </div>
    </div>
  );
}
