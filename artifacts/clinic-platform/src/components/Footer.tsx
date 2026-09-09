import { Link, useLocation } from 'wouter';
import {
  Phone, Mail, MapPin, ShieldCheck, Stethoscope, Clock3, CalendarDays, ExternalLink, Activity, HeartPulse, Microscope
} from 'lucide-react';
import logo from '@assets/clinic/logo.png';
import { useLanguage } from '@/lib/language-context';

export function Footer() {
  const { t } = useLanguage();
  const [location] = useLocation();

  if (location === '/patient') {
    return (
      <footer className="shrink-0 border-t border-border bg-card py-3 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Contai B.B. Health Clinic · Padmapukuria, Contai · Secure Patient Portal</p>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <a href="tel:8978933511" className="hover:text-primary transition">Emergency Helpline: 8978933511</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      {/* Top Value Banner */}
      <div className="border-b border-primary-foreground/10 bg-primary/80 py-8 px-4">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold">{t('Govt Recognized Lab', 'প পশ্চিমবঙ্গ সরকার স্বীকৃত')}</h4>
              <p className="mt-1 text-xs text-primary-foreground/70">
                {t('Certified diagnostic center with high-accuracy digital testing.', 'উচ্চ নির্ভুলতার ডিজিটাল প্যাথলজি ও পরীক্ষা কেন্দ্র।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))]">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold">{t('Visiting Specialists', 'অন-কল বিশেষজ্ঞ ডাক্তার')}</h4>
              <p className="mt-1 text-xs text-primary-foreground/70">
                {t('Neuropsychiatry, Medicine, Dermatology & Gastro.', 'নিউরোসাইকিয়াট্রি, মেডিসিন, চর্মরোগ ও গ্যাস্ট্রো।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))]">
              <Microscope className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold">{t('Digital Imaging', 'ডিজিটাল ইমেজিং')}</h4>
              <p className="mt-1 text-xs text-primary-foreground/70">
                {t('Digital X-Ray, 12-lead ECG, USG and Pathology.', 'ডিজিটাল এক্স-রে, ১২-লিড ইসিজি, ইউএসজি ও প্যাথলজি।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))]">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold">{t('Quick Helpline', 'জরুরি ফোন লাইন')}</h4>
              <p className="mt-1 text-xs text-primary-foreground/70">
                {t('Call 8978933511 or 8918933511 for appointments.', 'অ্যাপয়েন্টমেন্ট বা হেল্পলাইনের জন্য ফোন করুন।')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Bio */}
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Contai B.B. Health Clinic" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <span className="font-display text-base font-extrabold text-primary-foreground">
                  Contai B.B. <span className="text-[hsl(var(--accent))]">Health Clinic</span>
                </span>
                <p className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">
                  Padmapukuria, Contai
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-primary-foreground/75">
              {t(
                'Contai B.B. Health Clinic is Padmapukuria’s premier healthcare destination, uniting weekly visiting doctor chambers, digital pathology, X-Ray, ECG, and USG diagnostics under one trusted roof.',
                'কাঁথির পদ্মপুকুরিয়ায় অবস্থিত কনটাই বি.বি. হেলথ ক্লিনিক একটি নির্ভরযোগ্য স্বাস্থ্য কেন্দ্র। এখানে সাপ্তাহিক বিশেষজ্ঞ ডাক্তারের চেম্বার, ডিজিটাল প্যাথলজি, এক্স-রে, ইসিজি এবং ইউএসজি পরিষেবা পাওয়া যায়।'
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/book"
                className="rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-xs font-bold text-foreground shadow hover:opacity-90 transition"
              >
                {t('Book Online', 'অনলাইনে বুকিং')}
              </Link>
              <a
                href="tel:8978933511"
                className="rounded-full border border-primary-foreground/30 px-4 py-2 text-xs font-bold hover:bg-primary-foreground/10 transition"
              >
                {t('Call Emergency', 'জরুরি কল')}
              </a>
            </div>
          </div>

          {/* Col 2: Visiting Doctors Schedule */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
              {t('Visiting Specialists Schedule', 'বিশেষজ্ঞ ডাক্তারদের সময়সূচী')}
            </h4>

            <ul className="mt-4 space-y-3 text-xs text-primary-foreground/80">
              <li className="border-b border-primary-foreground/10 pb-2">
                <strong className="block text-primary-foreground font-semibold">Dr. Suman Sarangi</strong>
                <span className="text-[11px] text-[hsl(var(--sidebar-primary))]">Neuropsychiatry · Every Sunday 8:30–10:30 AM</span>
              </li>
              <li className="border-b border-primary-foreground/10 pb-2">
                <strong className="block text-primary-foreground font-semibold">Dr. Kamal Poddar</strong>
                <span className="text-[11px] text-[hsl(var(--sidebar-primary))]">Medicine & Diabetes · Every Saturday 10:00 AM+</span>
              </li>
              <li className="border-b border-primary-foreground/10 pb-2">
                <strong className="block text-primary-foreground font-semibold">Dr. Saikat Maity</strong>
                <span className="text-[11px] text-[hsl(var(--sidebar-primary))]">Dermatology & Hair · Every Sunday 2:00 PM+</span>
              </li>
              <li>
                <strong className="block text-primary-foreground font-semibold">Dr. Rakesh Mohanty</strong>
                <span className="text-[11px] text-[hsl(var(--sidebar-primary))]">Gastroenterology · Appointment basis</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
              {t('Quick Links', 'দ্রুত লিংক')}
            </h4>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-primary-foreground/75">
              <Link href="/about" className="hover:text-primary-foreground transition">{t('About Clinic', 'আমাদের সম্পর্কে')}</Link>
              <Link href="/doctors" className="hover:text-primary-foreground transition">{t('Doctors', 'ডাক্তারবৃন্দ')}</Link>
              <Link href="/services" className="hover:text-primary-foreground transition">{t('Services & Departments', 'সেবা ও বিভাগসমূহ')}</Link>
              <Link href="/packages" className="hover:text-primary-foreground transition">{t('Health Packages', 'প্যাকেজ')}</Link>
              <Link href="/gallery" className="hover:text-primary-foreground transition">{t('Gallery', 'গ্যালারি')}</Link>
              <Link href="/contact" className="hover:text-primary-foreground transition">{t('Map & Directions', 'ম্যাপ')}</Link>
              <Link href="/patient" className="hover:text-primary-foreground transition">{t('Patient Portal', 'পোর্টাল')}</Link>
            </div>
          </div>

          {/* Col 4: Location & Contact Details */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
              {t('Visit & Contact', 'ঠিকানা ও যোগাযোগ')}
            </h4>

            <div className="mt-4 space-y-3 text-xs text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[hsl(var(--accent))] mt-0.5" />
                <span>
                  <strong>Padmapukuria, Contai</strong>
                  <br />
                  Contai Bypass Road (Kolkata Route NH stretch), Purba Medinipur, West Bengal - 721401
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <span>8918933511 / 7718149150</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <span>Emergency: 8978933511</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
                <span className="break-all">contaibbhealthclinic@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Contai B.B. Health Clinic · Padmapukuria, Contai. {t('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">{t('Privacy Policy', 'গোপনীয়তা নীতি')}</Link>
            <span>·</span>
            <Link href="/contact" className="hover:underline">{t('Location Map', 'ম্যাপ লোকেশন')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
