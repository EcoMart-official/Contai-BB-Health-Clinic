import { useState } from 'react';
import { Link } from 'wouter';
import {
  Check, CalendarDays, ArrowRight, ShieldCheck, Heart, Activity,
  Sparkles, Phone, MessageSquare, HelpCircle, FileText, ChevronRight,
  BadgePercent, Home as HomeIcon, Clock, Stethoscope, UserCheck, Droplet, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function Packages() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const packagesList = [
    {
      id: 'baseline',
      titleEn: 'Essential Baseline Screening Package',
      titleBn: 'প্রাথমিক বাৎসরিক হেলথ প্যাকেজ',
      price: '₹799',
      tagEn: 'Popular Choice',
      tagBn: 'জনপ্রিয় অফার',
      descEn: 'Fundamental pathology screening for general health overview.',
      descBn: 'সাধারণ শারীরিক সুস্থতা পর্যালোচনার জন্য সবচেয়ে দরকারী পরীক্ষা।',
      tests: [
        'Complete Blood Count (CBC)',
        'Fasting Blood Sugar (FBS)',
        'Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)',
        'Urine Routine & Microscopy',
        '12-Lead Digital ECG (Heart Tracing)'
      ]
    },
    {
      id: 'diabetes',
      titleEn: 'Diabetes & Metabolic Wellness Profile',
      titleBn: 'ডায়াবেটিস ও থাইরয়েড স্পেশাল প্যাকেজ',
      price: '₹1,299',
      tagEn: 'Recommended',
      tagBn: 'বিশেষ পরামর্শ',
      featured: true,
      descEn: 'Comprehensive monitor for blood sugar, thyroid, kidney & liver wellness.',
      descBn: 'ডায়াবেটিস, থাইরয়েড ও শারীরিক মেটাবলিজম পর্যবেক্ষণের প্যাকেজ।',
      tests: [
        'Fasting Blood Sugar (FBS) & PPBS',
        'HbA1c (3-Month Sugar Average)',
        'Thyroid Profile (T3, T4, TSH)',
        'Kidney Function Test (KFT - Urea & Creatinine)',
        'Liver Function Test (LFT - SGOT, SGPT, Bilirubin)'
      ]
    },
    {
      id: 'senior',
      titleEn: 'Comprehensive Senior Citizen Wellness',
      titleBn: 'বয়স্কদের বাৎসরিক সুস্বাস্থ্য প্যাকেজ',
      price: '₹1,899',
      tagEn: 'Full Body Care',
      tagBn: 'সম্পূর্ণ শারীরিক পরীক্ষা',
      descEn: 'In-depth annual review for senior family members.',
      descBn: 'পরিবারের বয়স্ক সদস্যদের সম্পূর্ণ স্বাস্থ্য পরীক্ষার জন্য বিশেষ অফার।',
      tests: [
        'Full Blood Pathology & Sugar Screen',
        'Thyroid & HbA1c Glycated Test',
        'Kidney & Liver Function Profiles',
        'Digital X-Ray Chest PA View',
        'USG Abdomen & Pelvis Scan',
        'Doctor Review Consultation'
      ]
    }
  ];

  const whyChoose = [
    {
      icon: BadgePercent,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/80',
      title: t('Up to 40% Cost Savings', 'সর্বোচ্চ ৪০% পর্যন্ত ছাড়'),
      desc: t(
        'Bundled pathology packages cost significantly less than booking individual blood and diagnostic tests separately.',
        'পৃথকভাবে প্রতিটি ল্যাব পরীক্ষা না করিয়ে প্যাকেজ আকারে টেস্ট করালে প্রায় ৩০-৪০% খরচ সাশ্রয় হয়।'
      )
    },
    {
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/80',
      title: t('Same-Day Digital Reports', 'একই দিনে ডিজিটাল রিপোর্ট'),
      desc: t(
        'Get highly accurate, automated pathology results on the same evening with instant WhatsApp PDF delivery.',
        'সম্পূর্ণ অটোমেটেড প্যাথলজি প্রক্রিয়ায় সঠিক রিপোর্ট এবং একই দিনে সরাসরি আপনার হোয়াটসঅ্যাপে ডিজিটাল পিডিএফ পাওয়ার ব্যবস্থা।'
      )
    },
    {
      icon: Stethoscope,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200/80',
      title: t('Free Doctor Review Guidance', 'বিশেষজ্ঞ ডাক্তারের পরামর্শ'),
      desc: t(
        'Our senior visiting consultants inspect abnormal test indicators to guide your preventive health action plan.',
        'রিপোর্টে কোনো অস্বাভাবিকতা থাকলে আমাদের অভিজ্ঞ ভিজিটিং কনসালট্যান্ট চিকিৎসকদের থেকে পরামর্শ নেওয়ার সুযোগ।'
      )
    },
    {
      icon: HomeIcon,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200/80',
      title: t('Home Sample Collection', 'বাড়িতে বসে নমুনা সংগ্রহ'),
      desc: t(
        'Convenient home blood sample collection available across Contai Town, Padmapukuria, Egra & nearby locations.',
        'কাঁথি শহর, পদ্মপুকুরিয়া ও আশেপাশের এলাকায় প্রবীণ ও ব্যস্ত রোগীদের জন্য বাড়িতে গিয়ে নমুনা সংগ্রহের সুব্যবস্থা।'
      )
    }
  ];

  const preparationSteps = [
    {
      step: '01',
      title: t('10-12 Hours Fasting', '১০-১২ ঘণ্টা খালি পেটে থাকুন'),
      desc: t(
        'For Fasting Blood Sugar, Lipid Profile, and Metabolic packages, do not consume food or beverages except plain water after 10 PM on the previous evening.',
        'ফাস্টিং সুগার, লিপিড প্রোফাইল বা সম্পূর্ণ বডি চেকআপের ক্ষেত্রে পরীক্ষার আগের দিন রাত ১০টার পর জল ছাড়া অন্য কিছু খাওয়া থেকে বিরত থাকুন।'
      ),
      icon: Droplet
    },
    {
      step: '02',
      title: t('Hydrate Properly', 'পর্যাপ্ত জল পান করুন'),
      desc: t(
        'Drink adequate plain drinking water in the morning. Good hydration makes blood collection smooth and helps with urine samples.',
        'সকালে পর্যাপ্ত পরিমাণে ভালো জল পান করুন। এতে সহজে রক্ত নেওয়া যায় এবং প্রস্রাবের নমুনা প্রদানে সুবিধা হয়।'
      ),
      icon: Activity
    },
    {
      step: '03',
      title: t('Morning Medications', 'নিয়মিত ওষুধের নিয়মাবলী'),
      desc: t(
        'Continue regular blood pressure medications as advised by your doctor, but consult our lab team before taking morning insulin or diabetes tablets.',
        'প্রেশার বা হাইপারটেনশনের ওষুধ থাকলে জলের সাথে সেবন করতে পারেন। তবে সুগার বা ইনসুলিনের ওষুধ ল্যাবে রক্ত দেওয়ার পরেই সেবন করবেন।'
      ),
      icon: ShieldCheck
    },
    {
      step: '04',
      title: t('Bring Previous Prescriptions', 'পুরোনো প্রেসক্রিপশন ও রিপোর্ট আনুন'),
      desc: t(
        'Bring past health reports or current prescriptions so our visiting doctors can compare progress and offer tailored advice.',
        'আপনার কাছে থাকা বিগত দিনের প্রেসক্রিপশন বা পরীক্ষার রিপোর্ট সঙ্গে আনলে চিকিৎসকের পক্ষে বর্তমান অবস্থা পর্যালোচনা করা সহজ হয়।'
      ),
      icon: FileText
    }
  ];

  const packageFaqs = [
    {
      q: t('Do I need a doctor prescription to book a health package?', 'হেলথ প্যাকেজ করাতে কি ডাক্তারের প্রেসক্রিপশন বাধ্যতামূলক?'),
      a: t(
        'No prescription is required. Preventive health checkups are designed for general health monitoring. However, if you have ongoing symptoms, our visiting doctors will review your reports.',
        'না, কোনো প্রেসক্রিপশনের প্রয়োজন নেই। যেকোনো প্রাপ্তবয়স্ক বা প্রবীণ ব্যক্তি নিজের স্বাস্থ্য সচেতনতার জন্য সরাসরি প্যাকেজ বুক করতে পারেন।'
      )
    },
    {
      q: t('Can I book a home sample collection for these packages?', 'আমি কি বাড়িতে বসেই এই হেলথ প্যাকেজের রক্ত পরীক্ষা করাতে পারব?'),
      a: t(
        'Yes! We offer home sample collection across Padmapukuria, Contai Town, Egra, and nearby areas. Call our reception hotline at 8978933511 to schedule home visits.',
        'হ্যাঁ, কাঁথি শহর ও পদ্মপুকুরিয়া পার্শ্ববর্তী এলাকায় হোম কালেকশনের সুবিধা রয়েছে। আমাদের হেল্পলাইন ৮৯৭৮৯৩৩৫১১ নম্বরে ফোন করে সহজেই সময় নির্ধারণ করতে পারেন।'
      )
    },
    {
      q: t('How will I receive my test reports?', 'আমি কীভাবে পরীক্ষার রিপোর্ট পাব?'),
      a: t(
        'You will receive a printed high-quality report from our Padmapukuria clinic counter, as well as an encrypted digital PDF report directly on your WhatsApp number.',
        'পদ্মপুকুরিয়া ক্লিনিকের কাউন্টার থেকে প্রিন্টেড কপি সংগ্রহ করতে পারবেন এবং আপনার দেওয়া হোয়াটসঅ্যাপ নম্বরে ডিজিটাল পিডিএফ রিপোর্ট সরাসরি পৌঁছে যাবে।'
      )
    },
    {
      q: t('What if any test result shows abnormal values?', 'রিপোর্টে কোনো সমস্যা ধরা পড়লে করণীয় কী?'),
      a: t(
        'Our experienced visiting specialists (Medicine, Neuropsychiatry, Dermatology, etc.) consult regularly at the clinic and will evaluate your findings and guide treatment.',
        'আমাদের ক্লিনিকে নিয়মিত বসা ভিজিটিং বিশেষজ্ঞ চিকিৎসকদের (মেডিসিন, চর্মরোগ, নিউরোসাইকিয়াট্রি ইত্যাদি) সাথে আলোচনা করে সঠিক চিকিৎসা ও পরামর্শ নিতে পারবেন।'
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* HERO BANNER */}
      <section className="bg-gradient-to-b from-secondary/60 via-background to-background py-12 sm:py-16 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{t('Preventive Health Packages', 'প্রতিরোধমূলক হেলথ প্যাকেজ')}</span>
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary">
            {t('Preventive Health Checkup Packages', 'সাশ্রয়ী ও সম্পূর্ণ হেলথ চেকআপ প্যাকেজ')}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              'Save on bundled pathology and diagnostic tests at Contai B.B. Health Clinic in Padmapukuria, Contai.',
              'আপনার ও আপনার পরিবারের সম্পূর্ণ শারীরিক সুস্থতা বজায় রাখতে বিশেষ ছাড় যুক্ত ডায়াগনস্টিক প্যাকেজ।'
            )}
          </p>
        </div>
      </section>

      {/* PACKAGES CARDS */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {packagesList.map((pack) => (
              <div
                key={pack.id}
                className={`rounded-3xl p-7 sm:p-8 shadow-card flex flex-col justify-between border transition duration-300 ${
                  pack.featured
                    ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-mono-ui text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                        pack.featured
                          ? 'bg-[hsl(var(--sidebar-primary))] text-primary'
                          : 'bg-secondary text-primary'
                      }`}
                    >
                      {t(pack.tagEn, pack.tagBn)}
                    </span>
                    <span className="font-display text-3xl font-extrabold">{pack.price}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold">{t(pack.titleEn, pack.titleBn)}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${pack.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {t(pack.descEn, pack.descBn)}
                  </p>

                  <div className="mt-6 pt-4 border-t border-current/10">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3">{t('Included Diagnostics:', 'প্যাকেজে অন্তর্ভুক্ত পরীক্ষাসমূহ:')}</p>
                    <ul className="space-y-2.5 text-xs">
                      {pack.tests.map((test, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className={`h-4 w-4 shrink-0 ${pack.featured ? 'text-[hsl(var(--sidebar-primary))]' : 'text-emerald-600'}`} />
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    <CalendarDays className="h-4 w-4" />
                    <span>{t('Book This Package', 'প্যাকেজ বুক করুন')}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE OUR HEALTH PACKAGES */}
      <section className="py-12 sm:py-16 bg-secondary/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>{t('Clinic Benefits', 'কেন আমাদের ল্যাব সেরা')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Why Choose Our Health Packages?', 'আমাদের হেলথ প্যাকেজের বিশেষত্ব ও সুবিধা')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('High accuracy testing, automated reporting, and expert medical care in Padmapukuria, Contai.', 'উন্নত প্রযুক্তির স্যাম্পল প্রসেসিং ও দ্রুততম রিপোর্ট সরবরাহের নিশ্চয়তা।')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-xl hover:border-primary/40 transition duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-base font-extrabold text-primary">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEP BY STEP PREPARATION GUIDE */}
      <section className="py-12 sm:py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>{t('Test Preparation', 'চেকআপের নিয়মাবলী')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('How to Prepare for Your Health Checkup?', 'হেলথ চেকআপের আগে প্রস্তুত হওয়ার গাইডলাইন')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('Follow these simple guidelines before giving your blood and urine samples.', 'নির্ভুল রিপোর্ট পাওয়ার জন্য ল্যাবে আসার আগে কিছু দরকারী নিয়ম মেনে চলুন।')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {preparationSteps.map((prep, idx) => {
              const IconComp = prep.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-3xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-black text-primary/30">{prep.step}</span>
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <IconComp className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="font-display text-base font-bold text-primary">{prep.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{prep.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS ABOUT PACKAGES */}
      <section className="py-12 sm:py-16 bg-secondary/20 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
              <HelpCircle className="h-3.5 w-3.5 text-primary" />
              <span>{t('Package Queries', 'প্যাকেজ সম্পর্কিত প্রশ্ন')}</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              {t('Frequently Asked Questions', 'সাধারণ জিজ্ঞাসার উত্তর')}
            </h2>
          </div>

          <div className="space-y-3.5">
            {packageFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
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
                    <span className="font-display text-sm sm:text-base font-bold text-primary pr-3">
                      {faq.q}
                    </span>
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

      {/* NEED ASSISTANCE OR CUSTOM PACKAGE HELPLINE BANNER */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-950 to-slate-900 p-6 sm:p-10 text-white text-center space-y-4 shadow-2xl overflow-hidden border border-white/10">
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-xs font-bold text-teal-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t('Need Custom Package Guidance?', 'সঠিক প্যাকেজ বাছাই করতে সাহায্য চান?')}</span>
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight text-white">
                {t('Not Sure Which Health Package Fits Your Requirements?', 'আপনার জন্য কোন প্যাকেজটি উপযোগী তা নিয়ে দ্বিধা আছে?')}
              </h2>

              <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl mx-auto leading-relaxed">
                {t(
                  'Our Padmapukuria reception team is ready to guide you according to your medical symptoms and doctor recommendations.',
                  'আমাদের অভিজ্ঞ মেডিকেল টিম আপনার উপসর্গ অনুযায়ী সঠিক প্যাকেজ চয়ন করতে সাহায্য করবে।'
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('Book Online Appointment', 'অনলাইন বুকিং করুন')}</span>
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
                  href="https://wa.me/918978933511?text=Hi%20Contai%20BB%20Health%20Clinic,%20I%20want%20to%20know%20about%20health%20packages."
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

