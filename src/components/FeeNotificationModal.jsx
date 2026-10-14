import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, Copy, Check, Share2 } from 'lucide-react';

export default function FeeNotificationModal({ isOpen, onClose, student, payment, settings, type = 'payment' }) {
  if (!isOpen || !student) return null;

  const [copied, setCopied] = useState(false);
  const currency = settings.currencySymbol || 'Rs.';
  const recipientPhone = (student.parentPhone || student.whatsapp || student.phone || '').replace(/[^0-9+]/g, '');

  const defaultMessage = type === 'payment' && payment
    ? `Assalam-o-Alaikum / Greetings! Dear Parent, we have successfully received fee payment of ${currency} ${payment.paidAmount.toLocaleString()} for student ${student.name} (Roll #: ${student.rollNo}) on ${payment.paymentDate}. Course: ${student.courseName}. Remaining balance due: ${currency} ${(payment.remainingDue || 0).toLocaleString()}. Receipt #: ${payment.receiptNo}. Regards, ${settings.academyName} (Contact: ${settings.phoneNumber})`
    : `Assalam-o-Alaikum / Greetings! Dear Parent of ${student.name} (Roll #: ${student.rollNo}), this is a gentle fee reminder from ${settings.academyName}. Outstanding balance due for course ${student.courseName} is ${currency} ${Number(student.remainingFee).toLocaleString()}. Kindly clear the dues at your earliest convenience to avoid fine. Regards, Accounts Dept, ${settings.academyName} (Contact: ${settings.phoneNumber})`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const cleanNumber = recipientPhone.replace('+', '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #233554' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              {type === 'payment' ? 'Send Fee Payment SMS / WhatsApp' : 'Send Dues Reminder Notification'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Notify student's guardian via instant WhatsApp message or SMS text
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Recipient Parent / Guardian Mobile</label>
            <input
              type="text"
              readOnly
              value={`${recipientPhone} (${student.name}'s Guardian)`}
              className="form-input"
              style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}
            />
          </div>

          <div>
            <label className="form-label">Message Template</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
              style={{ lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={handleCopy} className="btn btn-secondary">
              {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy SMS Text'}</span>
            </button>

            <button onClick={handleWhatsApp} className="btn btn-success" style={{ gap: '0.5rem' }}>
              <Send size={16} />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
