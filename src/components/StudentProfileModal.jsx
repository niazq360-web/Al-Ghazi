import React from 'react';
import { X, User, Phone, MapPin, Calendar, CreditCard, Award, CheckCircle2, Clock, Printer } from 'lucide-react';

export default function StudentProfileModal({
  student,
  isOpen,
  onClose,
  payments = [],
  currency = 'Rs.',
  onPrintDocument,
  onCollectFee
}) {
  if (!isOpen || !student) return null;

  const studentPayments = payments.filter((p) => p.studentId === student.id || p.studentRollNo === student.rollNo);

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide">
        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
              />
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800
                }}
              >
                {student.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {student.name}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Roll #: <strong>{student.rollNo}</strong> • S/D of: <strong>{student.fatherName}</strong>
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Stats Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f7f4', borderRadius: '8px', border: '1px solid #e8e6df' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>COURSE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{student.courseName}</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8f7f4', borderRadius: '8px', border: '1px solid #e8e6df' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>TOTAL COURSE FEE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{currency} {Number(student.totalFee).toLocaleString()}</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>TOTAL PAID</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>{currency} {Number(student.paidFee).toLocaleString()}</div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600 }}>REMAINING DUE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: Number(student.remainingFee) > 0 ? '#dc2626' : '#15803d' }}>
                {currency} {Number(student.remainingFee).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Student Bio Information */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div><strong>Father Name:</strong> {student.fatherName}</div>
            <div><strong>Parent WhatsApp:</strong> {student.parentPhone || student.phone}</div>
            <div><strong>Admission Date:</strong> {student.admissionDate || 'N/A'}</div>
            <div><strong>Gender / Blood:</strong> {student.gender || 'Male'} • {student.bloodGroup || 'O+'}</div>
            <div><strong>City:</strong> {student.city || 'Lahore'}</div>
            <div><strong>Address:</strong> {student.address || 'N/A'}</div>
          </div>

          {/* Payment History Table */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Fee Payment Records ({studentPayments.length})
            </h4>
            {studentPayments.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: '#faf9f5', borderRadius: '6px', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                No payment receipts on file for this student yet.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Fee Period</th>
                    <th>Method</th>
                    <th style={{ textAlign: 'right' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPayments.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>{p.receiptNo}</td>
                      <td>{p.paymentDate}</td>
                      <td>{p.feeMonth || 'Monthly'}</td>
                      <td>{p.paymentMethod}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                        {currency} {Number(p.paidAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid #e8e6df' }}>
            <button
              onClick={() => onPrintDocument('student_id_card', student)}
              className="btn btn-secondary"
            >
              <Printer size={14} />
              <span>Print Student ID Card</span>
            </button>
            <button
              onClick={() => onPrintDocument('admission_form', student)}
              className="btn btn-secondary"
            >
              <Printer size={14} />
              <span>Print Admission Form</span>
            </button>
            <button
              onClick={() => onCollectFee(student)}
              className="btn btn-primary"
            >
              <CreditCard size={14} />
              <span>Collect Fee</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
