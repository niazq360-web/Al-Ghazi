import React from 'react';
import { X, Settings, Check } from 'lucide-react';

export default function SetupWizardModal({
  isOpen,
  onClose,
  settings,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-wide">
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
            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#dbeafe', color: '#2563eb' }}>
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Institute Settings & Branding Wizard
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Configure Academy Name, Official Seal, Website, Signatory & Contacts
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const updated = {
              ...settings,
              academyName: form.academyName.value,
              tagline: form.tagline.value,
              registrationNumber: form.registrationNumber.value,
              website: form.website.value,
              phone: form.phone.value,
              email: form.email.value,
              address: form.address.value,
              city: form.city.value,
              principalName: form.principalName.value,
              directorName: form.directorName.value,
              academicSession: form.academicSession.value,
              currencySymbol: form.currencySymbol.value
            };
            onSave(updated);
            onClose();
          }}
          style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label className="form-label">Academy / Institute Name *</label>
            <input
              type="text"
              name="academyName"
              required
              defaultValue={settings.academyName || 'AL GHAZI DIGITAL INSTITUTE'}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label className="form-label">Institute Slogan / Tagline</label>
              <input
                type="text"
                name="tagline"
                defaultValue={settings.tagline || 'Excellence in IT & Digital Skills'}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Govt / Board Registration #</label>
              <input
                type="text"
                name="registrationNumber"
                defaultValue={settings.registrationNumber || 'AG-REG-2026-904'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label className="form-label">Institute Official Website *</label>
              <input
                type="text"
                name="website"
                required
                defaultValue={settings.website || 'http://alghazidigital.site.je/'}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Currency Symbol</label>
              <input
                type="text"
                name="currencySymbol"
                defaultValue={settings.currencySymbol || 'Rs.'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label className="form-label">Official Phone / WhatsApp</label>
              <input
                type="text"
                name="phone"
                defaultValue={settings.phone || '0300-1234567'}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Official Email</label>
              <input
                type="email"
                name="email"
                defaultValue={settings.email || 'info@alghazidigital.site.je'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label className="form-label">Principal / Director Name</label>
              <input
                type="text"
                name="principalName"
                defaultValue={settings.principalName || 'Prof. Muhammad Niaz'}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Academic Session</label>
              <input
                type="text"
                name="academicSession"
                defaultValue={settings.academicSession || 'Session 2026-2027'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Campus Physical Address</label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address || 'Civil Lines, Near Judicial Complex'}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                defaultValue={settings.city || 'Gujranwala'}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
