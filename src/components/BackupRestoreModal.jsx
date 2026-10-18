import React, { useRef, useState } from 'react';
import { X, Download, Upload, ShieldCheck, Check } from 'lucide-react';

export default function BackupRestoreModal({
  isOpen,
  onClose,
  allData = {},
  onRestore
}) {
  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const date = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `al_ghazi_backup_${date}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMsg('Backup downloaded successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (window.confirm('Are you sure you want to restore this database? Existing records will be updated.')) {
          onRestore(parsed);
          setStatusMsg('Database restored successfully!');
          setTimeout(() => onClose(), 1500);
        }
      } catch (err) {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Backup & Restore Database
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.825rem', color: '#475569', margin: 0 }}>
            Safeguard your institute records. Download complete database JSON or restore from an earlier backup.
          </p>

          {statusMsg && (
            <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#15803d', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              <span>{statusMsg}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={handleDownloadBackup}
              className="btn btn-primary"
              style={{ padding: '0.75rem', flexDirection: 'column', gap: '6px' }}
            >
              <Download size={22} />
              <span>Download Backup JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
              style={{ padding: '0.75rem', flexDirection: 'column', gap: '6px' }}
            >
              <Upload size={22} />
              <span>Restore from File</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
