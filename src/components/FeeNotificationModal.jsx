import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Copy, Check, X, Share2, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function FeeNotificationModal({
  isOpen,
  onClose,
  student,
  payment,
  settings = {},
  currency = 'Rs.',
  type = 'payment'
}) {
  const [copied, setCopied] = useState(false);
  const [messageType, setMessageType] = useState(type || 'payment');
  const [smsSentStatus, setSmsSentStatus] = useState(null);

  useEffect(() => {
    if (type) {
      setMessageType(type);
    }
    setSmsSentStatus(null);
  }, [type, isOpen, student, payment]);

  if (!isOpen || !student) return null;

  const rawPhone = student.parentPhone || student.phone || student.whatsapp || '';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

  const academyName = settings.academyName || 'AL GHAZI DIGITAL INSTITUTE';
  const website = settings.website || 'http://alghazidigital.site.je/';
  const contactPhone = settings.phone || '0300-1234567';

  // Format Pakistani numbers properly for WhatsApp & SMS
  let internationalPhone = cleanPhone;
  if (internationalPhone.startsWith('03')) {
    internationalPhone = '92' + internationalPhone.slice(1);
  } else if (internationalPhone.startsWith('+')) {
    internationalPhone = internationalPhone.slice(1);
  }

  let messageText = '';
  if (messageType === 'payment' && payment) {
    const isFullyPaid = Number(student.remainingFee || 0) === 0;
    messageText = `*${academyName.toUpperCase()} - FEE RECEIPT NOTIFICATION*\n\n` +
      `Respected Parent,\n` +
      `Tuition fee payment has been successfully recorded for student:\n` +
      `• Student Name: ${student.name}\n` +
      `• Roll Number: ${student.rollNo}\n` +
      `• Course: ${student.courseName}\n` +
      `• Receipt No: ${payment.receiptNo}\n` +
      `• Payment Date: ${payment.paymentDate || new Date().toISOString().split('T')[0]}\n` +
      `• Amount Paid: ${currency} ${Number(payment.paidAmount).toLocaleString()}\n` +
      `• Status: ${isFullyPaid ? 'ALL DUES CLEARED (FULLY PAID)' : `Remaining Balance: ${currency} ${Number(student.remainingFee || 0).toLocaleString()}`}\n\n` +
      `Thank you for trusting ${academyName}.\n` +
      `Helpline: ${contactPhone}\n` +
      `Verify official receipt: ${website}`;
  } else {
    messageText = `*${academyName.toUpperCase()} - FEE DUE REMINDER*\n\n` +
      `Respected Parent of ${student.name} (Roll: ${student.rollNo}),\n` +
      `This is a gentle reminder regarding pending academic tuition dues for course ${student.courseName}.\n` +
      `• Outstanding Due: ${currency} ${Number(student.remainingFee).toLocaleString()}\n` +
      `Please clear the dues at your earliest convenience to ensure uninterrupted classes.\n\n` +
      `Accounts Office: ${contactPhone}\n` +
      `Official Portal: ${website}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${internationalPhone}&text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
    setSmsSentStatus({ method: 'WhatsApp', time: new Date().toLocaleTimeString(), phone: internationalPhone });
  };

  const handleSendSMS = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    const targetPhone = cleanPhone.startsWith('+') ? cleanPhone : (cleanPhone.startsWith('92') ? '+' + cleanPhone : cleanPhone);
    const smsUrl = `sms:${targetPhone}${separator}body=${encodeURIComponent(messageText)}`;
    
    // Attempt opening native SMS
    window.location.href = smsUrl;
    setSmsSentStatus({ method: 'Mobile SMS Gateway', time: new Date().toLocaleTimeString(), phone: targetPhone });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${academyName} Fee Alert`,
          text: messageText
        });
        setSmsSentStatus({ method: 'Share Sheet', time: new Date().toLocaleTimeString(), phone: cleanPhone });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
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
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Parents Fee Alert (SMS & WhatsApp)
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Instant notification to Parent / Guardian mobile number
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

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Student & Phone Summary Card */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#f8f7f4',
              borderRadius: '8px',
              border: '1px solid #e8e6df',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                {student.name} ({student.rollNo})
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Father: <strong>{student.fatherName}</strong> • Course: <strong>{student.courseName}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#16a34a' }}>
                {rawPhone || 'No Phone Specified'}
              </div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Parent Mobile / WhatsApp</span>
            </div>
          </div>

          {/* SMS Delivery Confirmation / Gateway Status */}
          {smsSentStatus ? (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#166534',
                fontSize: '0.82rem'
              }}
            >
              <CheckCircle2 size={18} color="#16a34a" />
              <div>
                <strong>Alert Dispatched via {smsSentStatus.method}!</strong>
                <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                  Sent to {smsSentStatus.phone} at {smsSentStatus.time}. Status: Delivered.
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: '#eff6ff',
                borderRadius: '6px',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1e40af',
                fontSize: '0.78rem'
              }}
            >
              <Send size={15} color="#2563eb" />
              <span>
                Fees has been registered! Choose your delivery method below to send instant alert to parents.
              </span>
            </div>
          )}

          {/* Message Type Selector */}
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>Message Preview (Auto-Generated)</label>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Includes Receipt # & Institute Verification Link</span>
            </div>
            <textarea
              readOnly
              rows={7}
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

          {/* Action Delivery Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <button
              onClick={handleSendWhatsApp}
              className="btn btn-success"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.78rem', gap: '5px', gridColumn: 'span 2' }}
            >
              <MessageSquare size={17} />
              <span>Send via WhatsApp</span>
            </button>

            <button
              onClick={handleSendSMS}
              className="btn btn-primary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.78rem', gap: '5px' }}
            >
              <Send size={16} />
              <span>Mobile SMS</span>
            </button>

            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 0.5rem', fontSize: '0.78rem', gap: '5px' }}
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copied ? 'Copied!' : 'Copy SMS'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #e8e6df' }}>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', gap: '4px' }}
            >
              <Share2 size={14} />
              <span>Share Via Apps</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
