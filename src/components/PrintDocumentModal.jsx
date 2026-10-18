import React, { useRef } from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import OfficialSeal from './OfficialSeal';
import AlGhaziQrCode from './AlGhaziQrCode';
import CertificateCorner from './CertificateCorner';

export default function PrintDocumentModal({
  isOpen,
  onClose,
  documentType, // 'certificate' | 'fee_receipt' | 'admission_form' | 'teacher_form' | 'student_id_card' | 'teacher_id_card' | 'teacher_salary_slip' | 'defaulters_list' | 'result_card'
  data = {},
  settings = {},
  currency = 'Rs.'
}) {
  const printAreaRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printAreaRef.current) return;
    try {
      const element = printAreaRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const isLandscape = documentType === 'certificate';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${documentType}_${data.rollNo || data.receiptNo || 'document'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  const handleDownloadDOC = () => {
    // Generate clean HTML format suitable for Microsoft Word (.doc)
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
      "xmlns='http://www.w3.org/TR/REC-html40'>"+
      "<head><meta charset='utf-8'><title>Document</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentType}_${data.rollNo || data.receiptNo || 'document'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${documentType === 'certificate' ? 'modal-content-full' : 'modal-content-wide'}`}>
        {/* Modal Top Control Bar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e8e6df',
            backgroundColor: '#faf9f5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#2563eb" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', textTransform: 'uppercase' }}>
              Official Document Preview: {documentType?.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '0.45rem 0.85rem' }}>
              <Printer size={15} />
              <span>Print Directly</span>
            </button>
            <button onClick={handleDownloadPDF} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
              <Download size={15} />
              <span>Download PDF</span>
            </button>
            <button onClick={handleDownloadDOC} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
              <Download size={15} />
              <span>Download DOC</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Canvas */}
        <div style={{ padding: '1.5rem', overflowX: 'auto', backgroundColor: '#f1f0eb' }}>
          <div
            ref={printAreaRef}
            style={{
              backgroundColor: '#ffffff',
              margin: '0 auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              color: '#0f172a',
              fontFamily: 'inherit'
            }}
          >
            {/* ============================================================== */}
            {/* 1. MASTERPIECE CERTIFICATE OF EXCELLENCE                       */}
            {/* ============================================================== */}
            {documentType === 'certificate' && (
              <div
                style={{
                  border: '14px solid #071329',
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  width: '980px',
                  minHeight: '680px',
                  margin: '0 auto',
                  boxSizing: 'border-box'
                }}
              >
                {/* 24K Gold Foil Accent Inset Border */}
                <div
                  style={{
                    border: '3.5px solid #d4af37',
                    padding: '8px',
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
                  }}
                >
                  {/* Ornate Inner Frame with Luxury Cream Guilloche Background */}
                  <div
                    style={{
                      border: '1.5px solid #c59b27',
                      padding: '30px 40px 24px 40px',
                      backgroundColor: '#fffdf8',
                      position: 'relative',
                      textAlign: 'center',
                      backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* 4 CORNERS LUXURY BAROQUE ORNAMENTS */}
                    <CertificateCorner position="top-left" size={100} />
                    <CertificateCorner position="top-right" size={100} />
                    <CertificateCorner position="bottom-left" size={100} />
                    <CertificateCorner position="bottom-right" size={100} />

                    {/* Top Crest / Institute Logo Header */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                      {settings.logoUrl ? (
                        <img
                          src={settings.logoUrl}
                          alt="Logo"
                          style={{ width: 72, height: 72, objectFit: 'contain' }}
                        />
                      ) : (
                        <OfficialSeal
                          size={70}
                          customSealUrl={settings.officialSealUrl || ''}
                          instituteName={settings.academyName ? settings.academyName.replace(' DIGITAL INSTITUTE', '') : 'AL GHAZI'}
                          tagline="DIGITAL INSTITUTE"
                        />
                      )}
                    </div>

                    {/* Academy Name in Grand Royal Serif */}
                    <h1
                      className="font-serif-cert"
                      style={{
                        fontSize: '2.4rem',
                        color: '#071329',
                        margin: '0 0 2px 0',
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {settings.academyName || 'AL GHAZI DIGITAL INSTITUTE'}
                    </h1>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        margin: '4px 0 16px 0'
                      }}
                    >
                      <div style={{ height: '1.5px', width: '80px', background: 'linear-gradient(to left, #d4af37, transparent)' }}></div>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: '#b8860b'
                        }}
                      >
                        GOVERNMENT REGISTERED • REG #{settings.registrationNumber || 'AG-REG-2026-904'}
                      </span>
                      <div style={{ height: '1.5px', width: '80px', background: 'linear-gradient(to right, #d4af37, transparent)' }}></div>
                    </div>

                    {/* Certificate Title Banner */}
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '6px 36px',
                        borderTop: '2px solid #d4af37',
                        borderBottom: '2px solid #d4af37',
                        margin: '4px 0 14px 0'
                      }}
                    >
                      <div
                        className="font-serif-cert"
                        style={{
                          color: '#071329',
                          textTransform: 'uppercase',
                          letterSpacing: '0.14em',
                          fontWeight: 800,
                          fontSize: '1.2rem'
                        }}
                      >
                        {data.type || 'Certificate of Completion & Excellence'}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: '#475569', fontStyle: 'italic', margin: '6px 0 4px 0' }}>
                      This official academic credential is proudly awarded to
                    </p>

                    {/* Recipient Full Name */}
                    <h2
                      className="font-serif-cert"
                      style={{
                        fontSize: '2.5rem',
                        color: '#1e3a8a',
                        margin: '6px 0 4px 0',
                        fontWeight: 900,
                        textDecoration: 'underline',
                        textUnderlineOffset: '8px',
                        textDecorationColor: '#d4af37'
                      }}
                    >
                      {data.recipientName || data.name}
                    </h2>

                    <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600, margin: '6px 0 10px 0' }}>
                      {data.fatherName ? `Son / Daughter of: ${data.fatherName}` : ''}
                      {data.rollNo ? ` • Roll No: ${data.rollNo}` : ''}
                    </p>

                    {/* Curriculum Statement */}
                    <p style={{ fontSize: '0.93rem', color: '#1e293b', maxWidth: '760px', margin: '12px auto 16px auto', lineHeight: 1.68 }}>
                      for successfully fulfilling all prescribed academic requirements, completing hands-on practical projects,
                      and demonstrating commendable technical proficiency in the specialized discipline of:
                      <br />
                      <strong style={{ fontSize: '1.35rem', color: '#071329', display: 'inline-block', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {data.courseName || data.title}
                      </strong>
                      <br />
                      with an overall evaluation grade of <strong style={{ color: '#16a34a' }}>{data.grade || 'A+ Distinction'}</strong> during the academic session of <strong>{data.duration || settings.academicSession || 'Session 2026-2027'}</strong>.
                    </p>

                    {/* SIGNATURES & CENTER OFFICIAL SEAL */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'end',
                        marginTop: '12px',
                        padding: '0 16px'
                      }}
                    >
                      {/* Left Signature: Course Instructor */}
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
                        <div style={{ width: '160px', borderBottom: '1.5px solid #071329', margin: '2px auto 4px auto' }}></div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#071329', display: 'block' }}>Course Instructor</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Head of Department</span>
                      </div>

                      {/* CENTER: OFFICIAL SEAL (MEDALLION RECREATED FROM ASSET 1792081856717.jpg) */}
                      <div style={{ textAlign: 'center', margin: '0 20px', position: 'relative' }}>
                        <OfficialSeal
                          size={145}
                          showRibbons={true}
                          customSealUrl={settings.officialSealUrl || ''}
                          instituteName={settings.academyName ? settings.academyName.replace(' DIGITAL INSTITUTE', '') : 'AL GHAZI'}
                          tagline="DIGITAL INSTITUTE"
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
                        <div style={{ width: '160px', borderBottom: '1.5px solid #071329', margin: '2px auto 4px auto' }}></div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#071329', display: 'block' }}>
                          {settings.principalName || settings.directorName || 'Principal / Director'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Authorized Signatory</span>
                      </div>
                    </div>

                    {/* BOTTOM SECURITY BAR WITH OFFICIAL QR CODE & WEBSITE UNDERNEATH */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #cbd5e1',
                        marginTop: '14px',
                        paddingTop: '10px',
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}
                    >
                      {/* OFFICIAL QR CODE MATCHING "Al Ghazi Qr code.png" WITH WEBSITE UNDERNEATH */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                        <AlGhaziQrCode
                          value={settings.website || "http://alghazidigital.site.je/"}
                          websiteUrl={settings.website || "http://alghazidigital.site.je/"}
                          size={64}
                          label="Scan to Verify"
                        />
                      </div>

                      {/* Center Verification Code & Security Note */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#f1f5f9', padding: '3px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <ShieldCheck size={14} color="#16a34a" />
                          <span style={{ fontWeight: 700, color: '#071329', fontSize: '0.72rem' }}>
                            Certificate ID: {data.certificateNo || 'AG-CERT-2026-001'}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0 0 0', fontSize: '0.66rem', color: '#94a3b8' }}>
                          Tamper-evident system credential • Encrypted verification key
                        </p>
                      </div>

                      {/* Right Details */}
                      <div style={{ textAlign: 'right' }}>
                        <div>Issued: <strong>{data.issueDate || data.date || new Date().toISOString().split('T')[0]}</strong></div>
                        <div style={{ color: '#1e3a8a', fontWeight: 600 }}>Al Ghazi Academic Registry</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 2. OFFICIAL FEE RECEIPT                                         */}
            {/* ============================================================== */}
            {documentType === 'fee_receipt' && (
              <div style={{ width: '680px', padding: '30px', margin: '0 auto', border: '1px solid #cbd5e1' }}>
                {/* Header with Institute Logo / Official Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={56} />
                    )}
                    <div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                        {settings.academyName || 'AL GHAZI DIGITAL INSTITUTE'}
                      </h2>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                        {settings.address || 'Civil Lines, Near Judicial Complex, Gujranwala Road'}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '1px 0 0 0' }}>
                        Phone: {settings.phone || '0300-1234567'} • Web: {settings.website || 'http://alghazidigital.site.je/'}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ backgroundColor: '#1e3a8a', color: '#ffffff', padding: '4px 12px', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem' }}>
                      STUDENT FEE RECEIPT
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '6px' }}>
                      Receipt #: {data.receiptNo}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Date: {data.paymentDate || new Date().toISOString().split('T')[0]}
                    </div>
                  </div>
                </div>

                {/* Student Particulars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '16px 0', borderBottom: '1px solid #e2e8f0', fontSize: '0.825rem' }}>
                  <div><strong>Student Name:</strong> {data.studentName}</div>
                  <div><strong>Roll Number:</strong> {data.studentRollNo}</div>
                  <div><strong>Course Enrolled:</strong> {data.courseName}</div>
                  <div><strong>Fee Month / Installment:</strong> {data.feeMonth || 'Monthly'}</div>
                  <div><strong>Payment Mode:</strong> {data.paymentMethod || 'Cash'}</div>
                  <div><strong>Remarks / Memo:</strong> {data.remarks || 'Tuition Fee Payment'}</div>
                </div>

                {/* Financial Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>Description</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #cbd5e1' }}>Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0' }}>Total Course Fee Contracted</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>{Number(data.totalFee || 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0' }}>Discount / Scholarship Applied</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>- {Number(data.discount || 0).toLocaleString()}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f0fdf4', fontWeight: 800 }}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #bbf7d0', color: '#166534' }}>AMOUNT PAID TODAY</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', borderBottom: '1px solid #bbf7d0', color: '#15803d', fontSize: '1.1rem' }}>
                        {currency} {Number(data.paidAmount).toLocaleString()}
                      </td>
                    </tr>
                    <tr style={{ fontWeight: 700 }}>
                      <td style={{ padding: '8px 12px', color: '#991b1b' }}>Net Outstanding Dues Balance</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', color: '#dc2626' }}>
                        {currency} {Number(data.remainingDue || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer with Signatures & Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px' }}>
                  <div style={{ textAlign: 'center', width: '160px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>Student / Depositor</span>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <OfficialSeal size={50} />
                  </div>

                  <div style={{ textAlign: 'center', width: '160px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700 }}>Accounts Officer</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.68rem', color: '#94a3b8', borderTop: '1px dotted #cbd5e1', paddingTop: '8px' }}>
                  This is a computer-generated official receipt • Fee once paid is non-refundable • Verify: {settings.website || 'http://alghazidigital.site.je/'}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 3. STUDENT ADMISSION FORM                                      */}
            {/* ============================================================== */}
            {documentType === 'admission_form' && (
              <div style={{ width: '700px', padding: '36px', margin: '0 auto', border: '1.5px solid #0f172a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={64} />
                    )}
                    <div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{settings.academyName || 'AL GHAZI DIGITAL INSTITUTE'}</h2>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Official Student Admission & Enrollment Dossier</p>
                    </div>
                  </div>
                  {/* Photo Frame */}
                  <div style={{ width: '90px', height: '110px', border: '1.5px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center' }}>Affix Passport Photo</span>
                    )}
                  </div>
                </div>

                <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                  <div><strong>Student Full Name:</strong> {data.name}</div>
                  <div><strong>Roll Number:</strong> {data.rollNo}</div>
                  <div><strong>Father Name:</strong> {data.fatherName}</div>
                  <div><strong>Parent WhatsApp:</strong> {data.parentPhone || data.phone}</div>
                  <div><strong>Selected Course:</strong> {data.courseName}</div>
                  <div><strong>Batch / Shift:</strong> {data.batch || 'Regular Shift'}</div>
                  <div><strong>Date of Admission:</strong> {data.admissionDate || new Date().toISOString().split('T')[0]}</div>
                  <div><strong>Gender / Blood:</strong> {data.gender || 'Male'} • {data.bloodGroup || 'O+'}</div>
                  <div><strong>Total Fee:</strong> {currency} {Number(data.totalFee || 0).toLocaleString()}</div>
                  <div><strong>Fee Paid at Admission:</strong> {currency} {Number(data.paidFee || 0).toLocaleString()}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Residential Address:</strong> {data.address || 'N/A'}, {data.city || 'Lahore'}</div>
                </div>

                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Student / Parent Signature</span>
                  </div>
                  <OfficialSeal size={50} />
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Principal / Admission Officer</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 4. STUDENT ID CARD (FRONT & BACK)                              */}
            {/* ============================================================== */}
            {documentType === 'student_id_card' && (
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '20px' }}>
                {/* Front of ID Card */}
                <div
                  style={{
                    width: '260px',
                    height: '410px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #071329)', color: '#ffffff', padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '3px' }}>
                      <OfficialSeal size={28} />
                      <strong style={{ fontSize: '0.8rem', letterSpacing: '0.04em' }}>{settings.academyName || 'AL GHAZI INSTITUTE'}</strong>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#ffd700', textTransform: 'uppercase', fontWeight: 700 }}>STUDENT IDENTITY CARD</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', flex: 1 }}>
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt={data.name} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #2563eb' }} />
                    ) : (
                      <div style={{ width: 84, height: 84, borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800 }}>
                        {data.name?.charAt(0)}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px 0' }}>{data.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>{data.courseName}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>Roll #: {data.rollNo}</span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>S/D of: {data.fatherName}</span>
                  </div>

                  <div style={{ padding: '8px 12px', backgroundColor: '#f8f7f4', borderTop: '1px solid #e8e6df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
                    <span>Emergency: {data.parentPhone || data.phone}</span>
                    <OfficialSeal size={26} />
                  </div>
                </div>

                {/* Back of ID Card */}
                <div
                  style={{
                    width: '260px',
                    height: '410px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#faf9f5',
                    padding: '16px',
                    boxSizing: 'border-box',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#071329', textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>
                      TERMS & CONDITIONS
                    </h4>
                    <ul style={{ fontSize: '0.65rem', color: '#475569', paddingLeft: '14px', marginTop: '8px', lineHeight: 1.5 }}>
                      <li>This card must be worn at all times inside campus.</li>
                      <li>Lost card must be reported immediately to registry.</li>
                      <li>Card is non-transferable and property of the institute.</li>
                    </ul>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <AlGhaziQrCode
                      value={settings.website || "http://alghazidigital.site.je/"}
                      websiteUrl={settings.website || "http://alghazidigital.site.je/"}
                      size={54}
                      label="Scan to Verify"
                    />
                  </div>

                  <div style={{ textAlign: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '6px', fontSize: '0.65rem', color: '#64748b' }}>
                    <strong>Principal / Director Signature</strong>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* 5. FACULTY / TEACHER ID CARD                                   */}
            {/* ============================================================== */}
            {documentType === 'teacher_id_card' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div
                  style={{
                    width: '260px',
                    height: '410px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div style={{ background: 'linear-gradient(135deg, #15803d, #064e3b)', color: '#ffffff', padding: '12px 10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '3px' }}>
                      <OfficialSeal size={28} />
                      <strong style={{ fontSize: '0.8rem' }}>{settings.academyName || 'AL GHAZI INSTITUTE'}</strong>
                    </div>
                    <span style={{ fontSize: '0.62rem', color: '#ffd700', textTransform: 'uppercase', fontWeight: 700 }}>FACULTY / INSTRUCTOR CARD</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', flex: 1 }}>
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt={data.name} style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #16a34a' }} />
                    ) : (
                      <div style={{ width: 84, height: 84, borderRadius: '50%', backgroundColor: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800 }}>
                        {data.name?.charAt(0)}
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 2px 0' }}>{data.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>{data.qualification || 'Faculty Lead'}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>Staff ID: {data.teacherId}</span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Assigned: {data.assignedCourses}</span>
                  </div>

                  <div style={{ padding: '8px 12px', backgroundColor: '#f8f7f4', borderTop: '1px solid #e8e6df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem' }}>
                    <span>Phone: {data.phone}</span>
                    <OfficialSeal size={26} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
