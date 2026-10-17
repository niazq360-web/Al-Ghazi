import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * FinanceTrackingChart Component
 * Comprehensive visual financial tracking system comparing Fees Income vs Institute Expenses.
 * Features:
 * - 6-Month dynamic comparative bar chart (Income vs Expense)
 * - Net Profit / Cash flow calculation and profit margin %
 * - Expense category breakdown
 * - Fully styled for the halfwhite / off-white executive theme
 */
export default function FinanceTrackingChart({
  payments = [],
  expenses = [],
  currency = 'Rs.',
  className = ''
}) {
  const [chartView, setChartView] = useState('monthly'); // 'monthly' or 'categories'

  // Generate last 6 months labels
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const fullMonth = d.toLocaleString('default', { month: 'long' });
      const year = d.getFullYear();
      months.push({
        key: `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: `${monthName} ${year}`,
        monthName,
        fullMonth,
        year,
        income: 0,
        expense: 0
      });
    }

    // Aggregate payments (Fee Income)
    payments.forEach((p) => {
      const pDate = p.paymentDate ? new Date(p.paymentDate) : new Date();
      const pKey = `${pDate.getFullYear()}-${String(pDate.getMonth() + 1).padStart(2, '0')}`;
      const found = months.find((m) => m.key === pKey);
      if (found) {
        found.income += Number(p.paidAmount || 0);
      } else if (months.length > 0) {
        // If outside 6 months, add to latest month for presentation
        months[months.length - 1].income += Number(p.paidAmount || 0);
      }
    });

    // Aggregate expenses
    expenses.forEach((e) => {
      const eDate = e.date ? new Date(e.date) : new Date();
      const eKey = `${eDate.getFullYear()}-${String(eDate.getMonth() + 1).padStart(2, '0')}`;
      const found = months.find((m) => m.key === eKey);
      if (found) {
        found.expense += Number(e.amount || 0);
      } else if (months.length > 0) {
        months[months.length - 1].expense += Number(e.amount || 0);
      }
    });

    return months;
  }, [payments, expenses]);

  // Totals & Overall Metrics
  const totalIncome = useMemo(() => payments.reduce((acc, p) => acc + Number(p.paidAmount || 0), 0), [payments]);
  const totalExpense = useMemo(() => expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0), [expenses]);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Expense Categories Breakdown
  const categoryBreakdown = useMemo(() => {
    const cats = {};
    expenses.forEach((e) => {
      const cat = e.category || 'General Operations';
      cats[cat] = (cats[cat] || 0) + Number(e.amount || 0);
    });

    return Object.entries(cats).map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpense]);

  // Max value for scaling bars
  const maxBarValue = useMemo(() => {
    let max = 10000;
    monthlyData.forEach((m) => {
      if (m.income > max) max = m.income;
      if (m.expense > max) max = m.expense;
    });
    return max * 1.15;
  }, [monthlyData]);

  return (
    <div className={`card ${className}`} style={{ padding: '1.25rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
      {/* Chart Header & View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Financial Health & Tracking Dashboard
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                Live comparative analysis of Student Fees (Revenue) vs Operating Expenses
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setChartView('monthly')}
            className="btn"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              backgroundColor: chartView === 'monthly' ? '#ffffff' : 'transparent',
              color: chartView === 'monthly' ? '#2563eb' : '#64748b',
              boxShadow: chartView === 'monthly' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontWeight: 700
            }}
          >
            <BarChart3 size={13} />
            <span>Monthly Trends</span>
          </button>
          <button
            type="button"
            onClick={() => setChartView('categories')}
            className="btn"
            style={{
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              backgroundColor: chartView === 'categories' ? '#ffffff' : 'transparent',
              color: chartView === 'categories' ? '#2563eb' : '#64748b',
              boxShadow: chartView === 'categories' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontWeight: 700
            }}
          >
            <PieChart size={13} />
            <span>Expense Categories</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Income Card */}
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Total Fee Income</span>
            <div style={{ padding: '4px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <ArrowUpRight size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            {currency} {totalIncome.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#166534' }}>{payments.length} Fee receipts</span>
        </div>

        {/* Expenses Card */}
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Total Expenses</span>
            <div style={{ padding: '4px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <ArrowDownRight size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
            {currency} {totalExpense.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#991b1b' }}>{expenses.length} Expense entries</span>
        </div>

        {/* Net Profit Card */}
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: netProfit >= 0 ? '#eff6ff' : '#fff1f2', border: `1px solid ${netProfit >= 0 ? '#bfdbfe' : '#fecdd3'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: netProfit >= 0 ? '#1e40af' : '#9f1239', textTransform: 'uppercase' }}>Net Cash Reserve</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: netProfit >= 0 ? '#dbeafe' : '#ffe4e6', color: netProfit >= 0 ? '#1e40af' : '#e11d48' }}>
              {profitMargin}% Margin
            </span>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: netProfit >= 0 ? '#1d4ed8' : '#be123c', marginTop: '4px' }}>
            {currency} {netProfit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7rem', color: netProfit >= 0 ? '#1e40af' : '#9f1239' }}>
            {netProfit >= 0 ? 'Positive Operating Surplus' : 'Deficit / Needs Attention'}
          </span>
        </div>
      </div>

      {/* VIEW 1: MONTHLY COMPARATIVE BAR CHART */}
      {chartView === 'monthly' && (
        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          {/* Chart Legend */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.25rem', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }}></div>
              <span style={{ color: '#0f172a' }}>Fee Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#ef4444' }}></div>
              <span style={{ color: '#0f172a' }}>Expenses</span>
            </div>
          </div>

          {/* SVG / Bar Chart Representation */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${monthlyData.length}, 1fr)`, gap: '1rem', height: '170px', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
            {monthlyData.map((m, idx) => {
              const incomeHeight = Math.max(8, Math.round((m.income / maxBarValue) * 140));
              const expenseHeight = Math.max(8, Math.round((m.expense / maxBarValue) * 140));

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                  {/* Bars side by side */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', width: '100%', justifyContent: 'center' }}>
                    {/* Income Bar (Green) */}
                    <div
                      title={`Income: ${currency} ${m.income.toLocaleString()}`}
                      style={{
                        width: '42%',
                        maxWidth: '28px',
                        height: `${incomeHeight}px`,
                        backgroundColor: '#10b981',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                        boxShadow: '0 2px 5px rgba(16, 185, 129, 0.25)',
                        position: 'relative'
                      }}
                    >
                      {m.income > 0 && (
                        <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.62rem', fontWeight: 800, color: '#059669', whiteSpace: 'nowrap' }}>
                          {(m.income / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>

                    {/* Expense Bar (Red) */}
                    <div
                      title={`Expenses: ${currency} ${m.expense.toLocaleString()}`}
                      style={{
                        width: '42%',
                        maxWidth: '28px',
                        height: `${expenseHeight}px`,
                        backgroundColor: '#ef4444',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                        boxShadow: '0 2px 5px rgba(239, 68, 68, 0.25)',
                        position: 'relative'
                      }}
                    >
                      {m.expense > 0 && (
                        <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.62rem', fontWeight: 800, color: '#dc2626', whiteSpace: 'nowrap' }}>
                          {(m.expense / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Month Label */}
                  <div style={{ position: 'absolute', bottom: '-22px', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {m.monthName}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.7rem', color: '#64748b' }}>
            <span>Values in Pakistani Rupees ({currency})</span>
            <span>Hover bars to view exact amounts</span>
          </div>
        </div>
      )}

      {/* VIEW 2: EXPENSE CATEGORY BREAKDOWN */}
      {chartView === 'categories' && (
        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
            Breakdown by Expense Head
          </h4>
          {categoryBreakdown.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '1.5rem 0' }}>
              No expenses recorded yet. Click on Expenses & Accounts tab to add overhead costs.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{cat.name}</span>
                    <span style={{ fontWeight: 700, color: '#64748b' }}>
                      {currency} {cat.amount.toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        height: '100%',
                        backgroundColor: idx === 0 ? '#ef4444' : idx === 1 ? '#f59e0b' : idx === 2 ? '#3b82f6' : '#8b5cf6',
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
