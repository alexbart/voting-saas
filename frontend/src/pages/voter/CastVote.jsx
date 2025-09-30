// frontend/src/pages/voter/CastVote.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function CastVote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ballot, setBallot] = useState(null);
  const [selection, setSelection] = useState('');

  useEffect(() => {
    loadBallot();
  }, [id]);

  const loadBallot = async () => {
    try {
      const res = await api.get(`/elections/${id}`);
      setBallot(res.data.data.ballot);
    } catch (err) {
      toast.error('Failed to load ballot');
      navigate('/voter');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/votes/cast', { ballot_id: ballot.id, selection });
      toast.success('✅ Your vote has been recorded!');
      setTimeout(() => navigate('/voter'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Vote failed');
    }
  };

  if (!ballot) return <div>Loading...</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{ballot.question}</h5>
            <form onSubmit={handleSubmit}>
              {ballot.options.map(option => (
                <div key={option} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="selection"
                    value={option}
                    id={option}
                    onChange={(e) => setSelection(e.target.value)}
                    required
                  />
                  <label className="form-check-label" htmlFor={option}>
                    {option}
                  </label>
                </div>
              ))}
              <button type="submit" className="btn btn-success mt-3">Submit Vote</button>
              <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/voter')}>
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}