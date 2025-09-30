// frontend/src/pages/admin/CreateElection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';

export default function AdminCreateElection() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    question: '',
    candidates: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const candidates = formData.candidates.split('\n').map(s => s.trim()).filter(s => s);
      if (candidates.length < 2) {
        toast.error('At least 2 candidates required');
        return;
      }

      const now = new Date();
      let start = new Date(formData.start_time);
      if (start <= now) start = new Date(now.getTime() + 2 * 60000);

      let end = new Date(formData.end_time);
      if (end <= start) end = new Date(start.getTime() + 3600000);

      await api.post('/elections', {
        title: formData.title,
        description: formData.description,
        context_type: 'school',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        ballot: {
          question: formData.question,
          options: candidates,
          ballot_type: 'single_choice'
        }
      });

      toast.success('Election created!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Create New Election</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  name="title"
                  className="form-control"
                  placeholder="Election Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  name="start_time"
                  type="datetime-local"
                  className="form-control"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="end_time"
                  type="datetime-local"
                  className="form-control"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="question"
                  className="form-control"
                  placeholder="Ballot Question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="candidates"
                  className="form-control"
                  placeholder="Candidates (one per line)"
                  value={formData.candidates}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Election</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin')}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}