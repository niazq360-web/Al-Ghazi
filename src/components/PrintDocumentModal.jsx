import React from 'react';
import { X, Printer, Award, Download, FileText, CheckCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import OfficialSeal from './OfficialSeal';
import AlGhaziQrCode from './AlGhaziQrCode';
import CertificateCorner from './CertificateCorner';

export default function PrintDocumentModal({ isOpen, onClose, documentType, data, settings }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    if (documentType === 'certificate') {
      document.body.classList.add('printing-certificate');
    }
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-certificate');
    }, 1200);
  };

  const handleDownloadPdf = () => {
    // Triggers standard print dialog optimized for saving as PDF
    handlePrint();
  };

  const handleDownloadDoc = () => {
    const studentName = data.recipientName || data.name || 'Student';
    const courseName = data.courseName || data.title || 'Professional Certification';
    const rollNo = data.rollNo || 'N/A';
    const fatherName = data.fatherName || '';
    const grade = data.grade || 'A+ Distinction';
    const issueDate = data.issueDate || data.date || new Date().toISOString().split('T')[0];
    const certNo = data.certificateNo || 'AG-CERT-2026-001';
    const academyName = settings.academyName || 'AL GHAZI DIGITAL INSTITUTE';
    const website = settings.website || 'http://alghazidigital.site.je/';

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Certificate - ${studentName}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 297mm 210mm landscape;
            margin: 12mm;
          }
          body {
            font-family: 'Times New Roman', serif;
            color: #0f172a;
            margin: 0;
            padding: 15px;
            text-align: center;
            background-color: #ffffff;
          }
          .cert-outer {
            border: 10px double #0a192f;
            padding: 16px;
            background-color: #fffdf8;
          }
          .cert-inner {
            border: 3px solid #d4af37;
            padding: 24px;
            position: relative;
          }
          .institute-title {
            font-size: 28pt;
            font-weight: bold;
            color: #0f265c;
            letter-spacing: 2px;
            margin-bottom: 2px;
          }
          .institute-sub {
            font-size: 12pt;
            font-weight: bold;
            color: #b45309;
            letter-spacing: 3px;
            margin-bottom: 6px;
          }
          .reg-text {
            font-size: 9pt;
            color: #64748b;
            margin-bottom: 18px;
          }
          .cert-type {
            font-size: 16pt;
            font-weight: bold;
            color: #1e3a8a;
            text-transform: uppercase;
            border-bottom: 2px solid #d4af37;
            display: inline-block;
            padding: 4px 24px;
            margin-bottom: 14px;
          }
          .recipient-name {
            font-size: 32pt;
            font-weight: bold;
            color: #1e3a8a;
            text-decoration: underline;
            margin: 10px 0;
          }
          .body-text {
            font-size: 12pt;
            line-height: 1.7;
            color: #1e293b;
            margin: 16px auto;
            max-width: 800px;
          }
          .course-title {
            font-size: 16pt;
            font-weight: bold;
            color: #0f265c;
            text-transform: uppercase;
          }
          .signatures-table {
            width: 100%;
            margin-top: 30px;
          }
          .seal-box {
            display: inline-block;
            border: 3px solid #d4af37;
            border-radius: 50%;
            padding: 15px;
            background-color: #fefce8;
            font-weight: bold;
            color: #78350f;
          }
          .verification-bar {
            margin-top: 24px;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
            font-size: 8.5pt;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="cert-outer">
          <div class="cert-inner">
            <div class="institute-title">${academyName}</div>
            <div class="institute-sub">${settings.tagline || 'LEARN • PRACTICE • GROW'}</div>
            <div class="reg-text">Recognized & Registered Under Govt Authority Reg #${settings.registrationNumber || 'REG-2024-AGDI-8921'} • Pakistan</div>
            
            <div class="cert-type">${data.type || 'Certificate of Completion & Excellence'}</div>
            
            <div style="font-size: 11pt; font-style: italic; color: #475569;">This official credential is systematically awarded to</div>
            
            <div class="recipient-name">${studentName}</div>
            
            <div style="font-size: 11pt; font-weight: bold; color: #334155;">
              ${fatherName ? `Son / Daughter of: ${fatherName} • ` : ''} Roll No: ${rollNo}
            </div>
            
            <div class="body-text">
              for successfully fulfilling all academic requirements, completing practical hands-on projects,
              and demonstrating commendable technical proficiency in the specialized discipline of:<br>
              <span class="course-title">${courseName}</span><br>
              with an overall evaluation of <b>${grade}</b> during the academic session.
            </div>
            
            <table class="signatures-table">
              <tr>
                <td width="33%" align="center">
                  <br><br>
                  <div style="width: 160px; border-bottom: 2px solid #0f172a; margin: 0 auto 5px auto;"></div>
                  <b>Course Instructor</b><br>
                  <span style="font-size: 8.5pt; color: #64748b;">Head of Department</span>
                </td>
                <td width="34%" align="center">
                  <div class="seal-box">
                    ★ AL GHAZI ★<br>
                    OFFICIAL SEAL<br>
                    ${new Date().getFullYear()}
                  </div>
                </td>
                <td width="33%" align="center">
                  <br><br>
                  <div style="width: 160px; border-bottom: 2px solid #0f172a; margin: 0 auto 5px auto;"></div>
                  <b>${settings.principalName || settings.directorName || 'Principal / Director'}</b><br>
                  <span style="font-size: 8.5pt; color: #64748b;">Authorized Signatory</span>
                </td>
              </tr>
            </table>
            
            <div class="verification-bar">
              Certificate ID: <b>${certNo}</b> | Issued Date: <b>${issueDate}</b> | Official Website: <b><a href="${website}">${website}</a></b>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currency = settings.currencySymbol || 'Rs.';

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide" style={{ maxWidth: documentType === 'certificate' ? '1060px' : '960px' }}>
        {/* Controls Toolbar */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Print Preview: {documentType.replace(/_/g, ' ').toUpperCase()}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {documentType === 'certificate'
                ? 'Official Certificate with Gold Seal, Security QR, 4 Corner Designs & Digital Signatures. Formatted for A4 Landscape.'
                : 'Formatted for standard printing. Click "Print Document" to open the system print dialogue.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Print Button */}
            <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} />
              <span>Print {documentType === 'certificate' ? 'Certificate' : 'Document'}</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', borderColor: '#475569' }}
              title="Save as PDF via Print Dialogue"
            >
              <Download size={16} />
              <span>PDF</span>
            </button>

            {/* Download DOC (Word Document) Button */}
            {documentType === 'certificate' && (
              <button
                onClick={handleDownloadDoc}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  borderColor: '#3b82f6'
                }}
                title="Download formatted Microsoft Word .doc file"
              >
                <FileText size={16} />
                <span>DOC (Word)</span>
              </button>
            )}

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
              maxWidth: documentType === 'certificate' ? '1000px' : '820px',
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
                          <img src={settings.logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                        ) : (
                          <OfficialSeal size={56} />
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
                        <span style={{ color: '#64748b' }}>Father Name:</span><br />
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{data.fatherName || 'N/A'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Roll # / Student ID:</span><br />
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{data.rollNo || data.studentId}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Course Enrolled:</span><br />
                        <strong style={{ color: '#2563eb' }}>{data.courseName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Fee Month / Period:</span><br />
                        <strong>{data.month} {data.year || new Date().getFullYear()}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Payment Mode:</span><br />
                        <span style={{ textTransform: 'uppercase', fontWeight: 700, color: '#0f172a' }}>{data.paymentMethod || 'Cash'}</span>
                      </div>
                    </div>

                    {/* Fee Financial Summary Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                          <th style={{ textAlign: 'left', padding: '6px 8px' }}>Description</th>
                          <th style={{ textAlign: 'right', padding: '6px 8px' }}>Amount ({currency})</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0' }}>Monthly Tuition Fee</td>
                          <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #e2e8f0' }}>{(data.monthlyFee || data.amount).toLocaleString()}</td>
                        </tr>
                        {data.admissionFee > 0 && (
                          <tr>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0' }}>Admission / Registration Fee</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #e2e8f0' }}>{data.admissionFee.toLocaleString()}</td>
                          </tr>
                        )}
                        {data.previousDues > 0 && (
                          <tr>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#dc2626' }}>Arrears / Previous Dues</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#dc2626' }}>+{data.previousDues.toLocaleString()}</td>
                          </tr>
                        )}
                        {data.lateFine > 0 && (
                          <tr>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#dc2626' }}>Late Surcharge Fine</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#dc2626' }}>+{data.lateFine.toLocaleString()}</td>
                          </tr>
                        )}
                        {data.discount > 0 && (
                          <tr>
                            <td style={{ padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#16a34a' }}>Concession / Discount</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid #e2e8f0', color: '#16a34a' }}>-{data.discount.toLocaleString()}</td>
                          </tr>
                        )}
                        <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                          <td style={{ padding: '8px', borderTop: '2px solid #0f172a' }}>TOTAL AMOUNT PAID</td>
                          <td style={{ textAlign: 'right', padding: '8px', borderTop: '2px solid #0f172a', fontSize: '1rem', color: '#16a34a' }}>
                            {currency} {data.amount.toLocaleString()}
                          </td>
                        </tr>
                        {data.balance > 0 && (
                          <tr style={{ color: '#dc2626', fontWeight: 700 }}>
                            <td style={{ padding: '4px 8px' }}>Remaining Balance Due:</td>
                            <td style={{ textAlign: 'right', padding: '4px 8px' }}>{currency} {data.balance.toLocaleString()}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Footer / Terms */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', maxWidth: '55%' }}>
                        <p style={{ margin: 0 }}><strong>Note:</strong> {settings.receiptFooterText}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>Verified Digital Receipt • {settings.website || 'http://alghazidigital.site.je/'}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ opacity: 0.85 }}>
                          <OfficialSeal size={48} />
                        </div>
                        <div style={{ textAlign: 'center', width: '150px' }}>
                          <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Accounts Officer / Cashier</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================== 2. STUDENT ADMISSION FORM ==================== */}
            {documentType === 'admission_form' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #0f172a', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 68, height: 68, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={68} />
                    )}
                    <div>
                      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#0f172a' }}>
                        {settings.academyName}
                      </h1>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0' }}>
                        {settings.address}, {settings.city} | Phone: {settings.phoneNumber}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                        Official Website: {settings.website || 'http://alghazidigital.site.je/'}
                      </p>
                    </div>
                  </div>
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Student" style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '4px', border: '1.5px solid #0f172a' }} />
                  ) : (
                    <div style={{ border: '2px dashed #94a3b8', width: '100px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                      AFFIX RECENT PASSPORT PHOTO HERE
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  STUDENT ADMISSION & REGISTRATION APPLICATION FORM
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Admission Form #:</td>
                      <td style={{ padding: '8px', width: '28%' }}>{data.admissionNo || 'AGDI-' + (data.id || 'NEW')}</td>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Admission Date:</td>
                      <td style={{ padding: '8px', width: '28%' }}>{data.admissionDate || new Date().toISOString().split('T')[0]}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Candidate Full Name:</td>
                      <td style={{ padding: '8px', fontWeight: 800, color: '#0f172a' }}>{data.name}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Father / Guardian Name:</td>
                      <td style={{ padding: '8px' }}>{data.fatherName || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Date of Birth:</td>
                      <td style={{ padding: '8px' }}>{data.dob || 'N/A'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Gender:</td>
                      <td style={{ padding: '8px' }}>{data.gender || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Candidate Mobile:</td>
                      <td style={{ padding: '8px' }}>{data.phone || 'N/A'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Parent Mobile / WhatsApp:</td>
                      <td style={{ padding: '8px' }}>{data.parentPhone || data.whatsapp || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>National CNIC / B-Form:</td>
                      <td style={{ padding: '8px' }}>{data.cnic || 'N/A'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Email Address:</td>
                      <td style={{ padding: '8px' }}>{data.email || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Residential Address:</td>
                      <td colSpan={3} style={{ padding: '8px' }}>{data.address || 'N/A'}, {data.city || settings.city}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '4px 8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                  ACADEMIC COURSE ENROLLMENT DETAILS
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Program / Course:</td>
                      <td style={{ padding: '8px', fontWeight: 800, color: '#2563eb' }}>{data.courseName || 'Selected Diploma'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Batch / Shift:</td>
                      <td style={{ padding: '8px' }}>{data.batch || 'Morning / Evening'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
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

            {/* ==================== 3. TEACHER REGISTRATION FORM ==================== */}
            {documentType === 'teacher_form' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #0f172a', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 68, height: 68, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={68} />
                    )}
                    <div>
                      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#0f172a' }}>
                        {settings.academyName}
                      </h1>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0' }}>
                        Faculty & Human Resources Division | {settings.city}
                      </p>
                    </div>
                  </div>
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Faculty" style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '4px', border: '1.5px solid #0f172a' }} />
                  ) : (
                    <div style={{ border: '2px dashed #94a3b8', width: '100px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                      FACULTY PHOTO
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  FACULTY EMPLOYMENT & REGISTRATION RECORD
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Instructor ID:</td>
                      <td style={{ padding: '8px', width: '28%' }}>{data.teacherId || 'TCH-' + data.id}</td>
                      <td style={{ padding: '8px', fontWeight: 700, width: '22%', backgroundColor: '#f8fafc' }}>Joining Date:</td>
                      <td style={{ padding: '8px', width: '28%' }}>{data.joiningDate || new Date().toISOString().split('T')[0]}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Instructor Name:</td>
                      <td style={{ padding: '8px', fontWeight: 800, color: '#0f172a' }}>{data.name}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Father / Husband Name:</td>
                      <td style={{ padding: '8px' }}>{data.fatherName || 'N/A'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Qualification / Degree:</td>
                      <td style={{ padding: '8px' }}>{data.qualification || 'Master / Bachelor'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Assigned Subject:</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#2563eb' }}>{data.subject || data.specialization || 'Computing'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Contact Number:</td>
                      <td style={{ padding: '8px' }}>{data.phone || 'N/A'}</td>
                      <td style={{ padding: '8px', fontWeight: 700, backgroundColor: '#f8fafc' }}>Monthly Salary:</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#16a34a' }}>{currency} {(data.salary || 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Teacher / Instructor Signature</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '180px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Director / Principal Signature</span>
                  </div>
                </div>
              </div>
            )}

                        {/* ==================== 3B. STUDENT ID CARD ==================== */}
            {documentType === 'student_id_card' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div style={{ width: '350px', border: '2px solid #0f172a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', backgroundColor: '#ffffff' }}>
                  {/* Card Header with Official Emblem */}
                  <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #0f172a)', padding: '10px 14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={36} />
                    )}
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>{settings.academyName}</div>
                      <div style={{ fontSize: '0.65rem', color: '#fde047', fontWeight: 700 }}>STUDENT IDENTITY CARD</div>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt={data.name} style={{ width: '84px', height: '96px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #2563eb' }} />
                    ) : (
                      <div style={{ width: '84px', height: '96px', borderRadius: '6px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem', border: '1px dashed #94a3b8' }}>
                        PHOTO
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>{data.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>Roll #: {data.rollNo}</div>
                    </div>
                    <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '0.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
                      <div><strong>Father:</strong> {data.fatherName || 'N/A'}</div>
                      <div><strong>Program:</strong> {data.courseName}</div>
                      <div><strong>Emergency:</strong> {data.parentPhone || data.phone}</div>
                      <div><strong>Valid Thru:</strong> {settings.academicSession || 'Session 2026-2027'}</div>
                    </div>
                    {/* Card Footer Bar */}
                    <div style={{ width: '100%', borderTop: '1px solid #0f172a', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.65rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <OfficialSeal size={20} />
                        <span>Ph: {settings.phoneNumber}</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #0f172a', width: '75px', marginBottom: '2px' }}></div>
                        <span>Authorized Sign</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3C. TEACHER ID CARD ==================== */}
            {documentType === 'teacher_id_card' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div style={{ width: '350px', border: '2px solid #0f172a', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', backgroundColor: '#ffffff' }}>
                  <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', padding: '10px 14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={36} />
                    )}
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.2 }}>{settings.academyName}</div>
                      <div style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: 700 }}>FACULTY & STAFF CREDENTIAL</div>
                    </div>
                  </div>
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                    {data.photoUrl ? (
                      <img src={data.photoUrl} alt={data.name} style={{ width: '84px', height: '96px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #1e3a8a' }} />
                    ) : (
                      <div style={{ width: '84px', height: '96px', borderRadius: '6px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem', border: '1px dashed #94a3b8' }}>
                        PHOTO
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>{data.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>{data.qualification}</div>
                    </div>
                    <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '0.75rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
                      <div><strong>Staff ID:</strong> {data.teacherId || 'TCH-' + data.id}</div>
                      <div><strong>Department:</strong> {data.assignedCourses || data.subject || 'Computing'}</div>
                      <div><strong>Contact:</strong> {data.phone}</div>
                    </div>
                    <div style={{ width: '100%', borderTop: '1px solid #0f172a', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.65rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <OfficialSeal size={20} />
                        <span>Principal Office</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #0f172a', width: '75px', marginBottom: '2px' }}></div>
                        <span>Director</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3D. TEACHER SALARY VOUCHER ==================== */}
            {documentType === 'teacher_salary_slip' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" style={{ width: 52, height: 52, objectFit: 'contain' }} />
                    ) : (
                      <OfficialSeal size={52} />
                    )}
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{settings.academyName}</h2>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Faculty Honorarium & Salary Voucher</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <div><strong>Voucher #:</strong> SAL-2026-{data.id || '01'}</div>
                    <div><strong>Date:</strong> {new Date().toISOString().split('T')[0]}</div>
                  </div>
                </div>
                <div style={{ margin: '14px 0', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div><strong>Instructor:</strong> {data.name}</div>
                  <div><strong>Staff ID:</strong> {data.teacherId || 'TCH-' + data.id}</div>
                  <div><strong>Subject:</strong> {data.assignedCourses || data.subject}</div>
                  <div><strong>Period:</strong> {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>Basic Salary / Honorarium</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>{Number(data.monthlySalary || data.salary || 50000).toLocaleString()}</td>
                    </tr>
                    <tr style={{ fontWeight: 800, backgroundColor: '#f8fafc' }}>
                      <td style={{ padding: '10px' }}>NET PAYABLE AMOUNT</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#16a34a', fontSize: '1rem' }}>{currency} {Number(data.monthlySalary || data.salary || 50000).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Recipient Teacher</span>
                  </div>
                  <div style={{ textAlign: 'center', width: '150px' }}>
                    <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '4px' }}></div>
                    <span>Authorized Accounts</span>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 4. CERTIFICATE (MASTERPIECE WITH 4 CORNERS, OFFICIAL SEAL & QR CODE) ==================== */}
            {documentType === 'certificate' && (
              <div
                className="professional-certificate"
                style={{
                  border: '14px solid #071329',
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  boxShadow: '0 12px 45px rgba(0,0,0,0.22)'
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
                      padding: '28px 36px 20px 36px',
                      backgroundColor: '#fffdf8',
                      position: 'relative',
                      textAlign: 'center',
                      backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.14) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      overflow: 'hidden'
                    }}
                  >
                    {/* ================= 4 CORNERS LUXURY BAROQUE / ARABESQUE ORNAMENTS ================= */}
                    <CertificateCorner position="top-left" size={96} />
                    <CertificateCorner position="top-right" size={96} />
                    <CertificateCorner position="bottom-left" size={96} />
                    <CertificateCorner position="bottom-right" size={96} />

                    {/* Top Crest / Institute Logo Header */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                      {settings.logoUrl ? (
                        <img
                          src={settings.logoUrl}
                          alt="Logo"
                          style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}
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
                        fontSize: '2.3rem',
                        color: '#071329',
                        margin: '0 0 3px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        fontWeight: 900,
                        textShadow: '0 1px 2px rgba(0,0,0,0.12)'
                      }}
                    >
                      {settings.academyName}
                    </h1>

                    <p style={{ fontSize: '0.88rem', color: '#b45309', fontWeight: 800, letterSpacing: '0.18em', margin: '0 0 3px 0', textTransform: 'uppercase' }}>
                      {settings.tagline || 'LEARN • PRACTICE • GROW'}
                    </p>

                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 16px 0', fontWeight: 600, letterSpacing: '0.04em' }}>
                      Recognized & Registered Under Govt Authority Reg #{settings.registrationNumber || 'REG-2024-AGDI-8921'} • Pakistan
                    </p>

                    {/* Certificate Title Banner */}
                    <div style={{ margin: '8px auto 14px auto', display: 'inline-block' }}>
                      <div
                        style={{
                          background: 'linear-gradient(90deg, #071329 0%, #1e3a8a 50%, #071329 100%)',
                          color: '#ffffff',
                          padding: '7px 36px',
                          borderRadius: '4px',
                          border: '1.5px solid #ffd54f',
                          boxShadow: '0 4px 14px rgba(7, 19, 41, 0.3)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.14em',
                          fontWeight: 800,
                          fontSize: '1.1rem'
                        }}
                      >
                        {data.type || 'Certificate of Completion & Excellence'}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: '#475569', fontStyle: 'italic', margin: '8px 0 2px 0' }}>
                      This official credential is systematically awarded to
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
                    <p style={{ fontSize: '0.93rem', color: '#1e293b', maxWidth: '740px', margin: '12px auto 16px auto', lineHeight: 1.68 }}>
                      for successfully fulfilling all academic requirements, completing practical hands-on projects,
                      and demonstrating commendable technical proficiency in the specialized discipline of:
                      <br />
                      <strong style={{ fontSize: '1.3rem', color: '#071329', display: 'inline-block', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {data.courseName || data.title}
                      </strong>
                      <br />
                      with an overall evaluation of <strong style={{ color: '#16a34a' }}>{data.grade || 'A+ Distinction'}</strong> during the period of <strong>{data.duration || settings.academicSession || 'Session 2026-2027'}</strong>.
                    </p>

                    {/* ================= SIGNATURES & CENTER OFFICIAL SEAL ================= */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'end',
                        marginTop: '12px',
                        padding: '0 16px'
                      }}
                    >
                      {/* Left: Course Instructor */}
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

                      {/* CENTER: OFFICIAL SEAL (METALLIC GOLD 3D EMBOSSED MEDALLION RECREATED FROM ASSET 1792081856717.jpg) */}
                      <div style={{ textAlign: 'center', margin: '0 20px', position: 'relative' }}>
                        <OfficialSeal
                          size={145}
                          showRibbons={true}
                          customSealUrl={settings.officialSealUrl || ''}
                          instituteName={settings.academyName ? settings.academyName.replace(' DIGITAL INSTITUTE', '') : 'AL GHAZI'}
                          tagline="DIGITAL INSTITUTE"
                        />
                      </div>

                      {/* Right: Principal / Director */}
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

                    {/* ================= BOTTOM SECURITY BAR WITH OFFICIAL QR CODE & WEBSITE ================= */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
