import { createBrowserRouter } from 'react-router';
import LandingPage from './pages/LandingPage';
import PropertySearch from './pages/PropertySearch';
import PropertyDetail from './pages/PropertyDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantPortal from './pages/TenantPortal';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/search', Component: PropertySearch },
  { path: '/property/:id', Component: PropertyDetail },
  { path: '/pricing', Component: Pricing },
  { path: '/onboarding', Component: Onboarding },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    path: '/landlord/dashboard',
    element: (
      <ProtectedRoute roles={['LANDLORD']}>
        <LandlordDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tenant/portal',
    element: (
      <ProtectedRoute roles={['TENANT']}>
        <TenantPortal />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
