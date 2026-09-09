import { useState } from 'react';
import { Link } from 'wouter';
import {
  Microscope, TestTube2, Activity, ScanLine, Search, CheckCircle2,
  Clock3, ShieldCheck, FileText, Phone, CalendarDays, ArrowRight, Info, Award,
  Brain, Stethoscope, Sparkles, HeartPulse, Pill, Baby, Flame, UserCheck,
  MessageSquare, Home as HomeIcon, Check, ChevronRight, Droplet
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function Services() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const clinicalDepartments = [
    {
      id: 'neuro',
      icon: Brain,
      title: t('Neuropsychiatry & Mental Health', 'নিউরোসাইকিয়াট্রি ও মানসিক স্বাস্থ্য'),
      doctor: 'Dr. Suman Sarangi (MBBS, MD)',
      schedule: t('Every Sunday: 8:30 AM – 10:30 AM', 'প্রতি রবিবার: সকাল ৮:৩০ – ১০:৩০'),
      desc: t(
        'Expert evaluation for headache, migraine, depression, anxiety, sleep disorders, epilepsy, OCD, and stress management.',
        'মাথাব্যথা, বিষণ্নতা, মানসিক দুশ্চিন্তা, অনিদ্রা, মৃগী রোগ ও মানসিক স্বাস্থ্যের নির্ভরযোগ্য চিকিৎসা।'
      ),
      badgeBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
    },
    {
      id: 'medicine',
      icon: Stethoscope,
      title: t('General Medicine & Diabetes', 'মেডিসিন, ডায়াবেটিস ও প্রেশার'),
      doctor: 'Dr. Kamal Poddar (MBBS, MD)',
      schedule: t('Every Saturday: 10:00 AM Onwards', 'প্রতি শনিবার: সকাল ১০:০০ টা থেকে'),
      desc: t(
        'Comprehensive management of high blood pressure, diabetes, fever, thyroid, hypertension, and internal organs.',
        'উচ্চ রক্তচাপ, অনিয়ন্ত্রিত ডায়াবেটিস, থাইরয়েড, জ্বর ও জটিল শারীরিক সমস্যার অভিজ্ঞ চেম্বার।'
      ),
      badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      id: 'derma',
      icon: Sparkles,
      title: t('Dermatology & Hair Care', 'চর্ম, অ্যালার্জি ও চুল বিশেষজ্ঞ'),
      doctor: 'Dr. Saikat Maity (MBBS, MD)',
      schedule: t('Every Sunday: 2:00 PM Onwards', 'প্রতি রবিবার: দুপুর ২:০০ টা থেকে'),
      desc: t(
        'Modern clinical care for acne, eczema, psoriasis, skin allergies, fungal infections, and hair loss treatment.',
        'ব্রণ, একজিমা, সোরিয়াসিস, চর্ম অ্যালার্জি, ফাঙ্গাল ইনফেকশন ও চুল পড়ার আধুনিক চিকিৎসা।'
      ),
      badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-200'
    },
    {
      id: 'gastro',
      icon: HeartPulse,
      title: t('Gastroenterology & Liver', 'গ্যাস্ট্রোএন্টারোলজি ও লিভার'),
      doctor: 'Dr. Rakesh Mohanty (MBBS, DM)',
      schedule: t('Monthly Specialist Visit (Prior Booking)', 'বিশেষজ্ঞ ভিজিট (অগ্রিম বুকিং)'),
      desc: t(
        'Specialized care for acidity, IBS, fatty liver, stomach ulcers, jaundice, and digestive tract disorders.',
        'গ্যাস্ট্রিক, লিভারের সমস্যা, পেটে ব্যথা, বদহজম ও পাচনতন্ত্রের জটিল সমস্যার চিকিৎসা।'
      ),
      badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      id: 'gynae',
      icon: UserCheck,
      title: t('Gynecology & Women’s Health', 'স্ত্রী রোগ ও প্রসূতি বিভাগ'),
      doctor: t('Visiting Senior Consultant', 'অভিজ্ঞ স্ত্রী রোগ বিশেষজ্ঞ'),
      schedule: t('Regular Weekly Visiting Hours', 'সাপ্তাহিক নিয়মিত চেম্বার'),
      desc: t(
        'Comprehensive care for pregnancy monitoring, PCOS, menstrual irregularities, and female wellness.',
        'গর্ভাবস্থার পরিচর্যা, পিসিওএস (PCOS), মাসিক অনিয়ম ও নারীদের স্বাস্থ্য সচেতনতামূলক কনসালটেশন।'
      ),
      badgeBg: 'bg-purple-500/10 text-purple-600 border-purple-200'
    },
    {
      id: 'pedia',
      icon: Baby,
      title: t('Pediatrics & Child Care', 'শিশু রোগ ও বিকাশ বিভাগ'),
      doctor: t('Pediatric Specialist Consultant', 'অভিজ্ঞ শিশু বিশেষজ্ঞ'),
      schedule: t('Prior Appointment Basis', 'অগ্রিম বুকিং সাপেক্ষে'),
      desc: t(
        'Compassionate treatment for child fever, respiratory issues, vaccinations, and growth milestone checks.',
        'শিশুর জ্বর, সর্দি-কাশি, টিকাদান এবং শারীরিক ও মানসিক বিকাশ সম্পর্কিত পরামর্শ।'
      ),
      badgeBg: 'bg-sky-500/10 text-sky-600 border-sky-200'
    }
  ];

  const diagnosticServices = [
    // Pathology
    { id: 1, name: 'Complete Blood Count (CBC) with ESR', cat: 'pathology', price: '₹250', prep: 'No fasting required', turnaround: 'Same Day (4 hrs)', desc: 'Measures Hemoglobin, RBC, WBC, Platelets, Hematocrit for anemia & infection detection.' },
    { id: 2, name: 'Fasting Blood Sugar (FBS)', cat: 'pathology', price: '₹80', prep: '8-10 hours overnight fasting', turnaround: 'Same Day', desc: 'Baseline diabetes and glucose level screening.' },
    { id: 3, name: 'Post Prandial Blood Sugar (PPBS)', cat: 'pathology', price: '₹80', prep: '2 hours after meal', turnaround: 'Same Day', desc: 'Post-meal glucose absorption and insulin response test.' },
    { id: 4, name: 'HbA1c (Glycated Hemoglobin)', cat: 'pathology', price: '₹450', prep: 'No fasting required', turnaround: 'Same Day', desc: '3-month average blood glucose control assessment.' },
    { id: 5, name: 'Lipid Profile (Full Cholesterol)', cat: 'pathology', price: '₹550', prep: '10-12 hours overnight fasting', turnaround: 'Same Day', desc: 'Measures Total Cholesterol, Triglycerides, HDL, LDL, VLDL for cardiac health.' },
    { id: 6, name: 'Liver Function Test (LFT)', cat: 'pathology', price: '₹600', prep: 'Fasting preferred', turnaround: 'Same Day', desc: 'Bilirubin, SGOT, SGPT, Alkaline Phosphatase, Protein profile.' },
    { id: 7, name: 'Kidney Function Test (KFT / RFT)', cat: 'pathology', price: '₹600', prep: 'Stay hydrated', turnaround: 'Same Day', desc: 'Urea, Creatinine, Uric Acid, Sodium, Potassium electrolytes.' },
    { id: 8, name: 'Thyroid Profile (T3, T4, TSH)', cat: 'hormone', price: '₹500', prep: 'Morning sample preferred', turnaround: 'Same Day', desc: 'Comprehensive thyroid hormone imbalance screening.' },
    { id: 9, name: 'Urine Routine & Microscopy', cat: 'pathology', price: '₹120', prep: 'First morning urine sample', turnaround: 'Same Day', desc: 'Checks protein, sugar, pus cells, crystals for UTI and kidney health.' },
    { id: 10, name: 'Stool Routine & Occult Blood', cat: 'pathology', price: '₹150', prep: 'Clean sterile container', turnaround: 'Same Day', desc: 'Digestive tract infection and intestinal bleeding screen.' },

    // Cardiac & Imaging
    { id: 11, name: '12-Lead Digital ECG (Heart Tracing)', cat: 'cardiac', price: '₹200', prep: 'Rest 10 minutes prior', turnaround: 'Instant', desc: 'Detects arrhythmias, ischemia, heart rate abnormalities with digital precision.' },
    { id: 12, name: 'Digital X-Ray Chest PA View', cat: 'imaging', price: '₹350', prep: 'Remove metal objects', turnaround: 'Instant', desc: 'High-frequency digital imaging for chest infections, pneumonia & ribs.' },
    { id: 13, name: 'Digital X-Ray Spine & Joints (Knee/Cervical)', cat: 'imaging', price: '₹400', prep: 'No prep required', turnaround: 'Instant', desc: 'High-resolution bone alignment, arthritis & fracture imaging.' },
    { id: 14, name: 'Ultrasonography (USG) Abdomen & Pelvis', cat: 'ultrasound', price: '₹850', prep: 'Full urinary bladder required', turnaround: 'Same Day', desc: 'Detailed abdominal organ scan for gallstones, fatty liver, kidney stones, pelvic health.' },
    { id: 15, name: 'USG KUB (Kidney, Ureter, Bladder)', cat: 'ultrasound', price: '₹700', prep: 'Full urinary bladder', turnaround: 'Same Day', desc: 'Targeted ultrasound scan for kidney stones, hydronephrosis & bladder.' },
  ];

  const processSteps = [
    {
      num: '01',
      title: t('Sample Collection', 'নমুনা স্যাম্পল গ্রহণ'),
      desc: t('Visits at clinic or hygienic home sample collection across Contai Town & Padmapukuria.', 'আমাদের পরিচ্ছন্ন ল্যাবে বা আপনার বাড়িতে গিয়ে নিপুণভাবে স্যাম্পল গ্রহণ করা হয়।'),
      icon: Droplet
    },
    {
      num: '02',
      title: t('Automated Testing', 'অটোমেটেড ল্যাব প্রসেস'),
      desc: t('High-precision barcoded automated pathology analyzers ensure zero manual error.', 'সম্পূর্ণ অটোমেটেড মেশিনের সাহায্যে কোনো রকম ভুল ছাড়াই রক্তের পরীক্ষা হয়।'),
      icon: TestTube2
    },
    {
      num: '03',
      title: t('Doctor Verification', 'চিকিৎসক পর্যবেক্ষণ'),
      desc: t('Senior pathologists and visiting doctors verify every abnormal result for safety.', 'অভিজ্ঞ প্যাথলজিস্ট এবং ডাক্তারদের দ্বারা প্রতিটি ল্যাব রিপোর্ট যাচাই করা হয়।'),
      icon: ShieldCheck
    },
    {
      num: '04',
      title: t('Instant Delivery', 'হোয়াটসঅ্যাপে রিপোর্ট ডেলিভারি'),
      desc: t('Get encrypted digital PDF report directly on WhatsApp on the same evening.', 'একই দিনে সরাসরি আপনার হোয়াটসঅ্যাপে ডিজিটাল রিপোর্ট পাঠানো হয়।'),
      icon: MessageSquare
    }
  ];

  const filteredTests = diagnosticServices.filter((s) => {
    const matchesCat = selectedCat === 'all' || selectedCat === 'dept' || s.cat === selectedCat;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* SECTION 1: HERO BANNER */}
      <section className="bg-gradient-to-b from-secondary/60 via-background to-background py-12 sm:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span>{t('WB Government Recognized Clinic & Lab', 'পঃ বঙ্গ সরকার স্বীকৃত হেলথ ক্লিনিক ও ডিজিটাল ল্যাব')}</span>
          </span>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary max-w-4xl mx-auto leading-tight">
            {t('Clinical OPD Departments & Automated Diagnostic Services', 'বিশেষজ্ঞ ডাক্তারদের চেম্বার ও ডিজিটাল ডায়াগনস্টিক সেবাসমূহ')}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'Contai B.B. Health Clinic in Padmapukuria brings together weekly visiting specialist chambers, digital pathology, Digital X-Ray, 12-lead ECG, and Ultrasound scans under one trusted roof.',
              'কাঁথির পদ্মপুকুরিয়ায় কনটাই বি.বি. হেলথ ক্লিনিকে রয়েছে অভিজ্ঞ বিশেষজ্ঞ ডাক্তারদের নিয়মিত চেম্বার, অটোমেটেড রক্ত পরীক্ষা, ডিজিটাল এক্স-রে, ইসিজি ও ইউএসজি ব্যবস্থা।'
            )}
          </p>

          {/* Quick Stat Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-primary">
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{t('6+ OPD Departments', '৬+ টি বিশেষজ্ঞ ওপিডি বিভাগ')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{t('50+ Pathology Tests', '৫০+ প্রকার ল্যাব পরীক্ষা')}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{t('Same-Day WhatsApp Report', 'হোয়াটসঅ্যাপে ডিজিটালে রিপোর্ট')}</span>
            </span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-extrabold text-primary-foreground shadow hover:bg-[hsl(205_75%_24%)] transition hover:-translate-y-0.5"
            >
              <CalendarDays className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span>{t('Book Doctor Visit / Lab Test', 'অ্যাপয়েন্টমেন্ট বা পরীক্ষা বুক করুন')}</span>
            </Link>

            <a
              href="tel:8978933511"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-5 py-3 text-xs sm:text-sm font-bold text-primary shadow-xs hover:bg-secondary transition"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>{t('Helpline: 8978933511', 'জরুরি হেল্পলাইন: ৮৯৭৮৯৩৩৫১১')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: SPECIALIZED CLINICAL OPD DEPARTMENTS */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Stethoscope className="h-3.5 w-3.5 text-primary" />
              <span>{t('Visiting Specialist Chambers', 'বিশেষজ্ঞ ডাক্তারদের চেম্বার')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Clinical Medical OPD Departments', 'বিশেষায়িত ওপিডি চিকিৎসা বিভাগসমূহ')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('Senior Kolkata & Cuttack visiting specialist doctors consult regularly at Padmapukuria, Contai.', 'কলকাতা ও অভিজ্ঞ চিকিৎসা কেন্দ্রের বিশেষজ্ঞ ডাক্তারদের তত্ত্বাবধানে বিশ্বস্ত চিকিৎসা।')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clinicalDepartments.map((dept) => {
              const IconComp = dept.icon;
              return (
                <div
                  key={dept.id}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl hover:border-primary/40 transition duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${dept.badgeBg}`}>
                        {dept.schedule}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-extrabold text-primary">{dept.title}</h3>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 shrink-0" />
                        <span>{dept.doctor}</span>
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{dept.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Link
                      href="/book"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground py-2.5 px-4 text-xs font-bold text-primary transition"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{t('Book Doctor Appointment', 'ডাক্তার বুকিং করুন')}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: SEARCH & DIAGNOSTIC TEST CATALOG */}
      <section className="py-12 sm:py-16 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Microscope className="h-3.5 w-3.5 text-primary" />
              <span>{t('Digital Diagnostic Catalog', 'ডায়াগনস্টিক পরীক্ষার তালিকা')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('High-Precision Pathology & Imaging Tests', 'ডিজিটাল প্যাথলজি ও পরীক্ষা সমূহ')}
            </h2>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Search test name (e.g., CBC, Sugar, Thyroid, USG)...', 'পরীক্ষার নাম লিখে সার্চ করুন...')}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-10 text-xs outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {[
                  { id: 'all', label: t('All Tests', 'সকল পরীক্ষা') },
                  { id: 'pathology', label: t('Pathology & Blood', 'প্যাথলজি ও রক্ত') },
                  { id: 'hormone', label: t('Hormones & Thyroid', 'হরমোন ও থাইরয়েড') },
                  { id: 'cardiac', label: t('ECG & Cardiac', 'ইসিজি ও হার্ট') },
                  { id: 'imaging', label: t('Digital X-Ray', 'ডিজিটাল এক্স-রে') },
                  { id: 'ultrasound', label: t('USG Ultrasound', 'ইউএসজি') },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedCat === c.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 font-mono-ui text-[10px] font-extrabold uppercase">
                      {item.cat}
                    </span>
                    <span className="font-display text-lg font-extrabold text-primary">{item.price}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-primary">{item.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>

                  <div className="pt-2 border-t border-border text-[11px] space-y-1 text-muted-foreground">
                    <p>• <strong>Preparation:</strong> {item.prep}</p>
                    <p>• <strong>Turnaround:</strong> {item.turnaround}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border">
                  <Link
                    href="/book"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary py-2.5 px-4 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <span>{t('Book Test Sample', 'পরীক্ষা বুক করুন')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: 4-STEP AUTOMATED DIAGNOSTIC PROCESS */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>{t('Diagnostic Workflow', 'ল্যাব পরীক্ষা পদ্ধতি')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Our 4-Step Automated Testing Process', '৪ ধাপে নিখুঁত ও আধুনিক ল্যাব প্রক্রিয়া')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('Barcoded robotic sample processing for zero margin of human error.', 'স্যাম্পল কালেকশন থেকে রিপোর্ট জেনারেট পর্যন্ত বিশ্বস্ত ব্যবস্থা।')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-black text-primary/30">{step.num}</span>
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <IconComp className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-display text-base font-bold text-primary">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: PATIENT PREPARATION GUIDELINES */}
      <section className="py-12 sm:py-16 bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Info className="h-3.5 w-3.5 text-primary" />
              <span>{t('Patient Guidelines', 'পরীক্ষার নিয়মাবলী')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
              {t('Diagnostic Test Preparation Advice', 'সঠিক ফলাফলের জন্য দরকারী স্বাস্থ্য নিয়মাবলী')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-xs leading-relaxed text-muted-foreground">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <strong className="text-primary font-display text-sm block">{t('Fasting Blood Sugar & Lipid Profile', 'ফাস্টিং ব্লাড সুগার ও লিপিড প্রোফাইল')}</strong>
              <p>{t('Requires 8 to 12 hours of overnight fasting. Only plain drinking water is permitted during fasting hours.', '৮ থেকে ১২ ঘণ্টা খালি পেটে থাকতে হয়। উপবাসের সময় কেবল স্বাভাবিক জল খাওয়া যাবে।')}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <strong className="text-primary font-display text-sm block">{t('USG Abdomen Scan Instructions', 'ইউএসজি পেটের পরীক্ষার নিয়ম')}</strong>
              <p>{t('Drink 1 to 1.5 liters of water before scan to ensure a full urinary bladder for optimal imaging.', 'পরীক্ষার ১ ঘণ্টা আগে ৩-৪ গ্লাস জল খেয়ে প্রস্রাব চেপে রাখা প্রয়োজন।')}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <strong className="text-primary font-display text-sm block">{t('Thyroid & Hormone Assays', 'থাইরয়েড ও হরমোন পরীক্ষা')}</strong>
              <p>{t('Early morning fasting or light breakfast sample preferred before taking daily thyroid medication.', 'সকালবেলা খালি পেটে বা ওষুধ খাওয়ার পূর্বে স্যাম্পল দেওয়া উত্তম।')}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-xs">
              <strong className="text-primary font-display text-sm block">{t('Digital X-Ray Guidelines', 'ডিজিটাল এক্স-রে নিয়ম')}</strong>
              <p>{t('Wear comfortable clothing and remove all metallic jewelry or items around the scanned chest/bone area.', 'মেটাল বা ধাতব গহনা খুলে এক্স-রে রুমে প্রবেশ করতে হয়।')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DIRECT HELPLINE BANNER */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-950 to-slate-900 p-6 sm:p-10 text-white text-center space-y-4 shadow-2xl overflow-hidden border border-white/10">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-teal-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('24/7 Medical & Lab Helpline', '২৪ ঘণ্টা সরাসরি ডাক্তার ও ল্যাব হেল্পলাইন')}</span>
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight text-white">
                {t('Need Help Booking a Visiting Specialist or Diagnostic Test?', 'ডাক্তার দেখাতে বা কোনো ল্যাব পরীক্ষার বুকিং নিয়ে সাহায্য প্রয়োজন?')}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Our Padmapukuria reception desk in Contai is available to assist you with visiting doctor schedules and lab test quotes.',
                  'পদ্মপুকুরিয়া ক্লিনিকের সহায়তা টিম ডাক্তারদের সময়সূচী ও পরীক্ষার চার্জ নিয়ে আপনাকে সাহায্য করতে প্রস্তুত।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('Book Online Appointment', 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিং')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="tel:8978933511"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 text-xs sm:text-sm font-bold text-white transition backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>{t('Call 8978933511', 'ফোন করুন: ৮৯৭৮৯৩৩৫১১')}</span>
                </a>

                <a
                  href="https://wa.me/918978933511?text=Hi%20Contai%20BB%20Health%20Clinic,%20I%20want%20to%20know%20about%20doctor%20and%20lab%20services."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
