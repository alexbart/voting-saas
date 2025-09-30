// frontend/src/pages/voter/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      const res = await api.get('/elections/context/school');
      setElections(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load elections');
    }
  };

  return (
    <div>
      <h2>Active Elections</h2>
      {elections.length === 0 ? (
        <p className="text-muted">No active elections</p>
      ) : (
        <div className="row">
          {elections.map(election => (
            <div key={election.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{election.title}</h5>
                  <p className="card-text">{election.description || ''}</p>
                  <small className="text-muted">
                    {new Date(election.start_time).toLocaleString()} – {new Date(election.end_time).toLocaleString()}
                  </small>
                  <br />
                  <span className={`badge mt-2 ${
                    election.status === 'active' ? 'bg-success' :
                    election.status === 'closed' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {election.status}
                  </span>
                  {election.status === 'active' && (
                    <Link to={`/voter/vote/${election.id}`} className="btn btn-primary mt-2">Vote Now</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}