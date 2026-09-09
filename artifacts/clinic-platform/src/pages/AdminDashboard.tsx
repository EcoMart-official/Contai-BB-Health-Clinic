import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LogOut,
  Stethoscope,
  Settings,
  CreditCard,
  User,
  Bot,
  Plus,
  ArrowRight,
  Check,
  X,
  Printer,
  Phone,
  MessageSquare,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
  Activity,
  Award,
  ChevronLeft,
  SlidersHorizontal,
  Send,
  Loader2,
} from 'lucide-react';
import logo from '@assets/clinic/logo.png';
import { useCustomAlert } from '@/lib/alert-context';

interface Appointment {
  id: string;
  phone: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  specialty?: string;
  date: string;
  time_slot: string;
  serial_no: string;
  token_code: string;
  fee: string;
  payment_method: string;
  payment_id?: string;
  status: 'CONFIRMED' | 'BOOKED' | 'NO_SHOW' | 'COMPLETED' | 'CANCELLED' | string;
  symptoms?: string;
  created_at: string;
}

interface Patient {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  address?: string;
  emergency_phone?: string;
  notification_preference?: string;
  account_id: string;
  totalAppointments?: number;
  lastVisitDate?: string;
  lastDoctor?: string;
}

interface DashboardStats {
  todayCount: number;
  upcomingCount: number;
  patientsCount: number;
  cancellationsCount: number;
  completionRate: string;
  noShowRate: string;
  todaySchedule: Appointment[];
  upcomingSchedule: Appointment[];
}

export function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const { showAlert } = useCustomAlert();

  // Navigation State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calendar' | 'appointments' | 'patients' | 'services' | 'ai-settings' | 'settings' | 'billing' | 'profile'
  >(() => {
    const pathParts = location.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const validTabs = ['dashboard', 'calendar', 'appointments', 'patients', 'services', 'ai-settings', 'settings', 'billing', 'profile'];
    return validTabs.includes(lastPart) ? (lastPart as any) : 'dashboard';
  });

  // Data States
  const [stats, setStats] = useState<DashboardStats>({
    todayCount: 4,
    upcomingCount: 7,
    patientsCount: 10,
    cancellationsCount: 1,
    completionRate: '67%',
    noShowRate: '33%',
    todaySchedule: [],
    upcomingSchedule: [],
  });
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [billingData, setBillingData] = useState<any>({
    totalRevenue: '₹14,500',
    cashTotal: '₹11,000',
    onlineTotal: '₹3,500',
    invoices: [],
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filters for Appointments view
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  // Modals
  const [selectedSlip, setSelectedSlip] = useState<Appointment | null>(null);
  const [newAppointmentModal, setNewAppointmentModal] = useState(false);
  const [newPatientModal, setNewPatientModal] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState<Patient | null>(null);

  // AI Assistant chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Good day, Doctor / Admin. I am your MedBook Clinic AI Assistant. Ask me anything about today\'s serial schedule, patient histories, doctor availability, or counter collection.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingAi, setIsSendingAi] = useState(false);

  // Form states for adding appointment
  const [newAptForm, setNewAptForm] = useState({
    patientName: '',
    phone: '',
    doctorId: 'kamal-poddar',
    doctorName: 'Dr. Kamal Poddar',
    specialty: 'General Consultation',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:30 AM - 10:45 AM',
    fee: '₹500',
    paymentMethod: 'Pay at Clinic Counter',
    symptoms: 'Chamber consultation',
  });

  // Form states for adding patient
  const [newPatientForm, setNewPatientForm] = useState({
    fullName: '',
    phone: '',
    gender: 'Male',
    bloodGroup: 'O+',
    dateOfBirth: '1990-01-01',
    address: 'Contai, Purba Medinipur',
  });

  // Notification alerts list
  const notifications = [
    { id: 1, title: 'New Appointment Booked', desc: 'Jone Test booked Dr. Kamal Poddar for tomorrow at 3:30 PM', time: '10 min ago', unread: true },
    { id: 2, title: 'Razorpay Payment Verified', desc: '₹500 online transaction completed for Demo User (BBHC-SER-109)', time: '45 min ago', unread: true },
    { id: 3, title: 'Patient Profile Created', desc: 'Demo Smith verified profile and linked WhatsApp notification', time: '2 hours ago', unread: false },
  ];

  // Fetch all admin data
  // Sync tab changes to URL
  useEffect(() => {
    if (location !== `/app/${activeTab}`) {
      setLocation(`/app/${activeTab}`);
    }
  }, [activeTab]);

  const refreshAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Stats
      const resStats = await fetch('/api/admin/stats');
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }

      // 2. Fetch all appointments
      const resApts = await fetch('/api/admin/appointments');
      if (resApts.ok) {
        const aptsData = await resApts.json();
        setAllAppointments(aptsData);
      }

      // 3. Fetch patients
      const resPatients = await fetch('/api/admin/patients');
      if (resPatients.ok) {
        const patData = await resPatients.json();
        setPatientsList(patData);
      }

      // 4. Fetch billing
      const resBilling = await fetch('/api/admin/billing');
      if (resBilling.ok) {
        const billData = await resBilling.json();
        setBillingData(billData);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  // Update appointment status handler
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showAlert({
          title: 'Status Updated',
          message: `Appointment status has been updated to "${newStatus}".`,
          severity: 'success',
        });
        refreshAdminData();
      } else {
        showAlert({
          title: 'Update Error',
          message: 'Could not update status. Please try again.',
          severity: 'error',
        });
      }
    } catch (err) {
      showAlert({
        title: 'Network Error',
        message: 'Unable to connect to clinic server.',
        severity: 'error',
      });
    }
  };

  // Create new appointment handler
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptForm.patientName || !newAptForm.phone) {
      showAlert({
        title: 'Validation Error',
        message: 'Patient full name and mobile number are required.',
        severity: 'warning',
      });
      return;
    }

    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAptForm),
      });

      if (res.ok) {
        showAlert({
          title: 'Appointment Scheduled',
          message: `Serial booked successfully for ${newAptForm.patientName}.`,
          severity: 'success',
        });
        setNewAppointmentModal(false);
        refreshAdminData();
      } else {
        const err = await res.json();
        showAlert({
          title: 'Booking Failed',
          message: err.error || 'Failed to schedule appointment.',
          severity: 'error',
        });
      }
    } catch (err) {
      showAlert({
        title: 'Server Error',
        message: 'Could not reach clinic booking database.',
        severity: 'error',
      });
    }
  };

  // Create new patient handler
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.fullName || !newPatientForm.phone) {
      showAlert({
        title: 'Validation Error',
        message: 'Full Name and Mobile Number are required.',
        severity: 'warning',
      });
      return;
    }

    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatientForm),
      });

      if (res.ok) {
        showAlert({
          title: 'Patient Registered',
          message: `Profile created for ${newPatientForm.fullName}.`,
          severity: 'success',
        });
        setNewPatientModal(false);
        refreshAdminData();
      } else {
        const err = await res.json();
        showAlert({
          title: 'Registration Error',
          message: err.error || 'Failed to register patient.',
          severity: 'error',
        });
      }
    } catch (err) {
      showAlert({
        title: 'Network Error',
        message: 'Failed to connect to database.',
        severity: 'error',
      });
    }
  };

  // Send AI chat message
  const handleSendAiMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingAi) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setIsSendingAi(true);

    try {
      const res = await fetch('/api/admin/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'Sorry, I encountered a temporary issue checking the database.', time: 'Just now' },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Network connection issue with the AI assistant service.', time: 'Just now' },
      ]);
    } finally {
      setIsSendingAi(false);
    }
  };

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((a) => {
      const matchesStatus = statusFilter === 'ALL' || a.status?.toUpperCase() === statusFilter.toUpperCase();
      const matchesDoctor = doctorFilter === 'ALL' || a.doctor_id === doctorFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        a.patient_name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.doctor_name.toLowerCase().includes(q) ||
        a.token_code.toLowerCase().includes(q) ||
        a.serial_no.toLowerCase().includes(q);
      return matchesStatus && matchesDoctor && matchesSearch;
    });
  }, [allAppointments, statusFilter, doctorFilter, searchQuery]);

  // Today's schedule data to render
  const todayScheduleToRender = useMemo(() => {
    if (stats.todaySchedule && stats.todaySchedule.length > 0) {
      return stats.todaySchedule;
    }
    return allAppointments.slice(0, 4);
  }, [stats.todaySchedule, allAppointments]);

  // Upcoming schedule data to render
  const upcomingScheduleToRender = useMemo(() => {
    if (stats.upcomingSchedule && stats.upcomingSchedule.length > 0) {
      return stats.upcomingSchedule;
    }
    return allAppointments.slice(2, 8);
  }, [stats.upcomingSchedule, allAppointments]);

  // Helper for status badge styling
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'CONFIRMED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          Confirmed
        </span>
      );
    }
    if (s === 'BOOKED' || s === 'PENDING') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
          Booked
        </span>
      );
    }
    if (s === 'NO_SHOW' || s === 'NO SHOW') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          No Show
        </span>
      );
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
          Completed
        </span>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        {status}
      </span>
    );
  };

  // Helper for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedCurrentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#f3f9f8] dark:bg-slate-950 text-foreground flex flex-col antialiased">
      {/* WRAPPER WITH FIXED SIDEBAR AND SCROLLABLE CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR COMPONENT (MATCHING REFERENCE IMAGE) */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } shrink-0 bg-white dark:bg-card border-r border-emerald-100 dark:border-border flex flex-col justify-between transition-all duration-300 shadow-xs z-30`}
        >
          {/* Top Brand Header */}
          <div>
            <div className="p-4 border-b border-emerald-50 dark:border-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 overflow-hidden group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                  <Activity className="h-5 w-5" />
                </div>
                {!sidebarCollapsed && (
                  <div className="leading-tight">
                    <span className="font-extrabold text-sm text-foreground tracking-tight block">
                      MedBook AI
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground block">
                      Contai B.B. Health Clinic
                    </span>
                  </div>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-7 w-7 rounded-lg border border-border bg-slate-50 dark:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center text-xs transition cursor-pointer"
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            {/* Nav Group 1: MAIN */}
            <div className="px-3 pt-5 pb-2">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-muted-foreground/80 block mb-2">
                  MAIN
                </span>
              )}
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <LayoutDashboard className={`h-4 w-4 shrink-0 ${activeTab === 'dashboard' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left">Dashboard</span>
                  )}
                  {!sidebarCollapsed && activeTab === 'dashboard' && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'calendar'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <Calendar className={`h-4 w-4 shrink-0 ${activeTab === 'calendar' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">Calendar</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <CalendarDays className={`h-4 w-4 shrink-0 ${activeTab === 'appointments' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">Appointments</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-muted text-foreground font-bold">
                        {allAppointments.length || 11}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('patients')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'patients'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <Users className={`h-4 w-4 shrink-0 ${activeTab === 'patients' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">Patients</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <Stethoscope className={`h-4 w-4 shrink-0 ${activeTab === 'services' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">Services</span>}
                </button>
              </nav>
            </div>

            {/* Nav Group 2: CONFIG */}
            <div className="px-3 pt-3 pb-2">
              {!sidebarCollapsed && (
                <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-muted-foreground/80 block mb-2">
                  CONFIG
                </span>
              )}
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'ai-settings'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <Bot className={`h-4 w-4 shrink-0 ${activeTab === 'ai-settings' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">AI Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <Settings className={`h-4 w-4 shrink-0 ${activeTab === 'settings' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">Settings</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'billing'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <CreditCard className={`h-4 w-4 shrink-0 ${activeTab === 'billing' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">Billing</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted/50'
                  }`}
                >
                  <User className={`h-4 w-4 shrink-0 ${activeTab === 'profile' ? 'text-emerald-600' : ''}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">My Profile</span>}
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar Widget: AI Powered & Sign Out */}
          <div className="p-3 border-t border-emerald-50 dark:border-border space-y-2">
            {!sidebarCollapsed && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-bold mb-0.5 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>AI Powered</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  24/7 smart booking assistant active
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                showAlert({
                  title: 'Signing Out',
                  message: 'You have been securely signed out from the admin desk.',
                  severity: 'info',
                });
                setLocation('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOP APPBAR HEADER */}
          <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-emerald-100 dark:border-border px-6 flex items-center justify-between gap-4 shadow-2xs">
            {/* Left Brand Title */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-teal-600 rounded-full"></div>
              <h1 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight">
                MedBook AI
              </h1>
              <span className="hidden md:inline-block text-xs text-muted-foreground font-medium border-l border-border pl-3">
                Contai B.B. Health Clinic Portal
              </span>
            </div>

            {/* Center/Right Search Bar & Utilities */}
            <div className="flex items-center gap-3">
              {/* Live Search Bar */}
              <div className="relative w-48 sm:w-64 md:w-80">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-full border border-emerald-100 dark:border-border bg-[#f7fbfb] dark:bg-muted text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition placeholder:text-muted-foreground/70"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Notification Bell with Badge */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="h-9 w-9 rounded-full border border-emerald-100 dark:border-border bg-[#f7fbfb] dark:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </button>

                {/* Notifications Popover */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-border shadow-xl p-3 z-50 animate-fadeIn space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="font-bold text-xs">Recent Alerts</span>
                      <span className="text-[10px] text-primary font-semibold cursor-pointer hover:underline">
                        Mark all as read
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-xs transition space-y-0.5">
                          <p className="font-bold text-foreground text-[11px]">{n.title}</p>
                          <p className="text-muted-foreground text-[10px] leading-tight">{n.desc}</p>
                          <span className="text-[9px] text-muted-foreground block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Chip */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full border border-emerald-100 dark:border-border bg-[#f7fbfb] dark:bg-muted hover:bg-emerald-50/50 dark:hover:bg-muted/80 transition cursor-pointer"
                >
                  <div className="h-7 w-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    DU
                  </div>
                  <div className="hidden sm:block text-left leading-none">
                    <span className="text-xs font-bold text-foreground block">Demo User</span>
                    <span className="text-[10px] text-muted-foreground block truncate max-w-[120px]">
                      theblockchaincoders@g...
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="font-bold text-xs">Dr. Demo / Admin</p>
                      <p className="text-[10px] text-muted-foreground">help.ecomart01@gmail.com</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition"
                    >
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition"
                    >
                      Chamber Settings
                    </button>
                    <Link
                      href="/"
                      className="w-full block text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-muted transition"
                    >
                      Visit Public Website
                    </Link>
                    <button
                      type="button"
                      onClick={() => setLocation('/')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* TAB VIEW 1: LIVE DASHBOARD (IDENTICAL TO SCREENSHOT) */}
          {activeTab === 'dashboard' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              {/* TOP LIVE DASHBOARD BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      LIVE DASHBOARD
                    </span>
                  </div>
                  <h2 className="font-extrabold text-2xl md:text-3xl text-foreground tracking-tight">
                    {getGreeting()}, Dr. Demo
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    {formattedCurrentDate} — contai-bb-health-clinic
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => refreshAdminData()}
                    className="p-2.5 rounded-xl border border-emerald-100 dark:border-border bg-white dark:bg-card text-muted-foreground hover:text-foreground hover:bg-slate-50 shadow-2xs transition cursor-pointer"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAppointmentModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Book Walk-in</span>
                  </button>

                  {/* "View All Appointments ->" (From Reference Screenshot) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('appointments')}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-extrabold shadow-sm hover:bg-teal-700 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Activity className="h-4 w-4" />
                    <span>View All Appointments</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 6 KPI STAT CARDS ROW (EXACT REPLICA OF SCREENSHOT) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* CARD 1: TODAY */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      TODAY
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.todayCount || 4}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Scheduled today</span>
                  </div>
                </div>

                {/* CARD 2: UPCOMING */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      UPCOMING
                    </span>
                    <div className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.upcomingCount || 7}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Booked & confirmed</span>
                  </div>
                </div>

                {/* CARD 3: PATIENTS */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      PATIENTS
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.patientsCount || 10}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">↑ All time</span>
                  </div>
                </div>

                {/* CARD 4: CANCELLATIONS */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      CANCELLATIONS
                    </span>
                    <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.cancellationsCount || 1}
                    </span>
                    <span className="text-[11px] text-rose-600 font-semibold">↓ Needs attention</span>
                  </div>
                </div>

                {/* CARD 5: COMPLETION */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      COMPLETION
                    </span>
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.completionRate || '67%'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">↑ vs. total</span>
                  </div>
                </div>

                {/* CARD 6: NO-SHOWS */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                      NO-SHOWS
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-2xl text-foreground block">
                      {stats.noShowRate || '33%'}
                    </span>
                    <span className="text-[11px] text-amber-600 font-semibold">↓ Missed visits</span>
                  </div>
                </div>
              </div>

              {/* TWO-COLUMN LAYOUT: TODAY'S SCHEDULE & UPCOMING */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT 2 COLS: TODAY'S SCHEDULE (MATCHING SCREENSHOT) */}
                <div className="lg:col-span-2 rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-50 dark:border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground">Today's Schedule</h3>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                      {todayScheduleToRender.length} appointments
                    </span>
                  </div>

                  {/* TABLE VIEW */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          <th className="pb-3 font-extrabold">PATIENT</th>
                          <th className="pb-3 font-extrabold">SERVICE</th>
                          <th className="pb-3 font-extrabold">DATE & TIME</th>
                          <th className="pb-3 font-extrabold">SOURCE</th>
                          <th className="pb-3 font-extrabold">STATUS</th>
                          <th className="pb-3 font-extrabold text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {todayScheduleToRender.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-muted/30 transition">
                            {/* PATIENT */}
                            <td className="py-3.5 pr-2">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {item.patient_name ? item.patient_name.charAt(0).toUpperCase() : 'P'}
                                </div>
                                <div>
                                  <span className="font-bold text-foreground block whitespace-nowrap">
                                    {item.patient_name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block">
                                    {item.phone}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* SERVICE */}
                            <td className="py-3.5 pr-2">
                              <div>
                                <span className="font-semibold text-foreground block whitespace-nowrap">
                                  {item.specialty || 'General Consultation'}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  30 min · {item.doctor_name}
                                </span>
                              </div>
                            </td>

                            {/* DATE & TIME */}
                            <td className="py-3.5 pr-2 whitespace-nowrap">
                              <div>
                                <span className="font-medium text-foreground block">
                                  {item.date}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  {item.time_slot}
                                </span>
                              </div>
                            </td>

                            {/* SOURCE (AI Widget badge) */}
                            <td className="py-3.5 pr-2 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                                <Bot className="h-3 w-3" />
                                AI Widget
                              </span>
                            </td>

                            {/* STATUS */}
                            <td className="py-3.5 pr-2 whitespace-nowrap">
                              {renderStatusBadge(item.status)}
                            </td>

                            {/* QUICK ACTIONS */}
                            <td className="py-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSlip(item)}
                                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 transition"
                                  title="View Chamber Slip"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </button>
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                                  className="text-[10px] font-bold py-1 px-1.5 rounded-md border border-border bg-card text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
                                >
                                  <option value="CONFIRMED">Confirm</option>
                                  <option value="BOOKED">Booked</option>
                                  <option value="COMPLETED">Completed</option>
                                  <option value="NO_SHOW">No Show</option>
                                  <option value="CANCELLED">Cancel</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RIGHT 1 COL: UPCOMING (MATCHING SCREENSHOT) */}
                <div className="rounded-2xl border border-emerald-100 dark:border-border bg-white dark:bg-card p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-50 dark:border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-600" />
                        <h3 className="font-extrabold text-sm text-foreground">Upcoming</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('appointments')}
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>See all</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* UPCOMING LIST (MATCHING SCREENSHOT WITH HIGHLIGHTED PATIENT TAGS) */}
                    <div className="pt-2 space-y-3">
                      {upcomingScheduleToRender.map((apt, idx) => (
                        <div
                          key={apt.id || idx}
                          onClick={() => setSelectedSlip(apt)}
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-muted/40 transition cursor-pointer group"
                        >
                          <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <div className="space-y-0.5">
                            {/* Highlighted patient name pill like in screenshot */}
                            <span className="inline-block px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200 text-xs font-bold">
                              {apt.patient_name}
                            </span>
                            <p className="text-[11px] text-muted-foreground leading-tight">
                              {apt.specialty || 'General Consultation'} · {apt.date}, {apt.time_slot ? apt.time_slot.split('-')[0] : '10:30 AM'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CLINIC CHAMBERS QUICK SUMMARY */}
                  <div className="pt-4 border-t border-border mt-4">
                    <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/40 text-xs space-y-1">
                      <span className="font-bold text-teal-900 dark:text-teal-200 block text-[11px]">
                        Contai B.B. Health Clinic Emergency Desk
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        Direct helpline: <strong>8978933511 / 7718149150</strong>. WhatsApp token confirmations are active.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* TAB VIEW 2: CALENDAR */}
          {activeTab === 'calendar' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-2xl text-foreground">Clinic Chamber Calendar</h2>
                  <p className="text-xs text-muted-foreground">
                    Doctor visiting days, weekly schedules and slot occupancy at Contai B.B. Health Clinic.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewAppointmentModal(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Chamber Appointment</span>
                </button>
              </div>

              {/* Weekly Schedule Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-foreground">Dr. Suman Sarangi</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
                      Sunday
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Neuropsychiatry & Behavioral Health</p>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-muted text-xs space-y-1">
                    <span className="font-bold block">Timing: 08:30 AM – 10:30 AM</span>
                    <span className="text-[11px] text-muted-foreground block">Chamber Fee: ₹500</span>
                    <span className="text-[10px] text-emerald-600 font-bold">● Active Booking Allowed</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-foreground">Dr. Kamal Poddar</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 text-cyan-800 font-bold">
                      Saturday
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Consultant Physician & Diabetes</p>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-muted text-xs space-y-1">
                    <span className="font-bold block">Timing: 10:00 AM – 01:00 PM</span>
                    <span className="text-[11px] text-muted-foreground block">Chamber Fee: ₹400</span>
                    <span className="text-[10px] text-emerald-600 font-bold">● Active Booking Allowed</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-foreground">Dr. Saikat Maity</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      Sunday
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Dermatologist & Hair Specialist</p>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-muted text-xs space-y-1">
                    <span className="font-bold block">Timing: 02:00 PM – 05:00 PM</span>
                    <span className="text-[11px] text-muted-foreground block">Chamber Fee: ₹400</span>
                    <span className="text-[10px] text-emerald-600 font-bold">● Active Booking Allowed</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-foreground">Dr. Rakesh Mohanty</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                      By Appointment
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Gastroenterology & Liver</p>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-muted text-xs space-y-1">
                    <span className="font-bold block">Timing: 04:00 PM – 07:00 PM</span>
                    <span className="text-[11px] text-muted-foreground block">Chamber Fee: ₹500</span>
                    <span className="text-[10px] text-emerald-600 font-bold">● Active Booking Allowed</span>
                  </div>
                </div>
              </div>

              {/* Schedule List */}
              <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm">Scheduled Appointments by Date</h3>
                <div className="divide-y divide-border">
                  {allAppointments.map((apt) => (
                    <div key={apt.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xs">
                          {apt.serial_no || '#01'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-foreground block">{apt.patient_name}</span>
                          <span className="text-[10px] text-muted-foreground block">
                            {apt.doctor_name} · {apt.date} ({apt.time_slot})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStatusBadge(apt.status)}
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(apt)}
                          className="text-xs text-primary font-bold hover:underline"
                        >
                          View Slip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          )}

          {/* TAB VIEW 3: APPOINTMENTS (FULL TABLE WITH FILTERS) */}
          {activeTab === 'appointments' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-2xl text-foreground">Appointment Management</h2>
                  <p className="text-xs text-muted-foreground">
                    Review and update all patient chamber serials, doctor consultation slots and statuses.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => refreshAdminData()}
                    className="p-2.5 rounded-xl border border-border bg-white dark:bg-card text-muted-foreground hover:text-foreground"
                    title="Refresh List"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAppointmentModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Appointment</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Doctor Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-card border border-border">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', 'CONFIRMED', 'BOOKED', 'NO_SHOW', 'COMPLETED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        statusFilter === st
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {st === 'NO_SHOW' ? 'No Show' : st.charAt(0) + st.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-semibold">Doctor:</span>
                  <select
                    value={doctorFilter}
                    onChange={(e) => setDoctorFilter(e.target.value)}
                    className="text-xs py-1.5 px-2.5 rounded-xl border border-border bg-card text-foreground cursor-pointer"
                  >
                    <option value="ALL">All Specialists</option>
                    <option value="kamal-poddar">Dr. Kamal Poddar (Physician)</option>
                    <option value="suman-sarangi">Dr. Suman Sarangi (Psychiatry)</option>
                    <option value="saikat-maity">Dr. Saikat Maity (Dermatology)</option>
                    <option value="rakesh-mohanty">Dr. Rakesh Mohanty (Gastro)</option>
                  </select>
                </div>
              </div>

              {/* APPOINTMENTS TABLE */}
              <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3">TOKEN & SERIAL</th>
                        <th className="pb-3">PATIENT</th>
                        <th className="pb-3">DOCTOR & SERVICE</th>
                        <th className="pb-3">DATE & TIME</th>
                        <th className="pb-3">FEE / MODE</th>
                        <th className="pb-3">STATUS</th>
                        <th className="pb-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/70 dark:hover:bg-muted/30 transition">
                          <td className="py-3 pr-2">
                            <span className="font-extrabold text-foreground block">{apt.serial_no}</span>
                            <span className="text-[10px] text-muted-foreground block font-mono">
                              {apt.token_code}
                            </span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-bold text-foreground block">{apt.patient_name}</span>
                            <span className="text-[10px] text-muted-foreground block">{apt.phone}</span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-semibold text-foreground block">{apt.doctor_name}</span>
                            <span className="text-[10px] text-muted-foreground block">{apt.specialty}</span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-medium text-foreground block">{apt.date}</span>
                            <span className="text-[10px] text-muted-foreground block">{apt.time_slot}</span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-bold text-foreground block">{apt.fee || '₹500'}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-[120px]">
                              {apt.payment_method}
                            </span>
                          </td>
                          <td className="py-3 pr-2 whitespace-nowrap">{renderStatusBadge(apt.status)}</td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedSlip(apt)}
                                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
                                title="Print Slip"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </button>
                              <select
                                value={apt.status}
                                onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                                className="text-[10px] font-bold py-1 px-1.5 rounded-md border border-border bg-card text-foreground cursor-pointer focus:ring-1 focus:ring-teal-500"
                              >
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="BOOKED">Booked</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="NO_SHOW">No Show</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          )}

          {/* TAB VIEW 4: PATIENTS DIRECTORY */}
          {activeTab === 'patients' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-2xl text-foreground">Registered Patients Directory</h2>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive patient records, medical profiles, and historical appointment records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewPatientModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Patient</span>
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3">PATIENT ID</th>
                        <th className="pb-3">NAME & GENDER</th>
                        <th className="pb-3">PHONE</th>
                        <th className="pb-3">BLOOD GROUP</th>
                        <th className="pb-3">VISITS</th>
                        <th className="pb-3">LAST VISIT</th>
                        <th className="pb-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {patientsList.map((pat) => (
                        <tr key={pat.id} className="hover:bg-slate-50/70 dark:hover:bg-muted/30 transition">
                          <td className="py-3 pr-2 font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400">
                            {pat.account_id}
                          </td>
                          <td className="py-3 pr-2">
                            <span className="font-bold text-foreground block">{pat.full_name}</span>
                            <span className="text-[10px] text-muted-foreground block">{pat.gender || 'Male'}</span>
                          </td>
                          <td className="py-3 pr-2 font-medium">{pat.phone}</td>
                          <td className="py-3 pr-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              {pat.blood_group || 'O+'}
                            </span>
                          </td>
                          <td className="py-3 pr-2 font-bold">{pat.totalAppointments || 1}</td>
                          <td className="py-3 pr-2 text-muted-foreground">{pat.lastVisitDate || 'Recent'}</td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedPatientHistory(pat)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold hover:bg-teal-100 transition cursor-pointer"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          )}

          {/* TAB VIEW 5: SERVICES & DOCTORS */}
          {activeTab === 'services' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              <div>
                <h2 className="font-extrabold text-2xl text-foreground">Clinic Services & Doctor Chambers</h2>
                <p className="text-xs text-muted-foreground">
                  Manage specialist roster, consultation fees, visiting hours and chamber availability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Dr. Suman Sarangi',
                    degree: 'MBBS, MD (Psychiatry), DNB',
                    spec: 'Neuropsychiatrist & Behavioral Health Specialist',
                    fee: '₹500',
                    timing: 'Every Sunday (08:30 AM - 10:30 AM)',
                    room: 'Chamber #1 (1st Floor)',
                  },
                  {
                    name: 'Dr. Kamal Poddar',
                    degree: 'MBBS, MD (Medicine), C.Diab',
                    spec: 'Consultant Physician & Diabetes Specialist',
                    fee: '₹400',
                    timing: 'Every Saturday (10:00 AM - 01:00 PM)',
                    room: 'Chamber #2 (Ground Floor)',
                  },
                  {
                    name: 'Dr. Saikat Maity',
                    degree: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
                    spec: 'Dermatologist, Hair & Cosmetology Specialist',
                    fee: '₹400',
                    timing: 'Every Sunday (02:00 PM - 05:00 PM)',
                    room: 'Chamber #3 (1st Floor)',
                  },
                  {
                    name: 'Dr. Rakesh Mohanty',
                    degree: 'MBBS, MD (Medicine), DM (Gastroenterology)',
                    spec: 'Gastroenterologist & Liver Specialist',
                    fee: '₹500',
                    timing: 'On Appointment Booking (04:00 PM - 07:00 PM)',
                    room: 'Chamber #4 (Specialist Block)',
                  },
                ].map((doc, idx) => (
                  <div key={idx} className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-base text-foreground">{doc.name}</h3>
                        <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">{doc.degree}</p>
                        <p className="text-xs text-muted-foreground">{doc.spec}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Active
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-muted/50 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Consultation Fee:</span>
                        <span className="font-bold text-foreground">{doc.fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visiting Schedule:</span>
                        <span className="font-semibold text-foreground">{doc.timing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chamber Room:</span>
                        <span className="font-semibold text-foreground">{doc.room}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewAptForm((prev) => ({
                            ...prev,
                            doctorName: doc.name,
                            specialty: doc.spec,
                            fee: doc.fee,
                          }));
                          setNewAppointmentModal(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                      >
                        Book Serial Token
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* TAB VIEW 6: AI SETTINGS */}
          {activeTab === 'ai-settings' && (
            <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
              <div>
                <h2 className="font-extrabold text-2xl text-foreground">Clinic AI Settings</h2>
                <p className="text-xs text-muted-foreground">
                  Configure 24/7 smart booking receptionist, auto-replies, and patient triage automation.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white dark:bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm block">24/7 AI Smart Booking Receptionist</span>
                    <p className="text-xs text-muted-foreground">
                      Automatically answers patient inquiries and suggests doctor chamber slots.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-600 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm block">WhatsApp Auto-Confirmation</span>
                    <p className="text-xs text-muted-foreground">
                      Dispatches chamber serial slips and instructions directly to patient WhatsApp numbers.
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-600 cursor-pointer" />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm block">Emergency Keyword Detection</span>
                    <p className="text-xs text-muted-foreground">
                      Instantly alerts duty desk for acute symptoms (chest pain, severe breathlessness, trauma).
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-600 cursor-pointer" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showAlert({
                      title: 'Settings Saved',
                      message: 'AI Clinic Automation configuration updated successfully.',
                      severity: 'success',
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  Save AI Configuration
                </button>
              </div>
            </main>
          )}

          {/* TAB VIEW 7: CLINIC SETTINGS */}
          {activeTab === 'settings' && (
            <main className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
              <div>
                <h2 className="font-extrabold text-2xl text-foreground">Clinic Configuration</h2>
                <p className="text-xs text-muted-foreground">
                  Address, emergency phone numbers, and operational timings for Contai B.B. Health Clinic.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white dark:bg-card p-6 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Clinic Name</label>
                    <input
                      type="text"
                      defaultValue="Contai B.B. Health Clinic"
                      className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Clinic Phone Numbers</label>
                    <input
                      type="text"
                      defaultValue="+91 89789 33511 / +91 77181 49150"
                      className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-foreground">Clinic Address</label>
                    <input
                      type="text"
                      defaultValue="Padmapukuria, Contai Bypass Road (NH Kolkata Route), Contai, WB - 721401"
                      className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showAlert({
                      title: 'Clinic Details Updated',
                      message: 'Changes saved to Central Clinic Database.',
                      severity: 'success',
                    })
                  }
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </main>
          )}

          {/* TAB VIEW 8: BILLING */}
          {activeTab === 'billing' && (
            <main className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn">
              <div>
                <h2 className="font-extrabold text-2xl text-foreground">Clinic Billing & Counter Revenue</h2>
                <p className="text-xs text-muted-foreground">
                  Ledger of chamber consultation fees, pathology diagnostics payments, and Razorpay collections.
                </p>
              </div>

              {/* Revenue Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold">Total Revenue (Paid)</span>
                  <span className="text-2xl font-extrabold text-foreground block">{billingData.totalRevenue}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Synchronized with SQLite</span>
                </div>
                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold">Counter Cash Collections</span>
                  <span className="text-2xl font-extrabold text-foreground block">{billingData.cashTotal}</span>
                  <span className="text-[10px] text-muted-foreground">Physical receipts</span>
                </div>
                <div className="rounded-2xl border border-border bg-white dark:bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold">Online UPI / Razorpay</span>
                  <span className="text-2xl font-extrabold text-teal-600 block">{billingData.onlineTotal}</span>
                  <span className="text-[10px] text-teal-600 font-bold">Direct bank settlement</span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="rounded-2xl border border-border bg-white dark:bg-card p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm">Recent Counter Invoices</h3>
                <div className="divide-y divide-border text-xs">
                  {billingData.invoices && billingData.invoices.length > 0 ? (
                    billingData.invoices.map((inv: any) => (
                      <div key={inv.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-foreground block">{inv.description}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">
                            {inv.id} · Phone: {inv.phone} · Date: {inv.date}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-foreground block">{inv.amount}</span>
                          <span className="text-[10px] text-emerald-600 font-bold">{inv.mode}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-xs">
                      No invoices logged today.
                    </div>
                  )}
                </div>
              </div>
            </main>
          )}

          {/* TAB VIEW 9: MY PROFILE */}
          {activeTab === 'profile' && (
            <main className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full animate-fadeIn">
              <div>
                <h2 className="font-extrabold text-2xl text-foreground">Clinic Administrator Profile</h2>
                <p className="text-xs text-muted-foreground">
                  Credentials and access permissions for Contai B.B. Health Clinic admin.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white dark:bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="h-16 w-16 rounded-2xl bg-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                    DU
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">Demo User / Dr. Demo</h3>
                    <p className="text-xs text-muted-foreground">help.ecomart01@gmail.com</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      Super Administrator & Doctor Chamber In-Charge
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground block">Facility:</span>
                      <span className="font-bold text-foreground block">Contai B.B. Health Clinic</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Role:</span>
                      <span className="font-bold text-foreground block">Clinical Director</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Helpline:</span>
                      <span className="font-bold text-foreground block">+91 89789 33511</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Database Status:</span>
                      <span className="font-bold text-emerald-600 block">Connected (SQLite WAL)</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* FLOATING ACTION / DOCKED BUTTON: "✨ AI ASSISTANT" (MATCHING SCREENSHOT) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAiAssistantOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-xs font-extrabold shadow-xl hover:shadow-2xl hover:scale-105 transition flex items-center gap-2.5 cursor-pointer border border-white/20"
        >
          <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
          <span>AI ASSISTANT</span>
        </button>
      </div>

      {/* MODAL 1: AI ASSISTANT INTERACTIVE CHAT */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">MedBook AI Clinic Assistant</h3>
                  <span className="text-[10px] text-white/80 block">
                    Connected to Contai B.B. Health Clinic Central Roster
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiAssistantOpen(false)}
                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-muted/20">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-card border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isSendingAi && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-card border border-border text-xs flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                    <span className="text-muted-foreground text-[11px]">Checking appointments database...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-border flex gap-1.5 overflow-x-auto bg-card">
              {[
                "Today's schedule",
                'Doctor timings',
                'Patient count',
                'Billing summary',
              ].map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => {
                    setChatInput(qp);
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-muted hover:bg-teal-50 hover:text-teal-800 transition whitespace-nowrap"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiMessage} className="p-3 border-t border-border bg-card flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about appointments, patients, schedules..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-muted/40 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <button
                type="submit"
                disabled={isSendingAi || !chatInput.trim()}
                className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT / VIEW SERIAL SLIP */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-5 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-sm text-primary">Contai B.B. Health Clinic</h4>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    Official Chamber Consultation Slip
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Slip Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-muted/40 border border-border space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-muted-foreground">Serial No:</span>
                <span className="font-extrabold text-xl text-teal-700 dark:text-teal-400">
                  {selectedSlip.serial_no}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Token Code:</span>
                <span className="font-mono font-bold text-foreground">{selectedSlip.token_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Patient Name:</span>
                <span className="font-bold text-foreground">{selectedSlip.patient_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground">{selectedSlip.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Doctor:</span>
                <span className="font-bold text-teal-700 dark:text-teal-400">{selectedSlip.doctor_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Specialty:</span>
                <span className="font-medium text-foreground">{selectedSlip.specialty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Consultation Date:</span>
                <span className="font-semibold text-foreground">{selectedSlip.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Slot:</span>
                <span className="font-semibold text-foreground">{selectedSlip.time_slot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Fee / Payment:</span>
                <span className="font-bold text-foreground">
                  {selectedSlip.fee} ({selectedSlip.payment_method})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Status:</span>
                {renderStatusBadge(selectedSlip.status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Print Slip</span>
              </button>
              <a
                href={`https://wa.me/91${selectedSlip.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                  `*Contai B.B. Health Clinic - Chamber Serial Token*\n` +
                    `Patient: ${selectedSlip.patient_name}\n` +
                    `Serial: ${selectedSlip.serial_no} (${selectedSlip.token_code})\n` +
                    `Doctor: ${selectedSlip.doctor_name}\n` +
                    `Date & Time: ${selectedSlip.date}, ${selectedSlip.time_slot}\n` +
                    `Chamber: Padmapukuria, Contai Bypass Road (721401)\nHelpline: 8978933511`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Send WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BOOK WALK-IN / NEW APPOINTMENT */}
      {newAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-foreground">Schedule Chamber Appointment</h3>
              </div>
              <button
                type="button"
                onClick={() => setNewAppointmentModal(false)}
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Giri"
                    value={newAptForm.patientName}
                    onChange={(e) => setNewAptForm({ ...newAptForm, patientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={newAptForm.phone}
                    onChange={(e) => setNewAptForm({ ...newAptForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Doctor Specialist</label>
                  <select
                    value={newAptForm.doctorId}
                    onChange={(e) => {
                      const val = e.target.value;
                      let dName = 'Dr. Kamal Poddar';
                      let fee = '₹400';
                      let spec = 'Consultant Physician';
                      if (val === 'suman-sarangi') {
                        dName = 'Dr. Suman Sarangi';
                        fee = '₹500';
                        spec = 'Neuropsychiatrist';
                      } else if (val === 'saikat-maity') {
                        dName = 'Dr. Saikat Maity';
                        fee = '₹400';
                        spec = 'Dermatologist';
                      } else if (val === 'rakesh-mohanty') {
                        dName = 'Dr. Rakesh Mohanty';
                        fee = '₹500';
                        spec = 'Gastroenterologist';
                      }
                      setNewAptForm({
                        ...newAptForm,
                        doctorId: val,
                        doctorName: dName,
                        fee,
                        specialty: spec,
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  >
                    <option value="kamal-poddar">Dr. Kamal Poddar (Physician)</option>
                    <option value="suman-sarangi">Dr. Suman Sarangi (Psychiatry)</option>
                    <option value="saikat-maity">Dr. Saikat Maity (Dermatology)</option>
                    <option value="rakesh-mohanty">Dr. Rakesh Mohanty (Gastro)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={newAptForm.date}
                    onChange={(e) => setNewAptForm({ ...newAptForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Time Slot</label>
                  <select
                    value={newAptForm.timeSlot}
                    onChange={(e) => setNewAptForm({ ...newAptForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  >
                    <option value="09:00 AM - 09:15 AM">09:00 AM - 09:15 AM</option>
                    <option value="09:15 AM - 09:30 AM">09:15 AM - 09:30 AM</option>
                    <option value="10:00 AM - 10:15 AM">10:00 AM - 10:15 AM</option>
                    <option value="10:30 AM - 10:45 AM">10:30 AM - 10:45 AM</option>
                    <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                    <option value="06:45 PM - 07:15 PM">06:45 PM - 07:15 PM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Payment Mode</label>
                  <select
                    value={newAptForm.paymentMethod}
                    onChange={(e) => setNewAptForm({ ...newAptForm, paymentMethod: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  >
                    <option value="Pay at Clinic Counter">Pay at Clinic Counter (Cash/UPI)</option>
                    <option value="Razorpay Online UPI">Razorpay Online UPI</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewAppointmentModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  Confirm & Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW PATIENT */}
      {newPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-foreground">Register New Patient</h3>
              </div>
              <button
                type="button"
                onClick={() => setNewPatientModal(false)}
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subhasis Panda"
                  value={newPatientForm.fullName}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit Indian Mobile"
                  value={newPatientForm.phone}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Gender</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, gender: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Blood Group</label>
                  <select
                    value={newPatientForm.bloodGroup}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Address / Town</label>
                <input
                  type="text"
                  placeholder="e.g. Contai, Purba Medinipur"
                  value={newPatientForm.address}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewPatientModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PATIENT HISTORY / PROFILE VIEW */}
      {selectedPatientHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-extrabold text-base text-foreground">{selectedPatientHistory.full_name}</h3>
                <span className="font-mono text-xs text-teal-600 font-bold">
                  {selectedPatientHistory.account_id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatientHistory(null)}
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-muted/40 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block">Phone:</span>
                  <span className="font-bold text-foreground block">{selectedPatientHistory.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Blood Group:</span>
                  <span className="font-bold text-rose-600 block">{selectedPatientHistory.blood_group || 'O+'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Gender:</span>
                  <span className="font-bold text-foreground block">{selectedPatientHistory.gender || 'Male'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Address:</span>
                  <span className="font-bold text-foreground block">{selectedPatientHistory.address || 'Contai'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs text-foreground block">Appointment Records</span>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {allAppointments
                  .filter((a) => a.phone === selectedPatientHistory.phone)
                  .map((apt) => (
                    <div key={apt.id} className="p-2.5 rounded-xl border border-border text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold block">{apt.doctor_name}</span>
                        <span className="text-[10px] text-muted-foreground block">
                          {apt.date} · {apt.time_slot} ({apt.serial_no})
                        </span>
                      </div>
                      {renderStatusBadge(apt.status)}
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPatientHistory(null)}
              className="w-full py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
