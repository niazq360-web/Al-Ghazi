import React, { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import {
  initialSettings,
  initialCourses,
  initialStudents,
  initialPayments,
  initialExpenses,
  initialTeachers
} from './data/mockData';

export default function App() {
  // LocalStorage state management
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ag_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('ag_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('ag_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  // Modals
  const [showCollectFeeModal, setShowCollectFeeModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ag_settings', JSON.stringify(settings));
    localStorage.setItem('ag_courses', JSON.stringify(courses));
    localStorage.setItem('ag_students', JSON.stringify(students));
    localStorage.setItem('ag_payments', JSON.stringify(payments));
    localStorage.setItem('ag_expenses', JSON.stringify(expenses));
    localStorage.setItem('ag_teachers', JSON.stringify(teachers));
  }, [settings, courses, students, payments, expenses, teachers]);

  // Financial Computations
  const totalStudents = students.length;
  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.paidAmount || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const netBalance = totalRevenue - totalExpenses;
  const totalPendingDues = students.reduce((acc, s) => acc + Number(s.remainingFee || 0), 0);

  // Fee Collection Form State
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    amount: '',
    method: 'Cash',
    remarks: 'Monthly installment'
  });

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    fatherName: '',
    phone: '',
    courseId: '',
    totalFee: '',
    advanceFee: '0',
    gender: 'Male',
    city: 'Karachi'
  });

  // Course Form State
  const [courseForm, setCourseForm] = useState({
    name: '',
    duration: '3 Months',
    totalFee: '15000',
    instructor: 'Al Ghazi Faculty',
    timings: '10:00 AM - 12:00 PM'
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Utilities',
    amount: '',
    paidTo: '',
    paymentMethod: 'Cash'
  });

  // Handlers
  const handleCollectFee = (e) => {
    e.preventDefault();
    const student = students.find((s) => s.id === Number(feeForm.studentId));
    if (!student) return;

    const paidAmt = Number(feeForm.amount);
    if (paidAmt <= 0) return;

    const receiptNo = `${settings.receiptPrefix}${String(settings.nextReceiptSeq).padStart(5, '0')}`;
    const newPayment = {
      id: Date.now(),
      receiptNo,
      studentId: student.id,
      studentRollNo: student.rollNo,
      studentName: student.name,
      courseName: student.courseName,
      paidAmount: paidAmt,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: feeForm.method,
      remarks: feeForm.remarks,
      receivedBy: 'Admin'
    };

    // Update student fee status
    const updatedStudents = students.map((s) => {
      if (s.id === student.id) {
        const newPaid = s.paidFee + paidAmt;
        const newRemaining = Math.max(0, s.totalFee - newPaid);
        return { ...s, paidFee: newPaid, remainingFee: newRemaining };
      }
      return s;
    });

    setStudents(updatedStudents);
    setPayments([newPayment, ...payments]);
    setSettings({ ...settings, nextReceiptSeq: settings.nextReceiptSeq + 1 });
    setShowCollectFeeModal(false);
    setActiveReceipt(newPayment);
    setFeeForm({ studentId: '', amount: '', method: 'Cash', remarks: 'Monthly installment' });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === Number(studentForm.courseId));
    if (!course) return;

    const totalFee = Number(studentForm.totalFee || course.totalFee);
    const advance = Number(studentForm.advanceFee || 0);
    const remaining = Math.max(0, totalFee - advance);
    const nextSeq = students.length + 1;
    const rollNo = `AG-2026-${String(nextSeq).padStart(4, '0')}`;

    const newStudent = {
      id: Date.now(),
      rollNo,
      name: studentForm.name,
      fatherName: studentForm.fatherName,
      phone: studentForm.phone,
      parentPhone: studentForm.phone,
      email: `${studentForm.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      courseId: course.id,
      courseName: course.name,
      batch: course.batch || 'Batch-2026-A',
      admissionDate: new Date().toISOString().split('T')[0],
      totalFee,
      paidFee: advance,
      remainingFee: remaining,
      status: 'Active',
      gender: studentForm.gender,
      city: studentForm.city
    };

    setStudents([newStudent, ...students]);

    // If advance was paid, record receipt
    if (advance > 0) {
      const receiptNo = `${settings.receiptPrefix}${String(settings.nextReceiptSeq).padStart(5, '0')}`;
      const newPayment = {
        id: Date.now() + 1,
        receiptNo,
        studentId: newStudent.id,
        studentRollNo: rollNo,
        studentName: newStudent.name,
        courseName: course.name,
        paidAmount: advance,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        remarks: 'Admission advance payment',
        receivedBy: 'Admin'
      };
      setPayments([newPayment, ...payments]);
      setSettings((prev) => ({ ...prev, nextReceiptSeq: prev.nextReceiptSeq + 1 }));
    }

    setShowAddStudentModal(false);
    setStudentForm({
      name: '',
      fatherName: '',
      phone: '',
      courseId: '',
      totalFee: '',
      advanceFee: '0',
      gender: 'Male',
      city: 'Karachi'
    });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const newCourse = {
      id: Date.now(),
      name: courseForm.name,
      code: `CRS-${courses.length + 101}`,
      duration: courseForm.duration,
      totalFee: Number(courseForm.totalFee),
      monthlyFee: Math.round(Number(courseForm.totalFee) / 3),
      instructor: courseForm.instructor,
      timings: courseForm.timings,
      batch: `Batch-2026-${String.fromCharCode(65 + courses.length)}`,
      studentsCount: 0,
      status: 'Active'
    };
    setCourses([...courses, newCourse]);
    setShowAddCourseModal(false);
    setCourseForm({
      name: '',
      duration: '3 Months',
      totalFee: '15000',
      instructor: 'Al Ghazi Faculty',
      timings: '10:00 AM - 12:00 PM'
    });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      paidTo: expenseForm.paidTo,
      paymentMethod: expenseForm.paymentMethod,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddExpenseModal(false);
    setExpenseForm({
      title: '',
      category: 'Utilities',
      amount: '',
      paidTo: '',
      paymentMethod: 'Cash'
    });
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchesCourse = filterCourse === 'All' || s.courseName === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#111827',
          borderRight: '1px solid #1f2937',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40
        }}
      >
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
                Al Ghazi
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Digital Institute</span>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'fees', label: 'Fee Collection', icon: CreditCard },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'courses', label: 'Courses & Batches', icon: BookOpen },
            { id: 'teachers', label: 'Faculty & Staff', icon: UserCheck },
            { id: 'expenses', label: 'Expenses', icon: DollarSign },
            { id: 'certificates', label: 'Certificates', icon: Award },
            { id: 'portal', label: 'Public Portal', icon: Globe },
            { id: 'settings', label: 'Settings', icon: Settings }
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
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: active ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: active ? '#60a5fa' : '#94a3b8',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>v2.4.0 GitHub Pages</span>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Live
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#111827',
            borderBottom: '1px solid #1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>• {settings.tagline}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setShowCollectFeeModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <CreditCard size={16} /> Collect Fee
            </button>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <Plus size={16} /> Add Student
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div style={{ padding: '1.5rem', flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Enrolled</span>
                    <Users size={18} color="#2563eb" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{totalStudents}</div>
                  <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Active Academy Learners</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Total Fee Collected</span>
                    <TrendingUp size={18} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>
                    {settings.currencySymbol} {totalRevenue.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{payments.length} Verified Receipts</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Pending Fee Dues</span>
                    <Clock size={18} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>
                    {settings.currencySymbol} {totalPendingDues.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Receivable this term</span>
                </div>

                <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Active Courses</span>
                    <BookOpen size={18} color="#a855f7" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>{courses.length}</div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full-Stack, AI, Design</span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
                    Institute Overview
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Welcome to <strong>{settings.academyName}</strong> cloud management portal. All student admissions, course fees, thermal receipts, and certificates are managed seamlessly with GitHub Pages automated static hosting.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setShowCollectFeeModal(true)} className="btn btn-primary">
                      <CreditCard size={16} /> Collect Fee Now
                    </button>
                    <button onClick={() => setActiveTab('students')} className="btn btn-secondary">
                      <Users size={16} /> View Students
                    </button>
                    <button onClick={() => setActiveTab('portal')} className="btn btn-secondary">
                      <Globe size={16} /> Public Website
                    </button>
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Recent Receipts</h3>
                    <button onClick={() => setActiveTab('fees')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer' }}>
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {payments.slice(0, 4).map((pay) => (
                      <div
                        key={pay.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.65rem',
                          background: '#131c2e',
                          borderRadius: '0.5rem',
                          border: '1px solid #1f2937'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{pay.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{pay.receiptNo} • {pay.paymentMethod}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.85rem' }}>
                            +{settings.currencySymbol} {pay.paidAmount.toLocaleString()}
                          </div>
                          <button
                            onClick={() => setActiveReceipt(pay)}
                            style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.75rem', cursor: 'pointer' }}
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

          {/* 2. STUDENTS MANAGEMENT */}
          {activeTab === 'students' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                    <input
                      type="text"
                      placeholder="Search by name, roll no, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                        backgroundColor: '#131c2e',
                        border: '1px solid #2e3a52',
                        borderRadius: '0.5rem',
                        color: '#f8fafc',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    style={{
                      padding: '0.6rem 1rem',
                      backgroundColor: '#131c2e',
                      border: '1px solid #2e3a52',
                      borderRadius: '0.5rem',
                      color: '#f8fafc',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="All">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button onClick={() => setShowAddStudentModal(true)} className="btn btn-primary">
                  <Plus size={16} /> New Admission
                </button>
              </div>

              {/* Students Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: '#131c2e', borderBottom: '1px solid #2e3a52', color: '#94a3b8' }}>
                      <tr>
                        <th style={{ padding: '0.85rem 1rem' }}>Roll No</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Student & Father</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Course & Batch</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Fee Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Phone</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((st) => (
                        <tr key={st.id} style={{ borderBottom: '1px solid #1f2937' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#60a5fa' }}>{st.rollNo}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>{st.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>S/D of {st.fatherName}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ color: '#f8fafc' }}>{st.courseName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.batch}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {st.remainingFee === 0 ? (
                              <span className="badge badge-paid">Fully Paid</span>
                            ) : st.paidFee > 0 ? (
                              <span className="badge badge-partial">
                                Due: {settings.currencySymbol} {st.remainingFee.toLocaleString()}
                              </span>
                            ) : (
                              <span className="badge badge-unpaid">
                                Unpaid: {settings.currencySymbol} {st.remainingFee.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{st.phone}</td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setFeeForm({ studentId: String(st.id), amount: String(st.remainingFee || 5000), method: 'Cash', remarks: 'Fee payment' });
                                setShowCollectFeeModal(true);
                              }}
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                            >
                              Collect
                            </button>
                            <button
                              onClick={() => setActiveCertificate({ student: st, courseName: st.courseName })}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Cert
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

          {/* 3. FEE COLLECTION & RECEIPTS */}
          {activeTab === 'fees' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Fee Ledger & Receipts</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>All generated computer receipts and payment records</p>
                </div>
                <button onClick={() => setShowCollectFeeModal(true)} className="btn btn-primary">
                  <CreditCard size={16} /> Collect New Fee
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ backgroundColor: '#131c2e', borderBottom: '1px solid #2e3a52', color: '#94a3b8' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Receipt #</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Student & Roll No</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Course</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Slip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#10b981' }}>{p.receiptNo}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{p.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.studentRollNo}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{p.courseName}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{p.paymentDate}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className="badge" style={{ background: '#1e293b', color: '#e2e8f0' }}>{p.paymentMethod}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#10b981' }}>
                          {settings.currencySymbol} {p.paidAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setActiveReceipt(p)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            <Printer size={14} /> Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ATTENDANCE REGISTER */}
          {activeTab === 'attendance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Daily Attendance Register</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Mark and monitor daily classroom presence</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#131c2e',
                      border: '1px solid #2e3a52',
                      borderRadius: '0.5rem',
                      color: '#f8fafc'
                    }}
                  />
                </div>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ backgroundColor: '#131c2e', borderBottom: '1px solid #2e3a52', color: '#94a3b8' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Roll No</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Student Name</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Course</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st.id} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '0.85rem 1rem', color: '#60a5fa', fontWeight: 600 }}>{st.rollNo}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f8fafc' }}>{st.name}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{st.courseName}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-success"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Present
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Late
                            </button>
                            <button
                              className="btn btn-danger"
                              style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. COURSES & BATCHES */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Offered Programs & Batches</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Institute curriculum, pricing, and instructors</p>
                </div>
                <button onClick={() => setShowAddCourseModal(true)} className="btn btn-primary">
                  <Plus size={16} /> New Course
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {courses.map((crs) => (
                  <div key={crs.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-active">{crs.code}</span>
                      <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>{crs.duration}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>{crs.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div>Instructor: <strong style={{ color: '#e2e8f0' }}>{crs.instructor}</strong></div>
                      <div>Timings: <span style={{ color: '#60a5fa' }}>{crs.timings}</span></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #1f2937' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Fee</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                          {settings.currencySymbol} {crs.totalFee.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setStudentForm((prev) => ({ ...prev, courseId: String(crs.id) }));
                          setShowAddStudentModal(true);
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Enroll Student
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. EXPENSES */}
          {activeTab === 'expenses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Operating Expenses</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Log and track institute utility and salary expenditures</p>
                </div>
                <button onClick={() => setShowAddExpenseModal(true)} className="btn btn-primary">
                  <Plus size={16} /> Add Expense
                </button>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead style={{ backgroundColor: '#131c2e', borderBottom: '1px solid #2e3a52', color: '#94a3b8' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Title & Description</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Paid To</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id} style={{ borderBottom: '1px solid #1f2937' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f8fafc' }}>{exp.title}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className="badge" style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}>{exp.category}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{exp.paidTo}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{exp.date}</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#ef4444' }}>
                          -{settings.currencySymbol} {exp.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>Student Certificates</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Issue official institute course completion certificates</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {students.map((st) => (
                  <div key={st.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>{st.rollNo}</span>
                      <Award size={20} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{st.name}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{st.courseName}</p>
                    <button
                      onClick={() => setActiveCertificate({ student: st, courseName: st.courseName })}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Award size={16} /> View & Print Certificate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. PUBLIC PORTAL VIEW */}
          {activeTab === 'portal' && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 1rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2563eb, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  <GraduationCap size={36} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {settings.academyName}
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#f59e0b', fontWeight: 600, marginBottom: '1rem' }}>
                  {settings.tagline}
                </p>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                  Empowering future technology leaders through industry-standard computer and digital skills. Admissions open for modern tech batches.
                </p>
              </div>

              {/* Courses Showcase */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>Featured Programs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {courses.map((c) => (
                  <div key={c.id} style={{ background: '#131c2e', border: '1px solid #1f2937', borderRadius: '0.75rem', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.25rem' }}>{c.duration}</div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>{c.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Mentor: {c.instructor}</p>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>{settings.currencySymbol} {c.totalFee.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={20} color="#2563eb" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone & WhatsApp</div>
                    <div style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>{settings.phoneNumber}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={20} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email Inquiry</div>
                    <div style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>{settings.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={20} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Campus Location</div>
                    <div style={{ fontSize: '0.875rem', color: '#f8fafc', fontWeight: 600 }}>{settings.address}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card" style={{ maxWidth: '650px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
                Institute Configuration
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Settings updated successfully!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                    Academy Name
                  </label>
                  <input
                    type="text"
                    value={settings.academyName}
                    onChange={(e) => setSettings({ ...settings, academyName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#131c2e', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#131c2e', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: '#131c2e', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: '#131c2e', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                    Receipt Footer Note
                  </label>
                  <input
                    type="text"
                    value={settings.receiptFooterText}
                    onChange={(e) => setSettings({ ...settings, receiptFooterText: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#131c2e', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Save Configuration
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* COLLECT FEE MODAL */}
      {showCollectFeeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>Collect Student Fee</h3>
              <button onClick={() => setShowCollectFeeModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  Select Student *
                </label>
                <select
                  required
                  value={feeForm.studentId}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === Number(e.target.value));
                    setFeeForm({
                      ...feeForm,
                      studentId: e.target.value,
                      amount: st ? String(st.remainingFee || 5000) : ''
                    });
                  }}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.rollNo} - {st.name} ({st.courseName} - Due: {settings.currencySymbol} {st.remainingFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  Amount Received ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={feeForm.amount}
                  onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  Payment Method
                </label>
                <select
                  value={feeForm.method}
                  onChange={(e) => setFeeForm({ ...feeForm, method: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowCollectFeeModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Generate Receipt & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>New Student Admission</h3>
              <button onClick={() => setShowAddStudentModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fatherName}
                    onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>City</label>
                  <input
                    type="text"
                    value={studentForm.city}
                    onChange={(e) => setStudentForm({ ...studentForm, city: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Select Course *</label>
                <select
                  required
                  value={studentForm.courseId}
                  onChange={(e) => {
                    const crs = courses.find((c) => c.id === Number(e.target.value));
                    setStudentForm({ ...studentForm, courseId: e.target.value, totalFee: crs ? String(crs.totalFee) : '' });
                  }}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.id}>{crs.name} ({settings.currencySymbol} {crs.totalFee})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Total Course Fee</label>
                  <input
                    type="number"
                    value={studentForm.totalFee}
                    onChange={(e) => setStudentForm({ ...studentForm, totalFee: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Advance Paid</label>
                  <input
                    type="number"
                    value={studentForm.advanceFee}
                    onChange={(e) => setStudentForm({ ...studentForm, advanceFee: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COURSE MODAL */}
      {showAddCourseModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>Add New Program</h3>
              <button onClick={() => setShowAddCourseModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flutter Mobile Development"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Total Fee ({settings.currencySymbol})</label>
                  <input
                    type="number"
                    value={courseForm.totalFee}
                    onChange={(e) => setCourseForm({ ...courseForm, totalFee: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddCourseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showAddExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>Record Institute Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generator Fuel / Generator Rent"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Rent">Campus Rent</option>
                    <option value="Internet">Internet</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Amount ({settings.currencySymbol}) *</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#090d16', border: '1px solid #2e3a52', borderRadius: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE RECEIPT / PRINTABLE SLIP MODAL */}
      {activeReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', padding: '1.5rem', backgroundColor: '#ffffff', color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Receipt Preview</span>
              <button onClick={() => setActiveReceipt(null)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div id="printable-receipt" style={{ textAlign: 'center', borderTop: '2px dashed #cbd5e1', borderBottom: '2px dashed #cbd5e1', padding: '1.5rem 0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{settings.academyName}</h2>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.25rem' }}>{settings.address}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1rem' }}>Tel: {settings.phoneNumber}</div>

              <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
                FEE PAYMENT RECEIPT: {activeReceipt.receiptNo}
              </div>

              <table style={{ width: '100%', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Date:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600 }}>{activeReceipt.paymentDate}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Roll No:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600 }}>{activeReceipt.studentRollNo}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Student:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700 }}>{activeReceipt.studentName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Course:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600 }}>{activeReceipt.courseName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#64748b' }}>Method:</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 600 }}>{activeReceipt.paymentMethod}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 0', fontWeight: 800, fontSize: '1rem' }}>Amount Paid:</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
                      {settings.currencySymbol} {activeReceipt.paidAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', marginTop: '1rem' }}>
                {settings.receiptFooterText}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#0f172a' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-secondary" style={{ color: '#000', borderColor: '#cbd5e1' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CERTIFICATE MODAL */}
      {activeCertificate && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', padding: '2rem', backgroundColor: '#ffffff', color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Official Certificate of Completion</span>
              <button onClick={() => setActiveCertificate(null)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div
              id="printable-certificate"
              style={{
                border: '8px double #1e3a8a',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {settings.academyName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700, margin: '4px 0 1.5rem', letterSpacing: '1px' }}>
                CERTIFICATE OF ACCOMPLISHMENT
              </div>

              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.5rem' }}>This certifies that</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', borderBottom: '2px solid #cbd5e1', display: 'inline-block', padding: '0 2rem 4px', marginBottom: '1rem' }}>
                {activeCertificate.student.name}
              </div>

              <p style={{ fontSize: '0.95rem', color: '#334155', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                has successfully completed the comprehensive training program in <strong>{activeCertificate.courseName}</strong> and demonstrated competence in all required practical benchmarks.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Director Academics</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Prof. Al Ghazi</div>
                </div>
                <div style={{ width: '48px', height: '48px', border: '2px dashed #b45309', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', fontWeight: 800, fontSize: '0.7rem' }}>
                  SEAL
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Date of Issue</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#1e3a8a' }}
              >
                <Printer size={16} /> Print Certificate
              </button>
              <button onClick={() => setActiveCertificate(null)} className="btn btn-secondary" style={{ color: '#000', borderColor: '#cbd5e1' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
