import React from 'react';
import { X, Printer, Award, CheckCircle, ShieldCheck } from 'lucide-react';
import OfficialSeal from './OfficialSeal';

export default function PrintDocumentModal({ isOpen, onClose, documentType, data, settings }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    if (documentType === 'certificate') {
      document.body.classList.add('printing-certificate');
    }
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-certificate');
    }, 1000);
  };

  const currency = settings.currencySymbol || 'Rs.';

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide" style={{ maxWidth: documentType === 'certificate' ? '1020px' : '960px' }}>
        {/* Controls Toolbar */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #233554', backgroundColor: '#0d1526' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Print Preview: {documentType.replace(/_/g, ' ').toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {documentType === 'certificate'
                ? 'Official Certificate with Gold Seal, Security QR & Digital Signatures. Formatted for A4 Landscape.'
                : 'Formatted for standard printing. Click "Print Document" to open the system print dialogue.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} />
              <span>Print {documentType === 'certificate' ? 'Certificate (A4 Landscape)' : 'Document'}</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              <X size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Canvas Container */}
        <div style={{ padding: '2rem 1.5rem', backgroundColor: '#e2e8f0', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div
            id="printable-document"
            style={{
              width: '100%',
              maxWidth: documentType === 'certificate' ? '960px' : '820px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: documentType === 'certificate' ? '0' : '28px',
              borderRadius: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
            }}
          >
            {/* ==================== 1. FEE RECEIPT ==================== */}
            {documentType === 'fee_receipt' && (
              <div>
                {/* Single Receipt Generator Helper */}
                {['STUDENT COPY', settings.dualReceipt ? 'INSTITUTE / OFFICE COPY' : null].filter(Boolean).map((copyLabel, idx) => (
                  <div key={copyLabel} style={{ marginBottom: idx === 0 && settings.dualReceipt ? '28px' : '0', paddingBottom: idx === 0 && settings.dualReceipt ? '24px' : '0', borderBottom: idx === 0 && settings.dualReceipt ? '2px dashed #94a3b8' : 'none' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {settings.logoUrl ? (
                          <img src={settings.logoUrl} alt="Logo" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: '8px', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
                            AG
                          </div>
                        )}
                        <div>
                          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#0f172a' }}>
                            {settings.academyName}
                          </h1>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                            {settings.address}, {settings.city} | Ph: {settings.phoneNumber}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>
                            Govt Reg: {settings.registrationNumber || 'REG-2024-AGDI-8921'} | Affiliated Center
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: '4px' }}>
                          FEE VOUCHER & RECEIPT
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb' }}>
                          {copyLabel}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                          Receipt #: <strong style={{ color: '#0f172a' }}>{data.receiptNo}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                          Date: <strong style={{ color: '#0f172a' }}>{data.date}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Student Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '10px 0', borderBottom: '1px solid #cbd5e1', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Student Name:</span><br />
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{data.studentName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Roll No / ID:</span><br />
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{data.rollNo}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Father's Name:</span><br />
                        <strong>{data.fatherName || '---'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Course Enrolled:</span><br />
                        <strong>{data.courseName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Fee Month / Head:</span><br />
                        <strong>{data.month || 'Current Tuition'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Payment Mode:</span><br />
                        <strong>{data.paymentMethod}</strong> {data.transactionId ? `(${data.transactionId})` : ''}
                      </div>
                    </div>

                    {/* Financial Ledger Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                          <th style={{ padding: '6px 8px' }}>Sr.</th>
                          <th style={{ padding: '6px 8px' }}>Description / Fee Particulars</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Total Due ({currency})</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Discount ({currency})</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount Paid ({currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 8px' }}>1</td>
                          <td style={{ padding: '6px 8px' }}>
                            <strong>{data.feeType || 'Tuition & Lab Fee'}</strong> - {data.courseName}
                          </td>
                          <td style={{ padding: '6px 8px', textAlign: 'right' }}>{(data.totalDue || (data.amount + (data.remainingDues || 0))).toLocaleString()}</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right' }}>{(data.discount || 0).toLocaleString()}</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>{data.amount.toLocaleString()}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 800 }}>
                          <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>Total Amount Paid:</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '0.95rem', color: '#1e40af' }}>{currency} {data.amount.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} style={{ padding: '6px 8px', textAlign: 'right', color: '#dc2626', fontWeight: 700 }}>Remaining Balance / Dues:</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right', color: '#dc2626', fontWeight: 700 }}>{currency} {(data.remainingDues || 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Footer text and Signatures */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', fontSize: '0.75rem' }}>
                      <div style={{ maxWidth: '60%' }}>
                        <p style={{ margin: 0, color: '#64748b' }}>
                          <em>{settings.receiptFooterText || 'Fees once paid are non-refundable. Keep this receipt for verification.'}</em>
                        </p>
                        <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.7rem' }}>
                          Issued By: {data.collectedBy || 'Accounts Department'} | Computer Generated Secure Slip
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '32px', textAlign: 'center' }}>
                        <div>
                          <div style={{ width: '110px', borderBottom: '1px solid #94a3b8', marginBottom: '4px' }}></div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Depositor Sign</span>
                        </div>
                        <div>
                          <div style={{ width: '110px', borderBottom: '1px solid #94a3b8', marginBottom: '4px' }}></div>
                          <span style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 700 }}>Cashier / Officer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================== 2. STUDENT ID CARD ==================== */}
            {documentType === 'student_id_card' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <div style={{ width: '320px', height: '480px', border: '2px solid #cbd5e1', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', position: 'relative' }}>
                  {/* Card Top Header */}
                  <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '16px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h3>
                    <p style={{ fontSize: '0.65rem', margin: '2px 0 0 0', opacity: 0.85 }}>STUDENT IDENTITY CARD</p>
                  </div>
                  {/* Photo & Roll */}
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <div style={{ width: '90px', height: '100px', backgroundColor: '#e2e8f0', borderRadius: '8px', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #cbd5e1', overflow: 'hidden' }}>
                      {data.photoUrl ? (
                        <img src={data.photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>PHOTO</span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{data.name}</h4>
                    <span style={{ display: 'inline-block', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Roll No: {data.rollNo}
                    </span>
                  </div>
                  {/* Card Details */}
                  <div style={{ padding: '0 20px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#334155' }}>
                    <div><strong>Father:</strong> {data.fatherName}</div>
                    <div><strong>Course:</strong> {data.courseName}</div>
                    <div><strong>Batch:</strong> {data.batch || 'Morning'}</div>
                    <div><strong>Phone:</strong> {data.phone}</div>
                    <div><strong>Valid Session:</strong> {settings.academicSession || '2026-2027'}</div>
                  </div>
                  {/* Card Footer */}
                  <div style={{ marginTop: 'auto', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
                    <span>Reg #{settings.registrationNumber || 'AG-2024'}</span>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '70px', borderBottom: '1px solid #0f172a', marginBottom: '2px' }}></div>
                      <strong>Issuing Authority</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3. ADMISSION FORM ==================== */}
            {documentType === 'admission_form' && (
              <div>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0' }}>{settings.address}, {settings.city} | Ph: {settings.phoneNumber}</p>
                  <div style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 4, marginTop: '6px', textTransform: 'uppercase' }}>
                    STUDENT ADMISSION ENROLLMENT FORM
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0', fontSize: '0.85rem' }}>
                  <div><strong>Admission No:</strong> {data.admissionNo || 'ADM-800'}</div>
                  <div><strong>Roll No:</strong> {data.rollNo}</div>
                  <div><strong>Date:</strong> {data.admissionDate || new Date().toISOString().split('T')[0]}</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, width: '25%', backgroundColor: '#f8fafc' }}>Student Full Name:</td>
                      <td style={{ padding: '8px' }}>{data.name}</td>
                      <td style={{ padding: '8px', fontWeight: 700, width: '25%', backgroundColor: '#f8fafc' }}>Father / Guardian:</td>
                      <td style={{ padding: '8px' }}>{data.fatherName}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Father / Guardian CNIC:</td>
                      <td style={{ padding: '8px' }}>{data.fatherCnic || '---'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Date of Birth / Gender:</td>
                      <td style={{ padding: '8px' }}>{data.dob || '---'} ({data.gender || 'Not specified'})</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Mobile / WhatsApp:</td>
                      <td style={{ padding: '8px' }}>{data.phone} ({data.whatsapp || data.phone})</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Parent Contact:</td>
                      <td style={{ padding: '8px' }}>{data.parentPhone || '---'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Residential Address:</td>
                      <td colSpan={3} style={{ padding: '8px' }}>{data.address}, {data.city}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Course Enrolled:</td>
                      <td style={{ padding: '8px' }}><strong>{data.courseName}</strong></td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Assigned Batch / Shift:</td>
                      <td style={{ padding: '8px' }}>{data.batch || 'Morning'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Total Package Fee:</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#16a34a' }}>{currency} {(data.totalFee || 0).toLocaleString()}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Agreed Monthly Installment:</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#2563eb' }}>{currency} {(data.monthlyFee || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: 4, fontSize: '0.75rem', color: '#475569' }}>
                  <strong>Declaration:</strong> I hereby declare that the particulars provided above are correct to the best of my knowledge and I agree to strictly abide by the rules and regulations of {settings.academyName}.
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Student Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Father / Guardian Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Principal / Director</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 4. CERTIFICATE (PROFESSIONAL WITH OFFICIAL SEAL) ==================== */}
            {documentType === 'certificate' && (
              <div
                className="professional-certificate"
                style={{
                  border: '14px solid #0a192f',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              >
                {/* Gold Foil Accent Inset Border */}
                <div
                  style={{
                    border: '3px solid #d4af37',
                    padding: '6px',
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
                  }}
                >
                  {/* Fine Filigree Inner Frame */}
                  <div
                    style={{
                      border: '1px solid #c59b27',
                      padding: '24px 32px 20px 32px',
                      backgroundColor: '#fffdfa',
                      position: 'relative',
                      textAlign: 'center',
                      backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.12) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  >
                    {/* Corner Ornaments (SVG Florets) */}
                    <svg style={{ position: 'absolute', top: 8, left: 8, width: 42, height: 42 }} viewBox="0 0 50 50">
                      <path d="M0,0 L50,0 C25,0 0,25 0,50 Z" fill="#d4af37" opacity="0.3" />
                      <path d="M5,5 L40,5 C20,5 5,20 5,40 Z" fill="none" stroke="#9a7311" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" fill="#b45309" />
                    </svg>
                    <svg style={{ position: 'absolute', top: 8, right: 8, width: 42, height: 42, transform: 'scaleX(-1)' }} viewBox="0 0 50 50">
                      <path d="M0,0 L50,0 C25,0 0,25 0,50 Z" fill="#d4af37" opacity="0.3" />
                      <path d="M5,5 L40,5 C20,5 5,20 5,40 Z" fill="none" stroke="#9a7311" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" fill="#b45309" />
                    </svg>
                    <svg style={{ position: 'absolute', bottom: 8, left: 8, width: 42, height: 42, transform: 'scaleY(-1)' }} viewBox="0 0 50 50">
                      <path d="M0,0 L50,0 C25,0 0,25 0,50 Z" fill="#d4af37" opacity="0.3" />
                      <path d="M5,5 L40,5 C20,5 5,20 5,40 Z" fill="none" stroke="#9a7311" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" fill="#b45309" />
                    </svg>
                    <svg style={{ position: 'absolute', bottom: 8, right: 8, width: 42, height: 42, transform: 'scale(-1, -1)' }} viewBox="0 0 50 50">
                      <path d="M0,0 L50,0 C25,0 0,25 0,50 Z" fill="#d4af37" opacity="0.3" />
                      <path d="M5,5 L40,5 C20,5 5,20 5,40 Z" fill="none" stroke="#9a7311" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" fill="#b45309" />
                    </svg>

                    {/* Top Crest / Institute Logo Header */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                      {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" style={{ width: 68, height: 68, objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #0f172a)', border: '2px solid #d4af37', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                          <Award size={34} color="#ffd54f" />
                        </div>
                      )}
                    </div>

                    {/* Academy Name in Grand Royal Serif */}
                    <h1
                      className="font-serif-cert"
                      style={{
                        fontSize: '2.1rem',
                        color: '#0f265c',
                        margin: '0 0 4px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 900
                      }}
                    >
                      {settings.academyName}
                    </h1>

                    <p style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 800, letterSpacing: '0.14em', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                      {settings.tagline || 'LEARN • PRACTICE • GROW'}
                    </p>

                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 16px 0', fontWeight: 600, letterSpacing: '0.05em' }}>
                      Recognized & Registered Under Govt Authority Reg #{settings.registrationNumber || 'REG-2024-AGDI-8921'} • Pakistan
                    </p>

                    {/* Title Plaque */}
                    <div style={{ margin: '10px auto 14px auto', display: 'inline-block' }}>
                      <div
                        style={{
                          background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)',
                          color: '#ffffff',
                          padding: '6px 32px',
                          borderRadius: '4px',
                          border: '1px solid #ffd54f',
                          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          fontWeight: 800,
                          fontSize: '1.05rem'
                        }}
                      >
                        {data.type || 'Certificate of Completion & Excellence'}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', margin: '10px 0 4px 0' }}>
                      This official credential is systematically awarded to
                    </p>

                    {/* Recipient Full Name */}
                    <h2
                      className="font-serif-cert"
                      style={{
                        fontSize: '2.3rem',
                        color: '#1e3a8a',
                        margin: '6px 0',
                        fontWeight: 900,
                        textDecoration: 'underline',
                        textUnderlineOffset: '8px',
                        textDecorationColor: '#d4af37'
                      }}
                    >
                      {data.recipientName || data.name}
                    </h2>

                    <p style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 600, margin: '8px 0' }}>
                      {data.fatherName ? `Son / Daughter of: ${data.fatherName}` : ''}
                      {data.rollNo ? ` • Roll No: ${data.rollNo}` : ''}
                    </p>

                    {/* Curriculum Statement */}
                    <p style={{ fontSize: '0.92rem', color: '#1e293b', maxWidth: '720px', margin: '14px auto', lineHeight: 1.65 }}>
                      for successfully fulfilling all academic requirements, completing practical hands-on projects,
                      and demonstrating commendable technical proficiency in the specialized discipline of:
                      <br />
                      <strong style={{ fontSize: '1.25rem', color: '#0f265c', display: 'inline-block', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {data.courseName || data.title}
                      </strong>
                      <br />
                      with an overall evaluation of <strong style={{ color: '#16a34a' }}>{data.grade || 'A+ Distinction'}</strong> during the period of <strong>{data.duration || settings.academicSession || 'Session 2026-2027'}</strong>.
                    </p>

                    {/* Signatures & OFFICIAL SEAL Layout */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'end',
                        marginTop: '18px',
                        padding: '0 20px'
                      }}
                    >
                      {/* Left Signature: Instructor / HoD */}
                      <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
                        <svg width="120" height="34" viewBox="0 0 140 40" style={{ margin: '0 auto' }}>
                          <path
                            d="M 10,25 Q 35,5 60,22 Q 85,35 110,15 Q 125,5 130,28"
                            fill="none"
                            stroke="#1e3a8a"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div style={{ width: '160px', borderBottom: '1.5px solid #0f172a', margin: '2px auto 4px auto' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>Course Instructor</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Head of Department</span>
                      </div>

                      {/* CENTER: OFFICIAL SEAL (GOLD ROSETTE WITH ROYAL RED RIBBONS) */}
                      <div style={{ textAlign: 'center', margin: '0 18px', position: 'relative' }}>
                        <OfficialSeal
                          size={135}
                          customSealUrl={settings.officialSealUrl || ''}
                          instituteName={settings.academyName}
                          subtitle="OFFICIAL SEAL"
                          year={new Date().getFullYear().toString()}
                        />
                      </div>

                      {/* Right Signature: Principal / Director */}
                      <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
                        <svg width="120" height="34" viewBox="0 0 140 40" style={{ margin: '0 auto' }}>
                          <path
                            d="M 15,30 Q 30,8 55,18 Q 80,30 95,12 T 130,22"
                            fill="none"
                            stroke="#1e3a8a"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div style={{ width: '160px', borderBottom: '1.5px solid #0f172a', margin: '2px auto 4px auto' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                          {settings.principalName || settings.directorName || 'Principal / Director'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Authorized Signatory</span>
                      </div>
                    </div>

                    {/* Bottom Security & Verification Bar */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #e2e8f0',
                        marginTop: '16px',
                        paddingTop: '8px',
                        fontSize: '0.72rem',
                        color: '#64748b'
                      }}
                    >
                      {/* Scannable Verification QR Code */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                        <svg width="34" height="34" viewBox="0 0 34 34" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '2px', borderRadius: '4px' }}>
                          <rect x="2" y="2" width="10" height="10" fill="#0f172a" />
                          <rect x="4" y="4" width="6" height="6" fill="#ffffff" />
                          <rect x="5.5" y="5.5" width="3" height="3" fill="#0f172a" />
                          <rect x="22" y="2" width="10" height="10" fill="#0f172a" />
                          <rect x="24" y="4" width="6" height="6" fill="#ffffff" />
                          <rect x="25.5" y="5.5" width="3" height="3" fill="#0f172a" />
                          <rect x="2" y="22" width="10" height="10" fill="#0f172a" />
                          <rect x="4" y="24" width="6" height="6" fill="#ffffff" />
                          <rect x="25.5" y="25.5" width="3" height="3" fill="#0f172a" />
                          <rect x="14" y="4" width="4" height="4" fill="#0f172a" />
                          <rect x="14" y="14" width="6" height="6" fill="#0f172a" />
                          <rect x="22" y="14" width="4" height="4" fill="#0f172a" />
                          <rect x="4" y="14" width="4" height="4" fill="#0f172a" />
                          <rect x="14" y="24" width="4" height="6" fill="#0f172a" />
                        </svg>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Scan to Verify Authenticity</strong>
                          <br />
                          <span>{settings.website || 'https://niazq360-web.github.io/Al-Ghazi/'}</span>
                        </div>
                      </div>

                      {/* Security ID Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '9999px', color: '#1e40af', fontWeight: 700 }}>
                        <ShieldCheck size={14} />
                        <span>Security ID: {data.certId || 'AG-CERT-2026-00001'}</span>
                      </div>

                      {/* Issue Date & Seal Notice */}
                      <div style={{ textAlign: 'right' }}>
                        <div>Date of Issuance: <strong style={{ color: '#0f172a' }}>{data.issueDate || new Date().toISOString().split('T')[0]}</strong></div>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Official Permanent Academic Credential</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 5. EXAM RESULT CARD / MARKSHEET ==================== */}
            {documentType === 'exam_result_card' && (
              <div>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0' }}>{settings.address}, {settings.city} | Examination Board</p>
                  <div style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 4, marginTop: '6px', textTransform: 'uppercase' }}>
                    ACADEMIC RESULT CARD & TRANSCRIPT
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '14px 0', borderBottom: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <div><strong>Student Name:</strong> {data.studentName}</div>
                  <div><strong>Roll Number:</strong> {data.rollNo}</div>
                  <div><strong>Examination:</strong> {data.examTitle || 'Mid Term Assessment'}</div>
                  <div><strong>Course:</strong> {data.courseName}</div>
                  <div><strong>Issue Date:</strong> {new Date().toISOString().split('T')[0]}</div>
                  <div><strong>Result Status:</strong> <span style={{ color: data.status === 'Pass' ? '#16a34a' : '#dc2626', fontWeight: 800 }}>{data.status || 'Pass'}</span></div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Assessment Paper / Module</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Total Marks</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Pass Marks</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Obtained Marks</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Percentage</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Comprehensive Practical & Theory Exam</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>50</td>
                      <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>{data.obtainedMarks}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{data.percentage}%</td>
                      <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: '#2563eb' }}>{data.grade}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                      <td style={{ padding: '8px' }}>Cumulative Total</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>50</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#2563eb' }}>{data.obtainedMarks}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{data.percentage}%</td>
                      <td style={{ padding: '8px', textAlign: 'center', color: '#2563eb' }}>{data.grade}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ fontSize: '0.75rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '8px', borderRadius: 4, margin: '12px 0' }}>
                  <strong>Grading Key:</strong> A+ (80% & Above), A (70-79%), B (60-69%), C (50-59%), D (40-49%), F (Below 40% - Fail)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Controller of Examinations</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Principal / Director</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 6. TEACHER SALARY VOUCHER ==================== */}
            {documentType === 'salary_voucher' && (
              <div>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0' }}>{settings.address}, {settings.city} | Accounts Division</p>
                  <div style={{ display: 'inline-block', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 4, marginTop: '6px', textTransform: 'uppercase' }}>
                    STAFF SALARY PAYMENT DISBURSEMENT VOUCHER
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '14px 0', borderBottom: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <div><strong>Teacher Name:</strong> {data.name}</div>
                  <div><strong>Designation:</strong> {data.designation}</div>
                  <div><strong>Department:</strong> {data.department || 'Academic Faculty'}</div>
                  <div><strong>Salary Month:</strong> {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                  <div><strong>Date Paid:</strong> {new Date().toISOString().split('T')[0]}</div>
                  <div><strong>Payment Mode:</strong> Cash / Direct Bank Transfer</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Salary Breakdown Head</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Basic Monthly Salary</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{(data.salary || 0).toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Teaching & Lab Allowance</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>0</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                      <td style={{ padding: '8px' }}>Net Disbursed Amount</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: '#16a34a', fontSize: '1rem' }}>{currency} {(data.salary || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Faculty Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Accountant Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Principal Approval</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 7. DEFAULTERS LIST ==================== */}
            {documentType === 'defaulters_report' && (
              <div>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0' }}>{settings.address}, {settings.city}</p>
                  <div style={{ display: 'inline-block', backgroundColor: '#dc2626', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 4, marginTop: '6px', textTransform: 'uppercase' }}>
                    FEE DEFAULTERS & PENDING DUES REPORT
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>Report Generated On: {new Date().toLocaleString()}</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Roll No</th>
                      <th style={{ padding: '8px' }}>Student Name</th>
                      <th style={{ padding: '8px' }}>Father Name</th>
                      <th style={{ padding: '8px' }}>Parent Phone</th>
                      <th style={{ padding: '8px' }}>Course</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Total Fee</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Paid</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                      data.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', fontWeight: 700 }}>{s.rollNo}</td>
                          <td style={{ padding: '8px' }}>{s.name}</td>
                          <td style={{ padding: '8px' }}>{s.fatherName}</td>
                          <td style={{ padding: '8px' }}>{s.parentPhone || s.phone}</td>
                          <td style={{ padding: '8px' }}>{s.courseName}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>{currency} {s.totalFee.toLocaleString()}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#16a34a' }}>{currency} {s.paidFee.toLocaleString()}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: '#dc2626', fontWeight: 800 }}>{currency} {s.remainingFee.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '16px', color: '#16a34a', fontWeight: 700 }}>
                          No pending fee defaulters. All enrolled students are clear!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
