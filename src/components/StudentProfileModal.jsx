import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, Printer, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentProfileModal({
  isOpen,
  onClose,
  student,
  payments,
  settings,
  onCollectFee,
  onPrintDocument
}) {
  if (!isOpen || !student) return null;

  const currency = settings.currencySymbol || 'Rs.';
  const studentPayments = (payments || []).filter((p) => p.studentId === student.id || p.studentRollNo === student.rollNo);

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800 }}>
              {student.name?.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{student.name}</h3>
                <span className={`badge ${student.status === 'Active' ? 'badge-active' : 'badge-neutral'}`}>
                  {student.status}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Roll #: <strong>{student.rollNo}</strong> | Admission #: {student.admissionNo || 'ADM-801'} | Course: {student.courseName}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Action Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', backgroundColor: '#0d1526', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #233554' }}>
            <button
              onClick={() => {
                onClose();
                onCollectFee(student);
              }}
              className="btn btn-primary"
            >
              <CreditCard size={15} />
              <span>Collect Fee</span>
            </button>
            <button
              onClick={() => onPrintDocument('student_id_card', student)}
              className="btn btn-secondary"
            >
              <Printer size={15} />
              <span>Print Student ID Card</span>
            </button>
            <button
              onClick={() => onPrintDocument('admission_form', student)}
              className="btn btn-secondary"
            >
              <FileText size={15} />
              <span>Print Admission Form</span>
            </button>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {/* Personal & Family Info */}
            <div className="card" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Personal & Family Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <div><span style={{ color: '#94a3b8' }}>Father's Name:</span> <strong>{student.fatherName}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Mother's Name:</span> <strong>{student.motherName || 'N/A'}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Father CNIC:</span> {student.fatherCnic || 'N/A'}</div>
                <div><span style={{ color: '#94a3b8' }}>Date of Birth:</span> {student.dob || 'N/A'}</div>
                <div><span style={{ color: '#94a3b8' }}>Gender / Blood:</span> {student.gender} / {student.bloodGroup || 'N/A'}</div>
                <div><span style={{ color: '#94a3b8' }}>Previous School:</span> {student.previousSchool || 'N/A'}</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card" style={{ padding: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Contact & Address
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                <div><span style={{ color: '#94a3b8' }}>Student Mobile:</span> <strong>{student.phone}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Parent WhatsApp:</span> <strong>{student.parentPhone}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Emergency Contact:</span> {student.emergencyContact || student.parentPhone}</div>
                <div><span style={{ color: '#94a3b8' }}>Email:</span> {student.email || 'N/A'}</div>
                <div><span style={{ color: '#94a3b8' }}>Address:</span> {student.address}, {student.city}</div>
              </div>
            </div>

            {/* Academic & Financial Status */}
            <div className="card" style={{ padding: '1rem', gridColumn: '1 / -1' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Fee Ledger & Payment Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: '#0d1526', padding: '0.85rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Program Fee</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>{currency} {Number(student.totalFee).toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: '#0d1526', padding: '0.85rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Paid Fee to Date</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{currency} {Number(student.paidFee).toLocaleString()}</div>
                </div>
                <div style={{ backgroundColor: '#0d1526', padding: '0.85rem', borderRadius: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Remaining Dues</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: Number(student.remainingFee) > 0 ? '#f87171' : '#34d399' }}>
                    {currency} {Number(student.remainingFee).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment History Table */}
              <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>Receipts & Transaction History</h5>
              {studentPayments.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No payment receipts recorded yet for this student.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>Receipt #</th>
                        <th>Date</th>
                        <th>Month / Head</th>
                        <th>Method</th>
                        <th style={{ textAlign: 'right' }}>Amount Paid</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentPayments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700 }}>{p.receiptNo}</td>
                          <td>{p.paymentDate}</td>
                          <td>{p.feeMonth || 'Monthly Fee'}</td>
                          <td>{p.paymentMethod}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: '#34d399' }}>
                            {currency} {Number(p.paidAmount).toLocaleString()}
                          </td>
                          <td>
                            <button
                              onClick={() => onPrintDocument('fee_receipt', p)}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              <Printer size={12} />
                              <span>Receipt</span>
                            </button>
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
      </div>
    </div>
  );
}
