import React, { useState } from 'react';
import { X, Check, Upload, Trash2, ArrowRight, Building, Phone, Image, FileText } from 'lucide-react';

export default function SetupWizardModal({ isOpen, onClose, settings, onSaveSettings }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ ...settings });
  const [previewLogo, setPreviewLogo] = useState(settings.logoUrl || '');

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
        setFormData((prev) => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewLogo('');
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({ ...formData, isConfigured: true });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              Institute Setup Wizard
            </h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
              Configure your institute profile, logo, receipt styles & system defaults
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          {[
            { num: 1, title: 'Profile & Info', icon: Building },
            { num: 2, title: 'Contact & Campus', icon: Phone },
            { num: 3, title: 'Logo & Branding', icon: Image },
            { num: 4, title: 'Receipt & Policy', icon: FileText }
          ].map((s) => {
            const Icon = s.icon;
            const active = step === s.num;
            const completed = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 0.5rem',
                  border: 'none',
                  borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
                  background: active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  color: active ? '#60a5fa' : completed ? '#34d399' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Institute / Academy Name *</label>
                <input
                  type="text"
                  required
                  value={formData.academyName || ''}
                  onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Al Ghazi Digital Institute"
                />
              </div>
              <div>
                <label className="form-label">Institute Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="form-input"
                  placeholder="e.g. LEARN • PRACTICE • GROW"
                />
              </div>
              <div>
                <label className="form-label">Registration / Affiliation Number</label>
                <input
                  type="text"
                  value={formData.registrationNumber || ''}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className="form-input"
                  placeholder="e.g. REG-2024-AGDI-8921"
                />
              </div>
              <div>
                <label className="form-label">Academic Session</label>
                <input
                  type="text"
                  value={formData.academicSession || ''}
                  onChange={(e) => setFormData({ ...formData, academicSession: e.target.value })}
                  className="form-input"
                  placeholder="e.g. 2026-2027"
                />
              </div>
              <div>
                <label className="form-label">Principal / Dean Name</label>
                <input
                  type="text"
                  value={formData.principalName || ''}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Prof. Al Ghazi"
                />
              </div>
              <div>
                <label className="form-label">Director / Owner Name</label>
                <input
                  type="text"
                  value={formData.directorName || ''}
                  onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Engr. Niaz Qasim"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Official Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="form-input"
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className="form-label">WhatsApp Number (For Fee Alerts)</label>
                <input
                  type="text"
                  value={formData.whatsappNumber || ''}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="form-input"
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="info@alghazi.edu.pk"
                />
              </div>
              <div>
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="form-input"
                  placeholder="https://niazq360-web.github.io/Al-Ghazi/"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Campus Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Main Campus, Al Ghazi Complex, Education Corridor"
                />
              </div>
              <div>
                <label className="form-label">City, Country</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Lahore, Pakistan"
                />
              </div>
              <div>
                <label className="form-label">SMS Sender Header (Max 11 chars)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={formData.smsSenderName || ''}
                  onChange={(e) => setFormData({ ...formData, smsSenderName: e.target.value.toUpperCase() })}
                  className="form-input"
                  placeholder="e.g. AL-GHAZI"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Institute Official Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem', background: '#0d1526', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed #233554' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '0.75rem', backgroundColor: '#1a2742', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #334155' }}>
                    {previewLogo ? (
                      <img src={previewLogo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Building size={36} color="#64748b" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>Upload Institute Crest or Logo</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      PNG, JPG, or SVG up to 2MB. Appears automatically on receipts, ID cards, admission forms & certificates.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                        <Upload size={14} />
                        <span>Upload File</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      </label>
                      {previewLogo && (
                        <button type="button" onClick={handleRemoveLogo} className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Primary Theme Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="color"
                      value={formData.primaryColor || '#2563eb'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      style={{ width: 44, height: 38, border: 'none', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#2563eb'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Accent / Secondary Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="color"
                      value={formData.secondaryColor || '#f59e0b'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      style={{ width: 44, height: 38, border: 'none', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#f59e0b'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="form-label">Currency Code</label>
                <input
                  type="text"
                  value={formData.currency || 'PKR'}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="form-input"
                  placeholder="e.g. PKR, USD, EUR"
                />
              </div>
              <div>
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  value={formData.currencySymbol || 'Rs.'}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Rs. or $"
                />
              </div>
              <div>
                <label className="form-label">Fee Receipt Prefix</label>
                <input
                  type="text"
                  value={formData.receiptPrefix || 'REC-2026-'}
                  onChange={(e) => setFormData({ ...formData, receiptPrefix: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Certificate ID Prefix</label>
                <input
                  type="text"
                  value={formData.certificatePrefix || 'AG-CERT-2026-'}
                  onChange={(e) => setFormData({ ...formData, certificatePrefix: e.target.value })}
                  className="form-input"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.dualReceipt ?? true}
                    onChange={(e) => setFormData({ ...formData, dualReceipt: e.target.checked })}
                    style={{ width: 18, height: 18, accentColor: '#3b82f6' }}
                  />
                  <span>Dual Copy Receipt Layout (Print Student Copy + Institute Copy side-by-side or stacked on single A4 page)</span>
                </label>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Receipt Terms & Footer Note</label>
                <textarea
                  rows={2}
                  value={formData.receiptFooterText || ''}
                  onChange={(e) => setFormData({ ...formData, receiptFooterText: e.target.value })}
                  className="form-textarea"
                  placeholder="Terms printed at bottom of fee receipts..."
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #233554' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn btn-secondary"
              >
                Previous Step
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn btn-primary"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  <Check size={16} />
                  <span>Save & Apply Everywhere</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
