import { useState } from 'react';
import { Link } from 'wouter';
import {
  ShieldCheck,
  Award,
  HeartPulse,
  Building2,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  Microscope,
  CheckCircle2,
  ArrowRight,
  Clock3,
  Users,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Car,
  Send,
  Activity,
  CalendarDays,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import patientHall from '@assets/clinic/patient-hall.png';
import labTesting from '@assets/clinic/lab-testing.webp';

export function About() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const timelineMilestones = [
    {
      year: '2021',
      titleEn: 'Clinic Foundation at Padmapukuria',
      titleBn: 'পদ্মপুকুরিয়ায় ক্লিনিকের সূচনা',
      descEn: 'Established at Padmapukuria Contai Bypass Road to bring reliable pathology and doctor consultation under one roof.',
      descBn: 'কাঁথি বাইপাস রোডে বিশ্বস্ত প্যাথলজি ও বিশেষজ্ঞ ডাক্তার সেবা এক ছাদের নিচে দেওয়ার লক্ষ্যে সূচনা।',
      icon: Building2,
    },
    {
      year: '2022',
      titleEn: 'Automated Pathology Setup',
      titleBn: 'অটোমেটেড প্যাথলজি ল্যাব চালু',
      descEn: 'Upgraded laboratory with high-throughput 5-part hematology and biochemistry analyzers for fast test reporting.',
      descBn: 'আধুনিক হেমাটোলজি ও বায়োকেমিস্ট্রি অ্যানালাইজার মেশিনের মাধ্যমে নির্ভুল প্যাথলজি সেবা শুরু।',
      icon: Microscope,
    },
    {
      year: '2023',
      titleEn: 'Digital Radiology & ECG Expansion',
      titleBn: 'ডিজিটাল এক্স-রে ও ইসিজি সংযোজন',
      descEn: 'Integrated high-resolution digital X-Ray plate processing, 12-lead ECG, and USG diagnostic consultation.',
      descBn: 'উচ্চমানের ডিজিটাল এক্স-রে, ১২-লিড ইসিজি ও ইউএসজি স্ক্যান সুবিধা যুক্ত করা হয়।',
      icon: Activity,
    },
    {
      year: '2024',
      titleEn: 'Home Sample Collection & Digital Delivery',
      titleBn: 'হোম কালেকশন ও হোয়াটসঅ্যাপ পোর্টেবল রিপোর্ট',
      descEn: 'Launched doorstep blood sample collection across Contai Town and instant WhatsApp PDF report delivery.',
      descBn: 'কাঁথি শহরে বাড়িতে গিয়ে ব্লাড টেস্ট কালেকশন এবং হোয়াটসঅ্যাপে দ্রুত পিডিএফ রিপোর্ট সার্ভিস চালু।',
      icon: Send,
    },
    {
      year: '2025+',
      titleEn: 'Multi-Specialty OPD Clinics',
      titleBn: 'মাল্টি-স্পেশালিটি ওপিডি চেম্বার বিস্তার',
      descEn: 'Expanded visiting consultant chambers covering Neuropsychiatry, General Medicine, Gastroenterology, and Dermatology.',
      descBn: 'নিউরোসাইকিয়াট্রি, মেডিসিন, চর্মরোগ ও গ্যাস্ট্রো বিষয়ের খ্যাতনামা বিশেষজ্ঞদের নিয়মিত চেম্বার প্রসার।',
      icon: Stethoscope,
    },
  ];

  const valuePillars = [
    {
      icon: ShieldCheck,
      titleEn: 'Govt Aligned Standards',
      titleBn: 'সরকারি নিয়মকানুনের পূর্ণ আনুগত্য',
      descEn: 'Operating in accordance with West Bengal Clinical Establishment guidelines with transparent billing.',
      descBn: 'পশ্চিমবঙ্গ স্বাস্থ্য দপ্তরের নির্দিষ্ট নির্দেশিকা ও মূল্য তালিকা অনুযায়ী পরিচালিত।',
    },
    {
      icon: Award,
      titleEn: '100% Diagnostic Accuracy',
      titleBn: '১০০% নিখুঁত টেস্ট রিপোর্ট',
      descEn: 'Daily equipment calibration using certified reference control samples to ensure pinpoint precision.',
      descBn: 'প্রতিদিন ল্যাব মেশিনের ক্যালিব্রেশন ও কোয়ালিটি কন্ট্রোল সুনিশ্চিত করা হয়।',
    },
    {
      icon: HeartPulse,
      titleEn: 'Compassionate Local Care',
      titleBn: 'আন্তরিক ও সহানুভূতিশীল সেবা',
      descEn: 'Courteous local nursing staff and technicians trained to treat every patient with warmth and patience.',
      descBn: 'আমাদের স্থানীয় অভিজ্ঞ কর্মীবৃন্দ প্রতিটি রোগীর সাথে আন্তরিকতা ও যত্ন নিয়ে ব্যবহার করেন।',
    },
    {
      icon: Clock3,
      titleEn: 'Fast Turnaround Times',
      titleBn: 'দ্রুত রিপোর্ট ডেলিভারি',
      descEn: 'Emergency blood parameters reported within 20–45 minutes for urgent clinical decisions.',
      descBn: 'জরুরি রক্তের রিপোর্ট মাত্র ২০ থেকে ৪৫ মিনিটের মধ্যে প্রদান করা হয়।',
    },
  ];

  const faqs = [
    {
      qEn: 'Where exactly is Contai B.B. Health Clinic located?',
      qBn: 'কনটাই বি.বি. হেলথ ক্লিনিক ঠিক কোথায় অবস্থিত?',
      aEn: 'Our clinic is situated right on Contai Bypass Road (Padmapukuria), Purba Medinipur - 721401. It is easily accessible via Toto, auto, or bus from Contai Central Bus Stand (approx. 5 mins).',
      aBn: 'আমাদের ক্লিনিকটি কাঁথি বাইপাস রোড (পদ্মপুকুরিয়া মোড়), পূর্ব মেদিনীপুর - ৭২১৪০১ এ অবস্থিত। কাঁথি বাস স্ট্যান্ড বা স্টেশন থেকে টোটো বা অটোতে মাত্র ৫ মিনিটে পৌঁছানো যায়।',
    },
    {
      qEn: 'What are the operating hours for pathology blood sample collection?',
      qBn: 'রক্ত পরীক্ষা ও প্যাথলজি ল্যাব খোলা থাকার সময়সূচী কী?',
      aEn: 'Blood sample collection starts every morning at 7:00 AM and continues till 7:00 PM daily. Fasting blood samples are ideally collected between 7:00 AM and 10:30 AM.',
      aBn: 'প্রতিদিন সকাল ৭:০০ টা থেকে রাত ৭:০০ টা পর্যন্ত ব্লাড স্যাাম্পল নেওয়া হয়। খালি পেটের রক্তের পরীক্ষার জন্য সকাল ৭:টা থেকে ১০:৩০ টার মধ্যে আসার পরামর্শ দেওয়া হয়।',
    },
    {
      qEn: 'How can I request home blood sample collection in Contai?',
      qBn: 'কাঁথিতে বাড়িতে বসে ব্লাড পরীক্ষার ব্যবস্থা কীভাবে করব?',
      aEn: 'You can request home blood collection by calling 8918933511 or 7718149150 on the previous evening or before 8:00 AM. Our trained phlebotomist will visit your home with sterile equipment.',
      aBn: 'আগের দিন সন্ধ্যায় বা সকাল ৮টার আগে ৮৯১৮৯৩৩৫১১ বা ৭৭১৮১৪৯১৫০ নম্বরে ফোন দিয়ে হোম কালেকশন স্লট বুক করতে পারেন। আমাদের টেকনিশিয়ান বাড়িতে গিয়ে ব্লাড সংগ্রহ করবেন।',
    },
    {
      qEn: 'How can I get my test reports on my smartphone?',
      qBn: 'আমার টেস্টের রিপোর্ট কীভাবে ফোনে পাব?',
      aEn: 'Once your test is verified by our lab lead, an official PDF copy is sent directly to your WhatsApp number. You can also collect hard copies from our reception desk.',
      aBn: 'রিপোর্ট প্রস্তুত হওয়ার পর সরাসরি আপনার দেওয়া হোয়াটসঅ্যাপ নম্বরে পিডিএফ কপি পাঠিয়ে দেওয়া হয়। এছাড়া ল্যাব রিসিভশন থেকেও প্রিন্টেড কপি নেওয়া যাবে।',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-teal-500/5 py-16 sm:py-20 border-b border-border">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-1.5 text-xs font-bold text-primary shadow-xs">
            <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>{t('Padmapukuria Healthcare Landmark', 'পদ্মপুকুরিয়ার প্রথম সারির বিশ্বস্ত স্বাস্থ্য সেবা কেন্দ্র')}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary max-w-4xl mx-auto leading-tight">
            {t('About Contai B.B. Health Clinic', 'আমাদের কথা - কনটাই বি.বি. হেলথ ক্লিনিক')}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'Delivering experienced specialist doctor consultations, automated blood pathology, digital X-Ray, ECG, and USG diagnostics to Padmapukuria, Contai Town, Egra, Tamluk, Digha & Purba Medinipur region with unwavering medical accuracy and care.',
              'কাঁথি, এগরা, রামনগর ও পুরো পূর্ব মেদিনীপুর জেলার মানুষের পাশে — পদ্মপুকুরিয়ায় অবস্থিত আমাদের ক্লিনিকে পাবেন অভিজ্ঞ স্পেশালিস্ট ডাক্তার, আধুনিক অটোমেটেড ল্যাব ও ডিজিটাল ডায়াগনস্টিক সুবিধা।'
            )}
          </p>

          {/* QUICK ACTION BUTTONS */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-[hsl(205_75%_24%)] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-primary-foreground shadow-md transition hover:-translate-y-0.5"
            >
              <CalendarDays className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span>{t('Book Doctor Appointment', 'ডাক্তার দেখানোর বুকিং')}</span>
            </Link>

            <a
              href="tel:8978933511"
              className="inline-flex items-center gap-2 rounded-xl bg-card border border-border hover:bg-secondary px-6 py-3.5 text-xs sm:text-sm font-bold text-primary transition shadow-xs"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>{t('Helpline: 8978933511', 'হেল্পলাইন: ৮৯৭৮৯৩৩৫১১')}</span>
            </a>
          </div>

          {/* STATS HIGHLIGHT BAR */}
          <div className="pt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-primary">15,000+</div>
                <div className="text-[11px] font-semibold text-muted-foreground">{t('Satisfied Patients', 'সন্তুষ্ট রোগী সেবিত')}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-primary">50+</div>
                <div className="text-[11px] font-semibold text-muted-foreground">{t('Daily Pathology Tests', 'দৈনিক ল্যাব রক্ত পরীক্ষা')}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-primary">10+</div>
                <div className="text-[11px] font-semibold text-muted-foreground">{t('Visiting Specialists', 'অভিজ্ঞ স্পেশালিস্ট ডাক্তার')}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl font-extrabold text-primary">100%</div>
                <div className="text-[11px] font-semibold text-muted-foreground">{t('Govt Recognized Lab', 'পশ্চিমবঙ্গ সরকার স্বীকৃত')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FOUNDING STORY & VISION */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary border border-primary/20">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{t('Our Founding Objective', 'আমাদের প্রতিষ্ঠার ইতিহাস ও লক্ষ্য')}</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                  {t('Bridging Quality Healthcare for Contai & Surrounding Regions', 'স্থানীয় মানুষের জন্য বিশ্বস্ত ও নির্ভুল চিকিৎসার অঙ্গীকার')}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t(
                  'Contai B.B. Health Clinic was established with a singular vision: to eliminate the hassle for families in Contai, Egra, Tamluk, Ramnagar, and Digha of travelling long distances to Kolkata or Midnapore for routine specialist consultations and reliable blood pathology testing.',
                  'কাঁথি, এগরা, রামনগর, দীঘা ও তমলুক অঞ্চলের মানুষদের চিকিৎসার জন্য আর দূরে কলকাতায় দৌড়াতে হবে না। পদ্মপুকুরিয়া কাঁথি বাইপাস রোডে অবস্থিত আমাদের ক্লিনিকে পেয়ে যাবেন কলকাতা ও মেদিনীপুরের প্রথিতযশা স্পেশালিস্ট ডাক্তারদের চেম্বার এবং আন্তর্জাতিক মানের অটোমেটেড ল্যাব টেস্ট ব্যবস্থা।'
                )}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {/* MISSION CARD */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-primary font-display font-bold text-sm">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span>{t('Our Mission', 'আমাদের মিশন')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t(
                      'To provide 100% accurate pathology reports, timely specialist OPD slots, and empathetic care at affordable rates.',
                      'নির্ভুল ল্যাব রিপোর্ট, সময়মতো ডাক্তার পরামর্শ ও সাধ্যের মধ্যে সেরা চিকিৎসা সেবা প্রদান করা।'
                    )}
                  </p>
                </div>

                {/* VISION CARD */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-primary font-display font-bold text-sm">
                    <HeartPulse className="h-4 w-4 text-blue-600" />
                    <span>{t('Our Vision', 'আমাদের ভিশন')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t(
                      'To become the most trusted healthcare landmark in Purba Medinipur through medical technology & integrity.',
                      'প্রযুক্তি ও সততার মেলবন্ধনে পূর্ব মেদিনীপুর জেলার এক নম্বর ভরসাযোগ্য স্বাস্থ্য প্রতিষ্ঠানে পরিণত হওয়া।'
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-primary text-xs sm:text-sm">
                      {t('West Bengal Government Recognized Diagnostic Unit', 'পশ্চিমবঙ্গ সরকার স্বীকৃত ও নিবন্ধিত ল্যাব')}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('Strict compliance with clinical laboratory setup protocols.', 'নিয়ম ও স্বাস্থ্যবিধি কঠোরভাবে মেনে পরিচালিত।')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-primary text-xs sm:text-sm">
                      {t('Renowned Visiting Faculty & OPD Consultants', 'অভিজ্ঞ কনসালটেন্ট স্পেশালিস্ট ডাক্তারগণ')}
                    </h4>
                    <p className="text-muted-foreground">
                      {t('Specialists in Neuropsychiatry, General Medicine, Gastroenterology & Dermatology.', 'নিউরোসাইকিয়াট্রি, মেডিসিন, চর্মরোগ ও গ্যাস্ট্রো বিশেষজ্ঞ।')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE CONTAINER */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border-8 border-border bg-card overflow-hidden shadow-2xl group">
                <img
                  src={patientHall}
                  alt="Contai B.B. Health Clinic Patient Waiting Lounge"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 text-white">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Padmapukuria, Contai Bypass Road</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      {t('Spacious air-conditioned waiting hall with patient comfort amenities.', 'শীতাতপ নিয়ন্ত্রিত অপেক্ষালয় ও আরামদায়ক পরিবেশ।')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CLINICAL TIMELINE / MILESTONES */}
      <section className="py-16 sm:py-20 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Activity className="h-3.5 w-3.5" />
              <span>{t('Our Growth Story', 'আমাদের অগ্রগতির ধারা')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Key Milestones in Our Journey', 'যেভাবে আমরা কাঁথির মানুষের আস্থা অর্জন করেছি')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {timelineMilestones.map((m, idx) => {
              const IconComponent = m.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-5 shadow-card hover:shadow-xl hover:border-primary/40 transition duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-xs font-extrabold text-white bg-primary px-3 py-1 rounded-full shadow-xs">
                        {m.year}
                      </span>
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-sm font-bold text-primary leading-snug">
                        {t(m.titleEn, m.titleBn)}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                        {t(m.descEn, m.descBn)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CORE PILLARS & VALUES */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t('Our Guiding Ethics', 'চিকিৎসার মূল চার নীতি')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Four Pillars of Healthcare Excellence', 'সেবার সর্বোচ্চ মান বজায় রাখার অঙ্গীকার')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePillars.map((vp, idx) => {
              const IconComp = vp.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl transition duration-300 space-y-4 flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-base font-bold text-primary">
                      {t(vp.titleEn, vp.titleBn)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(vp.descEn, vp.descBn)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: CLINICAL INFRASTRUCTURE & DIAGNOSTIC TECH */}
      <section className="py-16 sm:py-20 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* IMAGE */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border-8 border-border bg-card overflow-hidden shadow-2xl relative">
                <img src={labTesting} alt="Blood Pathology Testing Equipment" className="w-full h-[400px] object-cover" />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  {t('Fully Automated Lab', 'অটোমেটেড ল্যাব প্রযুক্তি')}
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary border border-primary/20">
                  <Microscope className="h-3.5 w-3.5" />
                  <span>{t('Modern Diagnostic Equipment', 'আধুনিক ল্যাব ও স্ক্যান প্রযুক্তি')}</span>
                </span>
                <h2 className="font-display text-3xl font-extrabold text-primary">
                  {t('Advanced Medical Technology at Padmapukuria', 'আধুনিক ল্যাব প্রযুক্তিতে নির্ভরযোগ্য রিপোর্ট')}
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground">
                <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
                  <strong className="text-primary font-display font-bold text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{t('5-Part Hematology Analyzers', '৫-পার্ট হেমাটোলজি অ্যানালাইজার')}</span>
                  </strong>
                  <p>{t('Complete Blood Count (CBC), Differential Counts, ESR with automated accuracy.', 'রক্তের সিবিসি, ইএসআর ও হিমোগ্লোবিন পরীক্ষার নিখুঁত ফল।')}</p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
                  <strong className="text-primary font-display font-bold text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{t('Fully Automated Biochemistry System', 'বায়োকেমিস্ট্রি ডিজিটাল অ্যানালাইজার')}</span>
                  </strong>
                  <p>{t('Fast Sugar (HbA1c), Lipid Profile, Kidney Function (KFT), and Liver Function (LFT) testing.', 'সুগার, ডায়াবেটিস, লিভার ও কিডনি পরীক্ষার আধুনিক অটোমেশন।')}</p>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-1">
                  <strong className="text-primary font-display font-bold text-sm flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>{t('12-Lead ECG & Digital Radiology', '১২-লিড ইসিজি ও ডিজিটাল এক্স-রে')}</span>
                  </strong>
                  <p>{t('Instant ECG trace printing and digital X-Ray plate processing for immediate clinical evaluation.', 'হৃদরোগ ও এক্স-রে পরীক্ষার দ্রুত ফিল্ম প্রিন্টিং সুবিধা।')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>{t('Frequently Asked Questions', 'সাধারণ প্রশ্নাবলী')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Have Questions About Our Clinic?', 'ক্লিনিক ও পরীক্ষা সম্পর্কিত প্রয়োজনীয় তথ্য')}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card shadow-xs transition overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-sm font-bold text-primary hover:bg-secondary/40 transition"
                  >
                    <span>{t(faq.qEn, faq.qBn)}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground border-t border-border/50 leading-relaxed bg-background/50">
                      {t(faq.aEn, faq.aBn)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA BANNER */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-950 to-slate-900 p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl overflow-hidden border border-white/10">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-teal-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('Your Trusted Healthcare Partner in Contai', 'আপনার পরিবারের সুস্থতায় আমাদের সংকল্প')}</span>
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight text-white">
                {t('Need Specialist Advice or Reliable Blood Tests?', 'ডাক্তার দেখাত বা রক্ত পরীক্ষা করাতে আজই আসুন')}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Visit us at Padmapukuria, Contai Bypass Road or call our desk to reserve doctor slots or order home sample collection.',
                  'পদ্মপুকুরিয়ায় আমাদের ক্লিনিকে আসুন অথবা সরাসরি কল দিয়ে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('Book Online Appointment', 'অনলাইন বুকিং করুন')}</span>
                </Link>

                <a
                  href="tel:8978933511"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition backdrop-blur-sm"
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
