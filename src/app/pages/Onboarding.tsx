import { useState } from 'react';
import { Building2, User, Search, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

type UserRole = 'landlord' | 'tenant' | 'seeker' | null;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'signup'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('signup');
  };

  const handleSignup = () => {
    if (selectedRole === 'landlord') {
      navigate('/landlord/dashboard');
    } else if (selectedRole === 'tenant') {
      navigate('/tenant/portal');
    } else if (selectedRole === 'seeker') {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2e4a] to-[#2c4a6e] flex items-center justify-center p-4">
      {/* Logo */}
      <div
        className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <Home className="h-8 w-8 text-[#2ecc71]" />
        <span className="text-xl text-white">NestKenya</span>
      </div>

      <div className="w-full max-w-4xl">
        {step === 'role' && (
          <div className="text-center mb-12">
            <h1 className="text-5xl text-white mb-4">Welcome to NestKenya</h1>
            <p className="text-xl text-gray-200">How would you like to use NestKenya?</p>
          </div>
        )}

        {step === 'role' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Landlord */}
            <button
              onClick={() => handleRoleSelect('landlord')}
              className="bg-white p-8 rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-left"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl text-[#1a2e4a] mb-3">I'm a Landlord</h2>
              <p className="text-gray-600 mb-6">
                Manage properties, collect rent, track tenants, and streamline maintenance requests.
              </p>
              <div className="flex items-center gap-2 text-[#2ecc71]">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>

            {/* Tenant */}
            <button
              onClick={() => handleRoleSelect('tenant')}
              className="bg-white p-8 rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-left"
            >
              <div className="h-16 w-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl text-[#1a2e4a] mb-3">I'm a Tenant</h2>
              <p className="text-gray-600 mb-6">
                Pay rent online, submit maintenance requests, view documents, and communicate with your landlord.
              </p>
              <div className="flex items-center gap-2 text-[#2ecc71]">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>

            {/* House Seeker */}
            <button
              onClick={() => handleRoleSelect('seeker')}
              className="bg-white p-8 rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-left"
            >
              <div className="h-16 w-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl text-[#1a2e4a] mb-3">Looking for a Home</h2>
              <p className="text-gray-600 mb-6">
                Browse properties, filter by preferences, view on a map, and book viewings with landlords.
              </p>
              <div className="flex items-center gap-2 text-[#2ecc71]">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>
          </div>
        )}

        {step === 'signup' && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setStep('role')}
              className="text-white mb-6 flex items-center gap-2 hover:text-[#2ecc71]"
            >
              ← Back to role selection
            </button>

            <div className="bg-white rounded-lg p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-[#2ecc71] rounded-full flex items-center justify-center mx-auto mb-4">
                  {selectedRole === 'landlord' && <Building2 className="h-8 w-8 text-white" />}
                  {selectedRole === 'tenant' && <User className="h-8 w-8 text-white" />}
                  {selectedRole === 'seeker' && <Search className="h-8 w-8 text-white" />}
                </div>
                <h2 className="text-3xl text-[#1a2e4a] mb-2">
                  {selectedRole === 'landlord' && 'Landlord Sign Up'}
                  {selectedRole === 'tenant' && 'Tenant Sign Up'}
                  {selectedRole === 'seeker' && 'Create Your Account'}
                </h2>
                <p className="text-gray-600">
                  {selectedRole === 'landlord' && 'Start managing your properties today'}
                  {selectedRole === 'tenant' && 'Access your tenant portal'}
                  {selectedRole === 'seeker' && 'Find your perfect home in East Africa'}
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {selectedRole === 'landlord' && (
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Number of Properties</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Select range</option>
                      <option>1-5 properties</option>
                      <option>6-20 properties</option>
                      <option>20+ properties</option>
                    </select>
                  </div>
                )}

                {selectedRole === 'seeker' && (
                  <>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Preferred Location</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Select city</option>
                        <option>Nairobi, Kenya</option>
                        <option>Mombasa, Kenya</option>
                        <option>Dar es Salaam, Tanzania</option>
                        <option>Kampala, Uganda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Budget Range (Monthly)</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Select budget</option>
                        <option>KES 10,000 - 30,000</option>
                        <option>KES 30,000 - 60,000</option>
                        <option>KES 60,000 - 100,000</option>
                        <option>KES 100,000+</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-gray-600">
                    I agree to NestKenya's{' '}
                    <button className="text-[#2ecc71] hover:underline">Terms of Service</button> and{' '}
                    <button className="text-[#2ecc71] hover:underline">Privacy Policy</button>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSignup}
                  className="w-full py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg"
                >
                  {selectedRole === 'landlord' && 'Start Free Trial'}
                  {selectedRole === 'tenant' && 'Create Account'}
                  {selectedRole === 'seeker' && 'Create Account & Browse'}
                </button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button className="text-[#2ecc71] hover:underline">Sign In</button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
