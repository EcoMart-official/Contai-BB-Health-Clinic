import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Phone, Menu, X, ShieldCheck, CalendarDays, UserCheck, ChevronDown, Building2, Image, Award, PhoneCall, LogIn
} from 'lucide-react';
import logo from '@assets/clinic/logo.png';
import { useLanguage } from '@/lib/language-context';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();

  const primaryNavLinks = [
    { labelEn: 'Home', labelBn: 'হোম', href: '/' },
    { labelEn: 'Doctors', labelBn: 'ডাক্তারগণ', href: '/doctors' },
    { labelEn: 'Services & Departments', labelBn: 'সেবা ও বিভাগসমূহ', href: '/services' },
    { labelEn: 'Health Packages', labelBn: 'হেলথ প্যাকেজ', href: '/packages' },
    { labelEn: 'Contact & Map', labelBn: 'যোগাযোগ ও ম্যাপ', href: '/contact' },
  ];

  const moreLinks = [
    { labelEn: 'About Clinic', labelBn: 'আমাদের কথা', href: '/about', icon: Building2 },
    { labelEn: 'Clinic Gallery', labelBn: 'ছবি গ্যালারি', href: '/gallery', icon: Image },
  ];

  const allNavLinks = [
    ...primaryNavLinks,
    ...moreLinks.map(m => ({ labelEn: m.labelEn, labelBn: m.labelBn, href: m.href }))
  ];

  // Dedicated Minimal Header for Login Page
  if (location === '/patient') {
    return (
      <header className="shrink-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center sm:justify-between px-4 py-2.5 sm:px-8">
          {/* Logo Lockup */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={logo}
              alt="Contai B.B. Health Clinic"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-primary/20 transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-display text-base sm:text-lg font-extrabold leading-none text-primary block whitespace-nowrap">
                Contai B.B. <span className="text-[hsl(var(--accent))]">Health Clinic</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mt-1 whitespace-nowrap">
                Official Patient Portal
              </span>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-background">
      {/* TOP ANNOUNCEMENT BAR WITH ORIGINAL PRIMARY BLUE COLOR */}
      <div className="bg-gradient-to-r from-primary via-[hsl(205_75%_22%)] to-primary px-3 py-1.5 text-primary-foreground text-xs font-medium border-b border-primary-border overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          
          {/* Govt Recognition Badge */}
          <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-[hsl(var(--accent))] px-2.5 py-0.5 text-[10px] font-extrabold text-foreground uppercase tracking-wider shadow-xs z-10">
            <Award className="h-3 w-3 text-foreground shrink-0" />
            <span className="whitespace-nowrap">{t('Govt Recognized Lab', 'পঃ বঙ্গ সরকার স্বীকৃত')}</span>
          </div>

          {/* Scrolling Ticker Line */}
          <div className="relative flex-1 overflow-hidden py-0.5 max-w-3xl">
            <div className="animate-marquee flex items-center gap-6 text-[11px] font-semibold whitespace-nowrap text-primary-foreground/95">
              <span className="flex items-center gap-1.5">
                📍 {t('Padmapukuria, Contai Bypass Road (NH Kolkata Route), West Bengal - 721401', 'স্থান: পদ্মপুকুরিয়া, কাঁথি বাইপাস রোড (কলকাতা রুট), পশ্চিমবঙ্গ - ৭২১৪০১')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                🚑 {t('24x7 Emergency Helpline: 8978933511 / 7718149150', '২৪ ঘণ্টা জরুরি পরিষেবা হটলাইন: ৮৯৭৮৯৩৩৫১১ / ৭৭১৮১৪৯১৫০')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                🩺 {t('Visiting Specialists: Neuropsychiatry, General Medicine, Dermatology & Gastroenterology', 'বিশেষজ্ঞ চেম্বার: নিউরোসাইকিয়াট্রি, মেডিসিন, চর্মরোগ ও গ্যাস্ট্রোএন্টারোলজি')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                🧪 {t('Digital Diagnostic Lab: Blood, Hormone, 12-Lead ECG & Digital X-Ray', 'ডিজিটাল ল্যাব: রক্ত, মূত্র, হরমোন, ইসিজি, এক্স-রে ও ইউএসজি')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                📱 {t('WhatsApp Digital Reports Delivery Available Directly to Your Phone', 'হোয়াটসঅ্যাপের মাধ্যমে সরাসরি ডিজিটাল ল্যাব রিপোর্ট')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>

              {/* Duplicate for seamless marquee */}
              <span className="flex items-center gap-1.5">
                📍 {t('Padmapukuria, Contai Bypass Road (NH Kolkata Route), West Bengal - 721401', 'স্থান: পদ্মপুকুরিয়া, কাঁথি বাইপাস রোড (কলকাতা রুট), পশ্চিমবঙ্গ - ৭২১৪০১')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                🚑 {t('24x7 Emergency Helpline: 8978933511 / 7718149150', '২৪ ঘণ্টা জরুরি পরিষেবা হটলাইন: ৮৯৭৮৯৩৩৫১১ / ৭৭১৮১৪৯১৫০')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
              <span className="flex items-center gap-1.5">
                🩺 {t('Visiting Specialists: Neuropsychiatry, General Medicine, Dermatology & Gastroenterology', 'বিশেষজ্ঞ চেম্বার: নিউরোসাইকিয়াট্রি, মেডিসিন, চর্মরোগ ও গ্যাস্ট্রোএন্টারোলজি')}
              </span>
              <span className="text-[hsl(var(--accent))] font-bold">•</span>
            </div>
          </div>

          {/* Right side Emergency Contacts (No language toggle) */}
          <div className="shrink-0 flex items-center gap-2 z-10">
            <a
              href="tel:8978933511"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-foreground hover:text-[hsl(var(--accent))] transition bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs"
              title="24x7 Emergency Helpline"
            >
              <PhoneCall className="h-3 w-3 text-[hsl(var(--accent))] shrink-0" />
              <span>8978933511</span>
            </a>

            <a
              href="https://wa.me/917718149150"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-primary-foreground hover:text-[hsl(var(--accent))] transition bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs"
              title="WhatsApp Reports Hotline"
            >
              <Phone className="h-3 w-3 text-[hsl(var(--accent))] shrink-0" />
              <span>7718149150</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 lg:px-6">
          {/* Logo Lockup */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src={logo}
              alt="Contai B.B. Health Clinic"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20 transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-display text-sm sm:text-base font-extrabold leading-none text-primary block whitespace-nowrap">
                Contai B.B. <span className="text-[hsl(var(--accent))]">Health Clinic</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mt-0.5 whitespace-nowrap">
                {t('Padmapukuria, Contai · West Bengal', 'পদ্মপুকুরিয়া, কাঁথি · পশ্চিমবঙ্গ')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (No wrapping ever) */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {primaryNavLinks.map((link) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-secondary text-primary font-bold shadow-sm'
                      : 'text-foreground/80 hover:bg-secondary/60 hover:text-primary'
                  }`}
                >
                  {t(link.labelEn, link.labelBn)}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" onMouseLeave={() => setMoreDropdown(false)}>
              <button
                onClick={() => setMoreDropdown(!moreDropdown)}
                onMouseEnter={() => setMoreDropdown(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-colors whitespace-nowrap"
              >
                <span>{t('More', 'আরও')}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {moreDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150 z-50">
                  {moreLinks.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdown(false)}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                          location === item.href ? 'bg-secondary text-primary font-bold' : 'hover:bg-secondary/70 text-foreground'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4 text-primary/70 shrink-0" />
                        <span>{t(item.labelEn, item.labelBn)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-[hsl(205_75%_24%)] whitespace-nowrap"
            >
              <CalendarDays className="h-3.5 w-3.5 text-[hsl(var(--accent))] shrink-0" />
              <span>{t('Book Appointment', 'বুক অ্যাপয়েন্টমেন্ট')}</span>
            </Link>

            <Link
              href="/patient"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary transition hover:bg-secondary whitespace-nowrap"
            >
              <LogIn className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{t('Login', 'লগইন')}</span>
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition hover:bg-emerald-700 whitespace-nowrap"
              title="Admin & Doctor Desk"
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-border p-2 text-primary xl:hidden hover:bg-secondary shrink-0"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-4 xl:hidden shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid gap-1 mb-4">
            {allNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                  location === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/80 hover:bg-secondary hover:text-primary'
                }`}
              >
                {t(link.labelEn, link.labelBn)}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground whitespace-nowrap"
            >
              <CalendarDays className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              {t('Book', 'বুক')}
            </Link>
            <Link
              href="/patient"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1 rounded-full border border-primary/20 py-2.5 text-xs font-bold text-primary whitespace-nowrap"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t('Login', 'লগইন')}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1 rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white whitespace-nowrap"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
