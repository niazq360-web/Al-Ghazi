import React, { useState } from 'react';
import { Send, MessageSquare, Copy, Check, X, PhoneCall, ShieldCheck, ExternalLink } from 'lucide-react';

/**
 * FeeNotificationModal Component
 * Facilitates sending instant SMS / WhatsApp fee receipt alerts directly to Parents.
 * Pre-populates clean bilingual (English/Urdu context) notification with amount paid,
 * receipt number, student roll number, remaining dues balance, and institute portal link.
 */
export default function FeeNotificationModal({
  isOpen,
  onClose,
  student,
  payment,
  settings,
  currency = 'Rs.'
}) {
  const [copied, setCopied] = useState(false);
  const [messageType, setMessageType] = useState('payment'); // 'payment' | 'due_reminder'

  if (!isOpen || !student) return null;

  const parentPhone = student.parentPhone || student.phone || student.whatsapp || '';
  const cleanPhone = parentPhone.replace(/[^0-9+]/g, '');

  const academyName = settings.academyName || 'Al Ghazi Digital Institute';
  const website = settings.website || 'http://alghazidigital.site.je/';

  // Construct official message text
  let messageText = '';
  if (messageType === 'payment' && payment) {
    messageText = `*${academyName.toUpperCase()} - FEE RECEIPT NOTIFICATION*\n\n` +
      `Respected Parent,\n` +
      `Fee payment has been successfully received for student:\n` +
      `• Student Name: ${student.name}\n` +
      `• Roll Number: ${student.rollNo}\n` +
      `• Course: ${student.courseName}\n` +
      `• Receipt No: ${payment.receiptNo}\n` +
      `• Date: ${payment.paymentDate || new Date().toISOString().split('T')[0]}\n` +
      `• Amount Paid: ${currency} ${Number(payment.paidAmount).toLocaleString()}\n` +
      `• Remaining Due: ${currency} ${Number(student.remainingFee || 0).toLocaleString()}\n\n` +
      `Thank you for trusting ${academyName}.\n` +
      `Verify receipt online: ${website}`;
  } else {
    messageText = `*${academyName.toUpperCase()} - FEE DUE REMINDER*\n\n` +
      `Respected Parent of ${student.name} (Roll: ${student.rollNo}),\n` +
      `This is a gentle reminder regarding pending academic tuition dues for course ${student.courseName}.\n` +
      `• Outstanding Due: ${currency} ${Number(student.remainingFee).toLocaleString()}\n` +
      `Please clear the dues at your earliest convenience to ensure uninterrupted classes.\n\n` +
      `Accounts Office: ${settings.phone || '0300-0000000'}\n` +
      `Portal: ${website}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    // Format phone for international WhatsApp link
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('03')) {
      formattedPhone = '92' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.slice(1);
    }
    const url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  const handleSendSMS = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    const smsUrl = `sms:${cleanPhone}${separator}body=${encodeURIComponent(messageText)}`;
    window.location.href = smsUrl;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Send Parents Fee Alert (SMS / WhatsApp)
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Instant notification to Parent / Guardian WhatsApp
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Recipient Snapshot */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#f8f7f4',
              borderRadius: '8px',
              border: '1px solid #e8e6df',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {student.name} ({student.rollNo})
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Father: <strong>{student.fatherName}</strong> • Course: <strong>{student.courseName}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>
                {cleanPhone || 'No Phone Number'}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Parent Mobile</span>
            </div>
          </div>

          {/* Toggle Message Template */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setMessageType('payment')}
              className={`btn ${messageType === 'payment' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
            >
              Fee Payment Receipt
            </button>
            <button
              type="button"
              onClick={() => setMessageType('due_reminder')}
              className={`btn ${messageType === 'due_reminder' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ flex: 1, padding: '0.45rem', fontSize: '0.75rem' }}
            >
              Pending Due Reminder
            </button>
          </div>

          {/* Message Preview Box */}
          <div>
            <label className="form-label">SMS / WhatsApp Message Text</label>
            <textarea
              readOnly
              rows={8}
              value={messageText}
              className="form-textarea"
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                backgroundColor: '#ffffff',
                lineHeight: 1.5,
                padding: '0.75rem'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              onClick={handleSendWhatsApp}
              className="btn btn-success"
              style={{ padding: '0.6rem 0.5rem', fontSize: '0.78rem', gap: '5px' }}
            >
              <MessageSquare size={16} />
              <span>Send WhatsApp</span>
            </button>

            <button
              onClick={handleSendSMS}
              className="btn btn-primary"
              style={{ padding: '0.6rem 0.5rem', fontSize: '0.78rem', gap: '5px' }}
            >
              <Send size={16} />
              <span>Send Mobile SMS</span>
            </button>

            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 0.5rem', fontSize: '0.78rem', gap: '5px' }}
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
