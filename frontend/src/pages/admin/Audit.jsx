// frontend/src/pages/admin/Audit.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.get('/audit');
      setLogs(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load audit logs');
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Event</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.user_name || 'System'}</td>
                <td>{log.event_type}</td>
                <td>{log.ip_address || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}