import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  CreditCard,
  CalendarCheck,
  BookOpen,
  DollarSign,
  Award,
  Settings,
  Plus,
  Search,
  Printer,
  CheckCircle,
  Clock,
  X,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  FileText,
  UserCheck,
  ChevronRight,
  Download,
  Globe,
  Upload,
  Trash2,
  Edit,
  AlertCircle,
  Share2,
  Send,
  Filter,
  Eye,
  RefreshCw,
  Check,
  ShieldCheck,
  PieChart,
  BarChart3,
  HelpCircle,
  ArrowRight,
  Menu
} from 'lucide-react';

import {
  initialSettings,
  initialCourses,
  initialStudents,
  initialTeachers,
  initialPayments,
  initialExpenses,
  initialExams,
  initialExamResults,
  initialCertificates,
  initialInquiries
} from './data/mockData';

import SetupWizardModal from './components/SetupWizardModal';
import PrintDocumentModal from './components/PrintDocumentModal';
import FeeNotificationModal from './components/FeeNotificationModal';
import StudentProfileModal from './components/StudentProfileModal';
import BackupRestoreModal from './components/BackupRestoreModal';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Persistent States
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ag_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('ag_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ag_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('ag_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ag_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('ag_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('ag_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [examResults, setExamResults] = useState(() => {
    const saved = localStorage.getItem('ag_exam_results');
    return saved ? JSON.parse(saved) : initialExamResults;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('ag_certificates');
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('ag_inquiries');
    return saved ? JSON.parse(saved) : initialInquiries;
  });

  // Daily Attendance state (Key: YYYY-MM-DD -> { [studentId]: 'P' | 'A' | 'L' | 'T' })
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('ag_attendance');
    return saved ? JSON.parse(saved) : {};
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ag_settings', JSON.stringify(settings));
    // Apply primary color to CSS variable
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ag_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ag_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ag_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('ag_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ag_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('ag_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('ag_exam_results', JSON.stringify(examResults));
  }, [examResults]);

  useEffect(() => {
    localStorage.setItem('ag_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('ag_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('ag_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Toast Notification Trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Modals Visibility
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDocConfig, setPrintDocConfig] = useState({ type: '', data: null });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({ student: null, payment: null, type: 'payment' });
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Form Modals
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [preselectedStudentForFee, setPreselectedStudentForFee] = useState(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showEnterMarksModal, setShowEnterMarksModal] = useState(false);
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);

  // Filter States
  const [studentCourseFilter, setStudentCourseFilter] = useState('ALL');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');
  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL');
  const [portalCertQuery, setPortalCertQuery] = useState('');
  const [portalCertResult, setPortalCertResult] = useState(null);

  const currency = settings.currencySymbol || 'Rs.';

  // Trigger Print Helper
  const openPrintDocument = (type, data) => {
    setPrintDocConfig({ type, data });
    setShowPrintModal(true);
  };

  // Trigger Fee Notification Helper
  const openFeeNotification = (student, payment, type = 'payment') => {
    setNotificationConfig({ student, payment, type });
    setShowNotificationModal(true);
  };

  // =================== CALCULATED METRICS ===================
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const inactiveStudents = totalStudents - activeStudents;
  const totalTeachers = teachers.length;
  const totalCourses = courses.length;

  const totalFeeCollected = useMemo(() => {
    return payments.reduce((acc, p) => acc + Number(p.paidAmount || 0), 0);
  }, [payments]);

  const totalOutstandingDues = useMemo(() => {
    return students.reduce((acc, s) => acc + Number(s.remainingFee || 0), 0);
  }, [students]);

  const totalExpensesAmount = useMemo(() => {
    return expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  }, [expenses]);

  const netBalance = totalFeeCollected - totalExpensesAmount;

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (s.phone && s.phone.includes(globalSearch)) ||
        (s.courseName && s.courseName.toLowerCase().includes(globalSearch.toLowerCase()));
      const matchCourse = studentCourseFilter === 'ALL' || s.courseName === studentCourseFilter;
      const matchStatus = studentStatusFilter === 'ALL' || s.status === studentStatusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [students, globalSearch, studentCourseFilter, studentStatusFilter]);

  // Defaulters List
  const defaultersList = useMemo(() => {
    return students.filter((s) => Number(s.remainingFee) > 0);
  }, [students]);

  // Export CSV Helper
  const exportToCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully`);
  };

  // Online Certificate Verification (Public Portal)
  const handleVerifyCertificate = (e) => {
    e.preventDefault();
    if (!portalCertQuery.trim()) return;
    const found = certificates.find(
      (c) => c.certId.toLowerCase().trim() === portalCertQuery.toLowerCase().trim()
    );
    if (found) {
      setPortalCertResult({ found: true, cert: found });
    } else {
      setPortalCertResult({ found: false, id: portalCertQuery });
    }
  };

  // Submit Online Inquiry (Public Portal)
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', courseInterest: '', message: '' });
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    const newInq = {
      id: Date.now(),
      ...inquiryForm,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setInquiries([newInq, ...inquiries]);
    setInquiryForm({ name: '', phone: '', email: '', courseInterest: '', message: '' });
    showToast('Your admission inquiry has been received! Our counselors will contact you.');
  };

  // Attendance helpers
  const handleMarkAttendance = (studentId, status) => {
    setAttendanceRecords((prev) => {
      const dayRecords = prev[attendanceDate] || {};
      return {
        ...prev,
        [attendanceDate]: {
          ...dayRecords,
          [studentId]: status
        }
      };
    });
  };

  const handleMarkAllPresent = () => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = 'P';
    });
    setAttendanceRecords((prev) => ({
      ...prev,
      [attendanceDate]: updated
    }));
    showToast('All students marked present for selected date.');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16' }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #3b82f6',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          <CheckCircle size={18} color="#60a5fa" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0c1322',
          borderRight: '1px solid #1a2742',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: mobileMenuOpen ? 'translateX(0)' : 'none',
          transition: 'transform 0.3s ease'
        }}
        className={mobileMenuOpen ? 'sidebar-open' : 'sidebar-desktop'}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '1px solid #1a2742',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo"
              style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 6 }}
            />
          ) : (
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, var(--primary), #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <GraduationCap size={24} />
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <h1
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {settings.academyName || 'Al Ghazi Digital Institute'}
            </h1>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Management Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            padding: '0.75rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            overflowY: 'auto'
          }}
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users, badge: students.length },
            { id: 'teachers', label: 'Faculty & Staff', icon: UserCheck, badge: teachers.length },
            { id: 'courses', label: 'Courses & Batches', icon: BookOpen },
            { id: 'fees', label: 'Fee Collection & Dues', icon: CreditCard },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'exams', label: 'Exams & Results', icon: Award },
            { id: 'expenses', label: 'Expenses & Accounts', icon: DollarSign },
            { id: 'certificates', label: 'Certificate Generator', icon: Award },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
            { id: 'portal', label: 'Public Academy Portal', icon: Globe },
            { id: 'settings', label: 'Settings & Identity', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: active ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: active ? '#60a5fa' : '#94a3b8',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: active ? '#2563eb' : '#1e293b',
                      color: '#ffffff'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Setup Wizard Button */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #1a2742' }}>
          <button
            onClick={() => setShowSetupWizard(true)}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', gap: '0.4rem' }}
          >
            <Settings size={14} />
            <span>Launch Setup Wizard</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#0c1322',
            borderBottom: '1px solid #1a2742',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-secondary mobile-menu-toggle"
              style={{ display: 'none', padding: '0.4rem' }}
            >
              <Menu size={18} />
            </button>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          {/* Quick Action Buttons in Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => {
                setPreselectedStudentForFee(null);
                setShowCollectFeeModal(true);
              }}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <CreditCard size={15} />
              <span>Collect Fee</span>
            </button>
            <button
              onClick={() => {
                setEditingStudent(null);
                setShowAddStudentModal(true);
              }}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Plus size={15} />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="btn btn-secondary"
              title="Backup Database"
              style={{ padding: '0.45rem', fontSize: '0.8rem' }}
            >
              <Download size={16} />
            </button>
          </div>
        </header>

        {/* Main Body Canvas */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          {/* ===================== TAB 1: DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Top KPI Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL STUDENTS</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                        {totalStudents}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{activeStudents} Active Currently</span>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(37,99,235,0.1)', color: '#60a5fa' }}>
                      <Users size={22} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL FEES COLLECTED</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                        {currency} {totalFeeCollected.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{payments.length} Valid Transactions</span>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                      <CreditCard size={22} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>OUTSTANDING DUES</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>
                        {currency} {totalOutstandingDues.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{defaultersList.length} Students Pending</span>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                      <AlertCircle size={22} />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>NET CASH BALANCE</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: netBalance >= 0 ? '#38bdf8' : '#f87171', marginTop: '4px' }}>
                        {currency} {netBalance.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Exp: {currency} {totalExpensesAmount.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, backgroundColor: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                      <DollarSign size={22} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div
                className="card"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(17,27,46,0.8))',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderColor: 'rgba(37,99,235,0.3)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                    {settings.academyName} Management Console
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Academic Session: <strong>{settings.academicSession}</strong> • Registered under{' '}
                    <strong>{settings.registrationNumber || 'Provincial Authority'}</strong>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowSetupWizard(true)} className="btn btn-secondary">
                    <Settings size={15} />
                    <span>Institute Setup Wizard</span>
                  </button>
                  <button onClick={() => openPrintDocument('defaulters_list', defaultersList)} className="btn btn-secondary">
                    <Printer size={15} />
                    <span>Print Defaulters List</span>
                  </button>
                  <button onClick={() => setActiveTab('portal')} className="btn btn-primary">
                    <Globe size={15} />
                    <span>View Public Academy Portal</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Course Distribution & Recent Payments */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
                {/* Course Enrollment Breakdown */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Course Enrollment Breakdown</h3>
                    <button onClick={() => setActiveTab('courses')} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {courses.map((c) => {
                      const count = students.filter((s) => s.courseId === c.id || s.courseName === c.name).length;
                      const percentage = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
                      return (
                        <div key={c.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{c.name}</span>
                            <span style={{ color: '#94a3b8' }}>{count} students ({percentage}%)</span>
                          </div>
                          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Fee Payments */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Recent Fee Collections</h3>
                    <button onClick={() => setActiveTab('fees')} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                      Fee Ledger
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {payments.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.75rem',
                          backgroundColor: '#0d1526',
                          borderRadius: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{p.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {p.receiptNo} • {p.paymentMethod} • {p.paymentDate}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399' }}>
                            {currency} {Number(p.paidAmount).toLocaleString()}
                          </div>
                          <button
                            onClick={() => openPrintDocument('fee_receipt', p)}
                            style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            Print Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: STUDENTS ===================== */}
          {activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Filter and Search Bar */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search by name, roll, phone..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '32px' }}
                    />
                  </div>

                  <select
                    value={studentCourseFilter}
                    onChange={(e) => setStudentCourseFilter(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto' }}
                  >
                    <option value="ALL">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={studentStatusFilter}
                    onChange={(e) => setStudentStatusFilter(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto' }}
                  >
                    <option value="ALL">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => exportToCSV('al_ghazi_students', filteredStudents)}
                    className="btn btn-secondary"
                  >
                    <Download size={15} />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setShowAddStudentModal(true);
                    }}
                    className="btn btn-primary"
                  >
                    <Plus size={15} />
                    <span>Add New Student</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll #</th>
                        <th>Student Name & Father</th>
                        <th>Enrolled Course</th>
                        <th>Parent WhatsApp</th>
                        <th style={{ textAlign: 'right' }}>Total Fee</th>
                        <th style={{ textAlign: 'right' }}>Paid</th>
                        <th style={{ textAlign: 'right' }}>Balance</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            No student records matching your search/filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700, color: '#60a5fa' }}>{s.rollNo}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#f8fafc' }}>{s.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>S/D of {s.fatherName}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>{s.courseName}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.batch || 'Regular'}</div>
                            </td>
                            <td>{s.parentPhone || s.phone}</td>
                            <td style={{ textAlign: 'right' }}>{Number(s.totalFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#34d399', fontWeight: 600 }}>
                              {Number(s.paidFee).toLocaleString()}
                            </td>
                            <td
                              style={{
                                textAlign: 'right',
                                fontWeight: 700,
                                color: Number(s.remainingFee) > 0 ? '#f87171' : '#34d399'
                              }}
                            >
                              {currency} {Number(s.remainingFee).toLocaleString()}
                            </td>
                            <td>
                              <span className={`badge ${s.status === 'Active' ? 'badge-active' : 'badge-neutral'}`}>
                                {s.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => {
                                    setSelectedStudentForProfile(s);
                                    setShowStudentProfileModal(true);
                                  }}
                                  className="btn btn-secondary"
                                  title="View Full Profile"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => openPrintDocument('student_id_card', s)}
                                  className="btn btn-secondary"
                                  title="Print ID Card"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Printer size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setPreselectedStudentForFee(s);
                                    setShowCollectFeeModal(true);
                                  }}
                                  className="btn btn-primary"
                                  title="Collect Fee"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <CreditCard size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingStudent(s);
                                    setShowAddStudentModal(true);
                                  }}
                                  className="btn btn-secondary"
                                  title="Edit Student"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Edit size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: TEACHERS ===================== */}
          {activeTab === 'teachers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Faculty Members & Instructors
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Manage teachers, salaries, assigned courses, ID cards & pay slips
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => exportToCSV('al_ghazi_teachers', teachers)} className="btn btn-secondary">
                    <Download size={15} />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingTeacher(null);
                      setShowAddTeacherModal(true);
                    }}
                    className="btn btn-primary"
                  >
                    <Plus size={15} />
                    <span>Add New Teacher</span>
                  </button>
                </div>
              </div>

              {/* Teachers Grid Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {teachers.map((t) => (
                  <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: '#1e3a8a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          fontWeight: 800
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{t.name}</h4>
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{t.qualification}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div><strong style={{ color: '#cbd5e1' }}>Assigned Course:</strong> {t.assignedCourses || t.subject}</div>
                      <div><strong style={{ color: '#cbd5e1' }}>Contact:</strong> {t.phone}</div>
                      <div>
                        <strong style={{ color: '#cbd5e1' }}>Monthly Honorarium / Salary:</strong>{' '}
                        <span style={{ color: '#34d399', fontWeight: 700 }}>
                          {currency} {Number(t.monthlySalary || t.salary).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #1e293b' }}>
                      <button
                        onClick={() => openPrintDocument('teacher_id_card', t)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                      >
                        <Printer size={13} />
                        <span>Print ID Card</span>
                      </button>
                      <button
                        onClick={() => openPrintDocument('teacher_salary_slip', t)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                      >
                        <FileText size={13} />
                        <span>Salary Voucher</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingTeacher(t);
                          setShowAddTeacherModal(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem' }}
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: COURSES ===================== */}
          {activeTab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Courses, Diplomas & Training Batches
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Define course durations, fee structures, syllabus outlines, and assign faculty
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setShowAddCourseModal(true);
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={15} />
                  <span>Add New Course</span>
                </button>
              </div>

              {/* Courses Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {courses.map((c) => {
                  const enrolled = students.filter((s) => s.courseId === c.id || s.courseName === c.name).length;
                  return (
                    <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>{c.code}</span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                            {c.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Instructor: <strong>{c.instructor}</strong>
                          </span>
                        </div>
                        <span className="badge badge-active">{c.status}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', backgroundColor: '#0c1424', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Duration</span>
                          <strong>{c.duration}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Total Fee</span>
                          <strong style={{ color: '#34d399' }}>{currency} {Number(c.totalFee).toLocaleString()}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Monthly Installment</span>
                          <strong>{currency} {Number(c.monthlyFee || 0).toLocaleString()}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Active Enrolled</span>
                          <strong style={{ color: '#60a5fa' }}>{enrolled} Students</strong>
                        </div>
                      </div>

                      {c.syllabus && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                          <strong style={{ color: '#cbd5e1' }}>Syllabus:</strong> {c.syllabus}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #1e293b' }}>
                        <button
                          onClick={() => {
                            setStudentCourseFilter(c.name);
                            setActiveTab('students');
                          }}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                        >
                          View {enrolled} Students
                        </button>
                        <button
                          onClick={() => {
                            setEditingCourse(c);
                            setShowAddCourseModal(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem' }}
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== TAB 5: FEE COLLECTION & DUES ===================== */}
          {activeTab === 'fees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Fee Quick Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL COLLECTED</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                    {currency} {totalFeeCollected.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL PENDING DUES</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
                    {currency} {totalOutstandingDues.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>DEFAULTERS COUNT</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                    {defaultersList.length} Students
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setPreselectedStudentForFee(null);
                      setShowCollectFeeModal(true);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                    <Plus size={16} />
                    <span>+ Collect New Fee</span>
                  </button>
                </div>
              </div>

              {/* Subtabs: Transactions History vs Defaulters */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setFeeStatusFilter('ALL')}
                      className={`btn ${feeStatusFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Receipts History ({payments.length})
                    </button>
                    <button
                      onClick={() => setFeeStatusFilter('DEFAULTERS')}
                      className={`btn ${feeStatusFilter === 'DEFAULTERS' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Defaulters & Dues ({defaultersList.length})
                    </button>
                  </div>

                  {feeStatusFilter === 'DEFAULTERS' && (
                    <button
                      onClick={() => openPrintDocument('defaulters_list', defaultersList)}
                      className="btn btn-secondary"
                    >
                      <Printer size={15} />
                      <span>Print Defaulters Statement</span>
                    </button>
                  )}
                </div>

                {feeStatusFilter === 'ALL' ? (
                  /* Payments Table */
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Receipt #</th>
                          <th>Date</th>
                          <th>Student Name & Roll</th>
                          <th>Course Name</th>
                          <th>Fee Month / Period</th>
                          <th>Method</th>
                          <th style={{ textAlign: 'right' }}>Amount Paid</th>
                          <th style={{ textAlign: 'right' }}>Balance Due</th>
                          <th style={{ textAlign: 'center' }}>Receipt & Alert</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const studentObj = students.find((s) => s.id === p.studentId || s.rollNo === p.studentRollNo);
                          return (
                            <tr key={p.id}>
                              <td style={{ fontWeight: 700, color: '#60a5fa' }}>{p.receiptNo}</td>
                              <td>{p.paymentDate}</td>
                              <td>
                                <div style={{ fontWeight: 700, color: '#f8fafc' }}>{p.studentName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.studentRollNo}</div>
                              </td>
                              <td>{p.courseName}</td>
                              <td>{p.feeMonth || 'Monthly Installment'}</td>
                              <td>
                                <span className="badge badge-neutral">{p.paymentMethod}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: '#34d399' }}>
                                {currency} {Number(p.paidAmount).toLocaleString()}
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: 700, color: Number(p.remainingDue || 0) > 0 ? '#f87171' : '#34d399' }}>
                                {currency} {Number(p.remainingDue || 0).toLocaleString()}
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                  <button
                                    onClick={() => openPrintDocument('fee_receipt', p)}
                                    className="btn btn-secondary"
                                    title="Print Fee Receipt"
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                  >
                                    <Printer size={13} />
                                    <span>Print</span>
                                  </button>
                                  {studentObj && (
                                    <button
                                      onClick={() => openFeeNotification(studentObj, p, 'payment')}
                                      className="btn btn-success"
                                      title="Send WhatsApp/SMS Alert"
                                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                    >
                                      <Send size={13} />
                                      <span>Alert</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Defaulters Table */
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll #</th>
                          <th>Student Name</th>
                          <th>Course Name</th>
                          <th>Parent WhatsApp</th>
                          <th style={{ textAlign: 'right' }}>Total Fee</th>
                          <th style={{ textAlign: 'right' }}>Paid</th>
                          <th style={{ textAlign: 'right' }}>Outstanding Dues</th>
                          <th style={{ textAlign: 'center' }}>Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaultersList.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700, color: '#60a5fa' }}>{s.rollNo}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#f8fafc' }}>{s.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Father: {s.fatherName}</div>
                            </td>
                            <td>{s.courseName}</td>
                            <td>{s.parentPhone || s.phone}</td>
                            <td style={{ textAlign: 'right' }}>{Number(s.totalFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#34d399' }}>{Number(s.paidFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#f87171' }}>
                              {currency} {Number(s.remainingFee).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => openFeeNotification(s, null, 'reminder')}
                                  className="btn btn-warning"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Send size={13} />
                                  <span>Send Reminder</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setPreselectedStudentForFee(s);
                                    setShowCollectFeeModal(true);
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <CreditCard size={13} />
                                  <span>Collect</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 6: ATTENDANCE ===================== */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Daily Attendance Marker</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Mark Present, Absent, Leave or Late for students on any date
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Attendance Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.75rem' }}
                    />
                  </div>
                  <button onClick={handleMarkAllPresent} className="btn btn-success" style={{ alignSelf: 'flex-end' }}>
                    <CheckCircle size={15} />
                    <span>Mark All Present</span>
                  </button>
                </div>
              </div>

              {/* Attendance Sheet Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll #</th>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Status Today</th>
                        <th style={{ textAlign: 'center' }}>Mark Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => {
                        const dayStatus = (attendanceRecords[attendanceDate] || {})[s.id] || 'P';
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700 }}>{s.rollNo}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#f8fafc' }}>{s.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.phone}</div>
                            </td>
                            <td>{s.courseName}</td>
                            <td>
                              <span
                                className={`badge ${
                                  dayStatus === 'P'
                                    ? 'badge-paid'
                                    : dayStatus === 'A'
                                    ? 'badge-unpaid'
                                    : dayStatus === 'L'
                                    ? 'badge-partial'
                                    : 'badge-neutral'
                                }`}
                              >
                                {dayStatus === 'P'
                                  ? 'Present'
                                  : dayStatus === 'A'
                                  ? 'Absent'
                                  : dayStatus === 'L'
                                  ? 'Leave'
                                  : 'Late'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                {[
                                  { code: 'P', label: 'Present', color: '#10b981' },
                                  { code: 'A', label: 'Absent', color: '#ef4444' },
                                  { code: 'L', label: 'Leave', color: '#f59e0b' },
                                  { code: 'T', label: 'Late', color: '#64748b' }
                                ].map((st) => (
                                  <button
                                    key={st.code}
                                    onClick={() => handleMarkAttendance(s.id, st.code)}
                                    style={{
                                      padding: '0.3rem 0.6rem',
                                      borderRadius: 4,
                                      border: dayStatus === st.code ? `2px solid ${st.color}` : '1px solid #334155',
                                      backgroundColor: dayStatus === st.code ? `${st.color}25` : 'transparent',
                                      color: dayStatus === st.code ? st.color : '#94a3b8',
                                      fontWeight: 700,
                                      fontSize: '0.75rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {st.code}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: EXAMS & RESULTS ===================== */}
          {activeTab === 'exams' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Examination Schedules & Results
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Manage mid-term & final examinations, enter marks, compute grades and print report cards
                  </p>
                </div>
                <button onClick={() => setShowAddExamModal(true)} className="btn btn-primary">
                  <Plus size={15} />
                  <span>Schedule New Exam</span>
                </button>
              </div>

              {/* Exams Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {exams.map((exam) => {
                  const resultsForThisExam = examResults.filter((r) => r.examId === exam.id);
                  return (
                    <div key={exam.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>{exam.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{exam.courseName}</span>
                        </div>
                        <span className="badge badge-active">{exam.status}</span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        <div>Date: <strong>{exam.examDate}</strong></div>
                        <div>Total Marks: <strong>{exam.totalMarks}</strong> | Passing: <strong>{exam.passingMarks}</strong></div>
                        <div>Assessed Students: <strong>{resultsForThisExam.length} evaluated</strong></div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #1e293b' }}>
                        <button
                          onClick={() => {
                            setSelectedExamForMarks(exam);
                            setShowEnterMarksModal(true);
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                        >
                          <Edit size={13} />
                          <span>Enter / Edit Marks</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Evaluated Results Table */}
              <div className="card" style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                  Recorded Result Cards & Transcripts
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll #</th>
                        <th>Student Name</th>
                        <th>Marks Obtained</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Print Result Card</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examResults.map((r) => {
                        const examObj = exams.find((e) => e.id === r.examId);
                        return (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 700 }}>{r.rollNo}</td>
                            <td style={{ fontWeight: 700, color: '#f8fafc' }}>{r.studentName}</td>
                            <td>{r.obtainedMarks} / 100</td>
                            <td style={{ fontWeight: 700 }}>{r.percentage}%</td>
                            <td style={{ fontWeight: 800, color: '#38bdf8' }}>{r.grade}</td>
                            <td>
                              <span className={`badge ${r.status === 'Pass' ? 'badge-paid' : 'badge-unpaid'}`}>
                                {r.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                  onClick={() =>
                                    openPrintDocument('exam_result_card', {
                                      ...r,
                                      examTitle: examObj?.title,
                                      courseName: examObj?.courseName
                                    })
                                  }
                                  className="btn btn-secondary"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                >
                                  <Printer size={13} />
                                  <span>Print Marksheet</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 8: EXPENSES & ACCOUNTS ===================== */}
          {activeTab === 'expenses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Financial Snapshot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL REVENUE (FEES)</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                    {currency} {totalFeeCollected.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL EXPENDITURE</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
                    {currency} {totalExpensesAmount.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>NET SURPLUS / PROFIT</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: netBalance >= 0 ? '#38bdf8' : '#f87171' }}>
                    {currency} {netBalance.toLocaleString()}
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => setShowAddExpenseModal(true)} className="btn btn-primary" style={{ width: '100%' }}>
                    <Plus size={16} />
                    <span>+ Add New Expense</span>
                  </button>
                </div>
              </div>

              {/* Expenses Table */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Operational Expense Ledger</h3>
                  <button onClick={() => exportToCSV('al_ghazi_expenses', expenses)} className="btn btn-secondary">
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Voucher #</th>
                        <th>Date</th>
                        <th>Title & Description</th>
                        <th>Category</th>
                        <th>Paid To</th>
                        <th>Method</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((e) => (
                        <tr key={e.id}>
                          <td style={{ fontWeight: 700 }}>{e.voucherNo || `EXP-${e.id}`}</td>
                          <td>{e.date}</td>
                          <td style={{ fontWeight: 600, color: '#f8fafc' }}>{e.title}</td>
                          <td>
                            <span className="badge badge-neutral">{e.category}</span>
                          </td>
                          <td>{e.paidTo}</td>
                          <td>{e.paymentMethod}</td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: '#f87171' }}>
                            {currency} {Number(e.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 9: CERTIFICATES ===================== */}
          {activeTab === 'certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    Institute Certificate Management
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Issue Course Completion, Character, Best Performer & Teacher Experience Certificates
                  </p>
                </div>
                <button onClick={() => setShowIssueCertModal(true)} className="btn btn-primary">
                  <Plus size={15} />
                  <span>Issue New Certificate</span>
                </button>
              </div>

              {/* Certificates Table */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Certificate ID</th>
                        <th>Recipient Full Name</th>
                        <th>Certificate Type</th>
                        <th>Course / Role</th>
                        <th>Grade / Distinction</th>
                        <th>Issue Date</th>
                        <th style={{ textAlign: 'center' }}>Print Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id}>
                          <td style={{ fontWeight: 800, color: '#60a5fa' }}>{cert.certId}</td>
                          <td style={{ fontWeight: 700, color: '#f8fafc' }}>{cert.recipientName}</td>
                          <td>
                            <span className="badge badge-active">{cert.type}</span>
                          </td>
                          <td>{cert.courseName}</td>
                          <td>{cert.grade}</td>
                          <td>{cert.issueDate}</td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <button
                                onClick={() => openPrintDocument('certificate', cert)}
                                className="btn btn-secondary"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <Printer size={13} />
                                <span>Print Certificate</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 10: REPORTS & ANALYTICS ===================== */}
          {activeTab === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                  Executive Reports & Analytics Center
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Export institutional statements, financial audits & enrollment summaries
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.5rem' }}>
                    Fee Collection Ledger Report
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Complete line-item history of all student fee receipts, payment methods & dates.
                  </p>
                  <button onClick={() => exportToCSV('al_ghazi_fee_collection_report', payments)} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={15} />
                    <span>Export Fee Report (CSV)</span>
                  </button>
                </div>

                <div className="card">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f87171', marginBottom: '0.5rem' }}>
                    Defaulters & Dues Statement
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    List of students with outstanding fees, course info and parent contact numbers.
                  </p>
                  <button onClick={() => exportToCSV('al_ghazi_defaulters_report', defaultersList)} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={15} />
                    <span>Export Defaulters (CSV)</span>
                  </button>
                </div>

                <div className="card">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                    Profit & Loss Statement
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Total Fee Collections minus Total Operational Expenses summary.
                  </p>
                  <button onClick={() => exportToCSV('al_ghazi_expenses_report', expenses)} className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={15} />
                    <span>Export Expenses (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 11: PUBLIC PORTAL ===================== */}
          {activeTab === 'portal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Public Hero Banner */}
              <div
                className="card"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #0b1120)',
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  border: '1px solid #3b82f6'
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#2563eb', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={36} color="#ffffff" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {settings.academyName}
                </h2>
                <p style={{ fontSize: '1rem', color: '#93c5fd', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
                  {settings.tagline} • Admissions open for {settings.academicSession}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success"
                  >
                    <Send size={16} />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a href={`tel:${settings.phoneNumber}`} className="btn btn-secondary">
                    <Phone size={16} />
                    <span>Call: {settings.phoneNumber}</span>
                  </a>
                </div>
              </div>

              {/* Certificate Online Verification Box */}
              <div className="card" style={{ backgroundColor: '#111b2e' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Official Certificate Verification System
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Employers, institutions, and students can authenticate diplomas and credentials using the official Certificate ID.
                </p>
                <form onSubmit={handleVerifyCertificate} style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AG-CERT-2026-00101"
                    value={portalCertQuery}
                    onChange={(e) => setPortalCertQuery(e.target.value)}
                    className="form-input"
                  />
                  <button type="submit" className="btn btn-primary">
                    <ShieldCheck size={16} />
                    <span>Verify</span>
                  </button>
                </form>

                {portalCertResult && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.5rem', backgroundColor: portalCertResult.found ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${portalCertResult.found ? '#10b981' : '#ef4444'}` }}>
                    {portalCertResult.found ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 800 }}>
                          <CheckCircle size={18} />
                          <span>VALID & VERIFIED CREDENTIAL</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#f8fafc', marginTop: '6px' }}>
                          Conferred upon <strong>{portalCertResult.cert.recipientName}</strong> for{' '}
                          <strong>{portalCertResult.cert.courseName}</strong> ({portalCertResult.cert.grade}).
                          Issued on {portalCertResult.cert.issueDate}.
                        </p>
                      </div>
                    ) : (
                      <div style={{ color: '#f87171', fontSize: '0.85rem' }}>
                        No certificate found matching ID: <strong>{portalCertResult.id}</strong>. Please verify the ID on your printed document.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Online Admission Inquiry Form */}
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Online Admission Inquiry Form
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Interested in joining a diploma or professional course? Submit your inquiry directly to our admission desk.
                </p>
                <form onSubmit={handleInquirySubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Course of Interest *</label>
                    <select
                      required
                      value={inquiryForm.courseInterest}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, courseInterest: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Course...</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Message / Queries</label>
                    <textarea
                      rows={2}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="form-textarea"
                    />
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary">
                      <span>Submit Inquiry</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===================== TAB 12: SETTINGS ===================== */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                    Institute Identity & Configuration
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Manage branding, colors, fee receipts, currency & database backups
                  </p>
                </div>
                <button onClick={() => setShowSetupWizard(true)} className="btn btn-primary">
                  <Settings size={16} />
                  <span>Open Setup Wizard</span>
                </button>
              </div>

              {/* Current Institute Summary Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GraduationCap size={32} color="#60a5fa" />
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>{settings.academyName}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{settings.tagline}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {settings.address}, {settings.city} • Ph: {settings.phoneNumber}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid #1e293b', paddingTop: '1rem', fontSize: '0.85rem' }}>
                  <div><strong>Academic Session:</strong> {settings.academicSession}</div>
                  <div><strong>Currency:</strong> {settings.currency} ({settings.currencySymbol})</div>
                  <div><strong>Receipt Prefix:</strong> {settings.receiptPrefix}</div>
                  <div><strong>Principal:</strong> {settings.principalName}</div>
                  <div><strong>Director:</strong> {settings.directorName}</div>
                  <div><strong>SMS Header:</strong> {settings.smsSenderName}</div>
                </div>
              </div>

              {/* Database Actions */}
              <div className="card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Data Integrity & Backup
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Save your institute records or reset sample data at any time.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setShowBackupModal(true)} className="btn btn-secondary">
                    <Download size={16} />
                    <span>Backup / Restore System</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== FORM MODALS ===================== */}

      {/* COLLECT FEE MODAL */}
      {showCollectFeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Collect Student Fee</h3>
              <button onClick={() => setShowCollectFeeModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const studentId = Number(form.studentId.value);
                const selectedStudent = students.find((s) => s.id === studentId);
                const paid = Number(form.paidAmount.value);
                const discount = Number(form.discountAmount.value || 0);
                const fine = Number(form.fineAmount.value || 0);
                const newPaid = Number(selectedStudent.paidFee || 0) + paid;
                const newRemaining = Math.max(0, Number(selectedStudent.totalFee) - newPaid - discount);

                const newReceipt = {
                  id: Date.now(),
                  receiptNo: `${settings.receiptPrefix || 'REC-2026-'}${String(settings.nextReceiptSeq || 105).padStart(5, '0')}`,
                  studentId: selectedStudent.id,
                  studentRollNo: selectedStudent.rollNo,
                  studentName: selectedStudent.name,
                  courseName: selectedStudent.courseName,
                  feeMonth: form.feeMonth.value,
                  dueDate: form.dueDate.value,
                  actualFee: Number(selectedStudent.monthlyFee || selectedStudent.totalFee),
                  discountAmount: discount,
                  fineAmount: fine,
                  paidAmount: paid,
                  remainingDue: newRemaining,
                  paymentDate: form.paymentDate.value,
                  paymentMethod: form.paymentMethod.value,
                  remarks: form.remarks.value,
                  receivedBy: form.receivedBy.value || 'Admin',
                  status: 'Paid'
                };

                setPayments([newReceipt, ...payments]);
                setStudents(
                  students.map((s) => (s.id === selectedStudent.id ? { ...s, paidFee: newPaid, remainingFee: newRemaining } : s))
                );
                setSettings({ ...settings, nextReceiptSeq: (settings.nextReceiptSeq || 105) + 1 });
                setShowCollectFeeModal(false);
                showToast(`Fee payment of ${currency} ${paid.toLocaleString()} recorded!`);

                // Open print modal & prompt WhatsApp alert
                openPrintDocument('fee_receipt', newReceipt);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Select Student *</label>
                <select
                  name="studentId"
                  required
                  defaultValue={preselectedStudentForFee?.id || ''}
                  className="form-select"
                >
                  <option value="">Choose Student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.rollNo} - {s.name} ({s.courseName} | Due: {currency} {Number(s.remainingFee).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Fee Month / Installment *</label>
                  <input type="text" name="feeMonth" required defaultValue="October 2026" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Payment Date *</label>
                  <input type="date" name="paymentDate" required defaultValue={new Date().toISOString().split('T')[0]} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Amount Paid ({currency}) *</label>
                  <input type="number" name="paidAmount" required min="1" placeholder="5000" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Discount Amount</label>
                  <input type="number" name="discountAmount" defaultValue="0" min="0" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Late Fine</label>
                  <input type="number" name="fineAmount" defaultValue="0" min="0" className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Payment Method *</label>
                  <select name="paymentMethod" required className="form-select">
                    <option value="Cash">Cash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input type="date" name="dueDate" defaultValue={new Date().toISOString().split('T')[0]} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">Received By</label>
                <input type="text" name="receivedBy" defaultValue="Admin Officer" className="form-input" />
              </div>

              <div>
                <label className="form-label">Remarks / Note</label>
                <input type="text" name="remarks" placeholder="Fee receipt notes..." className="form-input" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCollectFeeModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <Check size={16} />
                  <span>Record Payment & Print Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-wide">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                {editingStudent ? 'Edit Student Details' : 'Enroll New Student'}
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const total = Number(form.totalFee.value);
                const paid = Number(form.paidFee.value || 0);
                const discount = Number(form.discount.value || 0);
                const rem = Math.max(0, total - paid - discount);

                if (editingStudent) {
                  setStudents(
                    students.map((s) =>
                      s.id === editingStudent.id
                        ? {
                            ...s,
                            name: form.name.value,
                            fatherName: form.fatherName.value,
                            phone: form.phone.value,
                            parentPhone: form.parentPhone.value,
                            courseName: form.courseName.value,
                            totalFee: total,
                            paidFee: paid,
                            remainingFee: rem,
                            status: form.status.value,
                            city: form.city.value,
                            address: form.address.value
                          }
                        : s
                    )
                  );
                  showToast('Student details updated successfully!');
                } else {
                  const newStudent = {
                    id: Date.now(),
                    rollNo: `AG-2026-${String(students.length + 1).padStart(4, '0')}`,
                    admissionNo: `ADM-${800 + students.length + 1}`,
                    name: form.name.value,
                    fatherName: form.fatherName.value,
                    motherName: form.motherName.value || '',
                    guardianName: form.fatherName.value,
                    fatherCnic: form.fatherCnic.value || '',
                    dob: form.dob.value || '',
                    gender: form.gender.value || 'Male',
                    bloodGroup: form.bloodGroup.value || 'O+',
                    phone: form.phone.value,
                    whatsapp: form.phone.value,
                    parentPhone: form.parentPhone.value,
                    emergencyContact: form.parentPhone.value,
                    email: form.email.value || '',
                    address: form.address.value || '',
                    city: form.city.value || 'Lahore',
                    courseName: form.courseName.value,
                    batch: 'Morning Shift',
                    admissionDate: new Date().toISOString().split('T')[0],
                    monthlyFee: 5000,
                    totalFee: total,
                    discount: discount,
                    paidFee: paid,
                    remainingFee: rem,
                    status: 'Active',
                    remarks: form.remarks.value || ''
                  };
                  setStudents([newStudent, ...students]);
                  showToast(`Student ${newStudent.name} enrolled with Roll #: ${newStudent.rollNo}`);
                }
                setShowAddStudentModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Student Full Name *</label>
                  <input type="text" name="name" required defaultValue={editingStudent?.name || ''} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Father's Name *</label>
                  <input type="text" name="fatherName" required defaultValue={editingStudent?.fatherName || ''} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Mother's Name</label>
                  <input type="text" name="motherName" defaultValue={editingStudent?.motherName || ''} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Father / Guardian CNIC</label>
                  <input type="text" name="fatherCnic" defaultValue={editingStudent?.fatherCnic || ''} placeholder="35201-XXXXXXX-X" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Student Mobile *</label>
                  <input type="text" name="phone" required defaultValue={editingStudent?.phone || ''} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Parent WhatsApp (For Receipts) *</label>
                  <input type="text" name="parentPhone" required defaultValue={editingStudent?.parentPhone || ''} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Course / Program *</label>
                  <select name="courseName" required defaultValue={editingStudent?.courseName || courses[0]?.name} className="form-select">
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select name="gender" defaultValue={editingStudent?.gender || 'Male'} className="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" defaultValue={editingStudent?.dob || '2005-01-01'} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Blood Group</label>
                  <input type="text" name="bloodGroup" defaultValue={editingStudent?.bloodGroup || 'B+'} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Total Agreed Fee ({currency}) *</label>
                  <input type="number" name="totalFee" required defaultValue={editingStudent?.totalFee || 25000} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Initial Paid Fee ({currency})</label>
                  <input type="number" name="paidFee" defaultValue={editingStudent?.paidFee || 0} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Discount / Scholarship</label>
                  <input type="number" name="discount" defaultValue={editingStudent?.discount || 0} className="form-input" />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input type="text" name="city" defaultValue={editingStudent?.city || 'Lahore'} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select name="status" defaultValue={editingStudent?.status || 'Active'} className="form-select">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" name="email" defaultValue={editingStudent?.email || ''} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">Home Address</label>
                <input type="text" name="address" defaultValue={editingStudent?.address || ''} className="form-input" />
              </div>

              <div>
                <label className="form-label">Remarks / Special Notes</label>
                <input type="text" name="remarks" defaultValue={editingStudent?.remarks || ''} className="form-input" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingStudent ? 'Save Changes' : 'Enroll Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                {editingTeacher ? 'Edit Teacher Details' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => setShowAddTeacherModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                if (editingTeacher) {
                  setTeachers(
                    teachers.map((t) =>
                      t.id === editingTeacher.id
                        ? {
                            ...t,
                            name: form.name.value,
                            qualification: form.qualification.value,
                            assignedCourses: form.assignedCourses.value,
                            phone: form.phone.value,
                            monthlySalary: Number(form.monthlySalary.value)
                          }
                        : t
                    )
                  );
                  showToast('Teacher details updated!');
                } else {
                  const newTeacher = {
                    id: Date.now(),
                    teacherId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
                    name: form.name.value,
                    qualification: form.qualification.value,
                    assignedCourses: form.assignedCourses.value,
                    phone: form.phone.value,
                    monthlySalary: Number(form.monthlySalary.value),
                    joiningDate: new Date().toISOString().split('T')[0],
                    status: 'Active'
                  };
                  setTeachers([newTeacher, ...teachers]);
                  showToast(`Teacher ${newTeacher.name} added!`);
                }
                setShowAddTeacherModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Teacher Full Name *</label>
                <input type="text" name="name" required defaultValue={editingTeacher?.name || ''} className="form-input" />
              </div>
              <div>
                <label className="form-label">Qualification / Degrees *</label>
                <input type="text" name="qualification" required defaultValue={editingTeacher?.qualification || ''} placeholder="e.g. MS Computer Science" className="form-input" />
              </div>
              <div>
                <label className="form-label">Assigned Course / Subject *</label>
                <select name="assignedCourses" required defaultValue={editingTeacher?.assignedCourses || courses[0]?.name} className="form-select">
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input type="text" name="phone" required defaultValue={editingTeacher?.phone || ''} className="form-input" />
              </div>
              <div>
                <label className="form-label">Monthly Honorarium / Salary ({currency}) *</label>
                <input type="number" name="monthlySalary" required defaultValue={editingTeacher?.monthlySalary || 50000} className="form-input" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddTeacherModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Teacher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT COURSE MODAL */}
      {showAddCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                {editingCourse ? 'Edit Course' : 'Create New Course / Batch'}
              </h3>
              <button onClick={() => setShowAddCourseModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                if (editingCourse) {
                  setCourses(
                    courses.map((c) =>
                      c.id === editingCourse.id
                        ? {
                            ...c,
                            name: form.name.value,
                            code: form.code.value,
                            duration: form.duration.value,
                            totalFee: Number(form.totalFee.value),
                            monthlyFee: Number(form.monthlyFee.value),
                            instructor: form.instructor.value,
                            syllabus: form.syllabus.value
                          }
                        : c
                    )
                  );
                  showToast('Course updated successfully!');
                } else {
                  const newCourse = {
                    id: Date.now(),
                    name: form.name.value,
                    code: form.code.value,
                    duration: form.duration.value,
                    totalFee: Number(form.totalFee.value),
                    monthlyFee: Number(form.monthlyFee.value),
                    instructor: form.instructor.value,
                    syllabus: form.syllabus.value,
                    status: 'Active'
                  };
                  setCourses([...courses, newCourse]);
                  showToast(`Course ${newCourse.name} added!`);
                }
                setShowAddCourseModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Course Name *</label>
                <input type="text" name="name" required defaultValue={editingCourse?.name || ''} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Course Code *</label>
                  <input type="text" name="code" required defaultValue={editingCourse?.code || `CRS-${courses.length + 101}`} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Duration *</label>
                  <input type="text" name="duration" required defaultValue={editingCourse?.duration || '3 Months'} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Total Course Fee ({currency}) *</label>
                  <input type="number" name="totalFee" required defaultValue={editingCourse?.totalFee || 20000} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Monthly Installment ({currency})</label>
                  <input type="number" name="monthlyFee" defaultValue={editingCourse?.monthlyFee || 5000} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Course Instructor</label>
                <input type="text" name="instructor" defaultValue={editingCourse?.instructor || 'Faculty Lead'} className="form-input" />
              </div>
              <div>
                <label className="form-label">Syllabus Overview / Topics</label>
                <textarea rows={3} name="syllabus" defaultValue={editingCourse?.syllabus || ''} className="form-textarea" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddCourseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Record Operational Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newExp = {
                  id: Date.now(),
                  voucherNo: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
                  title: form.title.value,
                  category: form.category.value,
                  amount: Number(form.amount.value),
                  date: form.date.value,
                  paidTo: form.paidTo.value,
                  paymentMethod: form.paymentMethod.value
                };
                setExpenses([newExp, ...expenses]);
                setShowAddExpenseModal(false);
                showToast(`Expense of ${currency} ${newExp.amount.toLocaleString()} recorded!`);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Expense Title *</label>
                <input type="text" name="title" required placeholder="e.g. Fiber Internet Bill" className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select name="category" required className="form-select">
                    <option value="Utilities">Utilities (Electricity, Water, Gas)</option>
                    <option value="Salaries">Faculty & Staff Salaries</option>
                    <option value="Internet">Internet & Telecom</option>
                    <option value="Stationery">Stationery & Printing</option>
                    <option value="Marketing">Marketing & Ads</option>
                    <option value="Rent">Campus Rent</option>
                    <option value="Supplies">Lab Supplies</option>
                    <option value="Other">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount ({currency}) *</label>
                  <input type="number" name="amount" required min="1" className="form-input" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Payment Method *</label>
                  <select name="paymentMethod" required className="form-select">
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online / Credit Card</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Paid To (Vendor / Person) *</label>
                <input type="text" name="paidTo" required placeholder="e.g. K-Electric / Landlord" className="form-input" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  <Check size={16} />
                  <span>Record Expense</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE EXAM MODAL */}
      {showAddExamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Schedule New Examination</h3>
              <button onClick={() => setShowAddExamModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newExam = {
                  id: Date.now(),
                  title: form.title.value,
                  courseName: form.courseName.value,
                  examDate: form.examDate.value,
                  totalMarks: Number(form.totalMarks.value || 100),
                  passingMarks: Number(form.passingMarks.value || 50),
                  status: 'Scheduled'
                };
                setExams([...exams, newExam]);
                setShowAddExamModal(false);
                showToast(`Exam ${newExam.title} scheduled!`);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Exam Title *</label>
                <input type="text" name="title" required placeholder="e.g. Final Term Assessment 2026" className="form-input" />
              </div>
              <div>
                <label className="form-label">Course *</label>
                <select name="courseName" required className="form-select">
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" name="examDate" required defaultValue={new Date().toISOString().split('T')[0]} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Total Marks</label>
                  <input type="number" name="totalMarks" defaultValue="100" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Passing Marks</label>
                  <input type="number" name="passingMarks" defaultValue="50" className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddExamModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Create Exam</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENTER MARKS MODAL */}
      {showEnterMarksModal && selectedExamForMarks && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Enter Exam Marks
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {selectedExamForMarks.title} • {selectedExamForMarks.courseName}
                </p>
              </div>
              <button onClick={() => setShowEnterMarksModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const studentId = Number(form.studentId.value);
                const student = students.find((s) => s.id === studentId);
                const marks = Number(form.obtainedMarks.value);
                const total = selectedExamForMarks.totalMarks || 100;
                const pct = Math.round((marks / total) * 100);

                let grade = 'F';
                if (pct >= 85) grade = 'A+';
                else if (pct >= 75) grade = 'A';
                else if (pct >= 65) grade = 'B';
                else if (pct >= 55) grade = 'C';
                else if (pct >= 45) grade = 'D';

                const newRes = {
                  id: Date.now(),
                  examId: selectedExamForMarks.id,
                  studentId: student.id,
                  studentName: student.name,
                  rollNo: student.rollNo,
                  obtainedMarks: marks,
                  percentage: pct,
                  grade: grade,
                  status: marks >= (selectedExamForMarks.passingMarks || 50) ? 'Pass' : 'Fail',
                  remarks: form.remarks.value || 'Evaluated successfully'
                };

                setExamResults([newRes, ...examResults]);
                setShowEnterMarksModal(false);
                showToast(`Marks saved for ${student.name}: ${marks}/${total} (${grade})`);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Select Student *</label>
                <select name="studentId" required className="form-select">
                  <option value="">Choose Student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.rollNo} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Marks Obtained (Out of {selectedExamForMarks.totalMarks || 100}) *</label>
                  <input type="number" name="obtainedMarks" required min="0" max={selectedExamForMarks.totalMarks || 100} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Teacher Remarks</label>
                  <input type="text" name="remarks" placeholder="e.g. Excellent practical demo" className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEnterMarksModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Result Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE CERTIFICATE MODAL */}
      {showIssueCertModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Issue Official Certificate</h3>
              <button onClick={() => setShowIssueCertModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newCert = {
                  id: Date.now(),
                  certId: `${settings.certificatePrefix || 'AG-CERT-2026-'}${String(settings.nextCertSeq || 104).padStart(5, '0')}`,
                  recipientName: form.recipientName.value,
                  fatherName: form.fatherName.value || '',
                  type: form.type.value,
                  courseName: form.courseName.value,
                  duration: form.duration.value || 'Session 2026',
                  grade: form.grade.value || 'A+ Distinction',
                  issueDate: form.issueDate.value,
                  verified: true
                };

                setCertificates([newCert, ...certificates]);
                setSettings({ ...settings, nextCertSeq: (settings.nextCertSeq || 104) + 1 });
                setShowIssueCertModal(false);
                showToast(`Certificate issued with ID: ${newCert.certId}`);
                openPrintDocument('certificate', newCert);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Certificate Type *</label>
                <select name="type" required className="form-select">
                  <option value="Course Completion">Course Completion Certificate</option>
                  <option value="Character Certificate">Character Certificate</option>
                  <option value="Best Performer Award">Best Performer / Merit Award</option>
                  <option value="Experience Certificate">Experience Certificate (Faculty)</option>
                  <option value="Participation Certificate">Workshop Participation</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Recipient Name *</label>
                  <input type="text" name="recipientName" required placeholder="Full Name" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Father's Name</label>
                  <input type="text" name="fatherName" placeholder="Father Name" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Course / Program / Department *</label>
                <input type="text" name="courseName" required defaultValue={courses[0]?.name} className="form-input" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Duration</label>
                  <input type="text" name="duration" defaultValue="6 Months" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Grade / Distinction</label>
                  <input type="text" name="grade" defaultValue="A+ Distinction" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Issue Date</label>
                  <input type="date" name="issueDate" required defaultValue={new Date().toISOString().split('T')[0]} className="form-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowIssueCertModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Issue & Preview Print</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== SHARED DIALOG MODALS ===================== */}

      {/* Setup Wizard Modal */}
      <SetupWizardModal
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('Institute settings and branding saved successfully!');
        }}
      />

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDocConfig.type}
        data={printDocConfig.data}
        settings={settings}
      />

      {/* Fee Notification (WhatsApp/SMS) Modal */}
      <FeeNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        student={notificationConfig.student}
        payment={notificationConfig.payment}
        settings={settings}
        type={notificationConfig.type}
      />

      {/* Student Profile Dossier Modal */}
      <StudentProfileModal
        isOpen={showStudentProfileModal}
        onClose={() => setShowStudentProfileModal(false)}
        student={selectedStudentForProfile}
        payments={payments}
        settings={settings}
        onCollectFee={(student) => {
          setPreselectedStudentForFee(student);
          setShowCollectFeeModal(true);
        }}
        onPrintDocument={openPrintDocument}
      />

      {/* Backup and Restore Modal */}
      <BackupRestoreModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        allData={{
          settings,
          courses,
          students,
          teachers,
          payments,
          expenses,
          exams,
          examResults,
          certificates,
          inquiries,
          attendanceRecords
        }}
        onRestoreData={(restored) => {
          if (restored.settings) setSettings(restored.settings);
          if (restored.courses) setCourses(restored.courses);
          if (restored.students) setStudents(restored.students);
          if (restored.teachers) setTeachers(restored.teachers);
          if (restored.payments) setPayments(restored.payments);
          if (restored.expenses) setExpenses(restored.expenses);
          if (restored.exams) setExams(restored.exams);
          if (restored.examResults) setExamResults(restored.examResults);
          if (restored.certificates) setCertificates(restored.certificates);
          if (restored.inquiries) setInquiries(restored.inquiries);
          if (restored.attendanceRecords) setAttendanceRecords(restored.attendanceRecords);
          showToast('All institute data restored from backup file!');
        }}
        onResetToDemo={() => {
          setSettings(initialSettings);
          setCourses(initialCourses);
          setStudents(initialStudents);
          setTeachers(initialTeachers);
          setPayments(initialPayments);
          setExpenses(initialExpenses);
          setExams(initialExams);
          setExamResults(initialExamResults);
          setCertificates(initialCertificates);
          setInquiries(initialInquiries);
          setAttendanceRecords({});
          showToast('Reset to demo sample data completed.');
        }}
      />
    </div>
  );
}
