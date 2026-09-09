import { useState } from 'react';
import { Link } from 'wouter';
import {
  Phone, Mail, MapPin, Clock3, MessageSquare, Send, CheckCircle2,
  ShieldCheck, CalendarDays, Bus, Train, Car, Sparkles, AlertCircle,
  ExternalLink, Copy, Check, TestTube2, Stethoscope, Activity, User,
  HelpCircle, Home as HomeIcon
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'appointment',
    query: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('Contai B.B. Health Clinic, Padmapukuria, Contai Bypass Road, Purba Medinipur, West Bengal 721401');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clinicHours = [
    {
      icon: TestTube2,
      service: t('Pathology Blood Collection', 'রক্ত পরীক্ষা নমুনা সংগ্রহ'),
      hours: t('Daily 7:00 AM – 7:00 PM', 'প্রতিদিন সকাল ৭:০০ – সন্ধ্যা ৭:০০'),
      badge: t('Fasting Samples Morning', 'সকালের খালি পেটে স্যাম্পল'),
      iconBg: 'bg-rose-500/10 text-rose-600 border-rose-200'
    },
    {
      icon: Stethoscope,
      service: t('Doctor OPD Chambers', 'বিশেষজ্ঞ ডাক্তারদের ওপিডি'),
      hours: t('Sat & Sun (Doctor Schedule)', 'শনিবার ও রবিবার (সময়সূচী অনুযায়ী)'),
      badge: t('Prior Booking', 'অগ্রিম বুকিং'),
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      icon: Activity,
      service: t('Digital X-Ray & ECG', 'ডিজিটাল এক্স-রে ও ইসিজি'),
      hours: t('Daily 8:00 AM – 8:00 PM', 'প্রতিদিন সকাল ৮:০০ – রাত ৮:০০'),
      badge: t('Instant Print', 'ইনস্ট্যান্ট প্রিন্ট'),
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      icon: MessageSquare,
      service: t('WhatsApp Report Delivery', 'ডিজিটাল রিপোর্ট ডেলিভারি'),
      hours: t('24/7 Instant PDF via WhatsApp', '২৪ ঘণ্টা হোয়াটসঅ্যাপের মাধ্যমে'),
      badge: t('Automated', 'অটোমেটেড'),
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* SECTION 1: HERO BANNER */}
      <section className="bg-gradient-to-b from-secondary/60 via-background to-background py-12 sm:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{t('Padmapukuria, Contai, West Bengal', 'পদ্মপুকুরিয়া, কাঁথি, পূর্ব মেদিনীপুর')}</span>
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary max-w-3xl mx-auto leading-tight">
            {t('Contact Us & Clinic Directions', 'যোগাযোগ, ফোন নম্বর ও ক্লিনিকের অবস্থান')}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              'Get in touch with Contai B.B. Health Clinic for visiting doctor appointments, diagnostic test queries, home sample collection, and instant WhatsApp support.',
              'ডাক্তারদের অ্যাপয়েন্টমেন্ট, ল্যাব টেস্ট বুকিং বা হোম স্যাম্পল সংগ্রহের জন্য যেকোনো সময় সরাসরি আমাদের সাথে যোগাযোগ করুন।'
            )}
          </p>

          {/* Quick Info Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-primary">
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <Clock3 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Open Daily: 7 AM – 8 PM', 'প্রতিদিন খোলা: সকাল ৭টা – রাত ৮টা')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Helpline: 8978933511', 'হেল্পলাইন: ৮৯৭৮৯৩৩৫১১')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Free Parking Available', 'ফ্রি পার্কিংয়ের সুব্যবস্থা')}</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: HIGH-IMPACT CONTACT CARDS */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* CARD 1: APPOINTMENTS */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl hover:border-primary/40 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-primary">
                    {t('Appointments Helpline', 'অ্যাপয়েন্টমেন্ট হেল্পলাইন')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('Call for doctor booking & quotes', 'ডাক্তার বুকিং ও তথ্যের জন্য কল করুন')}
                  </p>
                </div>
                <div className="font-mono-ui text-sm font-bold text-primary space-y-0.5 pt-1">
                  <p>8918933511</p>
                  <p>7718149150</p>
                </div>
              </div>

              <a
                href="tel:8918933511"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground py-2.5 px-4 text-xs font-bold text-primary transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t('Call Now', 'সরাসরি কল করুন')}</span>
              </a>
            </div>

            {/* CARD 2: EMERGENCY HOTLINE */}
            <div className="rounded-3xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 p-6 shadow-card hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 animate-pulse text-rose-600" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-rose-700 dark:text-rose-400">
                    {t('Urgent Helpline', 'জরুরি হটলাইন')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('Immediate clinic desk assistance', 'জরুরি পরামর্শ ও ক্লিনিকে যোগাযোগ')}
                  </p>
                </div>
                <div className="font-mono-ui text-base font-extrabold text-rose-700 dark:text-rose-400 pt-1">
                  8978933511
                </div>
              </div>

              <a
                href="tel:8978933511"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 text-xs font-bold shadow-sm transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t('Call Emergency Line', 'জরুরি নম্বরে কল দিন')}</span>
              </a>
            </div>

            {/* CARD 3: WHATSAPP DESK */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 shadow-card hover:shadow-xl transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-emerald-800 dark:text-emerald-300">
                    {t('WhatsApp Direct', 'হোয়াটসঅ্যাপ সহায়তা')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('Get test rates & digital reports', 'ডিজিটাল রিপোর্ট ও মূল্য তালিকায় হোয়াটসঅ্যাপ')}
                  </p>
                </div>
                <div className="font-mono-ui text-base font-extrabold text-emerald-700 dark:text-emerald-400 pt-1">
                  8918933511
                </div>
              </div>

              <a
                href="https://wa.me/918918933511?text=Hi%20Contai%20BB%20Health%20Clinic,%20I%20have%20a%20query."
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 text-xs font-bold shadow-sm transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{t('Chat on WhatsApp', 'হোয়াটসঅ্যাপে মেসেজ দিন')}</span>
              </a>
            </div>

            {/* CARD 4: EMAIL ADDRESS */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl hover:border-primary/40 transition duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-primary">
                    {t('Official Email', 'অফিসিয়াল ইমেইল')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t('For official & feedback queries', 'অফিসিয়াল যোগাযোগের জন্য')}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground break-all font-mono-ui pt-1">
                  contaibbhealthclinic@gmail.com
                </div>
              </div>

              <a
                href="mailto:contaibbhealthclinic@gmail.com"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground py-2.5 px-4 text-xs font-bold text-primary transition"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{t('Send Email', 'ইমেইল পাঠান')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EMBEDDED GOOGLE MAP & DIRECTION GUIDE */}
      <section className="py-12 sm:py-16 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{t('Location & Map', 'ক্লিনিকের অবস্থান ও গুগল ম্যাপ')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('How to Reach Contai B.B. Health Clinic', 'পদ্মপুকুরিয়ায় আমাদের ক্লিনিকে পৌঁছানোর নির্দেশিকা')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('Situated conveniently on Contai Bypass Road (Kolkata Route NH stretch) at Padmapukuria.', 'কাঁথি বাইপাস রোড (কলকাতা রুট সংলগ্ন) পদ্মপুকুরিয়ায় সহজে যাতায়াতের সুব্যবস্থা।')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* GOOGLE MAP IFRAME CONTAINER */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-card overflow-hidden shadow-card p-2 flex flex-col justify-between h-full">
              <div className="relative w-full h-[380px] sm:h-full min-h-[380px] rounded-2xl overflow-hidden bg-secondary">
                <iframe
                  title="Contai B.B. Health Clinic Padmapukuria Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3698.8146749171724!2d87.7554!3d21.7820!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a033f7c00000001%3A0x0!2sPadmapukuria%2C%20Contai%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-card mt-2">
                <div className="flex items-center gap-2 text-muted-foreground text-left">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>Padmapukuria, Contai Bypass Road, Purba Medinipur - 721401</span>
                </div>

                <button
                  onClick={copyAddress}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-secondary hover:bg-secondary/80 px-3.5 py-2 text-xs font-bold text-primary transition shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? t('Address Copied!', 'ঠিকানা কপি হয়েছে!') : t('Copy Address', 'ঠিকানা কপি করুন')}</span>
                </button>
              </div>
            </div>

            {/* TRANSPORT & ROUTE CARDS */}
            <div className="lg:col-span-5 h-full">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                    <Bus className="h-5 w-5 text-primary" />
                    <span>{t('Transport Directions', 'যাতায়াতের মাধ্যমসমূহ')}</span>
                  </h3>

                  <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-1">
                      <strong className="text-primary font-display text-sm flex items-center gap-1.5">
                        <Bus className="h-4 w-4 text-emerald-600" />
                        <span>{t('From Contai Central Bus Stand', 'কাঁথি কেন্দ্রীয় বাস স্ট্যান্ড থেকে')}</span>
                      </strong>
                      <p>{t('Take an e-rickshaw (Toto) or auto towards Padmapukuria Bypass (Kolkata Route). Total travel time is approximately 5 minutes.', 'বাস স্ট্যান্ড থেকে মাত্র ৫ মিনিটে সরাসরি টোটো বা অটোযোগে পদ্মপুকুরিয়া মোড়ে আসা যায়।')}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-1">
                      <strong className="text-primary font-display text-sm flex items-center gap-1.5">
                        <Train className="h-4 w-4 text-blue-600" />
                        <span>{t('From Contai Railway Station', 'কাঁথি রেলওয়ে স্টেশন থেকে')}</span>
                      </strong>
                      <p>{t('Direct auto or Toto available from Contai Station gate directly to Padmapukuria Bypass Clinic.', 'রেল স্টেশন থেকে সরাসরি অটো বা টোটো ধরে বাইপাস পদ্মপুকুরিয়া ক্লিনিকে চলে আসা যায়।')}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/80 space-y-1">
                      <strong className="text-primary font-display text-sm flex items-center gap-1.5">
                        <Car className="h-4 w-4 text-purple-600" />
                        <span>{t('By Private Car / Bike', 'নিজের গাড়ি বা বাইকে')}</span>
                      </strong>
                      <p>{t('Drive along NH 116B / Contai Bypass Road. Spacious free patient vehicle parking is available right inside the clinic campus.', 'বাইপাস রোড ধরে এসে ক্লিনিকে বিনামূল্যে গাড়ি ও বাইক পার্কিংয়ের সুব্যবস্থা রয়েছে।')}</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Padmapukuria+Contai+West+Bengal"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 px-6 text-xs font-bold text-primary-foreground shadow hover:bg-[hsl(205_75%_24%)] transition mt-4"
                >
                  <ExternalLink className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>{t('Open Google Maps App', 'গুগল ম্যাপে ডিরেকশন খুলুন')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CLINIC TIMINGS & QUERY FORM */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* CLINIC TIMINGS CARD */}
            <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:shadow-xl transition duration-300 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary border border-primary/20">
                      <Clock3 className="h-3.5 w-3.5" />
                      <span>{t('Working Schedule', 'খোলা থাকার সময়সূচী')}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>{t('Open Daily', 'প্রতিদিন খোলা')}</span>
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-extrabold text-primary">
                    {t('Clinic & Laboratory Hours', 'ক্লিনিক ও ল্যাব সময়সূচী')}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {t('Our medical team in Padmapukuria is available daily to serve your healthcare needs.', 'আমাদের অভিজ্ঞ মেডিকেল টিম প্রতিদিন পদ্মপুকুরিয়ায় সেবায় প্রস্তুত।')}
                  </p>
                </div>
              </div>

              {/* SCHEDULE ITEMS */}
              <div className="space-y-3">
                {clinicHours.map((ch, idx) => {
                  const IconComp = ch.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-border/80 bg-background/80 hover:bg-background hover:border-primary/40 transition duration-200 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${ch.iconBg}`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display text-xs font-bold text-primary truncate">
                            {ch.service}
                          </h4>
                          <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                            {ch.badge}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-bold">
                          <Clock3 className="h-3 w-3 text-emerald-600" />
                          <span>{ch.hours}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* HOME SAMPLE COLLECTION CALLOUT */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-teal-500/10 to-emerald-500/10 border border-primary/20 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs font-bold text-primary flex items-center gap-1.5">
                    <HomeIcon className="h-4 w-4 text-emerald-600" />
                    <span>{t('Home Blood Sample Collection', 'বাড়িতে বসে ব্লাড টেস্ট কালেকশন')}</span>
                  </span>
                  <a
                    href="tel:8918933511"
                    className="text-[11px] font-extrabold text-primary underline hover:text-emerald-700 transition"
                  >
                    8918933511
                  </a>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t(
                    'For home blood test sample collection in Contai Town, call on the previous evening or before 8:00 AM.',
                    'কাঁথি শহরে হোম স্যাাম্পল সংগ্রহের জন্য আগের দিন সন্ধ্যায় বা সকাল ৮টার মধ্যে ফোন করে স্লট বুকিং করুন।'
                  )}
                </p>
              </div>
            </div>

            {/* INTERACTIVE INQUIRY FORM */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:shadow-xl transition duration-300 flex flex-col justify-between h-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary border border-primary/20 mb-1.5">
                    <Send className="h-3.5 w-3.5" />
                    <span>{t('Direct Support Form', 'সরাসরি বার্তা ও জিজ্ঞাসা')}</span>
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-primary">
                    {t('Send Us Your Question or Request', 'আপনার বার্তা বা স্বাস্থ্য বিষয়ক প্রশ্ন জানান')}
                  </h2>
                </div>

                <a
                  href="https://wa.me/918918933511"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 px-3 py-1.5 text-xs font-bold hover:bg-emerald-500 hover:text-white transition shrink-0"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t('WhatsApp Direct', 'হোয়াটসঅ্যাপে লিখুন')}</span>
                </a>
              </div>

              {submitted ? (
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 p-8 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-emerald-900 dark:text-emerald-300">
                      {t('Thank You! Message Received', 'ধন্যবাদ! আপনার বার্তা আমাদের কাছে পৌঁছেছে।')}
                    </h3>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 max-w-md mx-auto leading-relaxed">
                      {t(
                        'Our Padmapukuria reception desk will review your query and call you back at your mobile number shortly.',
                        'আমাদের ক্লিনিকের সহায়িকা টিম খুব শীঘ্রই আপনার প্রদত্ত নম্বরে কল দিয়ে বিস্তারিত জানিয়ে দেবে।'
                      )}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold shadow transition"
                    >
                      {t('Send Another Query', 'পুনরায় বার্তা পাঠান')}
                    </button>

                    <Link
                      href="/book"
                      className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-card hover:bg-secondary px-5 py-2.5 text-xs font-bold text-primary transition"
                    >
                      {t('Book Doctor Visit', 'ডাক্তার অ্যাপয়েন্টমেন্ট বুকিং')}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-primary flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>{t('Your Full Name', 'আপনার পুরো নাম *')}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('Enter your full name...', 'আপনার পুরো নাম লিখুন...')}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-xs text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-primary flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>{t('Mobile Phone Number', 'মোবাইল নম্বর *')}</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="8918933511"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-xs text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-primary flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-primary" />
                      <span>{t('Topic / Category', 'বিষয় বা ক্যাটাগরি')}</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-xs text-xs font-medium"
                    >
                      <option value="appointment">{t('Doctor Appointment Query', 'বিশেষজ্ঞ ডাক্তার বুকিং বিষয়ে')}</option>
                      <option value="lab">{t('Pathology / X-Ray / USG Rates', 'পরীক্ষার দাম ও ডায়াগনস্টিক তথ্য')}</option>
                      <option value="home">{t('Home Sample Collection Request', 'বাড়িতে বসে রক্ত পরীক্ষা কালেকশন')}</option>
                      <option value="report">{t('Test Report Delivery Assistance', 'পরীক্ষার রিপোর্ট পাওয়া সম্পর্কিত')}</option>
                      <option value="other">{t('General Feedback or Other', 'অন্যান্য তথ্য বা মতামত')}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-primary flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      <span>{t('Your Question / Message', 'আপনার প্রশ্ন বা বার্তা বিবরণ *')}</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.query}
                      onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                      placeholder={t('Write your medical query, preferred doctor name, or test requirement...', 'আপনার পছন্দের ডাক্তারের নাম, টেস্টের নাম বা যেকোনো প্রশ্ন লিখুন...')}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition shadow-xs text-xs font-medium"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{t('We protect your privacy. Contact details are strictly confidential.', 'আপনার তথ্যের গোপনীয়তা ১০০% সুরক্ষিত রাখা হয়।')}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-teal-800 hover:from-[hsl(205_75%_24%)] hover:to-teal-900 py-3.5 px-8 text-xs font-extrabold text-primary-foreground shadow-md hover:shadow-lg transition hover:-translate-y-0.5"
                    >
                      <Send className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <span>{t('Submit Query Now', 'বার্তা নিশ্চিত করুন')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA BANNER */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-950 to-slate-900 p-6 sm:p-10 text-white text-center space-y-4 shadow-2xl overflow-hidden border border-white/10">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-teal-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('Visit Us in Padmapukuria', 'পদ্মপুকুরিয়া ক্লিনিকে আসুন')}</span>
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight text-white">
                {t('Need Fast & Reliable Healthcare in Contai?', 'কাঁথিতে যেকোনো চিকিৎসা সহায়তায় আমরা প্রস্তুত')}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Book online or call our helpline to reserve doctor slots or order home sample collection.',
                  'অনলাইনে বুকিং করুন বা সরাসরি ফোন দিয়ে আজই পরামর্শ নিন।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('Book Online Appointment', 'অনলাইন বুকিং করুন')}</span>
                </Link>

                <a
                  href="tel:8978933511"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-xs sm:text-sm font-bold text-white transition backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>{t('Call 8978933511', 'ফোন করুন: ৮৯৭৮৯৩৩৫১১')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
