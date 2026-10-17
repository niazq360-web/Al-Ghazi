import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/**
 * FinancialTrackingChart Component
 * Comprehensive visual analytics for Fee Revenue vs Institutional Expenses.
 * Features:
 *  - Monthly Cashflow Bar Chart (Fees vs Expenses)
 *  - Category-wise Expense distribution
 *  - Course-wise Revenue contribution
 *  - Key Financial KPIs (Revenue, Expenses, Net Profit, Profit Margin)
 */
export default function FinancialTrackingChart({
  payments = [],
  expenses = [],
  students = [],
  courses = [],
  currency = 'Rs.'
}) {
  const [activeView, setActiveView] = useState('monthly'); // 'monthly' | 'categories' | 'courses'
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Month names
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // 1. KPI Aggregations
  const totalRevenue = useMemo(() => {
    return payments.reduce((acc, p) => acc + (Number(p.paidAmount) || 0), 0);
  }, [payments]);

  const totalExpense = useMemo(() => {
    return expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const totalPendingFees = useMemo(() => {
    return students.reduce((acc, s) => acc + (Number(s.remainingFee) || 0), 0);
  }, [students]);

  // 2. Monthly Cashflow Data (Last 6-12 Months)
  const monthlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const map = {};

    // Initialize past 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
      map[key] = { key, label, revenue: 0, expense: 0 };
    }

    // Aggregate Payments
    payments.forEach((p) => {
      if (!p.paymentDate) return;
      const key = p.paymentDate.slice(0, 7); // 'YYYY-MM'
      if (map[key]) {
        map[key].revenue += Number(p.paidAmount) || 0;
      } else {
        // If outside the 6-month window, we can include it dynamically
        const [yr, mo] = key.split('-');
        if (yr && mo) {
          map[key] = {
            key,
            label: `${monthNames[parseInt(mo, 10) - 1]} ${yr.slice(-2)}`,
            revenue: Number(p.paidAmount) || 0,
            expense: 0
          };
        }
      }
    });

    // Aggregate Expenses
    expenses.forEach((e) => {
      if (!e.date) return;
      const key = e.date.slice(0, 7);
      if (map[key]) {
        map[key].expense += Number(e.amount) || 0;
      } else {
        const [yr, mo] = key.split('-');
        if (yr && mo) {
          map[key] = {
            key,
            label: `${monthNames[parseInt(mo, 10) - 1]} ${yr.slice(-2)}`,
            revenue: 0,
            expense: Number(e.amount) || 0
          };
        }
      }
    });

    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
  }, [payments, expenses]);

  // Max value for bar scaling
  const maxMonthlyVal = useMemo(() => {
    const maxVal = Math.max(
      ...monthlyData.map((d) => Math.max(d.revenue, d.expense)),
      1000
    );
    return maxVal * 1.15; // 15% head room
  }, [monthlyData]);

  // 3. Expense Categories Breakdown
  const categoryData = useMemo(() => {
    const cats = {};
    expenses.forEach((e) => {
      const cat = e.category || 'General';
      cats[cat] = (cats[cat] || 0) + (Number(e.amount) || 0);
    });

    const entries = Object.entries(cats).map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    }));

    return entries.sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpense]);

  // 4. Course-wise Revenue Breakdown
  const courseRevenueData = useMemo(() => {
    const courseMap = {};

    // Initialize from courses list
    courses.forEach((c) => {
      courseMap[c.name] = {
        name: c.name,
        code: c.code || '',
        studentsCount: 0,
        collected: 0,
        pending: 0
      };
    });

    // Tally students per course
    students.forEach((s) => {
      const cName = s.courseName || 'Unassigned';
      if (!courseMap[cName]) {
        courseMap[cName] = { name: cName, code: '', studentsCount: 0, collected: 0, pending: 0 };
      }
      courseMap[cName].studentsCount += 1;
      courseMap[cName].collected += Number(s.paidFee) || 0;
      courseMap[cName].pending += Number(s.remainingFee) || 0;
    });

    return Object.values(courseMap).sort((a, b) => b.collected - a.collected);
  }, [courses, students]);

  // Color palette for categories & courses
  const colors = [
    '#2563eb', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316'
  ];

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header & View Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #e8e6df', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Financial Health & Tracking Analytics
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                Real-time tracking of Fee Collections, Operating Expenses, & Course Profitability
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f0ea', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveView('monthly')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeView === 'monthly' ? '#ffffff' : 'transparent',
              color: activeView === 'monthly' ? '#2563eb' : '#64748b',
              boxShadow: activeView === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Monthly Cashflow
          </button>
          <button
            onClick={() => setActiveView('courses')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeView === 'courses' ? '#ffffff' : 'transparent',
              color: activeView === 'courses' ? '#2563eb' : '#64748b',
              boxShadow: activeView === 'courses' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Course Revenue
          </button>
          <button
            onClick={() => setActiveView('categories')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeView === 'categories' ? '#ffffff' : 'transparent',
              color: activeView === 'categories' ? '#2563eb' : '#64748b',
              boxShadow: activeView === 'categories' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Expense Breakdown
          </button>
        </div>
      </div>

      {/* 4 Quick KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        {/* Total Fee Revenue */}
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Fee Income</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <ArrowUpRight size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14532d', marginTop: '4px' }}>
            {currency} {totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '2px', fontWeight: 600 }}>
            {payments.length} Receipts Processed
          </div>
        </div>

        {/* Total Expenses */}
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Expenses</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <ArrowDownRight size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#7f1d1d', marginTop: '4px' }}>
            {currency} {totalExpense.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '2px', fontWeight: 600 }}>
            {expenses.length} Vouchers Recorded
          </div>
        </div>

        {/* Net Profit / Margin */}
        <div style={{ backgroundColor: netProfit >= 0 ? '#eff6ff' : '#fff1f2', border: `1px solid ${netProfit >= 0 ? '#bfdbfe' : '#fecdd3'}`, borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: netProfit >= 0 ? '#1e40af' : '#9f1239', textTransform: 'uppercase' }}>
              Net Balance / Profit
            </span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: netProfit >= 0 ? '#dbeafe' : '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: netProfit >= 0 ? '#2563eb' : '#e11d48' }}>
              <DollarSign size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: netProfit >= 0 ? '#1e3a8a' : '#881337', marginTop: '4px' }}>
            {currency} {netProfit.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: netProfit >= 0 ? '#2563eb' : '#e11d48', marginTop: '2px', fontWeight: 600 }}>
            {profitMargin}% Operating Margin
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Pending Fees</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <AlertCircle size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
            {currency} {totalPendingFees.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px', fontWeight: 600 }}>
            Receivable from Students
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CASHFLOW BAR CHART */}
      {activeView === 'monthly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
              Monthly Comparison: Fee Inflows vs Expenditures
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#10b981', display: 'inline-block' }}></span>
                <span style={{ color: '#0f172a' }}>Fee Collected (Income)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                <span style={{ color: '#0f172a' }}>Expenses</span>
              </div>
            </div>
          </div>

          {/* SVG Visual Bar Chart */}
          <div style={{ backgroundColor: '#faf9f5', border: '1px solid #e8e6df', borderRadius: '10px', padding: '16px 12px 10px 12px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', gap: '8px', paddingBottom: '30px', position: 'relative' }}>
              {/* Horizontal grid guide lines */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: '25%', borderTop: '1px dashed #e2e8f0' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed #e2e8f0' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '75%', borderTop: '1px dashed #e2e8f0' }}></div>

              {monthlyData.map((d) => {
                const revHeight = maxMonthlyVal > 0 ? (d.revenue / maxMonthlyVal) * 150 : 0;
                const expHeight = maxMonthlyVal > 0 ? (d.expense / maxMonthlyVal) * 150 : 0;
                const net = d.revenue - d.expense;

                return (
                  <div
                    key={d.key}
                    onMouseEnter={() => setHoveredMonth(d)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      maxWidth: '90px',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                  >
                    {/* Bars Container */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', width: '100%', justifyContent: 'center' }}>
                      {/* Revenue Bar */}
                      <div
                        style={{
                          width: '18px',
                          height: `${Math.max(revHeight, 4)}px`,
                          backgroundColor: '#10b981',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease, background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                        }}
                        title={`Revenue: ${currency} ${d.revenue.toLocaleString()}`}
                      />
                      {/* Expense Bar */}
                      <div
                        style={{
                          width: '18px',
                          height: `${Math.max(expHeight, 4)}px`,
                          backgroundColor: '#ef4444',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease, background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                        }}
                        title={`Expense: ${currency} ${d.expense.toLocaleString()}`}
                      />
                    </div>

                    {/* Month Label */}
                    <div style={{ marginTop: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textAlign: 'center' }}>
                      {d.label}
                    </div>

                    {/* Net Badge */}
                    <div
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: net >= 0 ? '#15803d' : '#b91c1c',
                        marginTop: '2px'
                      }}
                    >
                      {net >= 0 ? `+${(net / 1000).toFixed(0)}k` : `${(net / 1000).toFixed(0)}k`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hover Tooltip display */}
            {hoveredMonth && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '0.75rem',
                  zIndex: 10
                }}
              >
                <strong style={{ color: '#0f172a' }}>{hoveredMonth.label} Breakdown:</strong>
                <div style={{ color: '#16a34a' }}>Fee Income: {currency} {hoveredMonth.revenue.toLocaleString()}</div>
                <div style={{ color: '#dc2626' }}>Expense: {currency} {hoveredMonth.expense.toLocaleString()}</div>
                <div style={{ fontWeight: 700, color: hoveredMonth.revenue >= hoveredMonth.expense ? '#2563eb' : '#dc2626' }}>
                  Net: {currency} {(hoveredMonth.revenue - hoveredMonth.expense).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: COURSE-WISE REVENUE */}
      {activeView === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
            Course-Wise Enrollment & Revenue Performance
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {courseRevenueData.map((c, i) => {
              const maxCourseRev = Math.max(...courseRevenueData.map((x) => x.collected), 1);
              const barPercent = Math.round((c.collected / maxCourseRev) * 100);
              const totalExpected = c.collected + c.pending;
              const recoveryRate = totalExpected > 0 ? Math.round((c.collected / totalExpected) * 100) : 0;
              const color = colors[i % colors.length];

              return (
                <div
                  key={c.name}
                  style={{
                    backgroundColor: '#faf9f5',
                    border: '1px solid #e8e6df',
                    borderRadius: '8px',
                    padding: '10px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: color,
                          display: 'inline-block'
                        }}
                      />
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                        {c.name}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        ({c.studentsCount} Admitted Students)
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#16a34a' }}>
                        {currency} {c.collected.toLocaleString()}
                      </span>
                      {c.pending > 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#dc2626', marginLeft: '8px', fontWeight: 600 }}>
                          Due: {currency} {c.pending.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${barPercent}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.68rem', color: '#64748b' }}>
                    <span>Fee Recovery: <strong>{recoveryRate}%</strong></span>
                    <span>Total Target: {currency} {totalExpected.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: EXPENSE CATEGORY DISTRIBUTION */}
      {activeView === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
            Operating Expense Distribution by Category
          </div>

          {categoryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              No expenses recorded yet. Use the "Add Expense" button to log institutional expenses.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {categoryData.map((cat, i) => {
                const color = colors[i % colors.length];
                return (
                  <div
                    key={cat.name}
                    style={{
                      backgroundColor: '#faf9f5',
                      border: '1px solid #e8e6df',
                      borderRadius: '8px',
                      padding: '12px 14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '3px',
                            backgroundColor: color
                          }}
                        />
                        <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{cat.name}</strong>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                        {currency} {cat.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${cat.percentage}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: '3px'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.68rem', color: '#64748b' }}>
                      <span>Share of Total Budget</span>
                      <strong>{cat.percentage}%</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
