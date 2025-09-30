// frontend/src/pages/admin/Results.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ballot, setBallot] = useState(null);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      // Load election + ballot
      const electionRes = await api.get(`/elections/${id}`);
      setElection(electionRes.data.data);

      const resultsRes = await api.get(`/votes/results/${id}`);
      if (resultsRes.data.success && resultsRes.data.data?.[0]) {
        setBallot(resultsRes.data.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load results');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading results...</div>;
  if (!ballot || !election) return <div className="alert alert-danger">No results found</div>;

  // Prepare chart data
  const candidates = Object.keys(ballot.tallies);
  const votes = Object.values(ballot.tallies);
  const totalVotes = votes.reduce((sum, v) => sum + v, 0);

  const barData = {
    labels: candidates,
    datasets: [{
      label: 'Votes',
      data: votes,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const pieData = {
    labels: candidates,
    datasets: [{
      data: votes,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { callbacks: { label: (item) => `${item.label}: ${item.raw} votes` } }
    }
  };

  // Prepare CSV data
  const csvData = candidates.map(candidate => ({
    Candidate: candidate,
    Votes: ballot.tallies[candidate],
    Percentage: totalVotes ? `${((ballot.tallies[candidate] / totalVotes) * 100).toFixed(1)}%` : '0%'
  }));

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{election.title}</h2>
        <button className="btn btn-outline-secondary" onClick={() => window.close()}>
          Close
        </button>
      </div>

      <div className="row">
        {/* Election Info */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Election Details</h5>
              <p><strong>Status:</strong> <span className={`badge ${
                election.status === 'active' ? 'bg-success' :
                election.status === 'closed' ? 'bg-danger' : 'bg-warning'
              }`}>{election.status}</span></p>
              <p><strong>Votes Cast:</strong> {ballot.total_votes}</p>
              <p><strong>Total Weight:</strong> {ballot.total_weight}</p>
              <p><strong>Question:</strong> {ballot.question}</p>
              <CSVLink
                data={csvData}
                filename={`election-results-${id}.csv`}
                className="btn btn-success w-100"
              >
                Export to CSV
              </CSVLink>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Vote Distribution (Bar)</h5>
                  <Bar data={barData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Vote Share (Pie)</h5>
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Tallies Table */}
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Detailed Results</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Votes</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => {
                    const voteCount = ballot.tallies[candidate];
                    const pct = totalVotes ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <tr key={candidate}>
                        <td>{candidate}</td>
                        <td>{voteCount}</td>
                        <td>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}