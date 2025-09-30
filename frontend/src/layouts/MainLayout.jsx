// Reusable layout for public pages (Landing, Login, Register)
import { Outlet } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import MainFooter from '../components/MainFooter';

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <MainNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}