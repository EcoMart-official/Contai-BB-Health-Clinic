import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Stethoscope,
  Microscope,
  Activity,
  HeartPulse,
  Users
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import patientHall from '@assets/clinic/patient-hall.png';
import labTesting from '@assets/clinic/lab-testing.webp';

export function Gallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Category definitions
  const categories = [
    { id: 'all', nameEn: 'All Photos', nameBn: 'সকল ছবি', icon: Filter },
    { id: 'chambers', nameEn: 'Doctor Chambers', nameBn: 'ডাক্তারদের চেম্বার', icon: Stethoscope },
    { id: 'pathology', nameEn: 'Pathology Lab', nameBn: 'অটোমেটেড ল্যাব', icon: Microscope },
    { id: 'diagnostics', nameEn: 'X-Ray & ECG', nameBn: 'ডায়াগনস্টিক ও ইসিজি', icon: Activity },
    { id: 'lounge', nameEn: 'Patient Lounge', nameBn: 'অপেক্ষালয় ও রিসিভশন', icon: Users },
    { id: 'homesample', nameEn: 'Home Collection', nameBn: 'হোম স্যাম্পল সংগ্রহ', icon: HeartPulse },
  ];

  // Gallery items - Pure images with titles only
  const galleryPhotos = [
    {
      id: 'ph-1',
      category: 'lounge',
      categoryNameEn: 'Patient Lounge',
      categoryNameBn: 'অপেক্ষালয়',
      titleEn: 'AC Patient Waiting Lounge',
      titleBn: 'শীতাতপ নিয়ন্ত্রিত অপেক্ষালয়',
      img: patientHall,
    },
    {
      id: 'ph-2',
      category: 'pathology',
      categoryNameEn: 'Pathology Lab',
      categoryNameBn: 'অটোমেটেড ল্যাব',
      titleEn: 'Automated 5-Part Hematology System',
      titleBn: 'অটোমেটেড ৫-পার্ট হেমাটোলজি অ্যানালাইজার',
      img: labTesting,
    },
    {
      id: 'ph-3',
      category: 'chambers',
      categoryNameEn: 'Doctor Chambers',
      categoryNameBn: 'ডাক্তারদের চেম্বার',
      titleEn: 'Visiting Specialist OPD Chamber',
      titleBn: 'বিশেষজ্ঞ ডাক্তারের চেম্বার',
      img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-4',
      category: 'diagnostics',
      categoryNameEn: 'X-Ray & ECG',
      categoryNameBn: 'ডায়াগনস্টিক ও ইসিজি',
      titleEn: '12-Lead Cardiac ECG Unit',
      titleBn: '১২-লিড কার্ডিয়াক ইসিজি পরীক্ষা',
      img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-5',
      category: 'pathology',
      categoryNameEn: 'Pathology Lab',
      categoryNameBn: 'অটোমেটেড ল্যাব',
      titleEn: 'Fully Automated Biochemistry Analyzer',
      titleBn: 'ডিজিটাল বায়োকেমিস্ট্রি অটোমেটেড ল্যাব',
      img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-6',
      category: 'lounge',
      categoryNameEn: 'Patient Lounge',
      categoryNameBn: 'সহায়ক ডেস্ক',
      titleEn: 'Reception & Helpdesk Counter',
      titleBn: 'রিসিভশন ও রোগী সহায়তা ডেস্ক',
      img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-7',
      category: 'homesample',
      categoryNameEn: 'Home Collection',
      categoryNameBn: 'হোম স্যাম্পল',
      titleEn: 'Sterile Phlebotomy Collection Kits',
      titleBn: 'জীবাণুমুক্ত ভ্যাকুটেইনার ব্লাড কিট',
      img: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-8',
      category: 'diagnostics',
      categoryNameEn: 'X-Ray & ECG',
      categoryNameBn: 'ডিজিটাল এক্স-রে',
      titleEn: 'High-Resolution Digital X-Ray Processing',
      titleBn: 'হাই-রেজোলিউশন ডিজিটাল এক্স-রে',
      img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-9',
      category: 'chambers',
      categoryNameEn: 'Doctor Chambers',
      categoryNameBn: 'ডাক্তারদের চেম্বার',
      titleEn: 'Neuropsychiatry Consultation Room',
      titleBn: 'মানসিক স্বাস্থ্য ও নিউরো সাইকিয়াট্রি রুম',
      img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-10',
      category: 'pathology',
      categoryNameEn: 'Pathology Lab',
      categoryNameBn: 'অটোমেটেড ল্যাব',
      titleEn: 'Hormone & Thyroid Immunoassay Lab',
      titleBn: 'থাইরয়েড ও হরমোন টেস্ট বিভাগ',
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-11',
      category: 'lounge',
      categoryNameEn: 'Patient Lounge',
      categoryNameBn: 'ক্যাম্পাস এলাকা',
      titleEn: 'On-Campus Patient Parking & Greenery',
      titleBn: 'ক্লিনিক চত্বরে ফ্রি পার্কিং এলাকা',
      img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ph-12',
      category: 'homesample',
      categoryNameEn: 'Home Collection',
      categoryNameBn: 'হোম স্যাম্পল',
      titleEn: 'Doorstep Phlebotomist Home Sample Service',
      titleBn: 'রোগীর বাড়িতে রক্তের নমুনা সংগ্রহ',
      img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Filter logic
  const filteredPhotos = selectedCategory === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedCategory);

  // Lightbox Navigation
  const handleOpenLightbox = (indexInFiltered: number) => {
    setActiveLightboxIndex(indexInFiltered);
  };

  const handleCloseLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handleNextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredPhotos.length]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* MINIMALIST HEADER BANNER */}
      <section className="py-10 sm:py-14 bg-card border-b border-border text-center">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary">
            {t('Clinic Photo Gallery', 'আমাদের ফটো গ্যালারি')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            {t(
              'Contai B.B. Health Clinic - Padmapukuria Campus, Chambers & Diagnostic Lab',
              'পদ্মপুকুরিয়া কাঁথি বাইপাস রোডে আমাদের ক্লিনিক, অটোমেটেড ল্যাব ও চেম্বারের ফটো গ্যালারি'
            )}
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER TABS */}
      <section className="py-6 bg-background border-b border-border sticky top-[65px] z-30 backdrop-blur-md bg-background/90 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-primary'
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{t(cat.nameEn, cat.nameBn)}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {cat.id === 'all'
                      ? galleryPhotos.length
                      : galleryPhotos.filter((p) => p.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* PURE PHOTO GALLERY GRID - NO EXTRA TEXT BELOW CARDS */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => handleOpenLightbox(index)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Photo */}
                <img
                  src={photo.img}
                  alt={t(photo.titleEn, photo.titleBn)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Subtle Gradient Shadow for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                {/* Category Badge - Top Left */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                  {t(photo.categoryNameEn, photo.categoryNameBn)}
                </div>

                {/* Zoom Icon - Top Right */}
                <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>

                {/* Only Title Text Over the Image at Bottom */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-display text-sm font-bold leading-snug drop-shadow-md">
                    {t(photo.titleEn, photo.titleBn)}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-border bg-card p-8 space-y-3 max-w-md mx-auto">
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-display text-base font-bold text-primary">
                {t('No photos found in this category', 'এই বিভাগে কোনো ছবি পাওয়া যায়নি')}
              </h3>
              <button
                onClick={() => setSelectedCategory('all')}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-bold shadow transition"
              >
                {t('View All Photos', 'সকল ছবি দেখুন')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex] && (
        <div
          onClick={handleCloseLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 transition-all animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLightbox();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextLightbox();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Lightbox Main Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[85vh] bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center"
          >
            <div className="w-full h-[65vh] bg-black flex items-center justify-center relative">
              <img
                src={filteredPhotos[activeLightboxIndex].img}
                alt={t(
                  filteredPhotos[activeLightboxIndex].titleEn,
                  filteredPhotos[activeLightboxIndex].titleBn
                )}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Bottom Title Bar in Lightbox */}
            <div className="w-full p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  {t(
                    filteredPhotos[activeLightboxIndex].categoryNameEn,
                    filteredPhotos[activeLightboxIndex].categoryNameBn
                  )}
                </span>
                <h2 className="font-display text-base font-bold text-white">
                  {t(
                    filteredPhotos[activeLightboxIndex].titleEn,
                    filteredPhotos[activeLightboxIndex].titleBn
                  )}
                </h2>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {activeLightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
