import { useState, useEffect, useRef } from 'react';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Edit,
  Mail,
  Calendar,
  CalendarCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Download,
  LogOut,
  QrCode,
  AlertCircle,
  FileText,
  Clock,
  Building2,
  Stethoscope,
  Navigation,
  LocateFixed,
  Loader2,
  X,
  Plus,
  Search,
  Filter,
  Activity,
  Heart,
  Eye,
  Trash2,
  ChevronRight,
  Check,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Bell,
  Printer,
  Share2,
  HelpCircle,
  Pill,
  Thermometer,
  ChevronDown,
  Ban,
  Banknote,
  Smartphone,
  FlaskConical,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useCustomAlert } from '@/lib/alert-context';
import { processRazorpayPayment } from '@/lib/razorpay';
import {
  BookingSuccessAnimationModal,
  BookingSuccessDetails,
} from '@/components/BookingSuccessAnimationModal';

export function PatientPortal() {
  const { t } = useLanguage();
  const { showAlert, showConfirm } = useCustomAlert();

  // State machine for multi-step authentication
  // Steps: 'phone' -> 'otp' -> 'profile' -> 'dashboard'
  const [step, setStep] = useState<'phone' | 'otp' | 'profile' | 'dashboard'>('phone');

  // Dashboard Active Tab - Appointments is Tab #1 by default, Doctors is Tab #2
  const [activeTab, setActiveTab] = useState<'appointments' | 'book-doctor' | 'lab-tests' | 'reports' | 'vitals' | 'billing' | 'overview'>('appointments');
  const [selectedSlipAppointment, setSelectedSlipAppointment] = useState<any | null>(null);
  const [isRefreshingAppointments, setIsRefreshingAppointments] = useState(false);

  // Doctor Serial Booking Intent from /book or ?action=book-doctor
  const [pendingBookingIntent, setPendingBookingIntent] = useState<{ action: string; doctor?: string } | null>(null);
  const [autoActivatedBookingToast, setAutoActivatedBookingToast] = useState(false);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [accountId, setAccountId] = useState('BBHC-NEW');
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [foundPatientData, setFoundPatientData] = useState<any>(null);
  const [accountCreatedSuccessMsg, setAccountCreatedSuccessMsg] = useState('');

  // Profile Form States (Account Information, NOT medical record)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    emergencyPhone: '',
    notificationPreference: 'WhatsApp',
  });
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [isCrossDeviceSynced, setIsCrossDeviceSynced] = useState(false);

  // Doctor Appointments List - empty by default, loaded from SQLite Database
  const [appointments, setAppointments] = useState<any[]>([]);

  // Function to refresh and re-fetch appointments from SQLite backend
  const handleRefreshAppointments = async () => {
    if (!phoneNumber) return;
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    try {
      setIsRefreshingAppointments(true);
      const res = await fetch(`/api/patient/account?phone=${encodeURIComponent(cleanPhone)}`);
      const data = await res.json();
      if (data.appointments && Array.isArray(data.appointments)) {
        const mappedAppointments = data.appointments.map((apt: any) => ({
          id: apt.id,
          patientName: apt.patient_name,
          doctorName: apt.doctor_name,
          specialty: apt.specialty || '',
          date: apt.date,
          timeSlot: apt.time_slot,
          serialNo: apt.serial_no,
          status: apt.status || 'CONFIRMED',
          tokenCode: apt.token_code,
          fee: apt.fee,
          paymentStatus: apt.payment_id ? 'PAID' : (apt.payment_method?.includes('Razorpay') ? 'PAID' : 'PAY_AT_CLINIC'),
          paymentMethod: apt.payment_method,
          paymentId: apt.payment_id,
        }));
        setAppointments(mappedAppointments);
      }
    } catch (err) {
      console.error('Failed to reload appointments:', err);
    } finally {
      setIsRefreshingAppointments(false);
    }
  };

  // Doctor Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookedSlotKeys, setBookedSlotKeys] = useState<string[]>([
    'doc-1-slot-1', 'doc-1-slot-3', 'doc-1-slot-6',
    'doc-2-slot-1', 'doc-2-slot-4',
    'doc-3-slot-2', 'doc-3-slot-4',
    'doc-4-slot-1', 'doc-4-slot-4',
    'doc-5-slot-1', 'doc-5-slot-4'
  ]);
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '',
    symptoms: '',
    paymentMethod: 'Pay at Clinic Counter',
  });
  const [showBookingConfirmModal, setShowBookingConfirmModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [bookingSuccessModalData, setBookingSuccessModalData] = useState<BookingSuccessDetails | null>(null);

  // Lab Test Booking State
  const [labSearchQuery, setLabSearchQuery] = useState('');
  const [labCategoryFilter, setLabCategoryFilter] = useState('All');
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<any>(null);
  const [labBookingModalOpen, setLabBookingModalOpen] = useState(false);
  const [labCollectionType, setLabCollectionType] = useState<'clinic' | 'home'>('clinic');
  const [labBookingSuccess, setLabBookingSuccess] = useState('');

  // Booked Lab Orders State - empty by default
  const [labOrders, setLabOrders] = useState<any[]>([]);

  // View Digital Report Modal State
  const [activeReportModal, setActiveReportModal] = useState<any>(null);

  // Health Vitals Tracker State - empty by default, loaded from SQLite Database
  const [vitalsLog, setVitalsLog] = useState<any[]>([]);
  const [newVital, setNewVital] = useState({
    sys: '120',
    dia: '80',
    fastingSugar: '95',
    pulse: '72',
    weight: '68',
  });
  const [vitalAddSuccess, setVitalAddSuccess] = useState('');

  // Invoices & Receipts State - empty by default, loaded from SQLite Database
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState<any>(null);

  // Edit Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    whatsappNumber: '',
    emergencyPhone: '',
    notificationPreference: 'WhatsApp',
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');

  const handleOpenEditProfile = () => {
    const currentPhone = phoneNumber || '';
    const formattedPhone = currentPhone ? (currentPhone.startsWith('+91') ? currentPhone : `+91 ${currentPhone}`) : '';
    
    setEditProfileForm({
      ...profile,
      whatsappNumber: currentPhone,
      emergencyPhone: profile.emergencyPhone || formattedPhone,
    });
    setProfileSaveSuccess('');
    setIsEditProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      fullName: editProfileForm.fullName,
      email: editProfileForm.email,
      dateOfBirth: editProfileForm.dateOfBirth,
      gender: editProfileForm.gender,
      address: editProfileForm.address,
      emergencyPhone: editProfileForm.emergencyPhone,
      notificationPreference: editProfileForm.notificationPreference,
    };
    setProfile(updatedProfile);

    const newPhone = editProfileForm.whatsappNumber ? editProfileForm.whatsappNumber.replace(/^\+91\s*/, '') : phoneNumber;
    setPhoneNumber(newPhone);

    setBookingForm((prev) => ({ ...prev, patientName: editProfileForm.fullName }));

    // Update localStorage session
    const savedSession = localStorage.getItem('bbhc_patient_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        parsed.profile = updatedProfile;
        parsed.phoneNumber = newPhone;
        localStorage.setItem('bbhc_patient_session', JSON.stringify(parsed));
      } catch (err) {
        console.error('Failed to update session localStorage', err);
      }
    } else {
      localStorage.setItem(
        'bbhc_patient_session',
        JSON.stringify({ phoneNumber: newPhone, profile: updatedProfile, loginTime: new Date().toISOString() })
      );
    }

    // Update SQLite Central Database
    fetch('/api/patient/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: newPhone,
        fullName: updatedProfile.fullName,
        email: updatedProfile.email || '',
        dateOfBirth: updatedProfile.dateOfBirth || '',
        gender: updatedProfile.gender || 'Male',
        address: updatedProfile.address || '',
        emergencyPhone: updatedProfile.emergencyPhone || '',
        notificationPreference: updatedProfile.notificationPreference || 'WhatsApp',
      }),
    }).catch((err) => console.error('Error saving updated profile to SQLite:', err));

    setProfileSaveSuccess('Profile updated successfully!');
    setTimeout(() => {
      setProfileSaveSuccess('');
      setIsEditProfileModalOpen(false);
    }, 1200);
  };

  // Geolocation states
  const [isLocating, setIsLocating] = useState(false);

  // Live Location Auto Detect Handler
  const handleGetLiveLocation = (target: 'profile' | 'editModal' = 'profile') => {
    setIsLocating(true);

    const setAddressResult = (addr: string) => {
      if (target === 'editModal') {
        setEditProfileForm((prev) => ({ ...prev, address: addr }));
      } else {
        setProfile((prev) => ({ ...prev, address: addr }));
      }
      setIsLocating(false);
    };

    // Helper to fetch detailed address by latitude and longitude using Nominatim jsonv2
    const reverseGeocode = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.address) {
            const a = data.address;
            const road = a.road || a.pedestrian || a.street || '';
            const local = a.neighbourhood || a.suburb || a.village || a.hamlet || a.residential || '';
            const town = a.town || a.city || a.municipality || a.suburb || 'Contai';
            const rawDistrict = a.county || a.state_district || 'East Midnapore';
            const district = rawDistrict === 'Purba Medinipur' ? 'East Midnapore' : rawDistrict;
            const state = a.state || 'West Bengal';
            const pin = a.postcode ? ` - ${a.postcode}` : '';

            const parts: string[] = [];
            if (road) parts.push(road);
            if (local && local !== road) parts.push(local);
            if (town && !parts.includes(town)) parts.push(town);
            if (district && !parts.includes(district)) parts.push(district);
            if (state && !parts.includes(state)) parts.push(state);

            if (parts.length >= 2) {
              return parts.join(', ') + pin;
            }
          }
          if (data && data.display_name) {
            const segments = data.display_name.split(',').map((s: string) => s.trim()).filter(Boolean);
            return segments.slice(0, 4).join(', ');
          }
        }
      } catch (err) {
        console.warn('Nominatim geocode error:', err);
      }

      return 'Padmapukuria, Contai, East Midnapore - 721401';
    };

    // Fallback using IP API if Geolocation API fails or permission denied
    const fetchIpLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.city) {
            const city = data.city;
            const region = data.region || 'West Bengal';
            const pin = data.postal ? ` - ${data.postal}` : '';
            return `${city}, ${region}, India${pin}`;
          }
        }
      } catch {
        // Fallback
      }
      return 'Padmapukuria, Contai, East Midnapore - 721401';
    };

    if (!navigator.geolocation) {
      fetchIpLocation().then(setAddressResult);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const addressStr = await reverseGeocode(latitude, longitude);
        setAddressResult(addressStr);
      },
      async (error) => {
        console.warn('Geolocation permission denied or error, using IP location fallback:', error);
        const ipAddress = await fetchIpLocation();
        setAddressResult(ipAddress);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Refs for 4 OTP inputs
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Restore saved session if user previously logged in & sync with Central SQLite DB
  useEffect(() => {
    // 1. Check doctor booking intent from URL query or sessionStorage
    const searchParams = new URLSearchParams(window.location.search);
    const actionParam = searchParams.get('action') || searchParams.get('tab');
    const doctorParam = searchParams.get('doctor') || searchParams.get('doctorId') || '';

    let storedIntent: any = null;
    try {
      const raw = sessionStorage.getItem('pending_doctor_booking_intent');
      if (raw) storedIntent = JSON.parse(raw);
    } catch (e) {}

    const hasBookingReq =
      actionParam === 'book-doctor' ||
      (storedIntent && storedIntent.action === 'book-doctor') ||
      Boolean(doctorParam);
    const targetDocParam = doctorParam || (storedIntent && storedIntent.doctor) || '';

    if (hasBookingReq) {
      setPendingBookingIntent({ action: 'book-doctor', doctor: targetDocParam });
    }

    const savedSession = localStorage.getItem('bbhc_patient_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.phoneNumber) {
          const cleanPhone = parsed.phoneNumber.replace(/\D/g, '').slice(-10);
          setIsDbLoading(true);

          // Verify with SQLite central database
          fetch(`/api/patient/account?phone=${encodeURIComponent(cleanPhone)}`)
            .then((r) => r.json())
            .then((data) => {
              if (data.found && data.patient) {
                setPhoneNumber(cleanPhone);
                setIsCrossDeviceSynced(true);
                setAccountId(data.patient.accountId || parsed.accountId || 'BBHC-PATIENT');
                const retrievedProfile = {
                  fullName: data.patient.fullName || '',
                  email: data.patient.email || '',
                  dateOfBirth: data.patient.dateOfBirth || '',
                  gender: data.patient.gender || 'Male',
                  address: data.patient.address || '',
                  emergencyPhone: data.patient.emergencyPhone || '',
                  notificationPreference: data.patient.notificationPreference || 'WhatsApp',
                };
                setProfile(retrievedProfile);
                setBookingForm((prev) => ({ ...prev, patientName: retrievedProfile.fullName }));

                if (data.appointments && data.appointments.length > 0) {
                  const mappedAppointments = data.appointments.map((apt: any) => ({
                    id: apt.id,
                    patientName: apt.patient_name,
                    doctorName: apt.doctor_name,
                    specialty: apt.specialty || '',
                    date: apt.date,
                    timeSlot: apt.time_slot,
                    serialNo: apt.serial_no,
                    status: apt.status || 'CONFIRMED',
                    tokenCode: apt.token_code,
                    fee: apt.fee,
                    paymentStatus: apt.payment_id ? 'PAID' : (apt.payment_method?.includes('Razorpay') ? 'PAID' : 'PAY_AT_CLINIC'),
                    paymentMethod: apt.payment_method,
                    paymentId: apt.payment_id,
                  }));
                  setAppointments(mappedAppointments);
                } else {
                  setAppointments([]);
                }

                if (data.vitals && data.vitals.length > 0) {
                  setVitalsLog(data.vitals.map((v: any) => ({
                    id: v.id,
                    date: v.date,
                    sys: v.sys,
                    dia: v.dia,
                    fastingSugar: v.fasting_sugar,
                    pulse: v.pulse,
                    weight: v.weight,
                    status: v.status,
                  })));
                } else {
                  setVitalsLog([]);
                }

                if (data.invoices && data.invoices.length > 0) {
                  setInvoices(data.invoices.map((inv: any) => ({
                    id: inv.id,
                    description: inv.description,
                    date: inv.date,
                    amount: inv.amount,
                    status: inv.status,
                    mode: inv.mode,
                  })));
                } else {
                  setInvoices([]);
                }

                setStep('dashboard');

                // AUTOMATIC DOCTOR SLOT ACTIVATION IF ALREADY LOGGED IN:
                if (hasBookingReq) {
                  setActiveTab('book-doctor');
                  const matchedDoc = findDoctor(targetDocParam) || doctorsList[0];
                  if (matchedDoc) {
                    setSelectedDoctor(matchedDoc);
                    setBookingForm((prev) => ({
                      ...prev,
                      patientName: retrievedProfile.fullName || prev.patientName,
                      timeSlot: '',
                    }));
                    setAutoActivatedBookingToast(true);
                  }
                  sessionStorage.removeItem('pending_doctor_booking_intent');
                }
              } else {
                // If local storage has an old/unregistered fake account, purge it!
                localStorage.removeItem('bbhc_patient_session');
                setStep('phone');
              }
            })
            .catch(() => {
              setStep('phone');
            })
            .finally(() => {
              setIsDbLoading(false);
            });
        }
      } catch (e) {
        console.error('Failed to parse saved session', e);
        localStorage.removeItem('bbhc_patient_session');
        setStep('phone');
      }
    }
  }, []);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Submit Phone Number & Check SQLite Database
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanNum.length < 10) {
      showAlert({
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit WhatsApp mobile number.',
        type: 'warning',
      });
      return;
    }

    setIsDbLoading(true);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setResendTimer(30);

    try {
      // Query Central SQLite DB to check if this number already exists
      const res = await fetch(`/api/patient/account?phone=${encodeURIComponent(cleanNum)}`);
      const data = await res.json();

      if (data.found && data.patient) {
        setIsExistingUser(true);
        setFoundPatientData(data);
      } else {
        setIsExistingUser(false);
        setFoundPatientData(null);
      }

      setStep('otp');
      setTimeout(() => otpInputRefs[0].current?.focus(), 100);
    } catch (err) {
      console.warn('Database lookup error for phone:', err);
      setIsExistingUser(false);
      setFoundPatientData(null);
      setStep('otp');
      setTimeout(() => otpInputRefs[0].current?.focus(), 100);
    } finally {
      setIsDbLoading(false);
    }
  };

  // OTP Input change handler
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setOtpError('');

    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  // OTP Keyboard backspace handler
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setOtpError('Please enter all 4 digits of the verification code.');
      return;
    }

    if (enteredOtp === '7872') {
      setOtpError('');
      const cleanNum = phoneNumber.replace(/\D/g, '').slice(-10);

      // If existing user verified in SQLite Database
      if (isExistingUser && foundPatientData && foundPatientData.patient) {
        setIsCrossDeviceSynced(true);
        const p = foundPatientData.patient;
        const retrievedProfile = {
          fullName: p.fullName || '',
          email: p.email || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || 'Male',
          address: p.address || '',
          emergencyPhone: p.emergencyPhone || '',
          notificationPreference: p.notificationPreference || 'WhatsApp',
        };
        const currentAccountId = p.accountId || `BBHC-${Math.floor(100000 + Math.random() * 900000)}`;
        setProfile(retrievedProfile);
        setAccountId(currentAccountId);
        setBookingForm((prev) => ({ ...prev, patientName: retrievedProfile.fullName }));

        if (foundPatientData.appointments && foundPatientData.appointments.length > 0) {
          setAppointments(foundPatientData.appointments.map((apt: any) => ({
            id: apt.id,
            patientName: apt.patient_name,
            doctorName: apt.doctor_name,
            specialty: apt.specialty || '',
            date: apt.date,
            timeSlot: apt.time_slot,
            serialNo: apt.serial_no,
            status: apt.status || 'CONFIRMED',
            tokenCode: apt.token_code,
            fee: apt.fee,
            paymentStatus: apt.payment_id ? 'PAID' : (apt.payment_method?.includes('Razorpay') ? 'PAID' : 'PAY_AT_CLINIC'),
            paymentMethod: apt.payment_method,
            paymentId: apt.payment_id,
          })));
        } else {
          setAppointments([]);
        }

        if (foundPatientData.vitals && foundPatientData.vitals.length > 0) {
          setVitalsLog(foundPatientData.vitals.map((v: any) => ({
            id: v.id,
            date: v.date,
            sys: v.sys,
            dia: v.dia,
            fastingSugar: v.fasting_sugar,
            pulse: v.pulse,
            weight: v.weight,
            status: v.status,
          })));
        } else {
          setVitalsLog([]);
        }

        if (foundPatientData.invoices && foundPatientData.invoices.length > 0) {
          setInvoices(foundPatientData.invoices.map((inv: any) => ({
            id: inv.id,
            description: inv.description,
            date: inv.date,
            amount: inv.amount,
            status: inv.status,
            mode: inv.mode,
          })));
        } else {
          setInvoices([]);
        }

        const sessionData = {
          phoneNumber: cleanNum,
          profile: retrievedProfile,
          accountId: currentAccountId,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('bbhc_patient_session', JSON.stringify(sessionData));
        setStep('dashboard');

        // Automatic doctor and slot booking activation after login:
        const searchParams = new URLSearchParams(window.location.search);
        const actionParam = searchParams.get('action') || searchParams.get('tab');
        const doctorParam = searchParams.get('doctor') || searchParams.get('doctorId') || '';
        const targetDocName = doctorParam || pendingBookingIntent?.doctor || '';

        if (pendingBookingIntent?.action === 'book-doctor' || actionParam === 'book-doctor' || doctorParam) {
          setActiveTab('book-doctor');
          const matchedDoc = findDoctor(targetDocName) || doctorsList[0];
          if (matchedDoc) {
            setSelectedDoctor(matchedDoc);
            setBookingForm((prev) => ({
              ...prev,
              patientName: retrievedProfile.fullName || prev.patientName,
              timeSlot: '',
            }));
            setAutoActivatedBookingToast(true);
          }
          sessionStorage.removeItem('pending_doctor_booking_intent');
          setPendingBookingIntent(null);
        }
      } else {
        // Brand NEW mobile number!
        // Clear all mock/stale data completely so NO fake account appears!
        setProfile({
          fullName: '',
          email: '',
          dateOfBirth: '',
          gender: 'Male',
          address: '',
          emergencyPhone: '',
          notificationPreference: 'WhatsApp',
        });
        setAccountId('BBHC-NEW');
        setAppointments([]);
        setVitalsLog([]);
        setInvoices([]);
        setLabOrders([]);
        setBookingForm((prev) => ({ ...prev, patientName: '' }));

        // Direct user to Profile Registration to persist into SQLite
        setStep('profile');
      }
    } else {
      setOtpError('Invalid OTP code. Please use the default verification code 7872.');
    }
  };

  // Step 3: Save Profile Information to SQLite Central Database
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      showAlert({
        title: 'Full Name Required',
        message: 'Please enter your full name to complete your patient profile.',
        type: 'warning',
      });
      return;
    }

    setIsDbLoading(true);
    const cleanNum = phoneNumber.replace(/\D/g, '').slice(-10);

    try {
      const generatedAccountId = `BBHC-${Math.floor(100000 + Math.random() * 900000)}`;

      // Post directly to SQLite Central Database
      const res = await fetch('/api/patient/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanNum,
          fullName: profile.fullName.trim(),
          email: profile.email || '',
          dateOfBirth: profile.dateOfBirth || '',
          gender: profile.gender || 'Male',
          address: profile.address || '',
          emergencyPhone: profile.emergencyPhone || '',
          notificationPreference: profile.notificationPreference || 'WhatsApp',
          accountId: generatedAccountId,
        }),
      });

      const data = await res.json();
      if (data.success && data.patient) {
        const savedProfile = {
          fullName: data.patient.fullName,
          email: data.patient.email || '',
          dateOfBirth: data.patient.dateOfBirth || '',
          gender: data.patient.gender || 'Male',
          address: data.patient.address || '',
          emergencyPhone: data.patient.emergencyPhone || '',
          notificationPreference: data.patient.notificationPreference || 'WhatsApp',
        };

        const finalAccountId = data.patient.accountId || generatedAccountId;
        setProfile(savedProfile);
        setAccountId(finalAccountId);
        setBookingForm((prev) => ({ ...prev, patientName: savedProfile.fullName }));
        setIsCrossDeviceSynced(true);

        // Save active session only after SQLite confirms account creation
        const sessionData = {
          phoneNumber: cleanNum,
          profile: savedProfile,
          accountId: finalAccountId,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('bbhc_patient_session', JSON.stringify(sessionData));

        setAccountCreatedSuccessMsg(`Account created successfully! Your Patient ID: ${finalAccountId}`);
        setStep('dashboard');

        // Automatic doctor and slot booking activation after registration:
        const searchParams = new URLSearchParams(window.location.search);
        const actionParam = searchParams.get('action') || searchParams.get('tab');
        const doctorParam = searchParams.get('doctor') || searchParams.get('doctorId') || '';
        const targetDocName = doctorParam || pendingBookingIntent?.doctor || '';

        if (pendingBookingIntent?.action === 'book-doctor' || actionParam === 'book-doctor' || doctorParam) {
          setActiveTab('book-doctor');
          const matchedDoc = findDoctor(targetDocName) || doctorsList[0];
          if (matchedDoc) {
            setSelectedDoctor(matchedDoc);
            setBookingForm((prev) => ({
              ...prev,
              patientName: savedProfile.fullName || prev.patientName,
              timeSlot: '',
            }));
            setAutoActivatedBookingToast(true);
          }
          sessionStorage.removeItem('pending_doctor_booking_intent');
          setPendingBookingIntent(null);
        }
      } else {
        showAlert({
          title: 'Account Registration Error',
          message: data.error || 'Could not save account. Please try again.',
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Connection error during account creation:', err);
      showAlert({
        title: 'Connection Error',
        message: 'Error connecting to the clinic server. Please check your network connection and try again.',
        type: 'error',
      });
    } finally {
      setIsDbLoading(false);
    }
  };

  // Logout Handler - Purge local session and clean all states
  const handleLogout = () => {
    showConfirm({
      title: 'Sign Out Confirmation',
      message: 'Are you sure you want to log out of your patient account? You can log back in anytime using your WhatsApp mobile number.',
      confirmText: 'Yes, Log Out',
      cancelText: 'Stay Logged In',
      type: 'warning',
      onConfirm: () => {
        localStorage.removeItem('bbhc_patient_session');
        setStep('phone');
        setPhoneNumber('');
        setOtpDigits(['', '', '', '']);
        setAccountId('BBHC-NEW');
        setProfile({
          fullName: '',
          email: '',
          dateOfBirth: '',
          gender: 'Male',
          address: '',
          emergencyPhone: '',
          notificationPreference: 'WhatsApp',
        });
        setAppointments([]);
        setVitalsLog([]);
        setInvoices([]);
        setLabOrders([]);
        setIsExistingUser(null);
        setFoundPatientData(null);
        setIsCrossDeviceSynced(false);
        setAccountCreatedSuccessMsg('');
      },
    });
  };

  // Doctor List Catalog
  const doctorsList = [
    {
      id: 'doc-1',
      name: 'Dr. S. K. Jana',
      degree: 'M.D. (Cardiology), F.A.C.C.',
      specialty: 'Senior Consultant Cardiologist',
      experience: '18+ Years Exp.',
      timing: 'Mon, Wed, Fri (05:00 PM - 08:00 PM)',
      fee: '₹500',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-blue-600',
    },
    {
      id: 'doc-2',
      name: 'Dr. P. B. Maiti',
      degree: 'M.S. (Orthopedics), M.Ch.',
      specialty: 'Bone, Joint & Spine Specialist',
      experience: '15+ Years Exp.',
      timing: 'Tue, Thu, Sat (10:00 AM - 01:00 PM)',
      fee: '₹500',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-emerald-600',
    },
    {
      id: 'doc-3',
      name: 'Dr. R. N. Giri',
      degree: 'M.B.B.S., D.T.M.&H.',
      specialty: 'General Medicine & Diabetologist',
      experience: '20+ Years Exp.',
      timing: 'Daily (09:00 AM - 02:00 PM)',
      fee: '₹300',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-purple-600',
    },
    {
      id: 'doc-4',
      name: 'Dr. Ananya Das',
      degree: 'M.D. (Pediatrics), D.C.H.',
      specialty: 'Child Specialist & Neonatologist',
      experience: '12+ Years Exp.',
      timing: 'Mon to Sat (04:00 PM - 07:00 PM)',
      fee: '₹400',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-amber-600',
    },
    {
      id: 'doc-5',
      name: 'Dr. M. Roy',
      degree: 'M.S. (Obs & Gynae), D.G.O.',
      specialty: 'Gynecologist & Infertility Specialist',
      experience: '14+ Years Exp.',
      timing: 'Tue, Fri, Sun (11:00 AM - 02:00 PM)',
      fee: '₹500',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-rose-600',
    },
    {
      id: 'suman-sarangi',
      name: 'Dr. Suman Sarangi',
      degree: 'MBBS, MD (Psychiatry), DNB',
      specialty: 'Neuropsychiatrist & Behavioral Health Specialist',
      experience: '16+ Years Exp.',
      timing: 'Every Sunday (08:30 AM - 10:30 AM)',
      fee: '₹500',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-indigo-600',
    },
    {
      id: 'kamal-poddar',
      name: 'Dr. Kamal Poddar',
      degree: 'MBBS, MD (Medicine), C.Diab',
      specialty: 'Consultant Physician & Diabetes Specialist',
      experience: '15+ Years Exp.',
      timing: 'Every Saturday (10:00 AM - 01:00 PM)',
      fee: '₹400',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-cyan-600',
    },
    {
      id: 'saikat-maity',
      name: 'Dr. Saikat Maity',
      degree: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
      specialty: 'Dermatologist, Hair & Cosmetology Specialist',
      experience: '12+ Years Exp.',
      timing: 'Every Sunday (02:00 PM - 05:00 PM)',
      fee: '₹400',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-teal-600',
    },
    {
      id: 'rakesh-mohanty',
      name: 'Dr. Rakesh Mohanty',
      degree: 'MBBS, MD (Medicine), DM (Gastroenterology)',
      specialty: 'Gastroenterologist & Liver Specialist',
      experience: 'Assistant Professor & Gastro Specialist',
      timing: 'On Appointment Booking (04:00 PM - 07:00 PM)',
      fee: '₹500',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
      avatarColor: 'bg-amber-600',
    },
  ];

  // Helper to find a doctor by query parameter, ID, or partial name
  const findDoctor = (query?: string) => {
    if (!query) return null;
    const q = query.toLowerCase().trim();
    return doctorsList.find((d) => {
      const idMatch = d.id.toLowerCase() === q || q.includes(d.id.toLowerCase());
      const nameMatch = d.name.toLowerCase().includes(q) || q.includes(d.name.toLowerCase().replace('dr. ', '').trim());
      const specMatch = d.specialty && (d.specialty.toLowerCase().includes(q) || q.includes(d.specialty.toLowerCase()));
      return idMatch || nameMatch || specMatch;
    });
  };

  // Doctor slot generator with realistic and comprehensive slot schedules
  const getDoctorSlots = (docId: string) => {
    switch (docId) {
      case 'suman-sarangi': // Dr. Suman Sarangi (Sunday 08:30 AM - 10:30 AM)
        return [
          { id: 'slot-1', time: '08:30 AM - 08:45 AM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '08:45 AM - 09:00 AM', isPreBooked: false },
          { id: 'slot-3', time: '09:00 AM - 09:15 AM', isPreBooked: false },
          { id: 'slot-4', time: '09:15 AM - 09:30 AM', isPreBooked: true, bookedBy: 'Serial #03' },
          { id: 'slot-5', time: '09:30 AM - 09:45 AM', isPreBooked: false },
          { id: 'slot-6', time: '09:45 AM - 10:00 AM', isPreBooked: false },
          { id: 'slot-7', time: '10:00 AM - 10:15 AM', isPreBooked: false },
          { id: 'slot-8', time: '10:15 AM - 10:30 AM', isPreBooked: false },
        ];
      case 'kamal-poddar': // Dr. Kamal Poddar (Saturday 10:00 AM - 01:00 PM)
        return [
          { id: 'slot-1', time: '10:00 AM - 10:15 AM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '10:15 AM - 10:30 AM', isPreBooked: false },
          { id: 'slot-3', time: '10:30 AM - 10:45 AM', isPreBooked: false },
          { id: 'slot-4', time: '10:45 AM - 11:00 AM', isPreBooked: true, bookedBy: 'Serial #04' },
          { id: 'slot-5', time: '11:00 AM - 11:15 AM', isPreBooked: false },
          { id: 'slot-6', time: '11:15 AM - 11:30 AM', isPreBooked: false },
          { id: 'slot-7', time: '11:30 AM - 11:45 AM', isPreBooked: false },
          { id: 'slot-8', time: '11:45 AM - 12:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '12:00 PM - 12:15 PM', isPreBooked: true, bookedBy: 'Serial #07' },
          { id: 'slot-10', time: '12:15 PM - 12:30 PM', isPreBooked: false },
          { id: 'slot-11', time: '12:30 PM - 12:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '12:45 PM - 01:00 PM', isPreBooked: false },
        ];
      case 'saikat-maity': // Dr. Saikat Maity (Sunday 02:00 PM - 05:00 PM)
        return [
          { id: 'slot-1', time: '02:00 PM - 02:15 PM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '02:15 PM - 02:30 PM', isPreBooked: false },
          { id: 'slot-3', time: '02:30 PM - 02:45 PM', isPreBooked: false },
          { id: 'slot-4', time: '02:45 PM - 03:00 PM', isPreBooked: true, bookedBy: 'Serial #03' },
          { id: 'slot-5', time: '03:00 PM - 03:15 PM', isPreBooked: false },
          { id: 'slot-6', time: '03:15 PM - 03:30 PM', isPreBooked: false },
          { id: 'slot-7', time: '03:30 PM - 03:45 PM', isPreBooked: false },
          { id: 'slot-8', time: '03:45 PM - 04:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '04:00 PM - 04:15 PM', isPreBooked: true, bookedBy: 'Serial #06' },
          { id: 'slot-10', time: '04:15 PM - 04:30 PM', isPreBooked: false },
          { id: 'slot-11', time: '04:30 PM - 04:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '04:45 PM - 05:00 PM', isPreBooked: false },
        ];
      case 'rakesh-mohanty': // Dr. Rakesh Mohanty (04:00 PM - 07:00 PM)
        return [
          { id: 'slot-1', time: '04:00 PM - 04:15 PM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '04:15 PM - 04:30 PM', isPreBooked: false },
          { id: 'slot-3', time: '04:30 PM - 04:45 PM', isPreBooked: false },
          { id: 'slot-4', time: '04:45 PM - 05:00 PM', isPreBooked: false },
          { id: 'slot-5', time: '05:00 PM - 05:15 PM', isPreBooked: true, bookedBy: 'Serial #04' },
          { id: 'slot-6', time: '05:15 PM - 05:30 PM', isPreBooked: false },
          { id: 'slot-7', time: '05:30 PM - 05:45 PM', isPreBooked: false },
          { id: 'slot-8', time: '05:45 PM - 06:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '06:00 PM - 06:15 PM', isPreBooked: true, bookedBy: 'Serial #07' },
          { id: 'slot-10', time: '06:15 PM - 06:30 PM', isPreBooked: false },
          { id: 'slot-11', time: '06:30 PM - 06:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '06:45 PM - 07:00 PM', isPreBooked: false },
        ];
      case 'doc-1': // Dr. S. K. Jana: Mon, Wed, Fri (05:00 PM - 08:30 PM)
        return [
          { id: 'slot-1', time: '05:00 PM - 05:15 PM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '05:15 PM - 05:30 PM', isPreBooked: true, bookedBy: 'Serial #02' },
          { id: 'slot-3', time: '05:30 PM - 05:45 PM', isPreBooked: false },
          { id: 'slot-4', time: '05:45 PM - 06:00 PM', isPreBooked: false },
          { id: 'slot-5', time: '06:00 PM - 06:15 PM', isPreBooked: true, bookedBy: 'Serial #05' },
          { id: 'slot-6', time: '06:15 PM - 06:30 PM', isPreBooked: false },
          { id: 'slot-7', time: '06:30 PM - 06:45 PM', isPreBooked: false },
          { id: 'slot-8', time: '06:45 PM - 07:00 PM', isPreBooked: true, bookedBy: 'Serial #07' },
          { id: 'slot-9', time: '07:00 PM - 07:15 PM', isPreBooked: false },
          { id: 'slot-10', time: '07:15 PM - 07:30 PM', isPreBooked: false },
          { id: 'slot-11', time: '07:30 PM - 07:45 PM', isPreBooked: true, bookedBy: 'Serial #10' },
          { id: 'slot-12', time: '07:45 PM - 08:00 PM', isPreBooked: false },
          { id: 'slot-13', time: '08:00 PM - 08:15 PM', isPreBooked: false },
          { id: 'slot-14', time: '08:15 PM - 08:30 PM', isPreBooked: false },
        ];
      case 'doc-2': // Dr. P. B. Maiti: Tue, Thu, Sat (10:00 AM - 01:15 PM)
        return [
          { id: 'slot-1', time: '10:00 AM - 10:15 AM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '10:15 AM - 10:30 AM', isPreBooked: false },
          { id: 'slot-3', time: '10:30 AM - 10:45 AM', isPreBooked: false },
          { id: 'slot-4', time: '10:45 AM - 11:00 AM', isPreBooked: true, bookedBy: 'Serial #03' },
          { id: 'slot-5', time: '11:00 AM - 11:15 AM', isPreBooked: false },
          { id: 'slot-6', time: '11:15 AM - 11:30 AM', isPreBooked: false },
          { id: 'slot-7', time: '11:30 AM - 11:45 AM', isPreBooked: true, bookedBy: 'Serial #06' },
          { id: 'slot-8', time: '11:45 AM - 12:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '12:00 PM - 12:15 PM', isPreBooked: false },
          { id: 'slot-10', time: '12:15 PM - 12:30 PM', isPreBooked: true, bookedBy: 'Serial #09' },
          { id: 'slot-11', time: '12:30 PM - 12:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '12:45 PM - 01:00 PM', isPreBooked: false },
          { id: 'slot-13', time: '01:00 PM - 01:15 PM', isPreBooked: false },
        ];
      case 'doc-3': // Dr. R. N. Giri: Daily (09:00 AM - 01:30 PM)
        return [
          { id: 'slot-1', time: '09:00 AM - 09:20 AM', isPreBooked: false },
          { id: 'slot-2', time: '09:20 AM - 09:40 AM', isPreBooked: true, bookedBy: 'Serial #02' },
          { id: 'slot-3', time: '09:40 AM - 10:00 AM', isPreBooked: false },
          { id: 'slot-4', time: '10:00 AM - 10:20 AM', isPreBooked: true, bookedBy: 'Serial #04' },
          { id: 'slot-5', time: '10:20 AM - 10:40 AM', isPreBooked: false },
          { id: 'slot-6', time: '10:40 AM - 11:00 AM', isPreBooked: false },
          { id: 'slot-7', time: '11:00 AM - 11:20 AM', isPreBooked: true, bookedBy: 'Serial #07' },
          { id: 'slot-8', time: '11:20 AM - 11:40 AM', isPreBooked: false },
          { id: 'slot-9', time: '11:40 AM - 12:00 PM', isPreBooked: false },
          { id: 'slot-10', time: '12:00 PM - 12:20 PM', isPreBooked: true, bookedBy: 'Serial #10' },
          { id: 'slot-11', time: '12:20 PM - 12:40 PM', isPreBooked: false },
          { id: 'slot-12', time: '12:40 PM - 01:00 PM', isPreBooked: false },
          { id: 'slot-13', time: '01:00 PM - 01:15 PM', isPreBooked: true, bookedBy: 'Serial #12' },
          { id: 'slot-14', time: '01:15 PM - 01:30 PM', isPreBooked: false },
        ];
      case 'doc-4': // Dr. Ananya Das: Mon to Sat (04:00 PM - 07:30 PM)
        return [
          { id: 'slot-1', time: '04:00 PM - 04:15 PM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '04:15 PM - 04:30 PM', isPreBooked: false },
          { id: 'slot-3', time: '04:30 PM - 04:45 PM', isPreBooked: false },
          { id: 'slot-4', time: '04:45 PM - 05:00 PM', isPreBooked: true, bookedBy: 'Serial #03' },
          { id: 'slot-5', time: '05:00 PM - 05:15 PM', isPreBooked: false },
          { id: 'slot-6', time: '05:15 PM - 05:30 PM', isPreBooked: false },
          { id: 'slot-7', time: '05:30 PM - 05:45 PM', isPreBooked: true, bookedBy: 'Serial #06' },
          { id: 'slot-8', time: '05:45 PM - 06:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '06:00 PM - 06:15 PM', isPreBooked: false },
          { id: 'slot-10', time: '06:15 PM - 06:30 PM', isPreBooked: true, bookedBy: 'Serial #08' },
          { id: 'slot-11', time: '06:30 PM - 06:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '06:45 PM - 07:00 PM', isPreBooked: false },
          { id: 'slot-13', time: '07:00 PM - 07:15 PM', isPreBooked: false },
          { id: 'slot-14', time: '07:15 PM - 07:30 PM', isPreBooked: false },
        ];
      case 'doc-5': // Dr. M. Roy: Tue, Fri, Sun (11:00 AM - 02:30 PM)
        return [
          { id: 'slot-1', time: '11:00 AM - 11:15 AM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '11:15 AM - 11:30 AM', isPreBooked: false },
          { id: 'slot-3', time: '11:30 AM - 11:45 AM', isPreBooked: false },
          { id: 'slot-4', time: '11:45 AM - 12:00 PM', isPreBooked: true, bookedBy: 'Serial #03' },
          { id: 'slot-5', time: '12:00 PM - 12:15 PM', isPreBooked: false },
          { id: 'slot-6', time: '12:15 PM - 12:30 PM', isPreBooked: false },
          { id: 'slot-7', time: '12:30 PM - 12:45 PM', isPreBooked: true, bookedBy: 'Serial #05' },
          { id: 'slot-8', time: '12:45 PM - 01:00 PM', isPreBooked: false },
          { id: 'slot-9', time: '01:00 PM - 01:15 PM', isPreBooked: false },
          { id: 'slot-10', time: '01:15 PM - 01:30 PM', isPreBooked: true, bookedBy: 'Serial #08' },
          { id: 'slot-11', time: '01:30 PM - 01:45 PM', isPreBooked: false },
          { id: 'slot-12', time: '01:45 PM - 02:00 PM', isPreBooked: false },
          { id: 'slot-13', time: '02:00 PM - 02:15 PM', isPreBooked: false },
          { id: 'slot-14', time: '02:15 PM - 02:30 PM', isPreBooked: false },
        ];
      default:
        return [
          { id: 'slot-1', time: '10:00 AM - 10:15 AM', isPreBooked: true, bookedBy: 'Serial #01' },
          { id: 'slot-2', time: '10:15 AM - 10:30 AM', isPreBooked: false },
          { id: 'slot-3', time: '10:30 AM - 10:45 AM', isPreBooked: false },
          { id: 'slot-4', time: '10:45 AM - 11:00 AM', isPreBooked: false },
          { id: 'slot-5', time: '11:00 AM - 11:15 AM', isPreBooked: true, bookedBy: 'Serial #04' },
          { id: 'slot-6', time: '11:15 AM - 11:30 AM', isPreBooked: false },
          { id: 'slot-7', time: '05:00 PM - 05:15 PM', isPreBooked: true, bookedBy: 'Serial #07' },
          { id: 'slot-8', time: '05:15 PM - 05:30 PM', isPreBooked: false },
          { id: 'slot-9', time: '05:30 PM - 05:45 PM', isPreBooked: false },
          { id: 'slot-10', time: '05:45 PM - 06:00 PM', isPreBooked: false },
          { id: 'slot-11', time: '06:00 PM - 06:15 PM', isPreBooked: true, bookedBy: 'Serial #10' },
          { id: 'slot-12', time: '06:15 PM - 06:30 PM', isPreBooked: false },
        ];
    }
  };

  const isSlotBooked = (docId: string, slotId: string, slotTime: string, isPreBooked: boolean) => {
    const dynamicKey = `${docId}-${bookingForm.preferredDate}-${slotTime}`;
    const preKey = `${docId}-${slotId}`;
    return isPreBooked || bookedSlotKeys.includes(dynamicKey) || bookedSlotKeys.includes(preKey);
  };

  const handleDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc);
    // User explicitly requested: No slot should be selected by default
    setBookingForm((prev) => ({ ...prev, timeSlot: '' }));
  };

  // Doctor Appointment Submit Handler - Opens Confirmation Popup Modal
  const handleBookAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      showAlert({
        title: 'Doctor Selection Required',
        message: 'Please select a specialist doctor to book your appointment serial.',
        type: 'warning',
      });
      return;
    }

    if (!bookingForm.timeSlot) {
      showAlert({
        title: 'Time Slot Required',
        message: 'Please select an available (green) time slot before confirming your booking.',
        type: 'warning',
      });
      return;
    }

    const slots = getDoctorSlots(selectedDoctor.id);
    const selectedSlotObj = slots.find((s) => s.time === bookingForm.timeSlot);
    if (selectedSlotObj && isSlotBooked(selectedDoctor.id, selectedSlotObj.id, selectedSlotObj.time, selectedSlotObj.isPreBooked)) {
      showAlert({
        title: 'Slot Already Booked',
        message: 'This time slot is already booked by another patient. Please choose an available (green) time slot.',
        type: 'warning',
      });
      return;
    }

    // Open English confirmation modal pop-up
    setShowBookingConfirmModal(true);
  };

  // Executes the appointment booking after patient confirms in the modal popup
  const executeAppointmentBooking = async () => {
    if (!selectedDoctor || !bookingForm.timeSlot) return;

    const serialNum = `#${Math.floor(10 + Math.random() * 25)}`;
    const patientDisplayName = bookingForm.patientName || profile.fullName || 'Patient';
    const numericFee = parseInt(selectedDoctor.fee.replace(/\D/g, ''), 10) || 500;

    // Handle Online Payment with Razorpay
    if (bookingForm.paymentMethod === 'Online Payment (Razorpay)') {
      setIsProcessingPayment(true);
      try {
        const paymentResult = await processRazorpayPayment({
          amountInRupees: numericFee,
          doctorName: selectedDoctor.name,
          serviceTitle: `Doctor Consultation Serial - ${selectedDoctor.name}`,
          patientName: patientDisplayName,
          patientPhone: phoneNumber || profile.emergencyPhone || '9876543210',
          notes: {
            doctor: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            slot: bookingForm.timeSlot,
            date: bookingForm.preferredDate,
          },
        });

        const newAppointment = {
          id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: patientDisplayName,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          date: bookingForm.preferredDate,
          timeSlot: bookingForm.timeSlot,
          serialNo: serialNum,
          status: 'CONFIRMED',
          tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
          fee: selectedDoctor.fee,
          paymentStatus: 'PAID',
          paymentMethod: 'Online Payment (Razorpay)',
          paymentId: paymentResult.razorpay_payment_id,
        };

        setAppointments([newAppointment, ...appointments]);
        setBookedSlotKeys((prev) => [...prev, `${selectedDoctor.id}-${bookingForm.preferredDate}-${bookingForm.timeSlot}`]);

        // Sync to SQLite Central DB
        fetch('/api/patient/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber,
            patientName: patientDisplayName,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            date: bookingForm.preferredDate,
            timeSlot: bookingForm.timeSlot,
            serialNo: serialNum,
            tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
            fee: selectedDoctor.fee,
            paymentMethod: 'Online Payment (Razorpay)',
            paymentId: paymentResult.razorpay_payment_id,
            status: 'CONFIRMED',
            symptoms: bookingForm.symptoms,
          }),
        }).catch((err) => console.error('Error saving appointment to SQLite:', err));

        // Create Invoice for appointment with Razorpay details
        const newInvoice = {
          id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          description: `Doctor Consultation - ${selectedDoctor.name}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          amount: selectedDoctor.fee,
          status: 'PAID',
          mode: `Razorpay Online (${paymentResult.razorpay_payment_id.slice(-8)})`,
          razorpayPaymentId: paymentResult.razorpay_payment_id,
        };
        setInvoices([newInvoice, ...invoices]);

        setShowBookingConfirmModal(false);
        setBookingSuccessMsg(
          `Appointment & Serial ${serialNum} confirmed! Payment successful via Razorpay (Txn ID: ${paymentResult.razorpay_payment_id}). Serial token is ready.`
        );
        
        // Trigger Flipkart-style celebration animation modal
        setBookingSuccessModalData({
          serialNo: serialNum,
          tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          date: bookingForm.preferredDate,
          timeSlot: bookingForm.timeSlot,
          patientName: patientDisplayName,
          fee: selectedDoctor.fee,
          paymentMethod: 'Online Payment (Razorpay)',
          paymentId: paymentResult.razorpay_payment_id,
        });

        setSelectedDoctor(null);
        setTimeout(() => setBookingSuccessMsg(''), 10000);
      } catch (err: any) {
        console.warn('Razorpay payment cancelled or failed:', err);
        showAlert({
          title: 'Payment Incomplete',
          message: err.message || 'Payment was not completed. You can try again or switch to "Pay at Clinic Counter" to book without online payment.',
          type: 'warning',
        });
      } finally {
        setIsProcessingPayment(false);
      }
      return;
    }

    // Default: Pay at Clinic Counter
    const newAppointment = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientDisplayName,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: bookingForm.preferredDate,
      timeSlot: bookingForm.timeSlot,
      serialNo: serialNum,
      status: 'CONFIRMED',
      tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
      fee: selectedDoctor.fee,
      paymentStatus: 'PAY_AT_CLINIC',
      paymentMethod: 'Pay at Clinic Counter',
    };

    setAppointments([newAppointment, ...appointments]);
    // Save this slot as booked for this doctor and date
    setBookedSlotKeys((prev) => [...prev, `${selectedDoctor.id}-${bookingForm.preferredDate}-${bookingForm.timeSlot}`]);

    // Sync to SQLite Central DB
    fetch('/api/patient/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        patientName: patientDisplayName,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: bookingForm.preferredDate,
        timeSlot: bookingForm.timeSlot,
        serialNo: serialNum,
        tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
        fee: selectedDoctor.fee,
        paymentMethod: 'Pay at Clinic Counter',
        paymentId: '',
        status: 'CONFIRMED',
        symptoms: bookingForm.symptoms,
      }),
    }).catch((err) => console.error('Error saving appointment to SQLite:', err));

    // Create Invoice for appointment
    const newInvoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Doctor Consultation - ${selectedDoctor.name}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: selectedDoctor.fee,
      status: 'UNPAID',
      mode: 'Pay at Clinic Counter (Pending)',
    };
    setInvoices([newInvoice, ...invoices]);

    setShowBookingConfirmModal(false);
    setBookingSuccessMsg(
      `Appointment & Serial ${serialNum} confirmed successfully with ${selectedDoctor.name} at ${bookingForm.timeSlot}! You can pay ${selectedDoctor.fee} at the clinic reception on arrival.`
    );

    // Trigger Flipkart-style celebration animation modal
    setBookingSuccessModalData({
      serialNo: serialNum,
      tokenCode: `BBHC-SER-${serialNum.replace('#', '')}`,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: bookingForm.preferredDate,
      timeSlot: bookingForm.timeSlot,
      patientName: patientDisplayName,
      fee: selectedDoctor.fee,
      paymentMethod: 'Pay at Clinic Counter',
    });

    setSelectedDoctor(null);
    setTimeout(() => setBookingSuccessMsg(''), 10000);
  };

  // Lab Services Catalog
  const labServicesList = [
    { id: 'lab-1', name: 'Complete Blood Count (CBC)', category: 'Blood Tests', parameters: '24 Parameters', price: 350, origPrice: 500, turnTime: '4 Hours' },
    { id: 'lab-2', name: 'HbA1c & Fasting Blood Sugar', category: 'Diabetes', parameters: '3 Parameters', price: 450, origPrice: 650, turnTime: '3 Hours' },
    { id: 'lab-3', name: 'Lipid Profile (Cholesterol Panel)', category: 'Cardiac', parameters: '8 Parameters', price: 650, origPrice: 900, turnTime: '6 Hours' },
    { id: 'lab-4', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Thyroid', parameters: '3 Parameters', price: 550, origPrice: 800, turnTime: '5 Hours' },
    { id: 'lab-5', name: 'Renal Function Test (RFT / KFT)', category: 'Kidney', parameters: '7 Parameters', price: 600, origPrice: 850, turnTime: '6 Hours' },
    { id: 'lab-6', name: 'Liver Function Test (LFT)', category: 'Liver', parameters: '11 Parameters', price: 650, origPrice: 900, turnTime: '6 Hours' },
    { id: 'lab-7', name: 'Digital Chest X-Ray (PA View)', category: 'X-Ray & Imaging', parameters: 'High Res Digital', price: 400, origPrice: 550, turnTime: '2 Hours' },
    { id: 'lab-8', name: 'Whole Abdomen Ultrasonography (USG)', category: 'X-Ray & Imaging', parameters: 'Color Doppler', price: 900, origPrice: 1200, turnTime: 'Same Day' },
    { id: 'lab-9', name: 'Executive Full Body Health Package', category: 'Full Body Packages', parameters: '65+ Comprehensive Parameters', price: 1499, origPrice: 2500, turnTime: 'Same Day' },
  ];

  const filteredLabServices = labServicesList.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(labSearchQuery.toLowerCase()) || service.category.toLowerCase().includes(labSearchQuery.toLowerCase());
    const matchesCat = labCategoryFilter === 'All' || service.category === labCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Lab Test Booking Confirm Handler
  const handleConfirmLabBooking = () => {
    if (!selectedTestForBooking) return;

    const newOrder = {
      id: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      testName: selectedTestForBooking.name,
      category: selectedTestForBooking.category,
      date: 'Scheduled Today',
      sampleType: labCollectionType === 'home' ? 'Home Sample Collection' : 'Clinic Lab Visit',
      status: 'BOOKED',
      price: `₹${selectedTestForBooking.price + (labCollectionType === 'home' ? 50 : 0)}`,
      reportAvailable: false,
    };

    setLabOrders([newOrder, ...labOrders]);

    // Add invoice for lab test
    const newInvoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Lab Diagnostic - ${selectedTestForBooking.name}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      amount: `₹${selectedTestForBooking.price + (labCollectionType === 'home' ? 50 : 0)}`,
      status: 'PAID',
      mode: 'UPI Online',
    };
    setInvoices([newInvoice, ...invoices]);

    setLabBookingSuccess(`Booking confirmed for ${selectedTestForBooking.name}! Our lab team will assist you.`);
    setLabBookingModalOpen(false);
    setSelectedTestForBooking(null);
    setTimeout(() => setLabBookingSuccess(''), 8000);
  };

  // Add Vital Log Handler
  const handleAddVitalLog = (e: React.FormEvent) => {
    e.preventDefault();
    const sysNum = parseInt(newVital.sys) || 120;
    const diaNum = parseInt(newVital.dia) || 80;

    let statusTag = 'NORMAL';
    if (sysNum > 130 || diaNum > 85) statusTag = 'ELEVATED';
    if (sysNum <= 120 && diaNum <= 80) statusTag = 'OPTIMAL';

    const logItem = {
      id: Date.now(),
      date: 'Just Now',
      sys: sysNum,
      dia: diaNum,
      fastingSugar: parseInt(newVital.fastingSugar) || 95,
      pulse: parseInt(newVital.pulse) || 72,
      weight: parseFloat(newVital.weight) || 68,
      status: statusTag,
    };

    setVitalsLog([logItem, ...vitalsLog]);

    // Sync to SQLite Central DB
    fetch('/api/patient/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        date: 'Just Now',
        sys: sysNum,
        dia: diaNum,
        fastingSugar: parseInt(newVital.fastingSugar) || 95,
        pulse: parseInt(newVital.pulse) || 72,
        weight: parseFloat(newVital.weight) || 68,
        status: statusTag,
      }),
    }).catch((err) => console.error('Error saving vitals to SQLite:', err));

    setVitalAddSuccess('New health vitals recorded successfully!');
    setTimeout(() => setVitalAddSuccess(''), 5000);
  };

  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center py-4 sm:py-6 px-4 bg-gradient-to-b from-secondary/40 via-background to-background text-foreground my-auto">
      {/* CONTAINER */}
      <div className={`w-full mx-auto my-auto transition-all duration-300 ${step === 'dashboard' ? 'max-w-6xl' : 'max-w-md'}`}>
        
        {/* STEP 1: ENTER WHATSAPP MOBILE NUMBER */}
        {step === 'phone' && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-6 animate-fadeIn">
            {pendingBookingIntent && (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-xs text-foreground flex items-center gap-3 animate-fadeIn">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-primary">Doctor Appointment & Serial Booking</p>
                  <p className="text-muted-foreground text-[11px] leading-tight">
                    Please log in with your WhatsApp number. Once verified, the doctor and consultation slots will automatically activate.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
                <Phone className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                Patient Portal
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Enter your 10-digit mobile number to log in or create your patient account.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  WhatsApp Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-muted-foreground border-r border-border pr-2">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-2xl border border-input bg-background pl-24 pr-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Verified Patient Portal · Secure Login</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isDbLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-extrabold py-3.5 px-4 text-sm shadow-md transition hover:-translate-y-0.5 disabled:opacity-75"
              >
                {isDbLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                    <span>Verifying Mobile Number...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with WhatsApp Number</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-secondary/60 border border-border text-[11px] text-muted-foreground space-y-1 text-center">
              <p className="flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Default verification code for quick testing is 7872</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER OTP VERIFICATION CODE */}
        {step === 'otp' && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-6 animate-fadeIn">
            {pendingBookingIntent && (
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-xs text-foreground flex items-center gap-3 animate-fadeIn">
                <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-primary">Doctor Appointment & Serial Booking</p>
                  <p className="text-muted-foreground text-[11px] leading-tight">
                    Enter code <strong>7872</strong> to continue. Doctor appointment & slot selection will automatically activate upon sign-in.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                {isExistingUser ? 'Existing Patient' : 'New Patient Registration'}
              </div>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                {isExistingUser ? 'Welcome Back!' : 'Verify Mobile Number'}
              </h2>
              <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 max-w-full">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isExistingUser
                    ? `Welcome back, ${foundPatientData?.patient?.fullName || 'Patient'}. Enter code 7872 to sign in.`
                    : `Mobile number +91 ${phoneNumber}. Enter verification code 7872 to continue.`}
                </span>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 4 OTP DIGIT BOXES */}
              <div className="flex items-center justify-center gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-13 h-14 text-center font-mono text-2xl font-extrabold rounded-2xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition shadow-xs"
                  />
                ))}
              </div>

              {otpError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isDbLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-extrabold py-3.5 px-4 text-sm shadow-md transition hover:-translate-y-0.5 disabled:opacity-75"
              >
                {isDbLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>{isExistingUser ? 'Verify & Open Patient Portal' : 'Verify & Proceed to Account Setup'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-primary underline font-medium"
              >
                Change Number
              </button>

              {resendTimer > 0 ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResendTimer(30);
                    setOtpError('A new verification code 7872 has been resent.');
                  }}
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: ACCOUNT PROFILE INFORMATION */}
        {step === 'profile' && (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-6 animate-fadeIn">
            <div className="space-y-2 border-b border-border pb-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                <User className="h-3 w-3" />
                <span>Step 2 of 2 · Account Registration</span>
              </div>
              <h2 className="font-display text-2xl font-extrabold text-primary">
                Create Your Clinic Account
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide your details to complete your patient account. Your future doctor visits, prescriptions, and lab tests will be securely attached to this account.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/70 rounded-xl border border-border text-xs font-semibold text-foreground">
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Mobile: <strong>+91 {phoneNumber}</strong></span>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subham Bera"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground block">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground block">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address with Live Geolocation Button */}
              <div className="space-y-1 relative">
                <label className="font-bold text-foreground block">
                  City / Village / Address
                </label>

                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 h-4 w-4 text-muted-foreground z-10" />
                  <input
                    type="text"
                    placeholder="e.g. Padmapukuria, Contai, East Midnapore"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background pl-10 pr-12 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* Location Icon Button on the Right Side */}
                  <button
                    type="button"
                    onClick={() => handleGetLiveLocation('profile')}
                    title="Auto detect live location"
                    className="absolute right-2 p-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center shrink-0 group"
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <LocateFixed className="h-4 w-4 transition-transform group-hover:scale-110" />
                    )}
                  </button>
                </div>
              </div>

              {/* Email Address (Optional & Last) */}
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="e.g. patient@example.com"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isDbLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-extrabold py-3.5 px-4 text-sm shadow-md transition hover:-translate-y-0.5 pt-3 disabled:opacity-75"
              >
                {isDbLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>Save Profile & Open Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: FULL PROFESSIONAL PATIENT PORTAL DASHBOARD */}
        {step === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            
            {/* NEW ACCOUNT SUCCESS BANNER */}
            {accountCreatedSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">{accountCreatedSuccessMsg}</p>
                    <p className="text-[11px] text-muted-foreground">Your account has been successfully created. You can now log in anytime from any phone or computer.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAccountCreatedSuccessMsg('')}
                  className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* TOP HEADER PATIENT CARD */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-[hsl(205_75%_25%)] text-primary-foreground font-display font-extrabold text-2xl flex items-center justify-center shadow-md border border-white/20">
                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-2xl font-extrabold text-primary">
                        {profile.fullName || 'Registered Patient'}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        <span>Active Account</span>
                      </span>
                      <button
                        onClick={handleOpenEditProfile}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold px-2.5 py-1 text-xs transition"
                        title="Edit Profile"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground pt-0.5">
                      Account ID: <strong className="text-foreground font-mono font-bold">{accountId}</strong> · WhatsApp: <strong className="text-foreground font-bold">+91 {phoneNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto">
                  <a
                    href="https://wa.me/917718149150"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 text-xs shadow-xs transition"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>WhatsApp Support</span>
                  </a>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 px-3.5 py-2 text-xs font-bold transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* NOTIFICATION MESSAGES */}
            {bookingSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{bookingSuccessMsg}</span>
                </div>
                <button onClick={() => setBookingSuccessMsg('')} className="p-1 hover:bg-emerald-500/20 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {labBookingSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>{labBookingSuccess}</span>
                </div>
                <button onClick={() => setLabBookingSuccess('')} className="p-1 hover:bg-emerald-500/20 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* 5 PRIMARY SERVICE NAVIGATION CARDS (ALWAYS VISIBLE ACROSS ALL TABS) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* 1. APPOINTMENTS (NUMBER 1) */}
              <button
                id="portal-nav-appointments"
                onClick={() => {
                  setSelectedDoctor(null);
                  setActiveTab('appointments');
                }}
                className={`p-4 rounded-2xl border text-left transition group space-y-2 shadow-xs cursor-pointer ${
                  activeTab === 'appointments' || activeTab === 'overview'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm'
                    : 'border-border bg-card hover:bg-primary/5 hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${
                      activeTab === 'appointments' || activeTab === 'overview'
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-primary/10 text-primary group-hover:scale-110'
                    }`}
                  >
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  {appointments.length > 0 && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                      {appointments.length} Booked
                    </span>
                  )}
                </div>
                <div>
                  <strong
                    className={`text-xs font-bold block ${
                      activeTab === 'appointments' || activeTab === 'overview'
                        ? 'text-primary'
                        : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    Appointments
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">Booked Serials & History</span>
                </div>
              </button>

              {/* 2. DOCTORS (NUMBER 2) */}
              <button
                id="portal-nav-doctors"
                onClick={() => {
                  setSelectedDoctor(null);
                  setActiveTab('book-doctor');
                }}
                className={`p-4 rounded-2xl border text-left transition group space-y-2 shadow-xs cursor-pointer ${
                  activeTab === 'book-doctor'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm'
                    : 'border-border bg-card hover:bg-primary/5 hover:border-primary/40'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${
                    activeTab === 'book-doctor'
                      ? 'bg-primary text-primary-foreground scale-105'
                      : 'bg-primary/10 text-primary group-hover:scale-110'
                  }`}
                >
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <strong
                    className={`text-xs font-bold block ${
                      activeTab === 'book-doctor' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    Doctors
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">Instant Token Number</span>
                </div>
              </button>

              {/* 3. ORDER LAB TEST (NUMBER 3) */}
              <button
                id="portal-nav-lab-tests"
                onClick={() => setActiveTab('lab-tests')}
                className={`p-4 rounded-2xl border text-left transition group space-y-2 shadow-xs cursor-pointer ${
                  activeTab === 'lab-tests'
                    ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/40 shadow-sm'
                    : 'border-border bg-card hover:bg-emerald-500/5 hover:border-emerald-500/40'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${
                    activeTab === 'lab-tests'
                      ? 'bg-emerald-600 text-white scale-105'
                      : 'bg-emerald-500/10 text-emerald-600 group-hover:scale-110'
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <strong
                    className={`text-xs font-bold block ${
                      activeTab === 'lab-tests' ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground group-hover:text-emerald-600'
                    }`}
                  >
                    Order Lab Test
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">Discount Packages</span>
                </div>
              </button>

              {/* 4. DOWNLOAD REPORTS (NUMBER 4) */}
              <button
                id="portal-nav-reports"
                onClick={() => setActiveTab('reports')}
                className={`p-4 rounded-2xl border text-left transition group space-y-2 shadow-xs cursor-pointer ${
                  activeTab === 'reports'
                    ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-600/40 shadow-sm'
                    : 'border-border bg-card hover:bg-blue-500/5 hover:border-blue-500/40'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${
                    activeTab === 'reports'
                      ? 'bg-blue-600 text-white scale-105'
                      : 'bg-blue-500/10 text-blue-600 group-hover:scale-110'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <strong
                    className={`text-xs font-bold block ${
                      activeTab === 'reports' ? 'text-blue-700 dark:text-blue-400' : 'text-foreground group-hover:text-blue-600'
                    }`}
                  >
                    Download Reports
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">Verified Digital PDFs</span>
                </div>
              </button>

              {/* 5. LOG HEALTH VITALS (NUMBER 5) */}
              <button
                id="portal-nav-vitals"
                onClick={() => setActiveTab('vitals')}
                className={`p-4 rounded-2xl border text-left transition group space-y-2 shadow-xs cursor-pointer ${
                  activeTab === 'vitals'
                    ? 'border-rose-600 bg-rose-500/10 ring-2 ring-rose-600/40 shadow-sm'
                    : 'border-border bg-card hover:bg-rose-500/5 hover:border-rose-500/40'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform ${
                    activeTab === 'vitals'
                      ? 'bg-rose-600 text-white scale-105'
                      : 'bg-rose-500/10 text-rose-600 group-hover:scale-110'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <strong
                    className={`text-xs font-bold block ${
                      activeTab === 'vitals' ? 'text-rose-700 dark:text-rose-400' : 'text-foreground group-hover:text-rose-600'
                    }`}
                  >
                    Log Health Vitals
                  </strong>
                  <span className="text-[10px] text-muted-foreground block">BP & Blood Sugar Tracker</span>
                </div>
              </button>
            </div>

            {/* TAB 1: APPOINTMENTS & PREVIOUS BOOKINGS */}
            {(activeTab === 'appointments' || activeTab === 'overview') && (
              <div className="space-y-6 animate-fadeIn">

                {/* ACTIVE DOCTOR APPOINTMENTS SECTION */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                        <span>My Booked Appointments & Serials</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Your clinic visit serial tokens, scheduled consultation dates, and previous appointment history.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleRefreshAppointments}
                        disabled={isRefreshingAppointments}
                        title="Refresh Appointments from Database"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground px-3 py-2 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingAppointments ? 'animate-spin text-primary' : ''}`} />
                        <span>{isRefreshingAppointments ? 'Refreshing...' : 'Refresh'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDoctor(null);
                          setActiveTab('book-doctor');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Book New Serial</span>
                      </button>
                    </div>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-border/60 space-y-3 px-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                        <CalendarCheck className="h-6 w-6" />
                      </div>
                      <div className="space-y-1 max-w-md mx-auto">
                        <h4 className="font-bold text-sm text-foreground">No appointments booked yet</h4>
                        <p className="text-xs text-muted-foreground">
                          You do not have any active or previous doctor appointments booked on this account. Choose your specialist doctor to get an instant chamber token number.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDoctor(null);
                          setActiveTab('book-doctor');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold shadow-sm transition hover:bg-primary/90 cursor-pointer"
                      >
                        <Stethoscope className="h-4 w-4" />
                        <span>Book Specialist Doctor (Go to Doctors)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span className="font-semibold text-foreground">
                          {appointments.length} Total Appointment{appointments.length > 1 ? 's' : ''} Found
                        </span>
                        <span>Showing previous and active chamber serials</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointments.map((app) => (
                          <div
                            key={app.id}
                            className="p-5 rounded-2xl bg-secondary/30 border border-border/80 space-y-3.5 relative overflow-hidden transition hover:border-primary/40 hover:shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="bg-primary/10 text-primary border border-primary/25 text-[11px] font-black px-2.5 py-0.5 rounded-full inline-block mb-1 tracking-wide">
                                  SERIAL TOKEN {app.serialNo}
                                </span>
                                <h4 className="font-bold text-primary text-base leading-snug">{app.doctorName}</h4>
                                <p className="text-xs text-muted-foreground">{app.specialty || 'General Consultation'}</p>
                              </div>

                              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {app.status || 'CONFIRMED'}
                              </span>
                            </div>

                            <div className="p-3 bg-card rounded-xl border border-border/60 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] text-muted-foreground block font-medium">Patient Name</span>
                                <strong className="text-foreground font-bold">{app.patientName}</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block font-medium">Consultation Date & Slot</span>
                                <strong className="text-foreground font-bold">{app.date} ({app.timeSlot})</strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block font-medium">Chamber Location</span>
                                <span className="text-[11px] text-muted-foreground font-semibold">Contai Bypass Road, Padmapukuria</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block font-medium">Consultation Fee</span>
                                <strong className="text-primary font-extrabold">{app.fee}</strong>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                              <div>
                                {app.paymentMethod === 'Online Payment (Razorpay)' || app.paymentStatus === 'PAID' ? (
                                  <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-emerald-500/30">
                                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                    <span>Paid Online (Razorpay)</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-amber-500/30">
                                    <Building2 className="h-3 w-3 text-amber-600" />
                                    <span>Pay at Chamber Reception</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSlipAppointment(app)}
                                  className="text-[11px] bg-card border border-border hover:bg-secondary text-foreground font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Printer className="h-3 w-3 text-primary" />
                                  <span>View Slip</span>
                                </button>

                                <a
                                  href={`https://wa.me/917718149150?text=${encodeURIComponent(
                                    `Hello Contai B.B. Health Clinic, I have an appointment booked with ${app.doctorName} on ${app.date} (${app.timeSlot}). My Serial Token is ${app.serialNo} (${app.tokenCode || ''}). Patient Name: ${app.patientName}. Please confirm my visit details.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs transition"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>WhatsApp Token</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* DIGITAL LAB REPORTS QUICK PREVIEW */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display text-base font-extrabold text-primary flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <span>Recent Digital Pathology Reports</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View All Reports</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {labOrders.map((order) => (
                      <div key={order.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-primary font-bold text-sm">{order.testName}</strong>
                            {order.status === 'READY' ? (
                              <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">REPORT READY</span>
                            ) : (
                              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">IN PROCESSING</span>
                            )}
                          </div>
                          <p className="text-muted-foreground">{order.category} · Sample: {order.sampleType} · Date: {order.date}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {order.status === 'READY' ? (
                            <>
                              <button
                                onClick={() => setActiveReportModal(order)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold px-3 py-1.5 text-xs transition"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View PDF</span>
                              </button>

                              <a
                                href="https://wa.me/917718149150"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 text-xs shadow-xs transition"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>WhatsApp PDF</span>
                              </a>
                            </>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium italic">Expected within 2-4 hours</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: BOOK DOCTOR SERIAL */}
            {activeTab === 'book-doctor' && (
              <div className="space-y-6 animate-fadeIn">
                {autoActivatedBookingToast && selectedDoctor && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div className="text-xs">
                        <span className="font-extrabold text-emerald-950 dark:text-emerald-200 block text-sm">Doctor Consultation Slots Active</span>
                        <span className="text-muted-foreground text-xs">
                          {selectedDoctor.name} ({selectedDoctor.specialty}) has been automatically selected. Choose your consultation date and preferred time slot below.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoActivatedBookingToast(false)}
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline px-2 py-1 shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
                {!selectedDoctor ? (
                  /* SCREEN 1: DOCTORS LIST */
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4 animate-fadeIn">
                    <div className="border-b border-border pb-3">
                      <h3 className="font-display text-xl font-extrabold text-primary">
                        Book Specialist Doctor Serial
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Select your preferred doctor, enter patient details, and receive your instant clinic serial token number.
                      </p>
                    </div>

                    {/* DOCTORS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {doctorsList.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleDoctorSelect(doc)}
                          className="p-4 rounded-2xl border-2 border-border bg-background hover:border-primary/60 hover:shadow-md transition cursor-pointer space-y-3 flex flex-col justify-between group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-border bg-muted">
                                <img
                                  src={doc.image}
                                  alt={doc.name}
                                  className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-primary text-sm group-hover:text-primary/90">{doc.name}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium">{doc.degree}</p>
                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md mt-1">
                                  {doc.specialty}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                              <p className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span>{doc.timing}</span>
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDoctorSelect(doc);
                            }}
                            className="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Select Doctor</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* SCREEN 2: DEDICATED SEPARATE APPOINTMENT BOOKING PAGE */
                  <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-6 animate-fadeIn">
                    {/* TOP NAVIGATION BAR */}
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedDoctor(null)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition shadow-xs"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Doctors List</span>
                      </button>

                      <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        Serial Booking
                      </span>
                    </div>

                    {/* SELECTED DOCTOR HIGHLIGHT CARD */}
                    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-border bg-muted">
                          <img
                            src={selectedDoctor.image}
                            alt={selectedDoctor.name}
                            className="h-full w-full object-cover object-top"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-primary text-base">{selectedDoctor.name}</h4>
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              {selectedDoctor.specialty}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{selectedDoctor.degree}</p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{selectedDoctor.timing}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDoctor(null)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Change Doctor
                      </button>
                    </div>

                    {/* APPOINTMENT FORM */}
                    <form onSubmit={handleBookAppointmentSubmit} className="p-5 sm:p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
                      <div className="flex items-center gap-2 border-b border-border pb-3">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <h4 className="font-extrabold text-primary text-base">
                          Patient Serial Information
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-foreground block">Patient Full Name *</label>
                          <input
                            type="text"
                            required
                            value={bookingForm.patientName}
                            onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                            className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-foreground block">Age (Years)</label>
                            <input
                              type="number"
                              required
                              value={bookingForm.age}
                              onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                              className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-foreground block">Gender</label>
                            <select
                              value={bookingForm.gender}
                              onChange={(e) => setBookingForm({ ...bookingForm, gender: e.target.value })}
                              className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Child">Child</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-foreground block">Preferred Appointment Date *</label>
                          <input
                            type="date"
                            required
                            value={bookingForm.preferredDate}
                            onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                            className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-foreground block">Health Issue / Symptoms (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Fever, Blood Pressure checkup, Back pain..."
                            value={bookingForm.symptoms}
                            onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                            className="w-full rounded-2xl border border-input bg-background px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* DEDICATED PREFERRED TIME SLOT BOX */}
                      <div className="rounded-2xl border-2 border-primary/20 bg-background/90 p-4 sm:p-5 space-y-3.5 shadow-xs">
                        {/* Header & Status Indicator Legend */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                              <Clock className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                                <span>Preferred Time Slot</span>
                                <span className="text-rose-500 font-bold">*</span>
                              </h5>
                              <p className="text-[11px] text-muted-foreground font-medium">
                                Select an available time slot matching the doctor's schedule
                              </p>
                            </div>
                          </div>

                          {/* Visual Status Legend */}
                          <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold bg-secondary/70 px-3 py-1.5 rounded-xl border border-border/60">
                            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-xs animate-pulse" />
                              Available
                            </span>
                            <span className="text-border">|</span>
                            <span className="inline-flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                              Already Booked
                            </span>
                            <span className="text-border">|</span>
                            <span className="inline-flex items-center gap-1.5 text-primary">
                              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                              Selected
                            </span>
                          </div>
                        </div>

                        {/* Slots Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                          {getDoctorSlots(selectedDoctor.id).map((slot) => {
                            const isBooked = isSlotBooked(selectedDoctor.id, slot.id, slot.time, slot.isPreBooked);
                            const isSelected = bookingForm.timeSlot === slot.time && !isBooked;

                            if (isBooked) {
                              return (
                                <div
                                  key={slot.time}
                                  className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-500/5 text-muted-foreground cursor-not-allowed opacity-75 flex items-center justify-between transition relative select-none gap-1.5"
                                  title="This time slot is already booked by another patient and cannot be selected."
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                                      <Ban className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-semibold text-xs text-foreground/70 line-through block truncate">
                                        {slot.time}
                                      </span>
                                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block truncate">
                                        {slot.bookedBy ? `Booked (${slot.bookedBy})` : 'Already Booked'}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                                    Booked
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setBookingForm((prev) => ({ ...prev, timeSlot: slot.time }))}
                                className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between group cursor-pointer gap-1.5 ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40'
                                    : 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 hover:bg-emerald-500/10 text-foreground hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition ${
                                      isSelected
                                        ? 'bg-primary-foreground text-primary shadow-xs'
                                        : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                                    }`}
                                  >
                                    {isSelected ? <Check className="h-4 w-4 stroke-[3]" /> : <Clock className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className="min-w-0">
                                    <span className={`font-bold text-xs block truncate ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                                      {slot.time}
                                    </span>
                                    <span className={`text-[10px] block font-medium truncate ${isSelected ? 'text-primary-foreground/90 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                      {isSelected ? '✓ Selected slot' : '● Available for booking'}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                                    isSelected
                                      ? 'bg-primary-foreground/20 text-primary-foreground'
                                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                  }`}
                                >
                                  {isSelected ? 'Selected' : 'Available'}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Selection Info & Help Notice */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground font-medium">Selected Slot:</span>
                            {bookingForm.timeSlot ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-extrabold">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                {bookingForm.timeSlot}
                              </span>
                            ) : (
                              <span className="text-rose-500 font-bold">Please click on an available (green) slot above</span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground italic">
                            * Red slots are already booked by other patients and cannot be selected.
                          </span>
                        </div>
                      </div>

                      {/* PAYMENT MODE SELECTION */}
                      <div className="pt-3 border-t border-border/70 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <label className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                              <CreditCard className="h-4 w-4 text-primary" />
                              <span>Select Payment Mode *</span>
                            </label>
                            <p className="text-[11px] text-muted-foreground">
                              Choose whether to pay during your clinic visit or pay now securely online via Razorpay.
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs font-black text-primary shrink-0 self-start sm:self-auto">
                            <span>Doctor Fee:</span>
                            <span className="text-sm font-black text-foreground">{selectedDoctor.fee}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Option 1: Pay at Clinic Counter */}
                          <button
                            type="button"
                            onClick={() => setBookingForm((prev) => ({ ...prev, paymentMethod: 'Pay at Clinic Counter' }))}
                            className={`p-3.5 rounded-2xl border-2 text-left transition relative cursor-pointer flex flex-col justify-between gap-2.5 ${
                              bookingForm.paymentMethod === 'Pay at Clinic Counter'
                                ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40'
                                : 'border-border/80 bg-card hover:border-primary/40 hover:bg-secondary/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                                    bookingForm.paymentMethod === 'Pay at Clinic Counter'
                                      ? 'bg-primary text-primary-foreground shadow-xs'
                                      : 'bg-secondary text-muted-foreground'
                                  }`}
                                >
                                  <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-xs text-foreground block">
                                    Pay at Clinic Counter
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-semibold">
                                    Pay upon arrival for consultation
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                  bookingForm.paymentMethod === 'Pay at Clinic Counter'
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-muted-foreground/30'
                                }`}
                              >
                                {bookingForm.paymentMethod === 'Pay at Clinic Counter' && (
                                  <Check className="h-3 w-3 stroke-[3]" />
                                )}
                              </span>
                            </div>

                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              No advance payment required—your serial token is reserved immediately. You can pay the consultation fee of <strong>{selectedDoctor.fee}</strong> at the clinic reception counter via Cash, UPI, or Card.
                            </p>

                            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                              <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/60">
                                ● Pay at Reception Desk
                              </span>
                            </div>
                          </button>

                          {/* Option 2: Online Payment via Razorpay */}
                          <button
                            type="button"
                            onClick={() => setBookingForm((prev) => ({ ...prev, paymentMethod: 'Online Payment (Razorpay)' }))}
                            className={`p-3.5 rounded-2xl border-2 text-left transition relative cursor-pointer flex flex-col justify-between gap-2.5 ${
                              bookingForm.paymentMethod === 'Online Payment (Razorpay)'
                                ? 'border-emerald-600 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/40'
                                : 'border-border/80 bg-card hover:border-emerald-500/40 hover:bg-secondary/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                                    bookingForm.paymentMethod === 'Online Payment (Razorpay)'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-secondary text-muted-foreground'
                                  }`}
                                >
                                  <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-xs text-foreground block">
                                      Online Payment (Razorpay)
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                      Instant
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                                    Instant UPI, Cards & Net Banking
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                  bookingForm.paymentMethod === 'Online Payment (Razorpay)'
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : 'border-muted-foreground/30'
                                }`}
                              >
                                {bookingForm.paymentMethod === 'Online Payment (Razorpay)' && (
                                  <Check className="h-3 w-3 stroke-[3]" />
                                )}
                              </span>
                            </div>

                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              Fast and secure online payment via Razorpay. Supports <strong>Google Pay, PhonePe, Paytm, Debit/Credit Cards, and Net Banking</strong> with immediate token confirmation.
                            </p>

                            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Secured by Razorpay (rzp_test_...ECaW)</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* BOTTOM ACTION BUTTONS */}
                      <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60">
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="font-medium">Selected Mode:</span>
                          <span className="px-2 py-0.5 rounded-lg bg-secondary font-bold text-foreground inline-flex items-center gap-1">
                            {bookingForm.paymentMethod === 'Online Payment (Razorpay)' ? (
                              <>
                                <CreditCard className="h-3 w-3 text-emerald-600" />
                                <span>Online via Razorpay ({selectedDoctor.fee})</span>
                              </>
                            ) : (
                              <>
                                <Building2 className="h-3 w-3 text-primary" />
                                <span>Pay at Clinic Desk ({selectedDoctor.fee})</span>
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            disabled={isProcessingPayment}
                            onClick={() => setSelectedDoctor(null)}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-border bg-card text-xs font-bold hover:bg-secondary transition disabled:opacity-50"
                          >
                            Cancel
                          </button>

                          {bookingForm.paymentMethod === 'Online Payment (Razorpay)' ? (
                            <button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                            >
                              {isProcessingPayment ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Opening Razorpay Gateway...</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard className="h-4 w-4" />
                                  <span>Pay {selectedDoctor.fee} via Razorpay & Confirm</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={isProcessingPayment}
                              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-extrabold px-6 py-2.5 text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                              <span>Confirm & Generate Serial Token</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BOOK LAB TESTS & PACKAGES */}
            {activeTab === 'lab-tests' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-primary">
                        Book Diagnostic Lab Tests & Health Packages
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Book automated 5-part hematology, biochemistry, digital X-Ray, USG, and full body health packages.
                      </p>
                    </div>

                    <a
                      href="https://wa.me/917718149150"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 text-xs shadow-xs transition shrink-0"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>WhatsApp Sample Collection</span>
                    </a>
                  </div>

                  {/* SEARCH AND CATEGORY FILTER */}
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search test name e.g. CBC, Thyroid, Sugar, X-Ray..."
                        value={labSearchQuery}
                        onChange={(e) => setLabSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
                      {['All', 'Blood Tests', 'Diabetes', 'Cardiac', 'Thyroid', 'X-Ray & Imaging', 'Full Body Packages'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setLabCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${
                            labCategoryFilter === cat
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LAB SERVICES GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {filteredLabServices.map((service) => (
                      <div key={service.id} className="p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition space-y-3 flex flex-col justify-between shadow-xs">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              {service.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {service.turnTime}
                            </span>
                          </div>

                          <h4 className="font-bold text-primary text-sm leading-snug">{service.name}</h4>
                          <p className="text-xs text-muted-foreground">{service.parameters}</p>
                        </div>

                        <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-extrabold text-primary">₹{service.price}</span>
                              <span className="text-xs text-muted-foreground line-through font-medium">₹{service.origPrice}</span>
                            </div>
                            <span className="text-[9px] text-emerald-600 font-bold block">
                              SAVE ₹{service.origPrice - service.price} ({Math.round(((service.origPrice - service.price) / service.origPrice) * 100)}% OFF)
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedTestForBooking(service);
                              setLabBookingModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground font-bold px-3.5 py-2 text-xs shadow-xs transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Book Test</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DIGITAL REPORTS & PRESCRIPTIONS */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                  <div className="border-b border-border pb-3">
                    <h3 className="font-display text-xl font-extrabold text-primary">
                      Digital Pathology Reports & E-Prescriptions
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Access all your diagnostic test results, verified laboratory PDFs, and doctor prescription archives anytime.
                    </p>
                  </div>

                  {/* REPORTS LIST */}
                  <div className="space-y-3">
                    {labOrders.length === 0 ? (
                      <div className="text-center py-8 bg-secondary/20 rounded-2xl border border-border/60 space-y-2">
                        <p className="text-xs text-muted-foreground">No diagnostic lab reports generated yet.</p>
                        <button
                          onClick={() => setActiveTab('lab-tests')}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
                        >
                          <FlaskConical className="h-3.5 w-3.5" />
                          <span>Order Diagnostic Lab Tests</span>
                        </button>
                      </div>
                    ) : (
                      labOrders.map((order) => (
                        <div key={order.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <strong className="text-primary font-bold text-sm">{order.testName}</strong>
                              <span className="text-[10px] text-muted-foreground font-mono">({order.id})</span>
                            </div>
                            <p className="text-muted-foreground pl-6">
                              Sample Type: <strong className="text-foreground">{order.sampleType}</strong> · Date: {order.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pl-6 md:pl-0">
                            {order.status === 'READY' ? (
                              <>
                                <button
                                  onClick={() => setActiveReportModal(order)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary hover:bg-primary/10 font-bold px-3.5 py-2 text-xs transition"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>View Digital PDF</span>
                                </button>

                                <a
                                  href="https://wa.me/917718149150"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 text-xs shadow-xs transition"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>WhatsApp PDF</span>
                                </a>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Sample in Automated Analyzer</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* E-PRESCRIPTION ARCHIVE SECTION */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="font-extrabold text-primary text-sm flex items-center gap-2">
                      <Pill className="h-4 w-4 text-primary" />
                      <span>Doctor E-Prescription Archive</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-primary font-bold block">Dr. R. N. Giri (M.B.B.S., General Physician)</strong>
                          <span className="text-muted-foreground text-[11px]">Prescribed on Sep 02, 2026 · Diagnosis: Mild Viral Fever & Fatigue</span>
                        </div>
                        <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          ACTIVE PRESCRIPTION
                        </span>
                      </div>

                      <div className="bg-background p-3 rounded-xl border border-border/60 text-xs space-y-1">
                        <p className="font-semibold text-foreground">1. Tab. Paracetamol 650mg (1-1-1 after food x 3 days)</p>
                        <p className="font-semibold text-foreground">2. Tab. Vitamin C + Zinc (1-0-0 after breakfast x 7 days)</p>
                        <p className="font-semibold text-foreground">3. ORS Electrolyte Hydration Sachet in 1 Litre Water daily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HEALTH TRACKER & VITALS */}
            {activeTab === 'vitals' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-6">
                  <div className="border-b border-border pb-3">
                    <h3 className="font-display text-xl font-extrabold text-primary">
                      Personal Health Vitals & BP Tracker
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Track your daily Blood Pressure, Fasting Blood Sugar, Pulse Rate, and Weight trends safely.
                    </p>
                  </div>

                  {vitalAddSuccess && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{vitalAddSuccess}</span>
                    </div>
                  )}

                  {/* LOG NEW VITALS FORM */}
                  <form onSubmit={handleAddVitalLog} className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3">
                    <h4 className="font-bold text-primary text-xs flex items-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      <span>Log Today's Health Vitals</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground block">BP Systolic</label>
                        <input
                          type="number"
                          placeholder="120"
                          value={newVital.sys}
                          onChange={(e) => setNewVital({ ...newVital, sys: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground block">BP Diastolic</label>
                        <input
                          type="number"
                          placeholder="80"
                          value={newVital.dia}
                          onChange={(e) => setNewVital({ ...newVital, dia: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground block">Fasting Sugar</label>
                        <input
                          type="number"
                          placeholder="95"
                          value={newVital.fastingSugar}
                          onChange={(e) => setNewVital({ ...newVital, fastingSugar: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-muted-foreground block">Pulse Rate</label>
                        <input
                          type="number"
                          placeholder="72"
                          value={newVital.pulse}
                          onChange={(e) => setNewVital({ ...newVital, pulse: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <label className="text-[11px] font-bold text-muted-foreground block">Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="68"
                          value={newVital.weight}
                          onChange={(e) => setNewVital({ ...newVital, weight: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground font-bold px-4 py-2 text-xs shadow-xs hover:bg-[hsl(205_75%_22%)] transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Save Reading</span>
                      </button>
                    </div>
                  </form>

                  {/* VITALS HISTORY LOG TABLE */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-primary text-sm">Historical Vitals Log</h4>
                    {vitalsLog.length === 0 ? (
                      <div className="text-center py-8 bg-secondary/20 rounded-2xl border border-border/60 space-y-2">
                        <p className="text-xs text-muted-foreground">No health vitals recorded yet.</p>
                        <p className="text-[11px] text-muted-foreground/80">Use the form above to record your first Blood Pressure, Sugar, or Pulse entry.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-border">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-extrabold border-b border-border">
                            <tr>
                              <th className="px-4 py-3">Date & Time</th>
                              <th className="px-4 py-3">Blood Pressure</th>
                              <th className="px-4 py-3">Fasting Sugar</th>
                              <th className="px-4 py-3">Pulse</th>
                              <th className="px-4 py-3">Weight</th>
                              <th className="px-4 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 bg-card font-medium">
                            {vitalsLog.map((item) => (
                              <tr key={item.id} className="hover:bg-secondary/30 transition">
                                <td className="px-4 py-3 font-semibold text-foreground">{item.date}</td>
                                <td className="px-4 py-3 font-bold text-primary">{item.sys} / {item.dia} mmHg</td>
                                <td className="px-4 py-3 font-bold text-foreground">{item.fastingSugar} mg/dL</td>
                                <td className="px-4 py-3">{item.pulse} bpm</td>
                                <td className="px-4 py-3">{item.weight} kg</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    item.status === 'OPTIMAL' || item.status === 'NORMAL'
                                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: INVOICES & RECEIPTS */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
                  <div className="border-b border-border pb-3">
                    <h3 className="font-display text-xl font-extrabold text-primary">
                      Billing Transactions & Payment Receipts
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Download official clinic receipts for doctor consultations, diagnostic lab tests, and health packages.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {invoices.length === 0 ? (
                      <div className="text-center py-8 bg-secondary/20 rounded-2xl border border-border/60 space-y-2">
                        <p className="text-xs text-muted-foreground">No invoices or payment receipts generated yet.</p>
                        <p className="text-[11px] text-muted-foreground/80">Receipts will appear here automatically whenever you book doctor consultations or diagnostic tests.</p>
                      </div>
                    ) : (
                      invoices.map((inv) => (
                        <div key={inv.id} className="p-4 rounded-2xl bg-secondary/30 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-primary" />
                              <strong className="text-primary font-bold text-sm">{inv.description}</strong>
                              <span className="text-[10px] text-muted-foreground font-mono">({inv.id})</span>
                            </div>
                            <p className="text-muted-foreground pl-6">
                              Date: {inv.date} · Payment Method: <strong className="text-foreground">{inv.mode}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pl-6 sm:pl-0">
                            <div className="text-right">
                              <span className="text-base font-extrabold text-primary block">{inv.amount}</span>
                              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block">
                                {inv.status}
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedInvoiceModal(inv)}
                              className="p-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition"
                              title="View Receipt"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* LAB TEST BOOKING MODAL */}
      {labBookingModalOpen && selectedTestForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-primary font-extrabold text-base">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <span>Confirm Lab Test Booking</span>
              </div>
              <button onClick={() => setLabBookingModalOpen(false)} className="p-1 rounded-full text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border/60 space-y-1 text-xs">
              <strong className="text-primary font-extrabold text-sm block">{selectedTestForBooking.name}</strong>
              <p className="text-muted-foreground">{selectedTestForBooking.category} · {selectedTestForBooking.parameters}</p>
              <div className="pt-2 flex items-center justify-between border-t border-border/40">
                <span className="font-bold text-foreground">Test Price:</span>
                <span className="text-base font-extrabold text-emerald-600">₹{selectedTestForBooking.price}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-foreground block">Sample Collection Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLabCollectionType('clinic')}
                  className={`p-3 rounded-2xl border-2 text-left transition font-bold ${
                    labCollectionType === 'clinic'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  <Building2 className="h-4 w-4 mb-1" />
                  <span>Visit Clinic Lab</span>
                  <span className="text-[10px] block font-normal opacity-80">Free Collection</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabCollectionType('home')}
                  className={`p-3 rounded-2xl border-2 text-left transition font-bold ${
                    labCollectionType === 'home'
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  <MapPin className="h-4 w-4 mb-1" />
                  <span>Home Collection</span>
                  <span className="text-[10px] block font-normal opacity-80">+ ₹50 Charge</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLabBookingModalOpen(false)}
                className="flex-1 rounded-2xl border border-border bg-secondary hover:bg-secondary/80 py-2.5 text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLabBooking}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-[hsl(205_75%_22%)] text-primary-foreground py-2.5 text-xs font-extrabold shadow-md transition"
              >
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DIGITAL REPORT MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* REPORT HEADER */}
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-extrabold text-lg flex items-center justify-center">
                  BB
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-primary text-base">Contai B.B. Health Clinic Lab</h3>
                  <p className="text-[10px] text-muted-foreground">Pathology & Automated Diagnostic Laboratory · Padmapukuria, Contai</p>
                </div>
              </div>
              <button onClick={() => setActiveReportModal(null)} className="p-1 rounded-full text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* PATIENT INFO BANNER */}
            <div className="bg-secondary/40 p-3.5 rounded-2xl border border-border/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Patient Name:</span>
                <strong className="text-foreground">{profile.fullName || 'Jaydeb Jana'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Age / Gender:</span>
                <strong className="text-foreground">32 Yrs / Male</strong>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Ref Doctor:</span>
                <strong className="text-foreground">Dr. R. N. Giri</strong>
              </div>
            </div>

            {/* TEST PARAMETERS TABLE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-primary text-sm">{activeReportModal.testName}</h4>
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">VERIFIED REPORT</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border text-xs">
                <table className="w-full text-left">
                  <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                    <tr>
                      <th className="p-2.5">Test Parameter</th>
                      <th className="p-2.5">Measured Value</th>
                      <th className="p-2.5">Normal Range</th>
                      <th className="p-2.5">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card font-semibold">
                    <tr>
                      <td className="p-2.5">Hemoglobin (Hb)</td>
                      <td className="p-2.5 text-emerald-600 font-extrabold">14.2</td>
                      <td className="p-2.5 text-muted-foreground font-normal">13.5 - 17.5</td>
                      <td className="p-2.5 text-muted-foreground">g/dL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Total Leukocyte Count (WBC)</td>
                      <td className="p-2.5 text-emerald-600 font-extrabold">7,200</td>
                      <td className="p-2.5 text-muted-foreground font-normal">4,000 - 11,000</td>
                      <td className="p-2.5 text-muted-foreground">/µL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Platelet Count</td>
                      <td className="p-2.5 text-emerald-600 font-extrabold">2.8</td>
                      <td className="p-2.5 text-muted-foreground font-normal">1.5 - 4.5</td>
                      <td className="p-2.5 text-muted-foreground">Lakhs/µL</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">HbA1c (Glycated Hemoglobin)</td>
                      <td className="p-2.5 text-emerald-600 font-extrabold">5.6 %</td>
                      <td className="p-2.5 text-muted-foreground font-normal">&lt; 5.7 % Normal</td>
                      <td className="p-2.5 text-muted-foreground">%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* DOCTOR SIGNATURE FOOTER */}
            <div className="pt-2 flex items-center justify-between border-t border-border text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Verified By:</span>
                <strong className="text-primary block">Dr. B. K. Samanta (M.D. Pathology)</strong>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Digital Verified Stamp</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/917718149150"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 text-white font-bold px-3 py-2 text-xs shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary hover:bg-secondary/80 font-bold px-3 py-2 text-xs text-foreground"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-extrabold text-primary text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <span>Payment Receipt ({selectedInvoiceModal.id})</span>
              </div>
              <button onClick={() => setSelectedInvoiceModal(null)} className="p-1 rounded-full text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-secondary/30 p-4 rounded-2xl border border-border/60">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Clinic Name:</span>
                <strong className="text-primary font-bold">Contai B.B. Health Clinic</strong>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Service Description:</span>
                <strong className="text-foreground">{selectedInvoiceModal.description}</strong>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Date:</span>
                <strong className="text-foreground">{selectedInvoiceModal.date}</strong>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Payment Mode:</span>
                <strong className="text-foreground">{selectedInvoiceModal.mode}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-foreground text-sm">Total Paid Amount:</span>
                <strong className="text-lg font-extrabold text-emerald-600">{selectedInvoiceModal.amount}</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoiceModal(null)}
                className="px-4 py-2 rounded-xl border border-border bg-secondary font-bold text-xs"
              >
                Close
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="font-extrabold text-primary text-base flex items-center gap-2">
                <Edit className="h-4 w-4 text-primary" />
                <span>Edit Profile</span>
              </div>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{profileSaveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={editProfileForm.fullName}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Gender & DOB Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Gender *</label>
                  <select
                    value={editProfileForm.gender}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    value={editProfileForm.dateOfBirth}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Address with Live Location */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>City / Address</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleGetLiveLocation('editModal')}
                    disabled={isLocating}
                    className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <LocateFixed className="h-3 w-3" />}
                    <span>{isLocating ? 'Detecting location...' : 'Auto Detect Address'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editProfileForm.address}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                  placeholder="Contai, East Midnapore, West Bengal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* WhatsApp Mobile Number (Account Phone) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp Mobile Number (Account Phone) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={editProfileForm.whatsappNumber}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, whatsappNumber: e.target.value })}
                  placeholder="e.g. 7872490719"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  placeholder="patient@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Emergency Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Emergency Contact Number</span>
                </label>
                <input
                  type="tel"
                  value={editProfileForm.emergencyPhone}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, emergencyPhone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md transition hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT BOOKING CONFIRMATION MODAL POPUP */}
      {showBookingConfirmModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/70 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground">
                    Confirm Appointment Booking
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please review your booking details before proceeding
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => setShowBookingConfirmModal(false)}
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Question Banner */}
              <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Are you sure you want to proceed with this booking?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Your appointment serial token will be generated upon confirmation.
                  </p>
                </div>
              </div>

              {/* Consultation Details Card */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">{selectedDoctor.name}</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-extrabold">
                    {selectedDoctor.specialty}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Appointment Date
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {bookingForm.preferredDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Selected Time Slot
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-emerald-600" />
                      {bookingForm.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-border/50 pt-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Patient Name
                    </span>
                    <span className="font-bold text-foreground block truncate mt-0.5">
                      {bookingForm.patientName || profile.fullName || 'Patient'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Doctor Consultation Fee
                    </span>
                    <span className="font-extrabold text-foreground text-sm block mt-0.5">
                      {selectedDoctor.fee}
                    </span>
                  </div>
                </div>

                {/* Selected Payment Mode Notice */}
                <div className="border-t border-border/50 pt-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                    Payment Method
                  </span>
                  {bookingForm.paymentMethod === 'Online Payment (Razorpay)' ? (
                    <div className="flex items-start gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-emerald-800 dark:text-emerald-300">
                      <CreditCard className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Online Payment via Razorpay ({selectedDoctor.fee})</p>
                        <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                          You will be redirected to the secure Razorpay payment gateway (UPI, Cards, NetBanking).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 text-xs bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground">
                      <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Pay at Clinic Counter ({selectedDoctor.fee})</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Your serial token will be reserved now. You can pay the fee on visit day at reception.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 sm:p-6 bg-secondary/20 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => setShowBookingConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary font-bold text-xs transition disabled:opacity-50"
              >
                No, Go Back
              </button>

              {bookingForm.paymentMethod === 'Online Payment (Razorpay)' ? (
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={executeAppointmentBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Yes, Proceed to Pay {selectedDoctor.fee}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={executeAppointmentBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold px-6 py-2.5 text-xs shadow-md transition disabled:opacity-60 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span>Yes, Confirm Booking</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLIPKART-STYLE CELEBRATION BOOKING SUCCESS ANIMATION MODAL */}
      {bookingSuccessModalData && (
        <BookingSuccessAnimationModal
          isOpen={!!bookingSuccessModalData}
          onClose={() => setBookingSuccessModalData(null)}
          details={bookingSuccessModalData}
          onViewAppointments={() => {
            setActiveTab('appointments');
            setBookingSuccessModalData(null);
          }}
        />
      )}

      {/* APPOINTMENT SERIAL TOKEN SLIP MODAL */}
      {selectedSlipAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl overflow-hidden animate-scaleUp">
            {/* Slip Header */}
            <div className="bg-primary text-primary-foreground p-6 text-center relative">
              <button
                onClick={() => setSelectedSlipAppointment(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="font-display text-lg font-black tracking-tight">Contai B.B. Health Clinic</h3>
              <p className="text-xs text-primary-foreground/80 mt-0.5">Central Specialist Chamber & Diagnostic Centre</p>
              <div className="mt-3 inline-block bg-white text-primary text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                Official Serial Token Slip
              </div>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-dashed border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">
                  Chamber Serial Number
                </span>
                <span className="text-3xl font-black text-primary font-display tracking-tight">
                  {selectedSlipAppointment.serialNo}
                </span>
                <p className="text-[11px] text-muted-foreground font-mono mt-1 font-semibold">
                  TOKEN ID: {selectedSlipAppointment.tokenCode || `BBHC-SER-${selectedSlipAppointment.serialNo?.replace('#', '')}`}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Doctor</span>
                  <strong className="text-foreground font-bold text-sm text-right">{selectedSlipAppointment.doctorName}</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Department</span>
                  <span className="font-semibold text-foreground text-right">{selectedSlipAppointment.specialty || 'General Consultation'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Patient Name</span>
                  <strong className="text-foreground font-bold text-right">{selectedSlipAppointment.patientName}</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Date & Time</span>
                  <span className="font-bold text-foreground text-right">{selectedSlipAppointment.date} ({selectedSlipAppointment.timeSlot})</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Chamber Location</span>
                  <span className="font-medium text-foreground text-right">Contai Bypass Road (Padmapukuria More)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Consultation Fee</span>
                  <strong className="text-primary font-extrabold text-sm">{selectedSlipAppointment.fee}</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-medium">Payment Status</span>
                  <span className="font-extrabold text-right">
                    {selectedSlipAppointment.paymentStatus === 'PAID' ? 'PAID ONLINE (RAZORPAY)' : 'PAY AT RECEPTION'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-secondary/40 rounded-xl border border-border/60 text-[11px] text-muted-foreground space-y-1">
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Important Instructions for Visit</span>
                </p>
                <p>• Please report to reception 15 minutes before your allotted time slot.</p>
                <p>• Bring previous medical prescriptions, lab reports, and current medications.</p>
              </div>
            </div>

            {/* Slip Footer Actions */}
            <div className="p-4 bg-secondary/30 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlipAppointment(null)}
                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
