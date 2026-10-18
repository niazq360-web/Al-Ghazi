import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  CalendarCheck,
  Award,
  Receipt,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Send,
  Eye,
  Check,
  X,
  Menu,
  Globe,
  FileText,
  ShieldCheck,
  RefreshCw,
  QrCode
} from 'lucide-react';

import OfficialSeal from './components/OfficialSeal';
import AlGhaziQrCode from './components/AlGhaziQrCode';
import ImageUploadField from './components/ImageUploadField';
import FinancialTrackingChart from './components/FinancialTrackingChart';
import PrintDocumentModal from './components/PrintDocumentModal';
import FeeNotificationModal from './components/FeeNotificationModal';
import BackupRestoreModal from './components/BackupRestoreModal';
import SetupWizardModal from './components/SetupWizardModal';
import StudentProfileModal from './components/StudentProfileModal';

// Initial Demo Courses
const initialCourses = [
  {
    id: 1,
    name: 'Graphic Designing & UI/UX',
    code: 'GD-101',
    duration: '3 Months',
    totalFee: 15000,
    monthlyFee: 5000,
    instructor: 'Sir Hamza Tariq',
    syllabus: 'Adobe Photoshop, Illustrator, Figma, Brand Identity, Social Media Posts',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Full Stack Web Development',
    code: 'WD-201',
    duration: '6 Months',
    totalFee: 30000,
    monthlyFee: 5000,
    instructor: 'Engr. Niaz Qasim',
    syllabus: 'HTML5, CSS3, JavaScript, React.js, Node.js, Express, MongoDB, Git',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Digital Marketing & SEO Mastery',
    code: 'DM-301',
    duration: '3 Months',
    totalFee: 18000,
    monthlyFee: 6000,
    instructor: 'Ma\'am Ayesha Khan',
    syllabus: 'Social Media Marketing, Google Ads, Meta Ads, Technical SEO, Content Strategy',
    status: 'Active'
  },
  {
    id: 4,
    name: 'CIT & Office Management',
    code: 'CIT-401',
    duration: '2 Months',
    totalFee: 10000,
    monthlyFee: 5000,
    instructor: 'Sir Usman Ali',
    syllabus: 'MS Word, Excel Advance, PowerPoint, InPage Urdu, Typing Speed, Windows',
    status: 'Active'
  }
];

// Initial Settings
const initialSettings = {
  academyName: 'AL GHAZI DIGITAL INSTITUTE',
  tagline: 'Excellence in IT, Design & Digital Technology',
  registrationNumber: 'AG-REG-2026-904',
  website: 'http://alghazidigital.site.je/',
  phone: '0300-1234567',
  email: 'info@alghazidigital.site.je',
  address: 'Civil Lines, Near Judicial Complex, Gujranwala Road',
  city: 'Gujranwala',
  principalName: 'Prof. Muhammad Niaz',
  directorName: 'Engr. Qasim Ali',
  academicSession: 'Session 2026-2027',
  currencySymbol: 'Rs.',
  receiptPrefix: 'REC-2026-',
  nextReceiptSeq: 101,
  logoUrl: '',
  officialSealUrl: ''
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'students' | 'teachers' | 'courses' | 'fees' | 'attendance' | 'expenses' | 'certificates'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Persistent State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.website || parsed.website.includes('github.io')) {
          parsed.website = 'http://alghazidigital.site.je/';
        }
        return parsed;
      }
    } catch (e) {}
    return initialSettings;
  });

  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_courses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialCourses;
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [teachers, setTeachers] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_teachers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_payments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_expenses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_attendance');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const [certificates, setCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_certificates');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('ag_settings', JSON.stringify(settings));
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
    localStorage.setItem('ag_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('ag_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Modals State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState('');

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherPhoto, setTeacherPhoto] = useState('');

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // FEE COLLECTION STATE & MODALS
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [preselectedStudentForFee, setPreselectedStudentForFee] = useState(null);

  // EDIT FEE PAYMENT MODAL (For fixing mistakes in fees)
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // EDIT EXPENSE MODAL
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // COURSE-WISE STUDENTS MODAL
  const [selectedCourseForStudentsModal, setSelectedCourseForStudentsModal] = useState(null);

  // STUDENT PROFILE MODAL
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);
  const [showStudentProfileModal, setShowStudentProfileModal] = useState(false);

  // DOCUMENT PRINTING MODAL
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDocConfig, setPrintDocConfig] = useState({ type: 'certificate', data: {} });

  // PARENTS NOTIFICATION MODAL (SMS / WhatsApp)
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({ student: null, payment: null, type: 'payment' });

  // BACKUP & RESTORE MODAL
  const [showBackupModal, setShowBackupModal] = useState(false);

  // SETUP WIZARD MODAL
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // FILTERS STATE
  const [globalSearch, setGlobalSearch] = useState('');
  const [studentCourseFilter, setStudentCourseFilter] = useState('ALL');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');

  const [feeCourseFilter, setFeeCourseFilter] = useState('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState('ALL'); // 'ALL' | 'DEFAULTERS'

  const [attendanceCourseFilter, setAttendanceCourseFilter] = useState('ALL');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  const currency = settings.currencySymbol || 'Rs.';

  // Open Document Helper
  const openPrintDocument = (type, data) => {
    setPrintDocConfig({ type, data });
    setShowPrintModal(true);
  };

  // Open Parents Notification Helper
  const openFeeNotification = (student, payment, type = 'payment') => {
    setNotificationConfig({ student, payment, type });
    setShowNotificationModal(true);
  };

  // Open Edit Payment Helper
  const openEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowEditPaymentModal(true);
  };

  // Open Edit Expense Helper
  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowAddExpenseModal(true);
  };

  // Open Student Modal Helper
  const openStudentModal = (student = null) => {
    setEditingStudent(student);
    setStudentPhoto(student?.photoUrl || '');
    setShowAddStudentModal(true);
  };

  // Open Teacher Modal Helper
  const openTeacherModal = (teacher = null) => {
    setEditingTeacher(teacher);
    setTeacherPhoto(teacher?.photoUrl || '');
    setShowAddTeacherModal(true);
  };

  // Open Course Modal Helper
  const openCourseModal = (course = null) => {
    setEditingCourse(course);
    setShowAddCourseModal(true);
  };

  // ==============================================================
  // 1. CRITICAL FEE COLLECTION HANDLER (WITH PARENTS SMS TRIGGER)
  // ==============================================================
  const handleCollectFeeSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const selectedStudentId = form.studentId.value;
    const paidAmount = Number(form.paidAmount.value) || 0;
    const discountAmount = Number(form.discountAmount.value) || 0;
    const feeMonth = form.feeMonth?.value || 'Monthly Installment';
    const paymentMethod = form.paymentMethod?.value || 'Cash';
    const paymentDate = form.paymentDate?.value || new Date().toISOString().split('T')[0];
    const remarks = form.remarks?.value || 'Tuition Fee Payment';

    if (!selectedStudentId) {
      alert('Please select a student.');
      return;
    }
    if (paidAmount <= 0) {
      alert('Please enter a valid payment amount greater than 0.');
      return;
    }

    // Match student flexibly by ID or Roll Number
    const targetStudentIndex = students.findIndex(
      (s) => String(s.id) === String(selectedStudentId) || s.rollNo === selectedStudentId
    );

    if (targetStudentIndex === -1) {
      alert('Selected student not found in records.');
      return;
    }

    const currentStudent = students[targetStudentIndex];
    const currentPaid = Number(currentStudent.paidFee || 0);
    const totalFee = Number(currentStudent.totalFee || 0);

    const newPaidFee = currentPaid + paidAmount;
    const newRemainingDue = Math.max(0, totalFee - newPaidFee - discountAmount);

    // 1. Update Student Record
    const updatedStudent = {
      ...currentStudent,
      paidFee: newPaidFee,
      remainingFee: newRemainingDue,
      discount: (Number(currentStudent.discount || 0)) + discountAmount
    };

    const updatedStudentsList = [...students];
    updatedStudentsList[targetStudentIndex] = updatedStudent;
    setStudents(updatedStudentsList);
    localStorage.setItem('ag_students', JSON.stringify(updatedStudentsList));

    // 2. Generate Official Receipt
    const receiptSeq = (settings.nextReceiptSeq || 101);
    const receiptNo = `${settings.receiptPrefix || 'REC-2026-'}${String(receiptSeq).padStart(5, '0')}`;

    const newPaymentRecord = {
      id: Date.now(),
      receiptNo,
      studentId: updatedStudent.id,
      studentRollNo: updatedStudent.rollNo,
      studentName: updatedStudent.name,
      fatherName: updatedStudent.fatherName,
      courseName: updatedStudent.courseName,
      paidAmount: paidAmount,
      totalFee: totalFee,
      discount: discountAmount,
      remainingDue: newRemainingDue,
      feeMonth,
      paymentMethod,
      paymentDate,
      remarks
    };

    const updatedPaymentsList = [newPaymentRecord, ...payments];
    setPayments(updatedPaymentsList);
    localStorage.setItem('ag_payments', JSON.stringify(updatedPaymentsList));

    // Update settings sequence
    setSettings((prev) => ({
      ...prev,
      nextReceiptSeq: receiptSeq + 1
    }));

    setShowCollectFeeModal(false);
    setPreselectedStudentForFee(null);

    showToast(`Fee of ${currency} ${paidAmount.toLocaleString()} received for ${updatedStudent.name}! Opening Parents Alert...`);

    // 3. AUTOMATICALLY OPEN PARENTS SMS / WHATSAPP ALERT!
    setTimeout(() => {
      openFeeNotification(updatedStudent, newPaymentRecord, 'payment');
    }, 400);
  };

  // ==============================================================
  // 2. SAVE EDITED FEE PAYMENT (FIX MISTAKES IN FEE RECORDS)
  // ==============================================================
  const handleSaveEditedPayment = (e) => {
    e.preventDefault();
    if (!editingPayment) return;
    const form = e.target;
    const newPaidAmount = Number(form.paidAmount.value) || 0;
    const newPaymentDate = form.paymentDate.value;
    const newFeeMonth = form.feeMonth.value;
    const newPaymentMethod = form.paymentMethod.value;
    const newRemarks = form.remarks.value;

    const oldAmount = Number(editingPayment.paidAmount) || 0;
    const diff = newPaidAmount - oldAmount;

    // 1. Adjust Student balance
    const updatedStudentsList = students.map((s) => {
      if (s.id === editingPayment.studentId || s.rollNo === editingPayment.studentRollNo) {
        const curPaid = Number(s.paidFee) || 0;
        const total = Number(s.totalFee) || 0;
        const adjPaid = curPaid + diff;
        const adjRemaining = Math.max(0, total - adjPaid - (Number(s.discount) || 0));
        return {
          ...s,
          paidFee: adjPaid,
          remainingFee: adjRemaining
        };
      }
      return s;
    });

    setStudents(updatedStudentsList);
    localStorage.setItem('ag_students', JSON.stringify(updatedStudentsList));

    // 2. Update Payment record
    const updatedPaymentsList = payments.map((p) => {
      if (p.id === editingPayment.id) {
        return {
          ...p,
          paidAmount: newPaidAmount,
          paymentDate: newPaymentDate,
          feeMonth: newFeeMonth,
          paymentMethod: newPaymentMethod,
          remarks: newRemarks,
          remainingDue: Math.max(0, (Number(p.remainingDue) || 0) - diff)
        };
      }
      return p;
    });

    setPayments(updatedPaymentsList);
    localStorage.setItem('ag_payments', JSON.stringify(updatedPaymentsList));

    setShowEditPaymentModal(false);
    setEditingPayment(null);
    showToast('Payment record updated and student dues balance adjusted successfully!');
  };

  // Delete Payment & revert balance
  const handleDeletePayment = (payment) => {
    if (window.confirm(`Are you sure you want to delete receipt #${payment.receiptNo} of ${currency} ${payment.paidAmount}? This will revert student dues.`)) {
      const amount = Number(payment.paidAmount) || 0;
      // Revert student balance
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === payment.studentId || s.rollNo === payment.studentRollNo) {
            const curPaid = Number(s.paidFee) || 0;
            const total = Number(s.totalFee) || 0;
            const adjPaid = Math.max(0, curPaid - amount);
            const adjRemaining = Math.max(0, total - adjPaid - (Number(s.discount) || 0));
            return {
              ...s,
              paidFee: adjPaid,
              remainingFee: adjRemaining
            };
          }
          return s;
        })
      );
      setPayments((prev) => prev.filter((p) => p.id !== payment.id));
      showToast(`Receipt #${payment.receiptNo} deleted and student balance restored.`);
    }
  };

  // ==============================================================
  // 3. EXPENSE HANDLER (ADD & EDIT)
  // ==============================================================
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const category = form.category.value;
    const amount = Number(form.amount.value) || 0;
    const date = form.date.value;
    const paidTo = form.paidTo.value;
    const paymentMethod = form.paymentMethod.value;

    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === editingExpense.id
            ? { ...exp, title, category, amount, date, paidTo, paymentMethod }
            : exp
        )
      );
      showToast('Expense updated successfully!');
    } else {
      const newExp = {
        id: Date.now(),
        voucherNo: `EXP-${String(expenses.length + 101).padStart(4, '0')}`,
        title,
        category,
        amount,
        date,
        paidTo,
        paymentMethod
      };
      setExpenses([newExp, ...expenses]);
      showToast(`Expense of ${currency} ${amount.toLocaleString()} recorded!`);
    }

    setShowAddExpenseModal(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (exp) => {
    if (window.confirm(`Are you sure you want to delete expense "${exp.title}" (${currency} ${exp.amount})?`)) {
      setExpenses((prev) => prev.filter((e) => e.id !== exp.id));
      showToast(`Expense deleted.`);
    }
  };

  // ==============================================================
  // 4. ATTENDANCE HANDLERS (BY COURSE)
  // ==============================================================
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

  const handleMarkBatchPresent = () => {
    const targetStudents = students.filter(
      (s) => attendanceCourseFilter === 'ALL' || s.courseName === attendanceCourseFilter
    );
    setAttendanceRecords((prev) => {
      const dayRecords = { ...(prev[attendanceDate] || {}) };
      targetStudents.forEach((s) => {
        dayRecords[s.id] = 'P';
      });
      return {
        ...prev,
        [attendanceDate]: dayRecords
      };
    });
    showToast(`Marked ${targetStudents.length} students as Present for ${attendanceDate}!`);
  };

  // ==============================================================
  // METRICS & COMPUTATIONS
  // ==============================================================
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;

  const totalFeeCollected = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0);
  }, [payments]);

  const totalOutstandingDues = useMemo(() => {
    return students.reduce((sum, s) => sum + (Number(s.remainingFee) || 0), 0);
  }, [students]);

  const totalExpensesAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netBalance = totalFeeCollected - totalExpensesAmount;

  const defaultersList = useMemo(() => {
    return students.filter((s) => Number(s.remainingFee) > 0);
  }, [students]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !globalSearch ||
        s.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (s.phone && s.phone.includes(globalSearch)) ||
        (s.parentPhone && s.parentPhone.includes(globalSearch));

      const matchCourse =
        studentCourseFilter === 'ALL' || s.courseName === studentCourseFilter;

      const matchStatus =
        studentStatusFilter === 'ALL' || s.status === studentStatusFilter;

      return matchSearch && matchCourse && matchStatus;
    });
  }, [students, globalSearch, studentCourseFilter, studentStatusFilter]);

  // Export CSV Helper
  const exportToCSV = (filename, dataRows) => {
    if (!dataRows || !dataRows.length) {
      alert('No records available to export.');
      return;
    }
    const headers = Object.keys(dataRows[0]).join(',');
    const rows = dataRows.map((r) =>
      Object.values(r)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f7f4' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          className="animate-fade-in"
        >
          <CheckCircle size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e8e6df',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50
        }}
      >
        {/* Institute Brand Header */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '1px solid #e8e6df',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#faf9f5'
          }}
        >
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          ) : (
            <OfficialSeal size={42} />
          )}
          <div style={{ overflow: 'hidden' }}>
            <h1
              style={{
                fontSize: '0.925rem',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.2,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                margin: 0
              }}
            >
              {settings.academyName || 'AL GHAZI INSTITUTE'}
            </h1>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
              Management System
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '0.75rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'students', label: 'Students Directory', icon: Users, badge: totalStudents },
            { id: 'courses', label: 'Courses & Admissions', icon: BookOpen, badge: courses.length },
            { id: 'fees', label: 'Fee Collection & Dues', icon: CreditCard, badge: defaultersList.length ? `${defaultersList.length} Dues` : undefined },
            { id: 'attendance', label: 'Attendance (By Course)', icon: CalendarCheck },
            { id: 'teachers', label: 'Faculty & Teachers', icon: GraduationCap, badge: teachers.length },
            { id: 'expenses', label: 'Operating Expenses', icon: Receipt },
            { id: 'certificates', label: 'Issued Certificates', icon: Award, badge: certificates.length }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: active ? '#2563eb' : 'transparent',
                  color: active ? '#ffffff' : '#334155',
                  fontWeight: active ? 700 : 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#edebe3',
                      color: active ? '#ffffff' : '#475569',
                      fontWeight: 700
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #e8e6df', backgroundColor: '#faf9f5' }}>
          <button
            onClick={() => setShowSetupWizard(true)}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', gap: '5px' }}
          >
            <Settings size={14} />
            <span>Institute Branding & Wizard</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN CANVAS ===================== */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '60px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e8e6df',
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
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' ? 'Institute Executive Dashboard' : activeTab.replace('-', ' ')}
            </h2>
          </div>

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
              onClick={() => openStudentModal(null)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            >
              <Plus size={15} />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => setShowBackupModal(true)}
              className="btn btn-secondary"
              title="Backup Database"
              style={{ padding: '0.45rem', fontSize: '0.8rem' }}
            >
              <Download size={15} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '1.5rem', flex: 1 }}>
          {/* ============================================================== */}
          {/* TAB 1: DASHBOARD (HALF-WHITE IVORY WITH TRACKING CHART)        */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Top KPI Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL STUDENTS</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                    {totalStudents}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>{activeStudents} Currently Active</span>
                </div>

                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL FEES REVENUE</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                    {currency} {totalFeeCollected.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{payments.length} verified transactions</span>
                </div>

                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>OUTSTANDING DUES</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                    {currency} {totalOutstandingDues.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>{defaultersList.length} students pending</span>
                </div>

                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>NET CASH BALANCE</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: netBalance >= 0 ? '#0284c7' : '#dc2626', marginTop: '4px' }}>
                    {currency} {netBalance.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Exp: {currency} {totalExpensesAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* BEHTREEN FINANCIAL TRACKING CHART (FEES VS EXPENSES) */}
              <FinancialTrackingChart
                payments={payments}
                expenses={expenses}
                students={students}
                courses={courses}
                currency={currency}
              />

              {/* Course-Wise Admitted Students Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Course-Wise Admitted Students
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Click any course to view all admitted students
                      </span>
                    </div>
                    <button onClick={() => setActiveTab('courses')} className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}>
                      All Courses
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {courses.map((c) => {
                      const enrolledStudents = students.filter((s) => s.courseName === c.name || s.courseId === c.id);
                      const count = enrolledStudents.length;
                      const percentage = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
                      return (
                        <div
                          key={c.id}
                          style={{
                            padding: '10px 12px',
                            backgroundColor: '#faf9f5',
                            border: '1px solid #e8e6df',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div>
                              <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{c.name}</strong>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '6px' }}>({c.code})</span>
                            </div>
                            <button
                              onClick={() => setSelectedCourseForStudentsModal(c)}
                              className="btn btn-secondary"
                              style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', gap: '3px' }}
                            >
                              <Users size={12} />
                              <span>{count} Students</span>
                            </button>
                          </div>
                          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0', overflow: 'hidden', margin: '6px 0 4px 0' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                            <span>Instructor: <strong>{c.instructor}</strong></span>
                            <span>{percentage}% of total admissions</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Fee Payments (with Quick Edit & SMS Alert) */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Recent Fee Collections
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Receipts with quick edit and parents SMS alerts
                      </span>
                    </div>
                    <button onClick={() => setActiveTab('fees')} className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}>
                      Fee Ledger
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {payments.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                        No fee payments recorded yet. Click "Collect Fee" above to start.
                      </div>
                    ) : (
                      payments.slice(0, 5).map((p) => {
                        const studentObj = students.find((s) => s.id === p.studentId || s.rollNo === p.studentRollNo);
                        return (
                          <div
                            key={p.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.65rem 0.85rem',
                              backgroundColor: '#faf9f5',
                              border: '1px solid #e8e6df',
                              borderRadius: '0.5rem'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{p.studentName}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                {p.receiptNo} • {p.courseName} • {p.paymentDate}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#16a34a' }}>
                                  {currency} {Number(p.paidAmount).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{p.paymentMethod}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => openEditPayment(p)}
                                  className="btn btn-secondary"
                                  title="Edit Payment (Fix Mistake)"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                >
                                  <Edit size={12} />
                                </button>
                                {studentObj && (
                                  <button
                                    onClick={() => openFeeNotification(studentObj, p, 'payment')}
                                    className="btn btn-success"
                                    title="Send Parents WhatsApp/SMS Alert"
                                    style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                  >
                                    <Send size={12} />
                                  </button>
                                )}
                                <button
                                  onClick={() => openPrintDocument('fee_receipt', p)}
                                  className="btn btn-secondary"
                                  title="Print Official Fee Receipt"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                >
                                  <Printer size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: STUDENTS DIRECTORY                                      */}
          {/* ============================================================== */}
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
                  <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search name, roll, phone..."
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
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => exportToCSV('al_ghazi_students', filteredStudents)} className="btn btn-secondary">
                    <Download size={15} />
                    <span>Export CSV</span>
                  </button>
                  <button onClick={() => openStudentModal(null)} className="btn btn-primary">
                    <Plus size={15} />
                    <span>+ Enroll New Student</span>
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
                        <th style={{ textAlign: 'right' }}>Remaining Due</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No student records found. Click "+ Enroll New Student" to register students.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 800, color: '#2563eb' }}>{s.rollNo}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                {s.photoUrl ? (
                                  <img src={s.photoUrl} alt={s.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #2563eb' }} />
                                ) : (
                                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                    {s.name?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>S/D of {s.fatherName}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{s.courseName}</div>
                            </td>
                            <td>{s.parentPhone || s.phone}</td>
                            <td style={{ textAlign: 'right' }}>{Number(s.totalFee || 0).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>
                              {Number(s.paidFee || 0).toLocaleString()}
                            </td>
                            <td
                              style={{
                                textAlign: 'right',
                                fontWeight: 800,
                                color: Number(s.remainingFee) > 0 ? '#dc2626' : '#16a34a'
                              }}
                            >
                              {currency} {Number(s.remainingFee || 0).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => {
                                    setSelectedStudentForProfile(s);
                                    setShowStudentProfileModal(true);
                                  }}
                                  className="btn btn-secondary"
                                  title="View Profile"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Eye size={13} />
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
                                  <CreditCard size={13} />
                                  <span>Collect</span>
                                </button>
                                <button
                                  onClick={() => openPrintDocument('student_id_card', s)}
                                  className="btn btn-secondary"
                                  title="Print ID Card"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Printer size={13} />
                                </button>
                                <button
                                  onClick={() => openStudentModal(s)}
                                  className="btn btn-secondary"
                                  title="Edit Student"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                  <Edit size={13} />
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

          {/* ============================================================== */}
          {/* TAB 3: COURSES & ADMISSIONS                                    */}
          {/* ============================================================== */}
          {activeTab === 'courses' && (
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Academic Programs & Courses</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Manage curriculum, batch timings, fees, and view students admitted in each course
                  </p>
                </div>
                <button onClick={() => openCourseModal(null)} className="btn btn-primary">
                  <Plus size={15} />
                  <span>+ Add New Course</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {courses.map((c) => {
                  const enrolledStudents = students.filter((s) => s.courseName === c.name || s.courseId === c.id);
                  const enrolled = enrolledStudents.length;
                  return (
                    <div key={c.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 800 }}>{c.code}</span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{c.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Instructor: {c.instructor}</span>
                        </div>
                        <span className="badge badge-active">Active</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px solid #edebe3', borderBottom: '1px solid #edebe3', fontSize: '0.8rem' }}>
                        <div>Duration: <strong>{c.duration}</strong></div>
                        <div>Total Fee: <strong style={{ color: '#16a34a' }}>{currency} {Number(c.totalFee).toLocaleString()}</strong></div>
                        <div>Monthly: <strong>{currency} {Number(c.monthlyFee || 0).toLocaleString()}</strong></div>
                        <div>Admitted: <strong style={{ color: '#2563eb' }}>{enrolled} Students</strong></div>
                      </div>

                      {/* Course Admitted Students Quick List */}
                      <div style={{ backgroundColor: '#faf9f5', border: '1px solid #e8e6df', borderRadius: '6px', padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>
                            Admitted Students ({enrolled}):
                          </span>
                          {enrolled > 0 && (
                            <button
                              onClick={() => setSelectedCourseForStudentsModal(c)}
                              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                            >
                              View All Details →
                            </button>
                          )}
                        </div>
                        {enrolled === 0 ? (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            No students admitted to this course yet.
                          </span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {enrolledStudents.slice(0, 3).map((st) => (
                              <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.73rem' }}>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>• {st.name} ({st.rollNo})</span>
                                <span style={{ color: Number(st.remainingFee || 0) > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                                  {Number(st.remainingFee || 0) > 0 ? `Due ${currency}${Number(st.remainingFee).toLocaleString()}` : 'Paid'}
                                </span>
                              </div>
                            ))}
                            {enrolled > 3 && (
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                +{enrolled - 3} more students admitted...
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #e8e6df' }}>
                        <button
                          onClick={() => setSelectedCourseForStudentsModal(c)}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', gap: '4px' }}
                        >
                          <Users size={13} />
                          <span>View {enrolled} Students</span>
                        </button>
                        <button
                          onClick={() => openCourseModal(c)}
                          className="btn btn-secondary"
                          title="Edit Course"
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

          {/* ============================================================== */}
          {/* TAB 4: FEE COLLECTION & DUES                                  */}
          {/* ============================================================== */}
          {activeTab === 'fees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Fee Quick Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL COLLECTED</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
                    {currency} {totalFeeCollected.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL PENDING DUES</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>
                    {currency} {totalOutstandingDues.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>DEFAULTERS COUNT</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
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

              {/* Subtabs & Course-Wise Fee Filter */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

                  {/* Course Filter for Fees */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                      Course Filter:
                    </span>
                    <select
                      value={feeCourseFilter}
                      onChange={(e) => setFeeCourseFilter(e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <option value="ALL">All Courses ({payments.length} Payments)</option>
                      {courses.map((c) => {
                        const count = payments.filter((p) => p.courseName === c.name).length;
                        return (
                          <option key={c.id} value={c.name}>
                            {c.name} ({count} receipts)
                          </option>
                        );
                      })}
                    </select>
                  </div>
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
                          <th>Fee Month</th>
                          <th>Method</th>
                          <th style={{ textAlign: 'right' }}>Amount Paid</th>
                          <th style={{ textAlign: 'right' }}>Balance Due</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments
                          .filter((p) => feeCourseFilter === 'ALL' || p.courseName === feeCourseFilter)
                          .map((p) => {
                            const studentObj = students.find((s) => s.id === p.studentId || s.rollNo === p.studentRollNo);
                            return (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 800, color: '#2563eb' }}>{p.receiptNo}</td>
                                <td>{p.paymentDate}</td>
                                <td>
                                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.studentName}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.studentRollNo}</div>
                                </td>
                                <td><span style={{ fontWeight: 600 }}>{p.courseName}</span></td>
                                <td>{p.feeMonth || 'Monthly'}</td>
                                <td><span className="badge badge-neutral">{p.paymentMethod}</span></td>
                                <td style={{ textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
                                  {currency} {Number(p.paidAmount).toLocaleString()}
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 700, color: Number(p.remainingDue || 0) > 0 ? '#dc2626' : '#16a34a' }}>
                                  {currency} {Number(p.remainingDue || 0).toLocaleString()}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                                    <button
                                      onClick={() => openEditPayment(p)}
                                      className="btn btn-secondary"
                                      title="Edit Fee Payment (Fix Any Mistake)"
                                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '3px' }}
                                    >
                                      <Edit size={13} />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => openPrintDocument('fee_receipt', p)}
                                      className="btn btn-secondary"
                                      title="Print Fee Receipt"
                                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                    >
                                      <Printer size={13} />
                                    </button>
                                    {studentObj && (
                                      <button
                                        onClick={() => openFeeNotification(studentObj, p, 'payment')}
                                        className="btn btn-success"
                                        title="Send WhatsApp/SMS Alert to Parent"
                                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '3px' }}
                                      >
                                        <Send size={13} />
                                        <span>Alert</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeletePayment(p)}
                                      className="btn btn-secondary"
                                      title="Delete Payment (Reverts Balance)"
                                      style={{ padding: '0.3rem 0.45rem', fontSize: '0.75rem', color: '#ef4444' }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
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
                          <th>Course</th>
                          <th>Parent WhatsApp</th>
                          <th style={{ textAlign: 'right' }}>Total Fee</th>
                          <th style={{ textAlign: 'right' }}>Paid</th>
                          <th style={{ textAlign: 'right' }}>Pending Dues</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaultersList.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 800, color: '#dc2626' }}>{s.rollNo}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>S/D of {s.fatherName}</div>
                            </td>
                            <td>{s.courseName}</td>
                            <td>{s.parentPhone || s.phone}</td>
                            <td style={{ textAlign: 'right' }}>{Number(s.totalFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#16a34a' }}>{Number(s.paidFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#dc2626', fontWeight: 800, fontSize: '0.95rem' }}>
                              {currency} {Number(s.remainingFee).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => openFeeNotification(s, null, 'due_reminder')}
                                  className="btn btn-danger"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '3px' }}
                                >
                                  <Send size={13} />
                                  <span>Send Due Reminder</span>
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

          {/* ============================================================== */}
          {/* TAB 5: ATTENDANCE (BY COURSE)                                  */}
          {/* ============================================================== */}
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Daily Attendance Marker</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Mark Present, Absent, Leave or Late by Course Batch
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <label className="form-label">Course Batch</label>
                    <select
                      value={attendanceCourseFilter}
                      onChange={(e) => setAttendanceCourseFilter(e.target.value)}
                      className="form-select"
                      style={{ padding: '0.4rem 0.75rem', minWidth: '180px' }}
                    >
                      <option value="ALL">All Courses ({students.length} Students)</option>
                      {courses.map((c) => {
                        const count = students.filter((s) => s.courseName === c.name || s.courseId === c.id).length;
                        return (
                          <option key={c.id} value={c.name}>
                            {c.name} ({count} Students)
                          </option>
                        );
                      })}
                    </select>
                  </div>
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
                  <button onClick={handleMarkBatchPresent} className="btn btn-success" style={{ alignSelf: 'flex-end' }}>
                    <CheckCircle size={15} />
                    <span>Mark Batch Present</span>
                  </button>
                </div>
              </div>

              {/* Attendance Sheet */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll #</th>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Status on {attendanceDate}</th>
                        <th style={{ textAlign: 'center' }}>Mark Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter((s) => attendanceCourseFilter === 'ALL' || s.courseName === attendanceCourseFilter)
                        .map((s) => {
                          const dayStatus = (attendanceRecords[attendanceDate] || {})[s.id] || 'P';
                          return (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 800 }}>{s.rollNo}</td>
                              <td>
                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.phone}</div>
                              </td>
                              <td>{s.courseName}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    dayStatus === 'P'
                                      ? 'badge-present'
                                      : dayStatus === 'A'
                                      ? 'badge-absent'
                                      : dayStatus === 'L'
                                      ? 'badge-warning'
                                      : 'badge-neutral'
                                  }`}
                                >
                                  {dayStatus === 'P' ? 'Present' : dayStatus === 'A' ? 'Absent' : dayStatus === 'L' ? 'Leave' : 'Late'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                  {['P', 'A', 'L'].map((st) => (
                                    <button
                                      key={st}
                                      onClick={() => handleMarkAttendance(s.id, st)}
                                      className={`btn ${dayStatus === st ? (st === 'P' ? 'btn-success' : st === 'A' ? 'btn-danger' : 'btn-secondary') : 'btn-secondary'}`}
                                      style={{
                                        padding: '0.25rem 0.55rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        backgroundColor: dayStatus === st ? undefined : '#faf9f5'
                                      }}
                                    >
                                      {st}
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

          {/* ============================================================== */}
          {/* TAB 6: FACULTY & TEACHERS                                      */}
          {/* ============================================================== */}
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Faculty & Instructors</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Manage teachers, salaries, assigned courses, ID cards & pay vouchers
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openTeacherModal(null)} className="btn btn-primary">
                    <Plus size={15} />
                    <span>+ Add New Faculty Member</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {teachers.length === 0 ? (
                  <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No teachers registered yet. Click "+ Add New Faculty Member" to add instructors.
                  </div>
                ) : (
                  teachers.map((t) => (
                    <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {t.photoUrl ? (
                          <img src={t.photoUrl} alt={t.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #16a34a' }} />
                        ) : (
                          <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>{t.qualification || 'Instructor'}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>ID: {t.teacherId}</span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', padding: '0.5rem 0', borderTop: '1px solid #edebe3', borderBottom: '1px solid #edebe3' }}>
                        <div>Assigned: <strong>{t.assignedCourses}</strong></div>
                        <div>Monthly Salary: <strong style={{ color: '#16a34a' }}>{currency} {Number(t.monthlySalary || 0).toLocaleString()}</strong></div>
                        <div>Phone: <strong>{t.phone}</strong></div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => openPrintDocument('teacher_id_card', t)}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: '0.35rem', fontSize: '0.72rem' }}
                        >
                          <Printer size={13} />
                          <span>Print ID Card</span>
                        </button>
                        <button
                          onClick={() => openPrintDocument('teacher_form', t)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem', fontSize: '0.72rem' }}
                        >
                          <Printer size={13} />
                          <span>Form</span>
                        </button>
                        <button
                          onClick={() => openTeacherModal(t)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem' }}
                        >
                          <Edit size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: OPERATING EXPENSES                                      */}
          {/* ============================================================== */}
          {activeTab === 'expenses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL REVENUE (FEES)</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
                    {currency} {totalFeeCollected.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TOTAL EXPENDITURE</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>
                    {currency} {totalExpensesAmount.toLocaleString()}
                  </div>
                </div>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>NET SURPLUS</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: netBalance >= 0 ? '#0284c7' : '#dc2626' }}>
                    {currency} {netBalance.toLocaleString()}
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button onClick={() => openEditExpense(null)} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                    <Plus size={16} />
                    <span>+ Add New Expense</span>
                  </button>
                </div>
              </div>

              {/* Expenses Ledger Table */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Expense Ledger & Vouchers</h3>
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
                        <th>Title</th>
                        <th>Category</th>
                        <th>Paid To</th>
                        <th>Method</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No expenses recorded yet. Click "+ Add New Expense" to record rent, salaries, utilities, marketing, etc.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((e) => (
                          <tr key={e.id}>
                            <td style={{ fontWeight: 800 }}>{e.voucherNo || `EXP-${e.id}`}</td>
                            <td>{e.date}</td>
                            <td style={{ fontWeight: 700, color: '#0f172a' }}>{e.title}</td>
                            <td><span className="badge badge-neutral">{e.category}</span></td>
                            <td>{e.paidTo}</td>
                            <td>{e.paymentMethod}</td>
                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>
                              {currency} {Number(e.amount).toLocaleString()}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => openEditExpense(e)}
                                  className="btn btn-secondary"
                                  title="Edit Expense"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteExpense(e)}
                                  className="btn btn-secondary"
                                  title="Delete Expense"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem', color: '#ef4444' }}
                                >
                                  <Trash2 size={12} />
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

          {/* ============================================================== */}
          {/* TAB 8: ISSUED CERTIFICATES (4 CORNERS, OFFICIAL SEAL & QR)     */}
          {/* ============================================================== */}
          {activeTab === 'certificates' && (
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    Authentic Verifiable Certificate Generator
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Issued with 4 luxury baroque corners, official metallic gold institute seal & verification QR code
                  </p>
                </div>
                <button
                  onClick={() => {
                    const sample = {
                      certificateNo: `AG-CERT-2026-${String(certificates.length + 1).padStart(3, '0')}`,
                      recipientName: students[0]?.name || 'Muhammad Usman Ali',
                      fatherName: students[0]?.fatherName || 'Muhammad Tariq',
                      rollNo: students[0]?.rollNo || 'AG-2026-0001',
                      courseName: students[0]?.courseName || 'Full Stack Web Development',
                      grade: 'A+ Distinction',
                      duration: 'Session 2026-2027',
                      issueDate: new Date().toISOString().split('T')[0]
                    };
                    openPrintDocument('certificate', sample);
                  }}
                  className="btn btn-gold"
                >
                  <Award size={16} />
                  <span>Generate New Certificate</span>
                </button>
              </div>

              {/* Issue certificate for students */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll #</th>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Fee Clearance</th>
                        <th style={{ textAlign: 'center' }}>Issue & Print Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 800 }}>{s.rollNo}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{s.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>S/D of {s.fatherName}</div>
                          </td>
                          <td>{s.courseName}</td>
                          <td>
                            <span className={`badge ${Number(s.remainingFee) === 0 ? 'badge-paid' : 'badge-unpaid'}`}>
                              {Number(s.remainingFee) === 0 ? 'Fee Fully Cleared' : `Dues: ${currency}${s.remainingFee}`}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                const certData = {
                                  certificateNo: `AG-CERT-2026-${s.rollNo.replace(/[^0-9]/g, '').slice(-3) || '001'}`,
                                  recipientName: s.name,
                                  fatherName: s.fatherName,
                                  rollNo: s.rollNo,
                                  courseName: s.courseName,
                                  grade: 'A+ Distinction',
                                  duration: settings.academicSession || 'Session 2026-2027',
                                  issueDate: new Date().toISOString().split('T')[0]
                                };
                                openPrintDocument('certificate', certData);
                              }}
                              className="btn btn-gold"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              <Award size={14} />
                              <span>Print / Download Certificate</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL: COLLECT STUDENT FEE (FIXED & FULLY FUNCTIONAL)          */}
      {/* ============================================================== */}
      {showCollectFeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Modal Header with Institute Logo / Official Seal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                ) : (
                  <OfficialSeal size={38} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Receive & Collect Student Fee
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {settings.academyName} • Accounts & Cashier Desk
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCollectFeeModal(false);
                  setPreselectedStudentForFee(null);
                }}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCollectFeeSubmit}
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
                  <option value="">-- Choose Student by Name & Roll --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) - Course: {s.courseName} | Due: {currency} {Number(s.remainingFee || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Amount Paid ({currency}) *</label>
                  <input
                    type="number"
                    name="paidAmount"
                    required
                    min="1"
                    placeholder="e.g. 5000"
                    defaultValue={preselectedStudentForFee?.monthlyFee || 5000}
                    className="form-input"
                    style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}
                  />
                </div>
                <div>
                  <label className="form-label">Concession / Discount ({currency})</label>
                  <input
                    type="number"
                    name="discountAmount"
                    defaultValue="0"
                    min="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Fee Month / Installment Period</label>
                  <select name="feeMonth" className="form-select">
                    {['Admission Installment', 'October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027', 'Full Course Clearance'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    name="paymentDate"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Payment Mode</label>
                  <select name="paymentMethod" className="form-select">
                    <option value="Cash">Cash (Campus Counter)</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer / Online</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Remarks / Memo</label>
                  <input
                    type="text"
                    name="remarks"
                    placeholder="e.g. Tuition fee received in cash"
                    className="form-input"
                  />
                </div>
              </div>

              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.78rem',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} />
                <span>Submitting will instantly update student balance and prompt WhatsApp/SMS alert to Parents!</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCollectFeeModal(false);
                    setPreselectedStudentForFee(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" style={{ padding: '0.6rem 1.25rem', gap: '6px' }}>
                  <Check size={16} />
                  <span>Receive Payment & Alert Parents</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT FEE PAYMENT (FIX MISTAKES IN FEE RECORDS)           */}
      {/* ============================================================== */}
      {showEditPaymentModal && editingPayment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <OfficialSeal size={36} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Edit Fee Receipt #{editingPayment.receiptNo}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Correct any typo or mistake in student fee payment
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditPaymentModal(false);
                  setEditingPayment(null);
                }}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveEditedPayment}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ padding: '8px 12px', backgroundColor: '#f8f7f4', borderRadius: '6px', fontSize: '0.8rem' }}>
                <strong>Student:</strong> {editingPayment.studentName} ({editingPayment.studentRollNo}) • Course: {editingPayment.courseName}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Corrected Paid Amount ({currency}) *</label>
                  <input
                    type="number"
                    name="paidAmount"
                    required
                    min="1"
                    defaultValue={editingPayment.paidAmount}
                    className="form-input"
                    style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a' }}
                  />
                </div>
                <div>
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    name="paymentDate"
                    defaultValue={editingPayment.paymentDate}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Fee Month / Installment</label>
                  <input
                    type="text"
                    name="feeMonth"
                    defaultValue={editingPayment.feeMonth || 'Monthly'}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Payment Method</label>
                  <select name="paymentMethod" defaultValue={editingPayment.paymentMethod || 'Cash'} className="form-select">
                    <option value="Cash">Cash</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Correction Note / Reason</label>
                <input
                  type="text"
                  name="remarks"
                  defaultValue={editingPayment.remarks || 'Amount corrected'}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPaymentModal(false);
                    setEditingPayment(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: COURSE ADMITTED STUDENTS VIEW (COURSE KE HISAB SE)      */}
      {/* ============================================================== */}
      {selectedCourseForStudentsModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-wide">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                ) : (
                  <OfficialSeal size={38} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedCourseForStudentsModal.name} - Admitted Students
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Code: {selectedCourseForStudentsModal.code} • Total Fee: {currency}{Number(selectedCourseForStudentsModal.totalFee).toLocaleString()} • Instructor: {selectedCourseForStudentsModal.instructor}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseForStudentsModal(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {(() => {
                const enrolled = students.filter(
                  (s) => s.courseName === selectedCourseForStudentsModal.name || s.courseId === selectedCourseForStudentsModal.id
                );
                if (enrolled.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      <Users size={36} color="#cbd5e1" style={{ margin: '0 auto 8px auto' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No students currently admitted in this course.</p>
                      <button
                        onClick={() => {
                          setSelectedCourseForStudentsModal(null);
                          openStudentModal(null);
                        }}
                        className="btn btn-primary"
                        style={{ marginTop: '12px' }}
                      >
                        <Plus size={15} />
                        <span>Enroll Student in this Course</span>
                      </button>
                    </div>
                  );
                }
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        Total Enrolled Students: {enrolled.length}
                      </span>
                      <button
                        onClick={() => exportToCSV(`${selectedCourseForStudentsModal.name}_students`, enrolled)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Download size={13} />
                        <span>Export Course Roster</span>
                      </button>
                    </div>

                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Roll #</th>
                          <th>Student Name & Father</th>
                          <th>Parent WhatsApp</th>
                          <th style={{ textAlign: 'right' }}>Total Fee</th>
                          <th style={{ textAlign: 'right' }}>Paid</th>
                          <th style={{ textAlign: 'right' }}>Remaining Due</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolled.map((s) => (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 800, color: '#2563eb' }}>{s.rollNo}</td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>S/D of {s.fatherName}</div>
                            </td>
                            <td>{s.parentPhone || s.phone}</td>
                            <td style={{ textAlign: 'right' }}>{currency} {Number(s.totalFee).toLocaleString()}</td>
                            <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>
                              {currency} {Number(s.paidFee).toLocaleString()}
                            </td>
                            <td
                              style={{
                                textAlign: 'right',
                                fontWeight: 800,
                                color: Number(s.remainingFee) > 0 ? '#dc2626' : '#16a34a'
                              }}
                            >
                              {currency} {Number(s.remainingFee).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => {
                                    setSelectedCourseForStudentsModal(null);
                                    setPreselectedStudentForFee(s);
                                    setShowCollectFeeModal(true);
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                >
                                  <CreditCard size={12} />
                                  <span>Collect</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCourseForStudentsModal(null);
                                    openPrintDocument('student_id_card', s);
                                  }}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                                >
                                  <Printer size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT STUDENT (WITH IMAGE UPLOAD & LOGO)           */}
      {/* ============================================================== */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-wide">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                ) : (
                  <OfficialSeal size={38} />
                )}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {editingStudent ? 'Edit Student Details' : 'Student Admission Form'}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {settings.academyName} • Registry & Admissions Desk
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const total = Number(form.totalFee.value) || 0;
                const paid = Number(form.paidFee.value) || 0;
                const discount = Number(form.discount?.value) || 0;
                const remaining = Math.max(0, total - paid - discount);

                if (editingStudent) {
                  setStudents((prev) =>
                    prev.map((s) =>
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
                            remainingFee: remaining,
                            photoUrl: studentPhoto || s.photoUrl || ''
                          }
                        : s
                    )
                  );
                  showToast('Student details updated successfully!');
                } else {
                  const rollNo = `AG-2026-${String(students.length + 1).padStart(4, '0')}`;
                  const newStudent = {
                    id: Date.now(),
                    rollNo,
                    name: form.name.value,
                    fatherName: form.fatherName.value,
                    phone: form.phone.value,
                    parentPhone: form.parentPhone.value,
                    courseName: form.courseName.value,
                    totalFee: total,
                    paidFee: paid,
                    discount,
                    remainingFee: remaining,
                    admissionDate: new Date().toISOString().split('T')[0],
                    status: 'Active',
                    photoUrl: studentPhoto || ''
                  };
                  setStudents([newStudent, ...students]);
                  showToast(`Student ${newStudent.name} enrolled with Roll #: ${newStudent.rollNo}`);
                }
                setShowAddStudentModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* IMAGE UPLOAD OPTION FOR STUDENT */}
              <ImageUploadField
                value={studentPhoto}
                onChange={setStudentPhoto}
                label="Student Passport-Size Photo"
                placeholderText="Upload Student Photo"
                subText="Will appear on Admission Form, Student ID Card & Certificate"
                shape="circle"
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Student Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingStudent?.name || ''}
                    placeholder="e.g. Muhammad Ali"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Father / Guardian Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    required
                    defaultValue={editingStudent?.fatherName || ''}
                    placeholder="e.g. Muhammad Tariq"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Student Phone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingStudent?.phone || ''}
                    placeholder="0300-1234567"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Parent WhatsApp (For Fee SMS Alerts) *</label>
                  <input
                    type="text"
                    name="parentPhone"
                    required
                    defaultValue={editingStudent?.parentPhone || ''}
                    placeholder="0300-7654321"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Select Course of Admission *</label>
                <select
                  name="courseName"
                  required
                  defaultValue={editingStudent?.courseName || courses[0]?.name}
                  className="form-select"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({currency} {Number(c.totalFee).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Total Course Fee ({currency}) *</label>
                  <input
                    type="number"
                    name="totalFee"
                    required
                    defaultValue={editingStudent?.totalFee || 20000}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Initial Fee Paid ({currency})</label>
                  <input
                    type="number"
                    name="paidFee"
                    defaultValue={editingStudent?.paidFee || 0}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Discount / Scholarship ({currency})</label>
                  <input
                    type="number"
                    name="discount"
                    defaultValue={editingStudent?.discount || 0}
                    className="form-input"
                  />
                </div>
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

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT TEACHER (WITH IMAGE UPLOAD & LOGO)           */}
      {/* ============================================================== */}
      {showAddTeacherModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <OfficialSeal size={38} />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {editingTeacher ? 'Edit Teacher Details' : 'Faculty Registration Form'}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {settings.academyName} • HR & Faculty Records
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAddTeacherModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                if (editingTeacher) {
                  setTeachers((prev) =>
                    prev.map((t) =>
                      t.id === editingTeacher.id
                        ? {
                            ...t,
                            name: form.name.value,
                            qualification: form.qualification.value,
                            assignedCourses: form.assignedCourses.value,
                            phone: form.phone.value,
                            monthlySalary: Number(form.monthlySalary.value) || 0,
                            photoUrl: teacherPhoto || t.photoUrl || ''
                          }
                        : t
                    )
                  );
                  showToast('Teacher details updated!');
                } else {
                  const newT = {
                    id: Date.now(),
                    teacherId: `TCH-${String(teachers.length + 101).padStart(3, '0')}`,
                    name: form.name.value,
                    qualification: form.qualification.value,
                    assignedCourses: form.assignedCourses.value,
                    phone: form.phone.value,
                    monthlySalary: Number(form.monthlySalary.value) || 0,
                    photoUrl: teacherPhoto || ''
                  };
                  setTeachers([newT, ...teachers]);
                  showToast(`Teacher ${newT.name} added!`);
                }
                setShowAddTeacherModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <ImageUploadField
                value={teacherPhoto}
                onChange={setTeacherPhoto}
                label="Teacher / Faculty Photo"
                placeholderText="Upload Instructor Headshot"
                subText="Will appear on Teacher ID Card & Salary Voucher"
                shape="circle"
              />

              <div>
                <label className="form-label">Teacher Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingTeacher?.name || ''}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Qualification / Title</label>
                  <input
                    type="text"
                    name="qualification"
                    defaultValue={editingTeacher?.qualification || 'BS Computer Science'}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    defaultValue={editingTeacher?.phone || '0300-1234567'}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Assigned Courses</label>
                <input
                  type="text"
                  name="assignedCourses"
                  defaultValue={editingTeacher?.assignedCourses || courses[0]?.name}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Monthly Honorarium / Salary ({currency})</label>
                <input
                  type="number"
                  name="monthlySalary"
                  defaultValue={editingTeacher?.monthlySalary || 45000}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddTeacherModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingTeacher ? 'Save Changes' : 'Register Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT COURSE                                       */}
      {/* ============================================================== */}
      {showAddCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingCourse ? 'Edit Course Program' : 'Add New Academic Course'}
              </h3>
              <button onClick={() => setShowAddCourseModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                if (editingCourse) {
                  setCourses((prev) =>
                    prev.map((c) =>
                      c.id === editingCourse.id
                        ? {
                            ...c,
                            name: form.name.value,
                            code: form.code.value,
                            duration: form.duration.value,
                            totalFee: Number(form.totalFee.value) || 0,
                            monthlyFee: Number(form.monthlyFee.value) || 0,
                            instructor: form.instructor.value
                          }
                        : c
                    )
                  );
                  showToast('Course program updated!');
                } else {
                  const newC = {
                    id: Date.now(),
                    name: form.name.value,
                    code: form.code.value,
                    duration: form.duration.value,
                    totalFee: Number(form.totalFee.value) || 0,
                    monthlyFee: Number(form.monthlyFee.value) || 0,
                    instructor: form.instructor.value,
                    status: 'Active'
                  };
                  setCourses([...courses, newC]);
                  showToast(`Course ${newC.name} added!`);
                }
                setShowAddCourseModal(false);
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCourse?.name || ''}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Course Code *</label>
                  <input
                    type="text"
                    name="code"
                    required
                    defaultValue={editingCourse?.code || `CRS-${courses.length + 101}`}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    required
                    defaultValue={editingCourse?.duration || '3 Months'}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Total Course Fee ({currency}) *</label>
                  <input
                    type="number"
                    name="totalFee"
                    required
                    defaultValue={editingCourse?.totalFee || 20000}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Monthly Installment ({currency})</label>
                  <input
                    type="number"
                    name="monthlyFee"
                    defaultValue={editingCourse?.monthlyFee || 5000}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Course Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  defaultValue={editingCourse?.instructor || 'Faculty Lead'}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddCourseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingCourse ? 'Save Changes' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT EXPENSE                                      */}
      {/* ============================================================== */}
      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8e6df',
                backgroundColor: '#faf9f5'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingExpense ? 'Edit Expense Record' : 'Record Operational Expense'}
              </h3>
              <button onClick={() => setShowAddExpenseModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleExpenseSubmit}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label className="form-label">Expense Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingExpense?.title || ''}
                  placeholder="e.g. Fiber Internet Bill"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Category *</label>
                  <select name="category" defaultValue={editingExpense?.category || 'Utilities'} className="form-select">
                    <option value="Salaries">Staff / Faculty Salaries</option>
                    <option value="Utilities">Electricity & Generator</option>
                    <option value="Internet">Fiber Internet / Tech</option>
                    <option value="Rent">Campus Building Rent</option>
                    <option value="Marketing">Social Media & Marketing</option>
                    <option value="Stationery">Stationery & Printing</option>
                    <option value="Refreshment">Refreshment & Tea</option>
                    <option value="Maintenance">Lab & AC Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Amount ({currency}) *</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    defaultValue={editingExpense?.amount || ''}
                    className="form-input"
                    style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label className="form-label">Expense Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingExpense?.date || new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Paid To (Vendor / Person)</label>
                  <input
                    type="text"
                    name="paidTo"
                    defaultValue={editingExpense?.paidTo || 'Vendor'}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Payment Method</label>
                <select name="paymentMethod" defaultValue={editingExpense?.paymentMethod || 'Cash'} className="form-select">
                  <option value="Cash">Cash</option>
                  <option value="Online">Online Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingExpense ? 'Save Changes' : 'Record Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: STUDENT PROFILE VIEW                                    */}
      {/* ============================================================== */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={showStudentProfileModal}
        onClose={() => setShowStudentProfileModal(false)}
        payments={payments}
        currency={currency}
        onPrintDocument={openPrintDocument}
        onCollectFee={(st) => {
          setShowStudentProfileModal(false);
          setPreselectedStudentForFee(st);
          setShowCollectFeeModal(true);
        }}
      />

      {/* ============================================================== */}
      {/* MODAL: PRINT ALL OFFICIAL DOCUMENTS                            */}
      {/* ============================================================== */}
      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDocConfig.type}
        data={printDocConfig.data}
        settings={settings}
        currency={currency}
      />

      {/* ============================================================== */}
      {/* MODAL: PARENTS SMS / WHATSAPP FEE NOTIFICATIONS                */}
      {/* ============================================================== */}
      <FeeNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        student={notificationConfig.student}
        payment={notificationConfig.payment}
        settings={settings}
        currency={currency}
      />

      {/* ============================================================== */}
      {/* MODAL: BACKUP & RESTORE DATABASE                               */}
      {/* ============================================================== */}
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
          attendanceRecords,
          certificates
        }}
        onRestore={(data) => {
          if (data.settings) setSettings(data.settings);
          if (data.courses) setCourses(data.courses);
          if (data.students) setStudents(data.students);
          if (data.teachers) setTeachers(data.teachers);
          if (data.payments) setPayments(data.payments);
          if (data.expenses) setExpenses(data.expenses);
          if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
          if (data.certificates) setCertificates(data.certificates);
          showToast('Database restored successfully!');
        }}
      />

      {/* ============================================================== */}
      {/* MODAL: INSTITUTE SETTINGS & BRANDING WIZARD                    */}
      {/* ============================================================== */}
      <SetupWizardModal
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        settings={settings}
        onSave={(updated) => {
          setSettings(updated);
          showToast('Institute settings saved!');
        }}
      />
    </div>
  );
}
