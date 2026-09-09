import { useState } from 'react';
import { Link } from 'wouter';
import {
  Stethoscope, Clock3, CalendarDays, ArrowRight, CheckCircle2, ShieldCheck,
  Search, Phone, UserCheck, Star, Award, AlertCircle, FileText, ChevronRight, HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import patientHall from '@assets/clinic/patient-hall.png';
import labTesting from '@assets/clinic/lab-testing.webp';

export function Doctors() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const doctorsList = [
    {
      id: 'suman-sarangi',
      name: 'Dr. Suman Sarangi',
      titleEn: 'Neuropsychiatrist & Behavioral Health Specialist',
      titleBn: 'নিউরোসাইকিয়াট্রি ও স্নায়ুরোগ বিশেষজ্ঞ',
      credentials: 'MBBS, MD (Neuropsychiatry), MRCPsych Part 1 (UK)',
      scheduleEn: 'Every Sunday, 8:30 AM – 10:30 AM',
      scheduleBn: 'প্রতি রবিবার, সকাল ৮:৩০ – ১০:৩০',
      dayTag: 'Sunday Morning',
      bioEn: 'Comprehensive support for dementia, epilepsy, Parkinson’s disease, addiction care, anxiety, OCD, depression, insomnia, migraine, and neuropathic pain.',
      bioBn: 'ডিমেনশিয়া, মৃগী রোগ, পারকিনসন, বিষণ্নতা, উদ্বেগ, ইনসোমনিয়া, ট্রমা, মাইগ্রেন ও স্নায়ু ব্যথার অভিজ্ঞ চিকিৎসাসেবা।',
      department: 'neuropsychiatry',
      experience: 'Experienced Consultant Psychiatrist',
      scope: ['Epilepsy & Seizures', 'Dementia & Memory Care', 'Migraine & Nerve Pain', 'Anxiety & Depression', 'Addiction Rehabilitation'],
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'kamal-poddar',
      name: 'Dr. Kamal Poddar',
      titleEn: 'Consultant Physician & Diabetes Specialist',
      titleBn: 'মেডিসিন, ডায়াবেটিস ও শারীরিক রোগ বিশেষজ্ঞ',
      credentials: 'MBBS, MD (Medicine), MRCP (UK)',
      scheduleEn: 'Every Saturday, 10:00 AM onward',
      scheduleBn: 'প্রতি শনিবার, সকাল ১০:০০ টা থেকে',
      dayTag: 'Saturday Morning',
      bioEn: 'Thoughtful consultation for blood sugar control, thyroid imbalances, high BP, heart concerns, asthma, stomach issues, and long-term preventive wellness.',
      bioBn: 'ডায়াবেটিস, থাইরয়েড, উচ্চ রক্তচাপ, হাঁপানি, হার্টের সমস্যা ও দৈনন্দিন অসুস্থতার অভিজ্ঞ চিকিৎসা পরমর্শ।',
      department: 'medicine',
      experience: 'Senior Consultant Physician',
      scope: ['Diabetes Management (FBS/PPBS/HbA1c)', 'Thyroid Disorders', 'High Blood Pressure & Cardiac Risk', 'Fever & Infectious Diseases', 'Respiratory Health'],
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'saikat-maity',
      name: 'Dr. Saikat Maity',
      titleEn: 'Dermatologist, Hair & Cosmetology Specialist',
      titleBn: 'চর্মরোগ, চুল, অ্যালার্জি ও কসমোটোলজি বিশেষজ্ঞ',
      credentials: 'MD (NM), MSc (Cosmetic & Aesthetic), Diploma Dermatology',
      scheduleEn: 'Every Sunday, 2:00 PM onward',
      scheduleBn: 'প্রতি রবিবার, দুপুর ২:০০ টা থেকে',
      dayTag: 'Sunday Afternoon',
      bioEn: 'Specialist attention for complex skin diseases, eczema, psoriasis, acne, hair fall, aesthetic cosmetology, and sexual health concerns.',
      bioBn: 'ত্বকের জটিল রোগ, একনি, অ্যালার্জি, অতিরিক্ত চুল পড়া, সোরাইসিস, কসমোটোলজি ও যৌন স্বাস্থ্যের নির্ভরযোগ্য চিকিৎসা।',
      department: 'dermatology',
      experience: 'Cosmetologist & Dermatologist',
      scope: ['Eczema & Psoriasis', 'Acne & Skin Pigmentation', 'Hair Loss & Scalp Treatments', 'Aesthetic Cosmetology Advice', 'Sexual Health Wellness'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'rakesh-mohanty',
      name: 'Dr. Rakesh Mohanty',
      titleEn: 'Gastroenterologist & Liver Specialist',
      titleBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার বিশেষজ্ঞ',
      credentials: 'MBBS, MD (Medicine), DM (Gastroenterology) - Asst. Prof. SCB Medical',
      scheduleEn: 'Appointment-based consultation',
      scheduleBn: 'সিরিয়াল বুকিং এর মাধ্যমে',
      dayTag: 'On Appointment',
      bioEn: 'Specialist advice for chronic gastritis, severe acidity, abdominal pain, bloating, fatty liver, bowel irregularity, and digestive health.',
      bioBn: 'দীর্ঘদিনের গ্যাস্ট্রিক, বুক জ্বালা, পেটে ব্যথা, বদহজম, ফ্যাটি লিভার ও পেটের জটলার বিশেষজ্ঞ পরমর্শ।',
      department: 'gastroenterology',
      experience: 'Assistant Professor & Gastro Specialist',
      scope: ['Gastritis & Acid Reflux', 'Fatty Liver & Jaundice', 'Abdominal Pain & Bloating', 'Irritable Bowel (IBS)', 'Digestive Health Screening'],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesDept = filterDept === 'all' || doc.department === filterDept;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* SECTION 1: HERO BANNER */}
      <section className="bg-gradient-to-b from-secondary/60 via-background to-background py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-4">
          <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
            {t('Expert Medical Faculty', 'অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকবৃন্দ')}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-primary">
            {t('Visiting Specialist Doctors & Chamber Schedules', 'বিশেষজ্ঞ ডাক্তারদের তালিকা ও সময়সূচী')}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              'Consult experienced visiting doctors from premier institutions right at Padmapukuria, Contai. Book your chamber serial in advance to ensure smooth consultation.',
              'পদ্মপুকুরিয়ার কনটাই বি.বি. হেলথ ক্লিনিকে প্রতি সপ্তাহে চিকিৎসা দিচ্ছেন বিশিষ্ট হাসপাতালে কর্মরত কনসালটেন্ট ডাক্তারবৃন্দ।'
            )}
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-[hsl(205_75%_24%)] transition"
            >
              <CalendarDays className="h-4 w-4 text-[hsl(var(--accent))]" />
              <span>{t('Book Doctor Serial', 'ডাক্তারের সিরিয়াল বুক করুন')}</span>
            </Link>

            <a
              href="tel:8918933511"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-5 py-3 text-xs font-bold text-primary shadow-sm hover:bg-secondary transition"
            >
              <Phone className="h-4 w-4 text-emerald-600" />
              <span>8918933511</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: SEARCH & FILTER BAR */}
      <section className="py-8 bg-card border-b border-border sticky top-[65px] z-30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search doctor name or specialty...', 'ডাক্তার বা চিকিৎসার বিষয় দিয়ে খোঁজ করুন...')}
                className="w-full rounded-full border border-input bg-background px-4 py-2.5 pl-10 text-xs outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Department Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
              {[
                { id: 'all', label: t('All Specialties', 'সব বিভাগ') },
                { id: 'neuropsychiatry', label: t('Neuropsychiatry', 'নিউরোসাইকিয়াট্রি') },
                { id: 'medicine', label: t('Medicine', 'মেডিসিন') },
                { id: 'dermatology', label: t('Dermatology', 'চর্মরোগ') },
                { id: 'gastroenterology', label: t('Gastroenterology', 'গ্যাস্ট্রো') },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterDept(btn.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    filterDept === btn.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DETAILED DOCTOR CARDS GRID */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-10">
          {filteredDoctors.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {t('No doctors found matching your criteria.', 'আপনার খোঁজা অনুযায়ী কোনো ডাক্তার পাওয়া যায়নি।')}
            </p>
          ) : (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card hover:border-primary/40 transition duration-300 grid lg:grid-cols-12 gap-6 items-start overflow-hidden"
              >
                {/* Doctor Portrait Image */}
                <div className="lg:col-span-3 shrink-0">
                  <div className="relative overflow-hidden rounded-2xl bg-secondary/30 h-56 sm:h-64 lg:h-full min-h-[220px]">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      <span>{t('VISITING', 'অন-কল')}</span>
                    </span>
                  </div>
                </div>

                {/* Doctor Bio Details */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary text-primary text-[10px] font-extrabold px-3 py-1 font-mono-ui">
                      {doc.dayTag}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-extrabold text-primary">{doc.name}</h2>
                  <p className="text-xs font-bold text-teal-700">
                    {lang === 'bn' ? doc.titleBn : doc.titleEn}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{doc.credentials}</p>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/50 p-2.5 text-xs font-bold text-primary border border-border">
                    <Clock3 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{lang === 'bn' ? doc.scheduleBn : doc.scheduleEn}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === 'bn' ? doc.bioBn : doc.bioEn}
                  </p>

                  {/* Scope of Treatment Badges */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-wider">
                      {t('Key Clinical Focus Areas:', 'প্রধান চিকিৎসার বিষয়সমূহ:')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.scope.map((item, i) => (
                        <span key={i} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] text-foreground/80 font-medium">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Trigger Side Card */}
                <div className="lg:col-span-4 rounded-2xl bg-secondary/40 border border-border p-5 space-y-4 text-center flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <Stethoscope className="h-10 w-10 text-primary mx-auto" />
                    <h4 className="font-display text-base font-bold text-primary">{t('Chamber Serial Booking', 'সিরিয়াল বুকিং করুন')}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t('Padmapukuria, Contai Chamber', 'পদ্মপুকুরিয়া, কাঁথি চেম্বার')}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Link
                      href={`/book?doctor=${encodeURIComponent(doc.name)}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 px-4 text-xs font-bold text-primary-foreground shadow hover:bg-[hsl(205_75%_24%)] transition"
                    >
                      <CalendarDays className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                      <span>{t('Book Serial for ', 'বুকিং করুন ')}{doc.name.split(' ')[1]}</span>
                    </Link>

                    <a
                      href="tel:8918933511"
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/20 py-2.5 px-4 text-xs font-bold text-primary hover:bg-background transition"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t('Call Chamber Phone', 'চেম্বার ফোন')}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 4: WEEKLY SCHEDULE MATRIX TABLE */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="font-mono-ui text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              {t('Timetable Overview', 'সাপ্তাহিক রুটিন')}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-primary">
              {t('Weekly Visiting Chamber Schedule Matrix', 'সাপ্তাহিক ডাক্তারের সময়সূচী ছক')}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-card">
            <table className="w-full text-xs text-left">
              <thead className="bg-primary text-primary-foreground font-display font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-4">{t('Day & Time', 'দিন ও সময়')}</th>
                  <th className="p-4">{t('Doctor Name', 'ডাক্তারের নাম')}</th>
                  <th className="p-4">{t('Specialty Discipline', 'বিশেষজ্ঞ বিভাগ')}</th>
                  <th className="p-4 text-right">{t('Action', 'বুকিং')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-secondary/40 transition">
                  <td className="p-4 font-bold text-primary">Every Saturday · 10:00 AM+</td>
                  <td className="p-4 font-bold">Dr. Kamal Poddar</td>
                  <td className="p-4 text-muted-foreground">Medicine & Diabetes Specialist</td>
                  <td className="p-4 text-right">
                    <Link href="/book" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
                      {t('Book Serial', 'বুক করুন')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/40 transition">
                  <td className="p-4 font-bold text-primary">Every Sunday · 8:30 AM – 10:30 AM</td>
                  <td className="p-4 font-bold">Dr. Suman Sarangi</td>
                  <td className="p-4 text-muted-foreground">Neuropsychiatry & Behavioral Health</td>
                  <td className="p-4 text-right">
                    <Link href="/book" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
                      {t('Book Serial', 'বুক করুন')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/40 transition">
                  <td className="p-4 font-bold text-primary">Every Sunday · 2:00 PM+</td>
                  <td className="p-4 font-bold">Dr. Saikat Maity</td>
                  <td className="p-4 text-muted-foreground">Dermatology, Hair & Cosmetology</td>
                  <td className="p-4 text-right">
                    <Link href="/book" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
                      {t('Book Serial', 'বুক করুন')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/40 transition">
                  <td className="p-4 font-bold text-primary">Appointment Basis</td>
                  <td className="p-4 font-bold">Dr. Rakesh Mohanty</td>
                  <td className="p-4 text-muted-foreground">Gastroenterology & Liver Care</td>
                  <td className="p-4 text-right">
                    <Link href="/book" className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
                      {t('Book Serial', 'বুক করুন')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: PATIENT CONSULTATION PREPARATION GUIDELINES */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-primary">
                  {t('Guidelines for Your Doctor Visit', 'ডাক্তারের কাছে আসার আগে প্রয়োজনীয় নির্দেশিকা')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('What to bring on your consultation day in Padmapukuria.', 'ডাক্তার দেখানোর দিন সঙ্গে যা আনা প্রয়োজন।')}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-muted-foreground">
              <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                <strong className="text-foreground block">{t('1. Previous Prescriptions & Reports', '১. আগের প্রেসক্রিপশন ও রিপোর্ট')}</strong>
                <p>{t('Bring all past prescriptions, recent blood test reports, ECG, or X-Ray films for doctor review.', 'আপনার আগের সমস্ত প্রেসক্রিপশন ও রিমেসন্ট রিপোর্ট সাথে আনুন।')}</p>
              </div>
              <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                <strong className="text-foreground block">{t('2. List of Current Medicines', '২. বর্তমান ওষুধের খাতা/স্ট্রিপ')}</strong>
                <p>{t('Keep a list of medicines you take daily for blood pressure, sugar, thyroid, or psychiatric conditions.', 'প্রেসক্রিপশনে থাকা আপনার বর্তমান ওষুধের নাম জানান।')}</p>
              </div>
              <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                <strong className="text-foreground block">{t('3. Arrive 15 Minutes Prior', '৩. ১৫ মিনিট আগে উপস্থিতি')}</strong>
                <p>{t('Please report to the reception counter 15 minutes before your booked time slot.', 'আপনার সিরিয়াল সময়ের ১৫ মিনিট আগে ক্লিনিকে আসুন।')}</p>
              </div>
              <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                <strong className="text-foreground block">{t('4. Emergency Helpline Support', '৪. সহায়তামূলক নম্বর')}</strong>
                <p>{t('If you need to reschedule or confirm visiting status, call 8918933511 / 7718149150.', 'কোনো পরিবর্তনের জন্য ৮৯১৮৯৩৩৫১১ নম্বরে কথা বলুন।')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
