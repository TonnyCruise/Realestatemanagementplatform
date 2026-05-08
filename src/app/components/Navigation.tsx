import { Home, Search, DollarSign, User } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#1a2e4a] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Home className="h-8 w-8 text-[#2ecc71]" />
            <span className="text-xl">NestKenya</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/search')}
              className="hover:text-[#2ecc71] transition-colors"
            >
              Find a Home
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="hover:text-[#2ecc71] transition-colors"
            >
              For Landlords
            </button>
            <button className="hover:text-[#2ecc71] transition-colors">
              About
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 text-sm border border-white hover:bg-white hover:text-[#1a2e4a] transition-colors rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 text-sm bg-[#2ecc71] hover:bg-[#27ae60] transition-colors rounded-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
