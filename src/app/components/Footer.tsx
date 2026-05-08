import { Home, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a2e4a] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-[#2ecc71]" />
              <span className="text-lg">NestKenya</span>
            </div>
            <p className="text-sm text-gray-300">
              Your property, managed smarter across East Africa.
            </p>
          </div>

          <div>
            <h4 className="mb-4">For House Seekers</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => navigate('/search')} className="hover:text-[#2ecc71]">Browse Properties</button></li>
              <li><button className="hover:text-[#2ecc71]">How It Works</button></li>
              <li><button className="hover:text-[#2ecc71]">Neighborhood Guides</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">For Landlords</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => navigate('/pricing')} className="hover:text-[#2ecc71]">Pricing</button></li>
              <li><button className="hover:text-[#2ecc71]">Features</button></li>
              <li><button onClick={() => navigate('/landlord/dashboard')} className="hover:text-[#2ecc71]">Dashboard</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Download App</h4>
            <div className="space-y-2">
              <button className="w-full bg-white text-[#1a2e4a] px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                App Store
              </button>
              <button className="w-full bg-white text-[#1a2e4a] px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                Google Play
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300 mb-4 md:mb-0">
            © 2026 NestKenya. All rights reserved. Serving Kenya, Tanzania & Uganda.
          </p>
          <div className="flex gap-4">
            <Facebook className="h-5 w-5 hover:text-[#2ecc71] cursor-pointer" />
            <Twitter className="h-5 w-5 hover:text-[#2ecc71] cursor-pointer" />
            <Instagram className="h-5 w-5 hover:text-[#2ecc71] cursor-pointer" />
            <Mail className="h-5 w-5 hover:text-[#2ecc71] cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
