import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Calendar,
  Clock,
  User,
  CreditCard,
  Building2,
  Share2,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  X,
  Copy,
} from 'lucide-react';

export interface BookingSuccessDetails {
  serialNo: string;
  tokenCode: string;
  doctorName: string;
  specialty?: string;
  date: string;
  timeSlot: string;
  patientName: string;
  fee: string;
  paymentMethod: string;
  paymentId?: string;
}

interface BookingSuccessAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: BookingSuccessDetails;
  onViewAppointments?: () => void;
}

export function BookingSuccessAnimationModal({
  isOpen,
  onClose,
  details,
  onViewAppointments,
}: BookingSuccessAnimationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. Play Flipkart-style pleasant celebration chime (Web Audio API)
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        // Celebratory major triad chord (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.7);
        });
      }
    } catch (e) {
      // Audio autoplay policy fallback (non-blocking)
    }

    // 2. Trigger Flipkart / E-Commerce Celebratory Confetti Cannon
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      zIndex: 99999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // First burst
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#10B981', '#059669', '#34D399', '#3B82F6', '#F59E0B'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#10B981', '#3B82F6', '#6366F1', '#EC4899'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#FFD700', '#FFA500', '#00C853'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Secondary side cannons for grand feel
    const timer = setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        zIndex: 99999,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        zIndex: 99999,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrintSlip = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🏥 *Contai B.B. Health Clinic - Serial Token*\n` +
      `👤 *Patient:* ${details.patientName}\n` +
      `🩺 *Doctor:* ${details.doctorName} (${details.specialty || 'Specialist'})\n` +
      `🎫 *Serial Number:* ${details.serialNo}\n` +
      `🔑 *Token ID:* ${details.tokenCode}\n` +
      `📅 *Date:* ${details.date} | *Slot:* ${details.timeSlot}\n` +
      `💳 *Fee & Payment:* ${details.fee} (${details.paymentMethod})\n` +
      `📍 *Location:* Padmapukuria, Contai, Purba Medinipur\n` +
      `📞 *Helpdesk:* +91 7718149150`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isOnlinePaid = details.paymentMethod.includes('Razorpay') || details.paymentId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative bg-card border border-border/80 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden my-auto animate-in zoom-in-95 duration-300">
        
        {/* Top Decorative Flipkart/Celebration Accent Bar */}
        <div className="h-2.5 w-full bg-linear-to-r from-emerald-500 via-teal-400 to-sky-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition border border-border/60 z-10 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8 text-center space-y-6">
          {/* Animated Animated Checkmark Ring (Flipkart Style Tick Animation) */}
          <div className="relative flex justify-center items-center">
            {/* Outer Expanding Pulse Waves */}
            <div className="absolute h-24 w-24 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
            <div className="absolute h-28 w-28 rounded-full bg-emerald-500/10 animate-pulse" />

            {/* Sparkle Icons */}
            <Sparkles className="absolute -top-1 -right-2 h-6 w-6 text-amber-400 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-2 h-5 w-5 text-emerald-400 animate-pulse" />

            {/* Main Center Green Check Circle */}
            <div className="relative h-20 w-20 rounded-full bg-linear-to-tr from-emerald-600 to-teal-400 shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white scale-up-center">
              <svg
                className="h-11 w-11 stroke-white stroke-[3.5] fill-none drop-shadow-sm checkmark-svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="23"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  opacity="0.3"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Confirmed & Reserved</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Your appointment serial has been successfully booked with the doctor.
            </p>
          </div>

          {/* Flipkart-Style Order / Serial Pass Ticket */}
          <div className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-linear-to-b from-emerald-500/5 via-card to-secondary/30 p-4 sm:p-5 text-left relative shadow-sm overflow-hidden">
            {/* Watermark Logo/Text */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-foreground font-black text-7xl select-none">
              BBHC
            </div>

            {/* Serial Header Row */}
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Serial Number
                </span>
                <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  {details.serialNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Digital Token Code
                </span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/25 font-mono font-black text-xs text-primary">
                  {details.tokenCode}
                </span>
              </div>
            </div>

            {/* Middle Specs Grid */}
            <div className="py-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" />
                  Doctor:
                </span>
                <span className="font-extrabold text-foreground text-right truncate">
                  {details.doctorName}
                </span>
              </div>

              {details.specialty && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Specialty:
                  </span>
                  <span className="font-bold text-primary text-right">
                    {details.specialty}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Date & Slot:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-right">
                  {details.date} • {details.timeSlot}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Patient:
                </span>
                <span className="font-bold text-foreground text-right truncate">
                  {details.patientName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                  {isOnlinePaid ? (
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Building2 className="h-3.5 w-3.5 text-amber-600" />
                  )}
                  Payment:
                </span>
                <div className="text-right">
                  <span className="font-black text-foreground">{details.fee}</span>{' '}
                  {isOnlinePaid ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      ✓ Paid Online (Razorpay)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      ● Pay at Counter
                    </span>
                  )}
                </div>
              </div>

              {details.paymentId && (
                <div className="text-[10px] font-mono text-muted-foreground text-right">
                  Txn ID: {details.paymentId}
                </div>
              )}
            </div>

            {/* Bottom Clinic Address Footer */}
            <div className="pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Contai B.B. Health Clinic</span>
              <span>Padmapukuria, Contai</span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp, Print, and Done */}
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handlePrintSlip}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold transition cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save Slip</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onViewAppointments) {
                  onViewAppointments();
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-black py-3.5 text-xs sm:text-sm shadow-lg shadow-primary/25 transition cursor-pointer"
            >
              <span>View My Appointments</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded CSS for tick draw animation and scaling */}
      <style>{`
        @keyframes scaleUpCenter {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmarkStroke {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .scale-up-center {
          animation: scaleUpCenter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }

        .checkmark-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmarkStroke 0.45s 0.25s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
