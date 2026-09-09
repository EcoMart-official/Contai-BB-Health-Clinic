import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  Phone, CalendarDays, ArrowRight, ShieldCheck, Stethoscope, Clock3, Activity, HeartPulse,
  TestTube2, Microscope, MapPin, CheckCircle2, ChevronRight, UserCheck, Star, Search, X, FlaskConical,
  Zap, Info, Sparkles, FileText, Check, Award, AlertCircle, HelpCircle, MessageSquare, Building2,
  Share2, ArrowUpRight, Compass, Syringe, ScanLine, Brain, HeartHandshake, Quote
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@assets/clinic/logo.png';
import patientHall from '@assets/clinic/patient-hall.png';
import labTesting from '@assets/clinic/lab-testing.webp';
import { useLanguage } from '@/lib/language-context';

export function Home() {
  const { t, lang } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [testSearch, setTestSearch] = useState<string>('');
  const [selectedTestCategory, setSelectedTestCategory] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [symptom, setSymptom] = useState<string>('');

  // Sample tests list for interactive test finder
  const diagnosticTests = [
    { name: 'Complete Blood Count (CBC)', category: 'Blood', price: '₹250', prep: 'Fasting not required', time: 'Same day' },
    { name: 'Fasting Blood Sugar (FBS)', category: 'Diabetic', price: '₹80', prep: '8-10 hrs fasting required', time: 'Same day' },
    { name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetic', price: '₹450', prep: 'Fasting not required', time: 'Same day' },
    { name: 'Lipid Profile (Cholesterol)', category: 'Heart', price: '₹550', prep: '10-12 hrs overnight fasting', time: 'Same day' },
    { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormone', price: '₹500', prep: 'Morning sample preferred', time: 'Same day' },
    { name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: '₹600', prep: 'Fasting preferred', time: 'Same day' },
    { name: 'Kidney Function Test (KFT / RFT)', category: 'Biochemistry', price: '₹600', prep: 'Stay hydrated', time: 'Same day' },
    { name: 'Digital X-Ray (Chest PA)', category: 'Imaging', price: '₹350', prep: 'Remove metal items', time: 'Instant' },
    { name: '12-Lead Digital ECG', category: 'Heart', price: '₹200', prep: 'Rest 10 mins before test', time: 'Instant' },
    { name: 'USG Abdomen & Pelvis', category: 'Imaging', price: '₹850', prep: 'Full bladder required', time: 'Same day' },
    { name: 'Urine Routine & Microscopy', category: 'Biochemistry', price: '₹120', prep: 'First morning sample', time: 'Same day' },
    { name: 'Stool Routine & Occult Blood', category: 'Biochemistry', price: '₹150', prep: 'Clean container', time: 'Same day' },
  ];

  const filteredTests = diagnosticTests.filter((test) =>
    test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
    test.category.toLowerCase().includes(testSearch.toLowerCase()) ||
    test.prep.toLowerCase().includes(testSearch.toLowerCase())
  );

  // Visiting doctors list
  const doctors = [
    {
      id: 'suman-sarangi',
      name: 'Dr. Suman Sarangi',
      specialtyEn: 'Neuropsychiatry & Behavioral Health',
      specialtyBn: 'নিউরোসাইকিয়াট্রি ও মানসিক স্বাস্থ্য',
      credentials: 'MBBS, MD (Neuropsychiatry), MRCPsych Part 1 (UK)',
      scheduleEn: 'Every Sunday, 8:30 AM – 10:30 AM',
      scheduleBn: 'প্রতি রবিবার, সকাল ৮:৩০ – ১০:৩০',
      bioEn: 'Support for dementia, epilepsy, Parkinson’s, addiction care, anxiety, OCD, migraine, and neuropathic pain.',
      bioBn: 'ডিমেনশিয়া, মৃগী রোগ, পারকিনসন, ট্রমা, বিষণ্নতা, উদ্বেগ, মাইগ্রেন ও স্নায়ু ব্যথার অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক।',
      category: 'neuropsychiatry',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'kamal-poddar',
      name: 'Dr. Kamal Poddar',
      specialtyEn: 'Consultant Physician & Internal Medicine',
      specialtyBn: 'মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ',
      credentials: 'MBBS, MD (Medicine), MRCP (UK)',
      scheduleEn: 'Every Saturday, 10:00 AM onward',
      scheduleBn: 'প্রতি শনিবার, সকাল ১০:০০ টা থেকে',
      bioEn: 'Thoughtful consultation for blood sugar, thyroid, high BP, heart, asthma, stomach & nerve concerns.',
      bioBn: 'ডায়াবেটিস, থাইরয়েড, উচ্চ রক্তচাপ, হাঁপানি, পেটের সমস্যা ও জটিল শারীরিক রোগের অভিজ্ঞ কনসালটেন্ট।',
      category: 'medicine',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'saikat-maity',
      name: 'Dr. Saikat Maity',
      specialtyEn: 'Dermatology, Hair & Sexual Health',
      specialtyBn: 'চর্মরোগ, চুল ও যৌন স্বাস্থ্য বিশেষজ্ঞ',
      credentials: 'MD (NM), MSc (Cosmetic & Aesthetic), Diploma Dermatology',
      scheduleEn: 'Every Sunday, 2:00 PM onward',
      scheduleBn: 'প্রতি রবিবার, দুপুর ২:০০ টা থেকে',
      bioEn: 'Specialist attention for skin diseases, acne, hair loss, cosmetic aesthetic treatments & sexual wellness.',
      bioBn: 'ত্বকের রোগ, একনি, অ্যালার্জি, অতিরিক্ত চুল পড়া, কসমোটোলজি ও যৌন স্বাস্থ্যের নির্ভরযোগ্য চিকিৎসা।',
      category: 'dermatology',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rakesh-mohanty',
      name: 'Dr. Rakesh Mohanty',
      specialtyEn: 'Gastroenterology & Hepatology',
      specialtyBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার বিশেষজ্ঞ',
      credentials: 'MBBS, MD (Medicine), DM (Gastroenterology) - Asst. Prof. SCB Medical',
      scheduleEn: 'Appointment-based consultation',
      scheduleBn: 'সিরিয়াল বুকিং এর মাধ্যমে',
      bioEn: 'Expert advice for chronic gastritis, acidity, abdominal pain, bloating, fatty liver & bowel disorders.',
      bioBn: 'দীর্ঘদিনের গ্যাস্ট্রিক, বুক জ্বালা, পেটে ব্যথা, বদহজম, ফ্যাটি লিভার ও পেটের সমস্যার বিশেষজ্ঞ পরমর্শ।',
      category: 'gastroenterology',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredDoctors = selectedSpecialty === 'all'
    ? doctors
    : doctors.filter((d) => d.category === selectedSpecialty);

  // Symptom guidance matcher
  const getSymptomGuidance = () => {
    if (!symptom) return null;
    const lower = symptom.toLowerCase();
    if (lower.includes('headache') || lower.includes('sleep') || lower.includes('brain') || lower.includes('anxiety') || lower.includes('মাথা ব্যথা') || lower.includes('ঘুম')) {
      return { doctor: 'Dr. Suman Sarangi (Neuropsychiatry)', department: 'Neuropsychiatry', test: '12-Lead ECG & Neuro Consultation' };
    }
    if (lower.includes('sugar') || lower.includes('fever') || lower.includes('pressure') || lower.includes('thyroid') || lower.includes('সুগার') || lower.includes('জ্বর')) {
      return { doctor: 'Dr. Kamal Poddar (Consultant Physician)', department: 'General Medicine', test: 'FBS, HbA1c, Lipid Profile' };
    }
    if (lower.includes('skin') || lower.includes('hair') || lower.includes('rash') || lower.includes('চুল') || lower.includes('চামড়া')) {
      return { doctor: 'Dr. Saikat Maity (Dermatology)', department: 'Dermatology & Hair', test: 'Skin Allergy & Hormone Screen' };
    }
    if (lower.includes('stomach') || lower.includes('gas') || lower.includes('acid') || lower.includes('liver') || lower.includes('পেট') || lower.includes('গ্যাস')) {
      return { doctor: 'Dr. Rakesh Mohanty (Gastroenterology)', department: 'Gastroenterology', test: 'USG Abdomen & LFT' };
    }
    return { doctor: 'Dr. Kamal Poddar (General Medicine)', department: 'General Medicine & Diagnostics', test: 'Routine Pathology Screening' };
  };

  const symptomResult = getSymptomGuidance();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[calc(100vh-100px)] lg:min-h-[82vh] flex items-center overflow-hidden bg-gradient-to-b from-[hsl(var(--secondary)/.7)] via-background to-background py-10 lg:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('Padmapukuria, Contai • West Bengal Govt Recognized Lab', 'পদ্মপুকুরিয়া, কাঁথি • পশ্চিমবঙ্গ সরকার স্বীকৃত ল্যাব')}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-[1.12]">
                {t('Comprehensive Local Healthcare with ', 'কাঁথির পদ্মপুকুরিয়ায় ')}
                <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent))] bg-clip-text text-transparent block sm:inline">
                  {t('Specialist Care & Digital Diagnostics', 'বিশেষজ্ঞ চিকিৎসা ও ডিজিটাল ল্যাব')}
                </span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
                {t(
                  'Contai B.B. Health Clinic brings experienced visiting doctors, fully automated pathology, digital X-Ray, 12-lead ECG, and USG diagnostics right to Padmapukuria, Contai. Fast reports, transparent scheduling, and patient-first care.',
                  'পদ্মপুকুরিয়া কাঁথি বাইপাস রোডে অবস্থিত কনটাই বি.বি. হেলথ ক্লিনিকে পাবেন অন-কল বিশেষজ্ঞ ডাক্তারদের চেম্বার, ডিজিটাল প্যাথলজি, এক্স-রে, ইসিজি ও ইউএসজি পরীক্ষা। দ্রুত রিপোর্ট ও অভিজ্ঞ স্বাস্থ্য কর্মীদের পরমর্শ।'
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-[hsl(205_75%_24%)] transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>{t('Book Doctor Consultation', 'ডাক্তার অ্যাপয়েন্টমেন্ট বুক করুন')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="tel:8978933511"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-5 py-3.5 text-sm font-bold text-primary shadow-sm hover:bg-secondary transition"
                >
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span>{t('Helpline: 8978933511', 'হেল্পলাইন: ৮৯৭৮৯৩৩৫১১')}</span>
                </a>
              </div>

              {/* Highlights Badge Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('Govt Recognized Lab', 'সরকার স্বীকৃত ল্যাব')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('Weekly Visiting Specialists', 'অন-কল বিশেষজ্ঞ ডাক্তার')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t('WhatsApp Digital Reports', 'হোয়াটসঅ্যাপ রিপোর্ট')}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual & Live Stats Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-border bg-card shadow-soft overflow-hidden group">
                <img
                  src={patientHall}
                  alt="Inside Contai B.B. Health Clinic Patient Hall"
                  className="w-full h-[320px] sm:h-[400px] object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between rounded-xl bg-background/90 p-3 backdrop-blur-md border border-border shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-display text-xs font-bold text-primary">Contai B.B. Health Clinic</p>
                      <p className="text-[10px] text-muted-foreground">{t('Padmapukuria, Contai Bypass', 'পদ্মপুকুরিয়া, কাঁথি বাইপাস')}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                    {t('OPEN TODAY', 'আজ খোলা')}
                  </span>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-primary/95 p-3.5 text-primary-foreground backdrop-blur-md border border-white/10 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-xs font-bold">{t('Emergency & Booking Helpline', 'জরুরি ও সহায়তামূলক লাইন')}</p>
                      <p className="text-xs font-mono-ui font-semibold text-[hsl(var(--accent))] mt-0.5">8978933511 / 7718149150</p>
                    </div>
                    <a
                      href="tel:8978933511"
                      className="rounded-full bg-[hsl(var(--accent))] p-2 text-foreground hover:scale-105 transition"
                      title="Call Helpline"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 24/7 EMERGENCY & QUICK ACTION TICKER */}
      <section className="bg-primary text-primary-foreground py-6 shadow-md">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/15">
            <div className="flex items-center gap-3 py-2 md:py-0 md:px-4">
              <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))] shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--sidebar-primary))] font-bold">
                  {t('Emergency Line', 'জরুরি যোগাযোগ')}
                </p>
                <p className="font-display text-sm font-bold">8978933511</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-4">
              <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))] shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--sidebar-primary))] font-bold">
                  {t('Appointments', 'অ্যাপয়েন্টমেন্ট লাইন')}
                </p>
                <p className="font-display text-sm font-bold">8918933511 / 7718149150</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-4">
              <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))] shrink-0">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--sidebar-primary))] font-bold">
                  {t('Specialist Chambers', 'বিশেষজ্ঞ ডাক্তারের সময়')}
                </p>
                <p className="font-display text-sm font-bold">{t('Saturday & Sunday Regular', 'শনি ও রবিবার নিয়মিত')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 md:py-0 md:px-4">
              <div className="rounded-xl bg-[hsl(var(--accent))/0.2] p-2.5 text-[hsl(var(--accent))] shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--sidebar-primary))] font-bold">
                  {t('Location', 'ঠিকানা')}
                </p>
                <p className="font-display text-sm font-bold">{t('Padmapukuria, Contai', 'পদ্মপুকুরিয়া, কাঁথি')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: QUICK ACTION PORTAL TILES */}
      <section className="py-12 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/book"
              className="group rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 hover:-translate-y-1 transition text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-primary">{t('Book Visit', 'বুকিং করুন')}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{t('Instant Doctor Slot', 'ডাক্তারের সময় নিন')}</p>
            </Link>

            <Link
              href="/services"
              className="group rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 hover:-translate-y-1 transition text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Microscope className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-primary">{t('Test Catalog', 'ল্যাব পরীক্ষা')}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{t('Pathology & X-Ray', 'প্যাথলজি ও এক্স-রে')}</p>
            </Link>

            <Link
              href="/doctors"
              className="group rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 hover:-translate-y-1 transition text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-primary">{t('Doctor Schedules', 'ডাক্তারদের সময়')}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{t('Weekly Specialists', 'বিশেষজ্ঞদের বিবরণ')}</p>
            </Link>

            <Link
              href="/packages"
              className="group rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 hover:-translate-y-1 transition text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-primary">{t('Health Checkups', 'হেলথ চেকআপ')}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{t('Discounted Packages', 'প্যাকেজ অফার')}</p>
            </Link>

            <Link
              href="/contact"
              className="col-span-2 sm:col-span-1 group rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 hover:-translate-y-1 transition text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-display text-sm font-bold text-primary">{t('Map Directions', 'ম্যাপ ও ঠিকানা')}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">{t('Padmapukuria Route', 'পদ্মপুকুরিয়ার রাস্তা')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS & IMPACT COUNTERS */}
      <section className="py-14 border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary">15,000+</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                {t('Satisfied Local Patients', 'সন্তুষ্ট স্থানীয় রোগী')}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-[hsl(var(--accent))]">25+</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                {t('Automated Diagnostic Tests', 'অটোমেটেড প্যাথলজি পরীক্ষা')}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-primary">4</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                {t('Specialist Visiting Disciplines', 'বিশেষজ্ঞ চিকিৎসার বিভাগ')}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-600">100%</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                {t('Digital Report Accuracy', 'ডিজিটাল রিপোর্টের নির্ভুলতা')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: VISITING SPECIALIST DOCTOR CHAMBERS */}
      <section className="py-16 lg:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
                <Stethoscope className="h-3.5 w-3.5 text-primary" />
                <span>{t('Expert Medical Faculty in Contai', 'কনসালটেন্ট বিশেষজ্ঞ চিকিৎসকবৃন্দ')}</span>
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-3">
                {t('Visiting Specialist Chambers', 'বিশেষজ্ঞ চিকিৎসকদের তালিকা ও সময়সূচী')}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {t(
                  'Regular visiting doctors from premier medical institutions consult at Contai B.B. Health Clinic on fixed weekly days.',
                  'প্রতি সপ্তাহে নির্দিষ্ট দিনগুলিতে নামকরা হাসপাতালের অভিজ্ঞ কনসালটেন্ট ডাক্তাররা পদ্মপুকুরিয়ার ক্লিনিকে রোগী দেখেন।'
                )}
              </p>
            </div>

            {/* Specialty Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: t('All Doctors', 'সকল ডাক্তার') },
                { id: 'neuropsychiatry', label: t('Neuropsychiatry', 'নিউরোসাইকিয়াট্রি') },
                { id: 'medicine', label: t('General Medicine', 'মেডিসিন') },
                { id: 'dermatology', label: t('Dermatology', 'চর্মরোগ') },
                { id: 'gastroenterology', label: t('Gastroenterology', 'গ্যাস্ট্রো') },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedSpecialty(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSpecialty === pill.id
                      ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                      : 'bg-card border border-border text-foreground hover:bg-secondary/70 hover:border-primary/30'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/90 bg-card p-5 shadow-soft hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition duration-300 overflow-hidden"
              >
                <div>
                  {/* Doctor Portrait Header */}
                  <div className="relative mb-4 overflow-hidden rounded-xl bg-secondary/30 h-48 sm:h-52">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      <span>{t('VISITING', 'অন-কল')}</span>
                    </span>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        {lang === 'bn' ? doctor.specialtyBn : doctor.specialtyEn}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-extrabold text-primary">{doctor.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium leading-tight">
                    {doctor.credentials}
                  </p>

                  <div className="mt-3.5 p-2.5 rounded-xl bg-secondary/40 border border-border/60 flex items-center gap-2 text-xs font-bold text-primary">
                    <Clock3 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{lang === 'bn' ? doctor.scheduleBn : doctor.scheduleEn}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                    {lang === 'bn' ? doctor.bioBn : doctor.bioEn}
                  </p>
                </div>

                <Link
                  href="/book"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 px-4 text-xs font-bold text-primary-foreground shadow-sm hover:bg-[hsl(205_75%_24%)] transition group-hover:shadow-md"
                >
                  <span>{t('Book Chamber Slot', 'সিরিয়াল বুক করুন')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE SYMPTOM ROUTER */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
              {t('Smart Patient Assistant', 'রোগী সহায়ক সিস্টেম')}
            </span>
            <h2 className="font-display text-3xl font-extrabold">
              {t('Not sure which doctor or test you need?', 'কোন ডাক্তার বা পরীক্ষাটি আপনার প্রয়োজন নিশ্চিত নন?')}
            </h2>
            <p className="text-sm text-primary-foreground/75">
              {t(
                'Type your symptom below (e.g. headache, sugar check, gas, hair loss) and we will point you to the right department.',
                'নিচে আপনার শারীরিক সমস্যা লিখে সার্চ করুন (যেমন: মাথা ব্যথা, সুগার, গ্যাস, ত্বক সমস্যা)।'
              )}
            </p>
          </div>

          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder={t('Enter symptom (e.g., headache, gas, fever, skin rash)...', 'লক্ষণ লিখুন (যেমন: মাথা ব্যথা, গ্যাস, জ্বর)...')}
                className="w-full rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-4 pl-12 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-primary))]"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-primary-foreground/50" />
            </div>

            {symptomResult && (
              <div className="mt-4 rounded-2xl bg-primary-foreground/15 p-5 border border-primary-foreground/20 text-xs space-y-2 animate-in fade-in duration-300">
                <p className="font-bold text-[hsl(var(--sidebar-primary))] text-sm">
                  {t('Recommended Guidance:', 'পরামর্শসূচক তথ্য:')}
                </p>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="bg-primary/50 p-2.5 rounded-xl border border-primary-foreground/10">
                    <span className="text-[10px] text-primary-foreground/60 block">{t('Specialist', 'ডাক্তার')}</span>
                    <strong className="text-primary-foreground">{symptomResult.doctor}</strong>
                  </div>
                  <div className="bg-primary/50 p-2.5 rounded-xl border border-primary-foreground/10">
                    <span className="text-[10px] text-primary-foreground/60 block">{t('Department', 'বিভাগ')}</span>
                    <strong className="text-primary-foreground">{symptomResult.department}</strong>
                  </div>
                  <div className="bg-primary/50 p-2.5 rounded-xl border border-primary-foreground/10">
                    <span className="text-[10px] text-primary-foreground/60 block">{t('Diagnostic Test', 'পরীক্ষা')}</span>
                    <strong className="text-primary-foreground">{symptomResult.test}</strong>
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <Link href="/book" className="inline-flex items-center gap-1 font-bold text-[hsl(var(--sidebar-primary))] hover:underline">
                    {t('Proceed to Book Visit', 'সিরিয়াল বুকিং এগিয়ে যান')} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: CLINICAL DEPARTMENTS OVERVIEW */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              {t('Specialized Divisions', 'ক্লিনিক্যাল বিভাগসমূহ')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              {t('Comprehensive Departments Under One Roof', 'আমাদের সকল বিশেষায়িত বিভাগসমূহ')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                'Organized clinical support for routine wellness, complex disease management, and precise diagnostic testing.',
                'প্রতিদিনের শারীরিক যত্ন থেকে শুরু করে জটিল রোগের পর্যবেক্ষণ ও পরীক্ষা সেবা।'
              )}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Stethoscope,
                title: t('General Medicine', 'জেনারেল মেডিসিন'),
                desc: t('Everyday consultation for blood pressure, diabetes, thyroid, fever, infections, and routine health maintenance.', 'রক্তচাপ, ডায়াবেটিস, থাইরয়েড, জ্বর ও শারীরিক অসুখের নির্ভরযোগ্য চিকিৎসা পরামর্শ।'),
                tag: 'Dr. Kamal Poddar'
              },
              {
                icon: Brain,
                title: t('Neuropsychiatry', 'নিউরোসাইকিয়াট্রি'),
                desc: t('Specialist care for epilepsy, migraine, dementia, anxiety, OCD, sleep disorders, and nerve pain.', 'মৃগী রোগ, মাইগ্রেন, উদ্বেগ, অবসাদ, প্যারালাইসিস ও স্নায়ুর ব্যথার বিশেষ চিকিৎসাসেবা।'),
                tag: 'Dr. Suman Sarangi'
              },
              {
                icon: Sparkles,
                title: t('Dermatology & Hair', 'চর্মরোগ ও চোট যত্ন'),
                desc: t('Diagnosis for skin infections, eczema, hair fall, acne, cosmetology advice, and sexual health.', 'ত্বক সংক্রমণ, এলার্জি, ব্রণ, অতিরিক্ত চুল পড়া ও কসমোটোলজির বিশেষজ্ঞ পরামর্শ।'),
                tag: 'Dr. Saikat Maity'
              },
              {
                icon: Activity,
                title: t('Gastroenterology', 'গ্যাস্ট্রোএন্টারোলজি'),
                desc: t('Treatment for chronic gastritis, acidity, fatty liver, abdominal pain, bloating, and digestive discomfort.', 'দীর্ঘদিনের পেটে ব্যথা, বুক জ্বালা, ফ্যাটি লিভার ও বদহজমের চিকিৎসা সমাধান।'),
                tag: 'Dr. Rakesh Mohanty'
              },
              {
                icon: TestTube2,
                title: t('Pathology & Digital Lab', 'প্যাথলজি ও ডিজিটাল ল্যাব'),
                desc: t('State-recognized digital lab providing blood, stool, urine, hormone, and biochemistry investigation.', 'রক্ত, প্রস্রাব, হরমোন ও লিভার-কিডনি প্রোফাইলের ডিজিটাল নির্ভুল পরীক্ষা।'),
                tag: 'Fully Automated'
              },
              {
                icon: ScanLine,
                title: t('Imaging & Cardiac Diagnostics', 'ডিজিটাল এক্স-রে, ইসিজি ও ইউএসজি'),
                desc: t('High-frequency Digital X-Ray, 12-lead ECG heart tracing, and USG ultrasound scanning.', 'ডিজিটাল ইসিজি, চেস্ট এক্স-রে এবং অভিজ্ঞ সোনালজিস্ট দ্বারা ইউএসজি পরীক্ষা।'),
                tag: 'Digital Imaging'
              },
            ].map((dept, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 hover:-translate-y-1 transition duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <dept.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 font-mono-ui text-[10px] font-bold text-primary">
                    {dept.tag}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-primary">{dept.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2 flex-1">{dept.desc}</p>

                <Link
                  href="/departments"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-[hsl(var(--accent))] transition"
                >
                  <span>{t('View Department Details', 'বিস্তারিত দেখুন')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INTERACTIVE DIAGNOSTIC TEST FINDER & PRICE CATALOG */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-background via-secondary/20 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Control Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
                  <TestTube2 className="h-3.5 w-3.5 text-primary" />
                  <span>{t('Transparent Lab Pricing', 'স্বচ্ছ পরীক্ষার রেটচার্ট')}</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-3 leading-tight">
                  {t('Search & Explore Diagnostic Tests', 'প্যাথলজি ও ডিজিটাল ডায়াগনস্টিক পরীক্ষার তালিকা')}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {t(
                    'Contai B.B. Health Clinic offers automated pathology testing at fair, transparent rates. Search any routine blood test, X-Ray, ECG, or USG below.',
                    'পদ্মপুকুরিয়া কন্টাই বি.বি. হেলথ ক্লিনিকে সবধরনের প্যাথলজি, রক্ত পরীক্ষা, ইসিজি, এক্স-রে ও ইউএসজি পরীক্ষার স্বচ্ছ তালিকা ও তথ্য দেওয়া হল।'
                  )}
                </p>
              </div>

              {/* Search Bar with Clear Button */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground/70" />
                <input
                  type="text"
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  placeholder={t('Search test name (e.g. CBC, Sugar, Lipid, X-Ray)...', 'পরীক্ষার নাম লিখে সার্চ করুন...')}
                  className="w-full rounded-2xl border border-border bg-card pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm transition"
                />
                {testSearch && (
                  <button
                    onClick={() => setTestSearch('')}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Report Collection & Quality Guarantee Box */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft space-y-3">
                <p className="font-display text-xs font-extrabold text-primary flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>{t('Lab Quality & Delivery Standards', 'ল্যাব মান ও রিপোর্ট সুবিধা')}</span>
                </p>
                <div className="grid gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t('Same-day delivery for routine blood & urine test reports', 'বেশিরভাগ রক্ত ও সাধারণ প্যাথলজি রিপোর্ট একই দিনে প্রদান')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t('Direct PDF reports via WhatsApp upon request', 'হোয়াটসঅ্যাপে সরাসরি পিডিএফ ডিজিটাল রিপোর্ট সার্ভিস')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t('West Bengal Govt. recognized automated diagnostic setup', 'পশ্চিমবঙ্গ সরকার অনুমোদিত সম্পূর্ণ অটোমেটেড ডিজিটাল ল্যাব')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary">{t('Sample Collection Helpline:', 'হোম কালেকশন হেল্পলাইন:')}</span>
                  <a
                    href="tel:8978933511"
                    className="text-xs font-mono-ui font-extrabold text-teal-700 hover:underline"
                  >
                    8978933511
                  </a>
                </div>
              </div>
            </div>

            {/* Right Test Catalog Container */}
            <div className="lg:col-span-7 bg-card border border-border/90 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-primary text-sm">
                    {t('Verified Diagnostic Catalog', 'পরীক্ষার রেট চার্ট')}
                  </span>
                  <span className="rounded-full bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5">
                    {filteredTests.length} {t('Tests', 'টি পরীক্ষা')}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                  {t('Estimated Rate & Delivery', 'আনুমানিক দর ও সময়')}
                </span>
              </div>

              {/* Scrollable Test List */}
              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredTests.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-secondary/30 border border-dashed border-border">
                    <AlertCircle className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                    <p className="text-sm font-bold text-primary">
                      {t('No tests matched your query', 'কোনো পরীক্ষা পাওয়া যায়নি')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Call our enquiry counter directly at 8978933511 / 7718149150 for custom tests.', 'অন্যান্য পরীক্ষার দর জানতে সরাসরি হেল্পলাইনে ফোন করুন: ৮৯৭৮৯৩৩৫১১')}
                    </p>
                  </div>
                ) : (
                  filteredTests.map((test, index) => (
                    <div
                      key={index}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/80 transition-all border border-border/60 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition mt-0.5">
                          {test.category === 'Heart' || test.category === 'Cardiac' ? (
                            <HeartPulse className="h-5 w-5" />
                          ) : test.category === 'Imaging' || test.category === 'Ultrasound' ? (
                            <ScanLine className="h-5 w-5" />
                          ) : test.category === 'Hormone' ? (
                            <Sparkles className="h-5 w-5" />
                          ) : (
                            <TestTube2 className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <span className="font-display text-sm font-extrabold text-primary block group-hover:text-teal-800 transition">
                            {test.name}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="rounded bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border">
                              {test.category}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              {test.prep}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <div className="sm:text-right">
                          <span className="font-display text-base font-extrabold text-primary block leading-none">
                            {test.price}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground block mt-1">
                            ⏱️ {test.time}
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/918978933511?text=Hi%20Contai%20BB%20Health%20Clinic,%20I%20want%20to%20enquire/book%20the%20test:%20${encodeURIComponent(test.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-bold px-3 py-2 transition flex items-center gap-1 shrink-0"
                        >
                          <span>{t('Inquire', 'বুকিং')}</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9: STATE OF THE ART MEDICAL TECHNOLOGY */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
                {t('Precision Laboratory Setup', 'আধুনিক ল্যাব প্রযুক্তি')}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
                {t('Advanced Diagnostic Equipment & Automation', 'নির্ভুল পরীক্ষার জন্য আধুনিক ও অটোমেটেড প্রযুক্তি')}
              </h2>
              <p className="text-sm leading-relaxed text-primary-foreground/75">
                {t(
                  'Our diagnostic center in Padmapukuria is equipped with fully automated hematology analyzers, digital radiography, high-resolution ultrasonography, and 12-lead digital ECG units to minimize human error and deliver precise clinical data.',
                  'আমাদের ডিজিটাল ল্যাবে রয়েছে সর্বাধুনিক অটোমেটেড হেমাটোলজি অ্যানালাইজার, উচ্চমাত্রার ডিজিটাল এক্স-রে, কালার ডপলার সহ ইউএসজি ও ১২-লিড ডিজিটাল ইসিজি মেশিন।'
                )}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-primary-foreground/10 p-4 rounded-2xl border border-primary-foreground/15">
                  <h4 className="font-bold text-sm text-primary-foreground">{t('Fully Automated Lab', 'সম্পূর্ণ অটোমেটেড ল্যাব')}</h4>
                  <p className="text-xs text-primary-foreground/70 mt-1">{t('Zero manual pipetting errors', 'নির্ভুল ডিজিটাল অ্যানালাইসিস')}</p>
                </div>
                <div className="bg-primary-foreground/10 p-4 rounded-2xl border border-primary-foreground/15">
                  <h4 className="font-bold text-sm text-primary-foreground">{t('High-Resolution USG', 'কালার ডপলার ইউএসজি')}</h4>
                  <p className="text-xs text-primary-foreground/70 mt-1">{t('Detailed organ ultrasound scanning', 'অভিজ্ঞ চিকিৎসকের নির্দেশনায়')}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border-8 border-primary-foreground/10 bg-primary/50 overflow-hidden shadow-2xl">
                <img
                  src={labTesting}
                  alt="Laboratory Equipment at Contai B.B. Health Clinic"
                  className="w-full h-[360px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CURATED PREVENTIVE HEALTH CHECKUP PACKAGES */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              {t('Preventive Healthcare', 'প্রতিরোধমূলক হেলথ প্যাকেজ')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              {t('Curated Health Packages for You & Your Family', 'সাশ্রয়ী ও সম্পূর্ণ হেলথ চেকআপ প্যাকেজ')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                'Comprehensive health packages designed for routine checkups, diabetes control, senior citizens, and general wellness.',
                'আপনার ও পরিবারের বার্ষিক স্বাস্থ্য সুরক্ষায় সাশ্রয়ী রক্ত ও ডায়াগনস্টিক প্যাকেজ।'
              )}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: t('Essential Baseline Screen', 'প্রাথমিক হেলথ চেকআপ'),
                tag: t('Popular', 'জনপ্রিয়'),
                price: '₹799',
                desc: t('Core pathology screening for everyday health overview.', 'সাধারণ শারীরিক অবস্থা জানার জন্য মৌলিক পরীক্ষা।'),
                items: [
                  'Complete Blood Count (CBC)',
                  'Fasting Blood Sugar (FBS)',
                  'Lipid Profile (Cholesterol)',
                  'Urine Routine & Microscopy',
                  '12-Lead Digital ECG'
                ]
              },
              {
                title: t('Diabetes & Metabolic Profile', 'ডায়াবেটিস ও থাইরয়েড প্যাকেজ'),
                tag: t('Recommended', 'বিশেষ পছন্দ'),
                price: '₹1,299',
                featured: true,
                desc: t('For individuals managing sugar, thyroid, and blood pressure.', 'ডায়াবেটিস, থাইরয়েড ও ব্লাড প্রেসার পর্যবেক্ষণে।'),
                items: [
                  'FBS & PPBS Blood Sugar',
                  'HbA1c (3-Month Sugar Avg)',
                  'Thyroid Profile (T3, T4, TSH)',
                  'Kidney Function Test (KFT)',
                  'Liver Function Test (LFT)'
                ]
              },
              {
                title: t('Comprehensive Senior Wellness', 'বয়স্কদের বিশেষ প্যাকেজ'),
                tag: t('Full Checkup', 'সম্পূর্ণ চেকআপ'),
                price: '₹1,899',
                desc: t('Complete annual health review for senior family members.', 'পরিবারের বয়স্ক সদস্যদের সার্বিক শারীরিক নিরীক্ষা।'),
                items: [
                  'Full Blood & Biochemistry Screen',
                  'Thyroid & HbA1c Sugar Test',
                  'Digital X-Ray Chest PA',
                  'USG Abdomen & Pelvis',
                  'Doctor Consultation Review'
                ]
              }
            ].map((pack, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 shadow-card flex flex-col justify-between border transition duration-300 ${
                  pack.featured
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono-ui text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        pack.featured
                          ? 'bg-[hsl(var(--sidebar-primary))] text-primary'
                          : 'bg-secondary text-primary'
                      }`}
                    >
                      {pack.tag}
                    </span>
                    <span className="font-display text-2xl font-extrabold">{pack.price}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold">{pack.title}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${pack.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {pack.desc}
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs">
                    {pack.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className={`h-4 w-4 shrink-0 ${pack.featured ? 'text-[hsl(var(--sidebar-primary))]' : 'text-emerald-600'}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-current/10">
                  <Link
                    href="/book"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold transition ${
                      pack.featured
                        ? 'bg-[hsl(var(--accent))] text-foreground hover:opacity-90'
                        : 'bg-primary text-primary-foreground hover:bg-[hsl(205_75%_24%)]'
                    }`}
                  >
                    <span>{t('Book Package Now', 'প্যাকেজ বুক করুন')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: STEP BY STEP PATIENT CARE & BOOKING JOURNEY */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              {t('Simple & Transparent Process', 'সহজ ৪টি ধাপ')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary">
              {t('How Booking & Visiting Works', 'আমাদের ক্লিনিক বুকিং কিভাবে কাজ করে')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('From appointment request to receiving your digital test report.', 'সিরিয়াল বুকিং থেকে শুরু করে রিপোর্ট পাওয়া পর্যন্ত সহজ প্রক্রিয়া।')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: t('Choose Doctor or Test', 'ডাক্তার বা পরীক্ষা নির্বাচন'),
                desc: t('Select your visiting specialist or diagnostic test from our list.', 'আমাদের তালিকা থেকে পছন্দের ডাক্তার বা পরীক্ষাটি বেছে নিন।')
              },
              {
                step: '02',
                title: t('WhatsApp Verification', 'হোয়াটসঅ্যাপ ভেরিফিকেশন'),
                desc: t('Enter mobile number and receive instant 6-digit WhatsApp OTP.', 'মোবাইল নম্বর লিখে সরাসরি হোয়াটসঅ্যাপ ওটিপি কোড নিশ্চিত করুন।')
              },
              {
                step: '03',
                title: t('Visit Padmapukuria Clinic', 'পদ্মপুকুরিয়া ক্লিনিকে আগমন'),
                desc: t('Arrive at Contai Bypass Road clinic during designated chamber time.', 'পদ্মপুকুরিয়া ক্লিনিকে নির্দিষ্ট সময়ে উপস্থিত হোন।')
              },
              {
                step: '04',
                title: t('Receive Digital Reports', 'ডিজিটাল রিপোর্ট সংগ্রহ'),
                desc: t('Collect physical copy at reception or receive PDF on WhatsApp.', 'ক্লিনিক কাউন্টার বা সরাসরি হোয়াটসঅ্যাপে পিডিএফ রিপোর্ট পান।')
              }
            ].map((s, idx) => (
              <div key={idx} className="relative rounded-3xl border border-border bg-card p-6 shadow-card space-y-3">
                <span className="font-mono-ui text-3xl font-extrabold text-[hsl(var(--accent))] block">{s.step}</span>
                <h3 className="font-display text-base font-bold text-primary">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: VIRTUAL FACILITY TOUR GALLERY */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
                {t('Inside Our Clinic', 'ক্লিনিক পরিবেশ')}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mt-2">
                {t('Facility & Care Environments', 'পরিচ্ছন্ন ও আরামদায়ক পরিবেশ')}
              </h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              <span>{t('View Full Photo Gallery', 'সকল ছবি দেখুন')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card group">
              <img src={patientHall} alt="Patient Hall" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-4">
                <h4 className="font-display text-sm font-bold text-primary">{t('Spacious Patient Waiting Hall', 'আরামদায়ক অপেক্ষালয়')}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t('Clean, air-conditioned seating for patients and families.', 'পরিচ্ছন্ন ও শীতাতপ নিয়ন্ত্রিত অপেক্ষাগার।')}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card group">
              <img src={labTesting} alt="Digital Pathology Lab" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-4">
                <h4 className="font-display text-sm font-bold text-primary">{t('Automated Pathology Testing', 'ডিজিটাল প্যাথলজি ইউনিট')}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t('State-recognized laboratory with automated analyzers.', 'ডিজিটাল মেশিন নির্ভর সুসজ্জিত ল্যাব।')}</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card group">
              <img src={patientHall} alt="Clinic Reception Lounge" className="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-4">
                <h4 className="font-display text-sm font-bold text-primary">{t('Dedicated Healthcare Team', 'সহানুভূতিশীল স্বাস্থ্য কর্মী')}</h4>
                <p className="text-xs text-muted-foreground mt-1">{t('Friendly local staff assisting with booking & reports.', 'সহায়তামূলক পেশাদার কর্মী দল।')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: PATIENT STORIES & REVIEWS */}
      <section className="py-12 sm:py-14 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <HeartHandshake className="h-3.5 w-3.5 text-primary" />
              <span>{t('Local Patient Experiences', 'রোগীদের অনুভূতি ও মতামত')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mt-1.5">
              {t('Trusted by Families Across Contai & Purba Medinipur', 'কাঁথি ও মেদিনীপুরের শত শত পরিবারের ভরসা')}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-0.5 text-xs text-muted-foreground">
              <span className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </span>
              <strong className="text-primary font-bold">4.9 / 5.0 Rating</strong>
              <span>• {t('Based on 350+ Local Patient Reviews', '৩৫০+ প্রত্যক্ষ রোগীর সন্তুষ্টি')}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: t('Dr. Suman Sarangi provided calm, attentive consultation for my father’s nerve pain. Having specialist care in Padmapukuria saved us traveling to Midnapore or Kolkata.', 'ডঃ সুমন সারঙ্গী মহাশয়ের পরামর্শে বাবার স্নায়ুর সমস্যা অনেক কমেছে। পদ্মপুকুরিয়ায় এতো ভালো ডাক্তার পাওয়ায় কলকাতায় যেতে হলো না।'),
                name: 'Ananya Das',
                location: 'Padmapukuria, Contai',
                initials: 'AD',
                bgGradient: 'from-blue-600 to-indigo-700'
              },
              {
                quote: t('Quick blood test reports and polite staff. I got my lipid profile report delivered on WhatsApp within hours.', 'খুব দ্রুত প্যাথলজি পরীক্ষা ও চমৎকার ব্যবহার। কয়েক ঘণ্টার মধ্যেই রক্ত পরীক্ষার রিপোর্ট পেয়ে গেছি।'),
                name: 'Sujit Bhowmik',
                location: 'Contai Town',
                initials: 'SB',
                bgGradient: 'from-teal-600 to-emerald-700'
              },
              {
                quote: t('Dr. Kamal Poddar listened carefully to my mother’s thyroid and blood sugar concerns. Transparent booking process.', 'মায়ের ডায়াবেটিস ও থাইরয়েডের চিকিৎসায় ডঃ কামাল পোদ্দার স্যারের চিকিৎসা অত্যন্ত ফলপ্রসূ হয়েছে।'),
                name: 'Subrata Maity',
                location: 'Egra, Purba Medinipur',
                initials: 'SM',
                bgGradient: 'from-purple-600 to-indigo-800'
              }
            ].map((rev, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative Quotation Mark Watermark */}
                <Quote className="absolute right-4 top-4 h-16 w-16 text-primary/5 pointer-events-none group-hover:text-primary/10 transition" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{t('Verified Patient', 'যাচাইকৃত রোগী')}</span>
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                    "{rev.quote}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center gap-3 relative z-10">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${rev.bgGradient} text-white font-display text-xs font-extrabold flex items-center justify-center shrink-0 shadow-sm`}>
                    {rev.initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-extrabold text-primary">{rev.name}</p>
                    <p className="text-[11px] text-muted-foreground">{rev.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14: HEALTH BLOG & PREVENTIVE TIPS */}
      <section className="py-12 sm:py-14 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>{t('Health Education', 'স্বাস্থ্য সচেতনতা ও গাইড')}</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mt-2">
                {t('Health Awareness Articles', 'স্বাস্থ্য বিষয়ক নিবন্ধ ও সচেতনতা')}
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-xs font-bold text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition group shrink-0"
            >
              <span>{t('View All Health Articles', 'সকল স্বাস্থ্য নিবন্ধ দেখুন')}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: t('Managing Blood Sugar & HbA1c in Daily Life', 'দৈনন্দিন জীবনে ডায়াবেটিস ও ব্লাড সুগার নিয়ন্ত্রণ'),
                cat: 'General Medicine',
                readTime: '4 min read',
                desc: t('Essential guidelines on diet, walking, and routine blood tests for diabetes management in Bengal.', 'বাংলায় খাদ্যাভ্যাস, হাঁটা ও নিয়মিত রক্তের সুগার পরীক্ষার নির্দেশিকা।'),
                icon: Activity,
                color: 'text-blue-600 bg-blue-50 border-blue-200/80',
                headerGradient: 'from-blue-500/10 via-teal-500/10 to-transparent'
              },
              {
                title: t('Understanding Anxiety, Sleep & Neurohealth', 'ঘুমের সমস্যা, উদ্বেগ ও স্নায়বিক সচেতনতা'),
                cat: 'Neuropsychiatry',
                readTime: '5 min read',
                desc: t('How to identify early signs of insomnia, migraine, and mental stress with doctor guidance.', 'ইনসোমনিয়া, মাইগ্রেন ও মানসিক চাপের প্রাথমিক লক্ষণ ও প্রতিকার।'),
                icon: Brain,
                color: 'text-purple-600 bg-purple-50 border-purple-200/80',
                headerGradient: 'from-purple-500/10 via-indigo-500/10 to-transparent'
              },
              {
                title: t('Humid Weather Hair Loss & Skin Care Tips', 'উপকূলীয় আবহাওয়ায় ত্বকের এলার্জি ও চুল পড়া'),
                cat: 'Dermatology',
                readTime: '3 min read',
                desc: t('Protecting your skin and hair in humid coastal weather near Digha and Contai.', 'আদ্র আবহাওয়ায় চর্মরোগ প্রতিরোধ ও চুলের যত্ন নেওয়ার নিয়ম।'),
                icon: Sparkles,
                color: 'text-rose-600 bg-rose-50 border-rose-200/80',
                headerGradient: 'from-rose-500/10 via-amber-500/10 to-transparent'
              }
            ].map((art, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-border bg-card shadow-card hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Article Banner Header */}
                <div className={`p-6 bg-gradient-to-br ${art.headerGradient} border-b border-border/50 relative`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${art.color}`}>
                      {art.cat}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
                      <Clock3 className="h-3 w-3 text-primary" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <art.icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-primary group-hover:text-teal-800 transition leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2.5">
                      {art.desc}
                    </p>
                  </div>

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-teal-700 transition pt-2"
                  >
                    <span>{t('Read Full Article', 'সম্পূর্ণ নিবন্ধ পড়ুন')}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 15: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-14 bg-gradient-to-b from-background via-secondary/10 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>{t('Patient Queries', 'সাধারণ প্রশ্নাবলী ও সহায়িকা')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mt-1.5">
              {t('Frequently Asked Questions', 'জরুরি উত্তর ও সাধারণ জিজ্ঞাসাবলি')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('Everything you need to know about doctor consultations, lab tests, timing, and clinic location.', 'ডাক্তার দেখানোর নিয়ম, ল্যাব পরীক্ষার সময় ও আমাদের ঠিকানা সম্পর্কিত প্রয়োজনীয় তথ্য।')}
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                icon: CalendarDays,
                tag: t('Booking & Slots', 'বুকিং নিয়ম'),
                q: t('How do I book an appointment with visiting doctors?', 'ডাক্তারের সিরিয়াল কিভাবে বুক করব?'),
                a: t('Select "Book Consultation" on our website, enter your mobile number, choose your doctor and date. Alternatively, you can directly call our reception helpline at 8978933511 / 7718149150 or send a message on WhatsApp.', 'আমাদের ওয়েবসাইট থেকে "Book Consultation" এ ক্লিক করে বা সরাসরি ৮৯৭৮৯৩৩৫১১ নম্বর ফোন করে আপনি পছন্দের ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করতে পারবেন।')
              },
              {
                icon: MapPin,
                tag: t('Location & Landmark', 'ঠিকানা ও পথ নির্দেশ'),
                q: t('Where is Contai B.B. Health Clinic located?', 'কনটাই বি.বি. হেলথ ক্লিনিকটি কোথায় অবস্থিত?'),
                a: t('The clinic is situated at Padmapukuria, Contai, Purba Medinipur, right on the Contai Bypass Road (Kolkata-bound NH stretch), West Bengal - 721401.', 'ক্লিনিকটি পুরুলিয়া/কলকাতা গামী কাঁথি বাইপাস রোডে পদ্মপুকুরিয়া পেট্রোল পাম্পের নিকটে, কাঁথিতে অবস্থিত।')
              },
              {
                icon: Stethoscope,
                tag: t('Visiting Specialists', 'ডাক্তারদের তালিকা'),
                q: t('Which visiting doctors consult here regularly?', 'এখানে কোন কোন বিশেষজ্ঞ ডাক্তার নিয়মিত বসেন?'),
                a: t('Dr. Suman Sarangi (Neuropsychiatry - Sundays), Dr. Kamal Poddar (Consultant Physician - Saturdays), Dr. Saikat Maity (Dermatology - Sundays), and Dr. Rakesh Mohanty (Gastroenterology - By Appt).', 'ডঃ সুমন সারঙ্গী (নিউরোসাইকিয়াট্রি - রবিবার), ডঃ কামাল পোদ্দার (মেডিসিন - শনিবার), ডঃ সাইকাত মাইতি (চর্মরোগ - রবিবার) এবং ডঃ রাকেশ মহান্তি (গ্যাস্ট্রো - অন অ্যাপয়েন্টমেন্ট)।')
              },
              {
                icon: TestTube2,
                tag: t('Lab Reports', 'প্যাথলজি ও রিপোর্ট'),
                q: t('How quickly do I get blood and diagnostic test reports?', 'প্যাথলজি ও ল্যাব পরীক্ষার রিপোর্ট কখন পাওয়া যায়?'),
                a: t('Most blood and routine pathology reports are ready the same evening. Digital PDF reports can also be delivered directly to your WhatsApp upon request.', 'বেশিরভাগ রক্ত পরীক্ষার রিপোর্ট একই দিনে প্রস্তুত হয় এবং প্রয়োজনীয় ক্ষেত্রে আপনার হোয়াটসঅ্যাপে সরাসরি ডিজিটাল পিডিএফ রিপোর্ট পাঠানো হয়।')
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              const IconComp = faq.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-primary/50 bg-card shadow-md ring-1 ring-primary/20'
                      : 'border-border/80 bg-card/80 hover:bg-card hover:border-primary/30 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition group"
                  >
                    <div className="flex items-center gap-3.5 pr-2">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isOpen
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                      }`}>
                        <IconComp className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-0.5">
                          {faq.tag}
                        </span>
                        <h3 className="font-display text-sm sm:text-base font-extrabold text-primary leading-snug">
                          {faq.q}
                        </h3>
                      </div>
                    </div>

                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-secondary text-muted-foreground'
                    }`}>
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-border/50 text-xs sm:text-sm text-foreground/80 leading-relaxed bg-secondary/20">
                      <p className="pt-2">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>


        </div>
      </section>

      {/* SECTION 16: LOCATION & DIRECTIONS MAP CALLOUT */}
      <section className="py-12 sm:py-14 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--sidebar-primary))]">
                {t('Easy Navigation', 'সহজ নেভিগেশন')}
              </span>
              <h2 className="font-display text-3xl font-extrabold">
                {t('Visit Contai B.B. Health Clinic in Padmapukuria', 'পদ্মপুকুরিয়ার কনটাই বি.বি. হেলথ ক্লিনিকে আসুন')}
              </h2>
              <p className="text-sm text-primary-foreground/75 leading-relaxed">
                {t(
                  'Located conveniently on the Contai Bypass Road (Kolkata Route NH stretch), Padmapukuria, Contai, Purba Medinipur, PIN 721401.',
                  'কাঁথি বাইপাস রোডে পদ্মপুকুরিয়ায় অবস্থিত। মেদিনীপুর, দীঘা ও কলকাতা রুটের যেকোনো গাড়ি থেকেই সহজে পৌঁছানো যায়।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Padmapukuria+Contai+West+Bengal"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--sidebar-primary))] px-5 py-3 text-xs font-bold text-primary shadow hover:opacity-90 transition"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t('Open Google Maps', 'গুগল ম্যাপে দেখুন')}</span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-xs font-bold hover:bg-primary-foreground/10 transition"
                >
                  <span>{t('View Detailed Directions', 'দিকনির্দেশন দেখুন')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border-4 border-primary-foreground/20 bg-primary-foreground/10 p-6 space-y-3 text-xs">
                <h4 className="font-display font-bold text-sm text-[hsl(var(--sidebar-primary))]">
                  {t('Landmark Guidance:', 'ল্যান্ডমার্ক নির্দেশিকা:')}
                </h4>
                <p>• {t('From Contai Bus Stand: 5 minutes via Bypass Road.', 'কাঁথি বাস স্ট্যান্ড থেকে ৫ মিনিটের দূরত্বে বাইপাস রোডে।')}</p>
                <p>• {t('From Contai Railway Station: Auto/E-rickshaw available to Padmapukuria.', 'কাঁথি রেল স্টেশন থেকে টোটো বা অটো সরাসরি পদ্মপুকুরিয়ায় আসে।')}</p>
                <p>• {t('Helpline for Directions: 8978933511', 'রাস্তার খবরের জন্য ফোন করুন: ৮৯৭৮৯৩৩৫১১')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 17: FINAL BOOKING CALL TO ACTION BANNER */}
      <section className="py-8 sm:py-12 bg-background border-b border-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-950 to-slate-900 p-6 sm:p-10 text-white text-center space-y-4 shadow-2xl overflow-hidden border border-white/10">
            {/* Background Decorative Glow Bubbles */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-teal-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('Ready to Consult a Specialist?', 'ডাক্তার দেখাতে চান?')}</span>
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold max-w-3xl mx-auto leading-tight text-white">
                {t('Your Family’s Health Deserves Prompt, Trusted Care', 'আপনার পরিবারের স্বাস্থ্য সুরক্ষায় নির্ভরযোগ্য ও দ্রুত পদক্ষেপ নিন')}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Schedule a visit with our visiting specialists or get fast, high-accuracy diagnostic testing in Padmapukuria, Contai.',
                  'কাঁথি পদ্মপুকুরিয়ায় অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের কনসালটেশন ও সম্পূর্ণ অটোমেটেড ল্যাব পরীক্ষার সুবিধা।'
                )}
              </p>

              {/* Quick Trust Checks */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-teal-200/90 pt-0.5">
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t('Instant OTP Booking', 'সহজ অনলাইন অ্যাপয়েন্টমেন্ট')}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t('Same-day Lab Reports', 'একই দিনে ল্যাব রিপোর্ট')}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t('No Hidden Service Fees', 'কোনো অতিরিক্ত সার্ভিস চার্জ নেই')}</span>
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-7 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('Book Your Consultation Now', 'এখনই অ্যাপয়েন্টমেন্ট বুক করুন')}</span>
                  <ArrowRight className="h-4 w-4" />
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
