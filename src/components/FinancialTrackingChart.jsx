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

export default function FinancialTrackingChart({
  payments = [],
  expenses = [],
  students = [],
  courses = [],
  currency = 'Rs.'
}) {
  const [chartView, setChartView] = useState('monthly');

  const totalFeeCollected = useMemo(() => {
    return payments.reduce((sum, p) => sum + (Number(p.paidAmount) || 0), 0);
  }, [payments]);

  const totalExpensesAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netBalance = totalFeeCollected - totalExpensesAmount;
  const profitMargin = totalFeeCollected > 0
    ? Math.round((netBalance / totalFeeCollected) * 100)
    : 0;

  const totalOutstandingDues = useMemo(() => {
    return students.reduce((sum, s) => sum + (Number(s.remainingFee) || 0), 0);
  }, [students]);

  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short' });
      months.push({ key, label, revenue: 0, expense: 0 });
    }

    payments.forEach((p) => {
      const dateStr = p.paymentDate || p.date || '';
      const mKey = dateStr.slice(0, 7);
      const target = months.find((m) => m.key === mKey);
      if (target) {
        target.revenue += Number(p.paidAmount) || 0;
      } else if (months.length > 0) {
        months[months.length - 1].revenue += Number(p.paidAmount) || 0;
      }
    });

    expenses.forEach((e) => {
      const dateStr = e.date || '';
      const mKey = dateStr.slice(0, 7);
      const target = months.find((m) => m.key === mKey);
      if (target) {
        target.expense += Number(e.amount) || 0;
      } else if (months.length > 0) {
        months[months.length - 1].expense += Number(e.amount) || 0;
      }
    });

    return months;
  }, [payments, expenses]);

  const courseRevenueData = useMemo(() => {
    const map = {};
    courses.forEach((c) => {
      map[c.name] = { name: c.name, collected: 0, pending: 0, count: 0 };
    });

    payments.forEach((p) => {
      const cName = p.courseName || 'General';
      if (!map[cName]) {
        map[cName] = { name: cName, collected: 0, pending: 0, count: 0 };
      }
      map[cName].collected += Number(p.paidAmount) || 0;
      map[cName].count += 1;
    });

    students.forEach((s) => {
      const cName = s.courseName || 'General';
      if (map[cName]) {
        map[cName].pending += Number(s.remainingFee) || 0;
      }
    });

    return Object.values(map);
  }, [courses, payments, students]);

  const expenseCategoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || 'General';
      map[cat] = (map[cat] || 0) + (Number(e.amount) || 0);
    });

    const entries = Object.entries(map).map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpensesAmount > 0 ? Math.round((amount / totalExpensesAmount) * 100) : 0
    }));

    return entries.sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpensesAmount]);

  const maxMonthlyVal = Math.max(
    ...monthlyData.map((m) => Math.max(m.revenue, m.expense)),
    1000
  );

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.85rem',
        padding: '1.25rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid #edebe3',
          paddingBottom: '0.85rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb'
            }}
          >
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Fees & Expenses Financial Health Tracker
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Real-time cashflow analytics, revenue distribution and operating margins
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f4f3ee', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setChartView('monthly')}
            className="btn"
            style={{
              backgroundColor: chartView === 'monthly' ? '#ffffff' : 'transparent',
              color: chartView === 'monthly' ? '#0f172a' : '#64748b',
              boxShadow: chartView === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Calendar size={13} />
            <span>Monthly Cashflow</span>
          </button>
          <button
            onClick={() => setChartView('courses')}
            className="btn"
            style={{
              backgroundColor: chartView === 'courses' ? '#ffffff' : 'transparent',
              color: chartView === 'courses' ? '#0f172a' : '#64748b',
              boxShadow: chartView === 'courses' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Layers size={13} />
            <span>Course Revenue</span>
          </button>
          <button
            onClick={() => setChartView('categories')}
            className="btn"
            style={{
              backgroundColor: chartView === 'categories' ? '#ffffff' : 'transparent',
              color: chartView === 'categories' ? '#0f172a' : '#64748b',
              boxShadow: chartView === 'categories' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <PieIcon size={13} />
            <span>Expenses Breakdown</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
            Fee Collections
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
            {currency} {totalFeeCollected.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#166534' }}>
            {payments.length} verified receipts
          </span>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>
            Operating Expenses
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c', marginTop: '2px' }}>
            {currency} {totalExpensesAmount.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#991b1b' }}>
            {expenses.length} voucher records
          </span>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#075985', fontWeight: 700, textTransform: 'uppercase' }}>
            Net Surplus / Balance
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: netBalance >= 0 ? '#0284c7' : '#dc2626', marginTop: '2px' }}>
            {currency} {netBalance.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#075985' }}>
            Margin: <strong>{profitMargin}%</strong>
          </span>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Dues
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
            {currency} {totalOutstandingDues.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#92400e' }}>
            Uncollected receivables
          </span>
        </div>
      </div>

      {chartView === 'monthly' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              6-Month Inflow (Fees) vs Outflow (Expenses)
            </span>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#16a34a' }}></span>
                <span style={{ color: '#475569' }}>Fee Collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#dc2626' }}></span>
                <span style={{ color: '#475569' }}>Expenses</span>
              </div>
            </div>
          </div>

          <div
            style={{
              height: '190px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '1.25rem',
              padding: '10px 10px 0 10px',
              borderBottom: '1.5px solid #cbd5e1',
              backgroundColor: '#faf9f5',
              borderRadius: '8px 8px 0 0'
            }}
          >
            {monthlyData.map((m, idx) => {
              const revH = Math.max(6, Math.round((m.revenue / maxMonthlyVal) * 140));
              const expH = Math.max(6, Math.round((m.expense / maxMonthlyVal) * 140));
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center' }}>
                    <div
                      title={`${m.label} Revenue: ${currency} ${m.revenue.toLocaleString()}`}
                      style={{
                        width: '38%',
                        maxWidth: '26px',
                        height: `${revH}px`,
                        backgroundColor: '#16a34a',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.2s ease'
                      }}
                    ></div>
                    <div
                      title={`${m.label} Expense: ${currency} ${m.expense.toLocaleString()}`}
                      style={{
                        width: '38%',
                        maxWidth: '26px',
                        height: `${expH}px`,
                        backgroundColor: '#dc2626',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.2s ease'
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginTop: '6px' }}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {chartView === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {courseRevenueData.map((cr, idx) => {
            const totalForCourse = cr.collected + cr.pending;
            const collectedPercent = totalForCourse > 0 ? Math.round((cr.collected / totalForCourse) * 100) : 0;
            return (
              <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#faf9f5', border: '1px solid #edebe3', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{cr.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                    {currency} {cr.collected.toLocaleString()} <span style={{ color: '#64748b', fontWeight: 500 }}>collected</span>
                  </span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#fee2e2', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${collectedPercent}%`, height: '100%', backgroundColor: '#16a34a' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '3px' }}>
                  <span>{collectedPercent}% Recovery Rate</span>
                  <span style={{ color: cr.pending > 0 ? '#dc2626' : '#16a34a' }}>
                    Pending: {currency} {cr.pending.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {chartView === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {expenseCategoryData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
              No expenses recorded yet. Add expenses to view category breakdown.
            </div>
          ) : (
            expenseCategoryData.map((cat, idx) => (
              <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#faf9f5', border: '1px solid #edebe3', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{cat.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 800 }}>
                    {currency} {cat.amount.toLocaleString()} ({cat.percentage}%)
                  </span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#edebe3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', backgroundColor: '#dc2626' }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
