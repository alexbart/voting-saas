export default function MainFooter() {
  return (
    <footer className="bg-light py-3 mt-auto border-top">
      <div className="container text-center text-muted">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Voting SaaS • Secure • Transparent • Adaptable
        </p>
      </div>
    </footer>
  );
}