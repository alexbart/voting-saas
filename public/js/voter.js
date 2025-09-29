// Add delete event listeners
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (!confirm('⚠️ Delete this election? This cannot be undone.')) return;
    const id = btn.dataset.id;
    try {
      const res = await fetch(`/api/elections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadElections(); // refresh list
      } else {
        alert('Delete failed: ' + data.message);
      }
    } catch (err) {
      alert('Network error');
    }
  });
});