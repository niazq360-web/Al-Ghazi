import React from 'react';
import { X, Printer, Download, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function PrintDocumentModal({ isOpen, onClose, documentType, data, settings }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = settings.currencySymbol || 'Rs.';

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide" style={{ maxWidth: '960px' }}>
        {/* Controls Toolbar */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #233554', backgroundColor: '#0d1526' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Print Preview: {documentType.replace(/_/g, ' ').toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Formatted for standard A4 / Card printing. Click 'Print Document' to open the system print dialogue.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary">
              <Printer size={16} />
              <span>Print Document</span>
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              <X size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Printable Canvas Container */}
        <div style={{ padding: '2rem', backgroundColor: '#f1f5f9', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div id="printable-document" style={{ width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', color: '#0f172a', padding: '28px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            
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
                          <div style={{ width: 48, height: 48, backgroundColor: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, borderRadius: 6 }}>
                            AG
                          </div>
                        )}
                        <div>
                          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#0f172a' }}>
                            {settings.academyName}
                          </h1>
                          <p style={{ fontSize: '0.75rem', color: '#475569', margin: '2px 0 0 0' }}>
                            {settings.tagline} • {settings.address}, {settings.city}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '1px 0 0 0' }}>
                            Phone: {settings.phoneNumber} | Reg #: {settings.registrationNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-block', backgroundColor: '#e2e8f0', color: '#0f172a', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                          {copyLabel}
                        </span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '4px', color: '#1e293b' }}>
                          {data.receiptNo}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Date: {data.paymentDate || new Date().toISOString().split('T')[0]}
                        </div>
                      </div>
                    </div>

                    {/* Student & Course Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '12px 0', borderBottom: '1px solid #cbd5e1', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Student Name:</span>
                        <strong style={{ color: '#0f172a' }}>{data.studentName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Roll / Admission #:</span>
                        <strong style={{ color: '#0f172a' }}>{data.studentRollNo || data.rollNo || 'N/A'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Course / Program:</span>
                        <strong style={{ color: '#0f172a' }}>{data.courseName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Fee Month / Period:</span>
                        <strong style={{ color: '#0f172a' }}>{data.feeMonth || 'Monthly Installment'}</strong>
                      </div>
                    </div>

                    {/* Fee Breakdown Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0', fontSize: '0.825rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                          <th style={{ padding: '6px 8px' }}>Description / Head</th>
                          <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount ({currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 8px' }}>Tuition / Monthly Installment Fee</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right' }}>{(data.actualFee || data.paidAmount).toLocaleString()}</td>
                        </tr>
                        {Number(data.discountAmount) > 0 && (
                          <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#16a34a' }}>
                            <td style={{ padding: '6px 8px' }}>Scholarship / Concession Discount</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right' }}>- {Number(data.discountAmount).toLocaleString()}</td>
                          </tr>
                        )}
                        {Number(data.fineAmount) > 0 && (
                          <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#dc2626' }}>
                            <td style={{ padding: '6px 8px' }}>Late Submission / Library Fine</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right' }}>+ {Number(data.fineAmount).toLocaleString()}</td>
                          </tr>
                        )}
                        <tr style={{ borderTop: '2px solid #cbd5e1', backgroundColor: '#f8fafc', fontWeight: 800 }}>
                          <td style={{ padding: '8px' }}>Total Amount Paid (Received)</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '0.95rem', color: '#2563eb' }}>
                            {currency} {Number(data.paidAmount).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 8px', color: '#64748b' }}>Remaining Balance Due</td>
                          <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: Number(data.remainingDue || 0) > 0 ? '#ef4444' : '#16a34a' }}>
                            {currency} {Number(data.remainingDue || 0).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Metadata & Signatures */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.75rem', color: '#475569' }}>
                      <div>
                        <div><strong>Payment Method:</strong> {data.paymentMethod || 'Cash'}</div>
                        <div><strong>Received By:</strong> {data.receivedBy || 'Accounts Officer'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                          {settings.receiptFooterText}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', width: '160px' }}>
                        <div style={{ borderBottom: '1px solid #0f172a', height: '28px', marginBottom: '4px' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Authorized Signature</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================== 2. STUDENT ID CARD ==================== */}
            {documentType === 'student_id_card' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Standard Student ID Card (Dual Sided)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
                  {/* Front Card */}
                  <div style={{ width: '280px', height: '420px', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '16px 12px', textAlign: 'center', color: '#ffffff' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase' }}>{settings.academyName}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.9 }}>STUDENT IDENTITY CARD</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', flex: 1 }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid #3b82f6', marginBottom: '10px' }}>
                        {data.photoUrl ? (
                          <img src={data.photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#64748b' }}>{data.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>{data.name}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '8px' }}>Roll: {data.rollNo}</div>
                      
                      <div style={{ width: '100%', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                        <div><strong style={{ color: '#64748b' }}>Course:</strong> {data.courseName}</div>
                        <div><strong style={{ color: '#64748b' }}>Father:</strong> {data.fatherName}</div>
                        <div><strong style={{ color: '#64748b' }}>Contact:</strong> {data.phone}</div>
                        <div><strong style={{ color: '#64748b' }}>Session:</strong> {settings.academicSession}</div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b' }}>
                      <span>Blood: {data.bloodGroup || 'N/A'}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>ISSUED CARD</span>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div style={{ width: '280px', height: '420px', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ backgroundColor: '#0f172a', padding: '12px', textAlign: 'center', color: '#ffffff' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>TERMS & EMERGENCY INFO</div>
                    </div>
                    <div style={{ padding: '16px', flex: 1, fontSize: '0.7rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p>1. This card is the property of {settings.academyName} and must be returned upon course completion.</p>
                      <p>2. The student must display this card at all times inside campus premises & labs.</p>
                      <p>3. If lost, report immediately to the administration office.</p>
                      
                      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                        <div><strong>Emergency Call:</strong> {data.emergencyContact || data.parentPhone || settings.phoneNumber}</div>
                        <div><strong>Address:</strong> {settings.address}</div>
                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Valid Thru 2026-27</span>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', borderBottom: '1px solid #0f172a', marginBottom: '2px' }}></div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Principal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3. STUDENT ADMISSION FORM ==================== */}
            {documentType === 'admission_form' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />}
                    <div>
                      <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0 0 0' }}>{settings.address}, {settings.city} | Ph: {settings.phoneNumber}</p>
                    </div>
                  </div>
                  <div style={{ width: '90px', height: '105px', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                    Affix Passport Photograph Here
                  </div>
                </div>

                <div style={{ textAlign: 'center', margin: '14px 0', backgroundColor: '#f1f5f9', padding: '6px', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  OFFICIAL ADMISSION & ENROLLMENT FORM ({settings.academicSession})
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Admission No:</strong> {data.admissionNo || 'ADM-801'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Roll Number:</strong> {data.rollNo}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Student Full Name:</strong> {data.name}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Father's Name:</strong> {data.fatherName}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Mother's Name:</strong> {data.motherName || 'N/A'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Father/Guardian CNIC:</strong> {data.fatherCnic || 'N/A'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Date of Birth:</strong> {data.dob || 'N/A'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Gender / Blood Group:</strong> {data.gender} / {data.bloodGroup || 'N/A'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Student Phone:</strong> {data.phone}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Parent WhatsApp:</strong> {data.parentPhone}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', gridColumn: '1 / -1' }}><strong>Residential Address:</strong> {data.address}, {data.city}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Enrolled Course:</strong> {data.courseName}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Batch / Timing:</strong> {data.batch || 'Morning Shift'}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Total Agreed Fee:</strong> {currency} {Number(data.totalFee).toLocaleString()}</div>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}><strong>Initial Fee Paid:</strong> {currency} {Number(data.paidFee).toLocaleString()}</div>
                </div>

                <div style={{ marginTop: '24px', fontSize: '0.75rem', color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                  <strong>Student & Parent Undertaking:</strong> I hereby declare that the information provided above is true and authentic. I solemnly agree to abide by the disciplinary rules, attendance standards (min 80%), and fee schedule of {settings.academyName}.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '0.8rem' }}>
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

            {/* ==================== 4. CERTIFICATE ==================== */}
            {documentType === 'certificate' && (
              <div style={{ border: '10px double #1e3a8a', padding: '24px', backgroundColor: '#ffffff', position: 'relative', textAlign: 'center' }}>
                {/* Decorative Inner Border */}
                <div style={{ border: '2px solid #b45309', padding: '28px', backgroundColor: '#fffdfa' }}>
                  {/* Top Seal / Logo */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#1e3a8a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={32} />
                      </div>
                    )}
                  </div>

                  <h1 className="font-serif-cert" style={{ fontSize: '1.9rem', color: '#1e3a8a', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {settings.academyName}
                  </h1>
                  <p style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, letterSpacing: '0.15em', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
                    Registered under Govt Department #{settings.registrationNumber || 'AGDI-2024'}
                  </p>

                  <h2 className="font-serif-cert" style={{ fontSize: '1.7rem', color: '#0f172a', margin: '14px 0', fontStyle: 'italic', fontWeight: 700 }}>
                    {data.type || 'Certificate of Completion'}
                  </h2>

                  <p style={{ fontSize: '0.9rem', color: '#475569', margin: '12px 0 6px 0' }}>
                    This is proudly conferred upon
                  </p>

                  <h3 className="font-serif-cert" style={{ fontSize: '2rem', color: '#2563eb', margin: '8px 0', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '6px' }}>
                    {data.recipientName || data.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '8px 0' }}>
                    {data.fatherName ? `Son/Daughter of ${data.fatherName}` : ''}
                  </p>

                  <p style={{ fontSize: '0.95rem', color: '#1e293b', maxWidth: '600px', margin: '14px auto', lineHeight: 1.6 }}>
                    for successfully demonstrating proficiency and completing the prescribed curriculum for
                    <br />
                    <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{data.courseName || data.title}</strong>
                    <br />
                    with grade/evaluation of <strong>{data.grade || 'A+ Distinction'}</strong> during <strong>{data.duration || 'Session 2026'}</strong>.
                  </p>

                  {/* Verification Badge */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', color: '#1e40af', margin: '12px 0 24px 0' }}>
                    <ShieldCheck size={16} />
                    <span>Certificate ID: {data.certId || 'AG-CERT-2026-001'} (Online Verified)</span>
                  </div>

                  {/* Signatures */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', padding: '0 32px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '150px', borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Course Instructor</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#b45309', margin: '0 auto 4px auto' }}>
                        OFFICIAL<br />SEAL
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Date: {data.issueDate || new Date().toISOString().split('T')[0]}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '150px', borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{settings.principalName || 'Principal / Director'}</span>
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

            {/* ==================== 6. TEACHER SALARY SLIP / VOUCHER ==================== */}
            {documentType === 'teacher_salary_slip' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <div>
                    <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                    <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0 0 0' }}>Faculty Salary Voucher / Pay Slip</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <strong>Voucher #:</strong> SAL-2026-{data.id || '01'}
                    <div style={{ color: '#64748b' }}>Date: {new Date().toISOString().split('T')[0]}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '14px 0', borderBottom: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <div><strong>Teacher Name:</strong> {data.name}</div>
                  <div><strong>Faculty ID:</strong> {data.teacherId || 'TCH-001'}</div>
                  <div><strong>Qualification:</strong> {data.qualification}</div>
                  <div><strong>Assigned Course:</strong> {data.assignedCourses || data.subject}</div>
                  <div><strong>Joining Date:</strong> {data.joiningDate}</div>
                  <div><strong>Contact:</strong> {data.phone}</div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Earnings & Allowances</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Basic Monthly Honorarium / Salary</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{Number(data.monthlySalary || data.salary).toLocaleString()}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px' }}>Lab & Mentorship Allowance</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>0</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid #cbd5e1' }}>
                      <td style={{ padding: '8px' }}>Net Payable Amount Received</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontSize: '1rem', color: '#16a34a' }}>
                        {currency} {Number(data.monthlySalary || data.salary).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Teacher / Receiver Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Finance Officer</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 7. DEFAULTERS LIST ==================== */}
            {documentType === 'defaulters_list' && (
              <div>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>{settings.academyName}</h1>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '2px 0' }}>Outstanding Fees & Defaulters Recovery Statement</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Generated on: {new Date().toLocaleDateString()}</p>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Roll #</th>
                      <th style={{ padding: '8px' }}>Student Name</th>
                      <th style={{ padding: '8px' }}>Course</th>
                      <th style={{ padding: '8px' }}>Parent Phone</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Total Fee</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Paid</th>
                      <th style={{ padding: '8px', textAlign: 'right', color: '#dc2626' }}>Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data || []).map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px', fontWeight: 700 }}>{s.rollNo}</td>
                        <td style={{ padding: '8px' }}>{s.name}</td>
                        <td style={{ padding: '8px' }}>{s.courseName}</td>
                        <td style={{ padding: '8px' }}>{s.parentPhone || s.phone}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{Number(s.totalFee).toLocaleString()}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{Number(s.paidFee).toLocaleString()}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>
                          {currency} {Number(s.remainingFee).toLocaleString()}
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
  );
}
