import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import PropertySearch from "./pages/PropertySearch";
import PropertyDetail from "./pages/PropertyDetail";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantPortal from "./pages/TenantPortal";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/search",
    Component: PropertySearch,
  },
  {
    path: "/property/:id",
    Component: PropertyDetail,
  },
  {
    path: "/landlord/dashboard",
    Component: LandlordDashboard,
  },
  {
    path: "/tenant/portal",
    Component: TenantPortal,
  },
  {
    path: "/pricing",
    Component: Pricing,
  },
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
