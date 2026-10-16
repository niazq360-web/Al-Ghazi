import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertCircle, CheckCircle, Database, Trash2 } from 'lucide-react';

export default function BackupRestoreModal({
  isOpen,
  onClose,
  allData,
  onRestoreData,
  onResetToDemo,
  onClearAllRecords
}) {
  if (!isOpen) return null;

  const fileInputRef = useRef(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const handleDownloadBackup = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `al_ghazi_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMsg({ text: 'Backup downloaded successfully! Store this file safely.', type: 'success' });
    } catch (err) {
      setStatusMsg({ text: 'Failed to generate backup file.', type: 'error' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.settings || !parsed.students) {
          throw new Error('Invalid backup file structure.');
        }
        onRestoreData(parsed);
        setStatusMsg({ text: 'Data restored successfully from backup!', type: 'success' });
      } catch (err) {
        setStatusMsg({ text: 'Error reading backup JSON file: ' + err.message, type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to completely clear all records (Students, Teachers, Fees, Expenses, Exams & Certificates)? You will have a clean slate with 0 records.')) {
      if (onClearAllRecords) {
        onClearAllRecords();
        setStatusMsg({ text: 'All records have been cleared! System is at a clean slate (0 records).', type: 'success' });
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? Any unsaved custom entries will be replaced.')) {
      onResetToDemo();
      setStatusMsg({ text: 'System reset completed.', type: 'success' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={22} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                Database Backup & Records Management
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Secure export, local file restore, and clean slate database management
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {statusMsg.text && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
              border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontSize: '0.85rem'
            }}>
              {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Download Backup */}
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Export All Data (JSON)</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Download all students, teachers, fees, attendance, exams & settings into a single backup file.
              </p>
            </div>
            <button onClick={handleDownloadBackup} className="btn btn-primary">
              <Download size={16} />
              <span>Download Backup</span>
            </button>
          </div>

          {/* Restore Data */}
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Restore from Backup File</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Load previously downloaded JSON backup file to restore records.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary"
              >
                <Upload size={16} />
                <span>Choose Backup File</span>
              </button>
            </div>
          </div>

          {/* Wipe All Records (Clean Slate - 0 Records) */}
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f87171' }}>Clear All Records (Clean Slate)</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Wipe all pre-filled student, teacher, fee, expense, exam & certificate records to start fresh with 0 records.
              </p>
            </div>
            <button onClick={handleClear} className="btn btn-danger">
              <Trash2 size={16} />
              <span>Clear All Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
