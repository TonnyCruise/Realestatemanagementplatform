import { useState } from 'react';
import { Check, Building2, Zap, Star, Users, BarChart3, Shield, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const FEATURES = {
  starter: [
    'Up to 5 properties',
    'Up to 20 units',
    'Online rent collection (M-Pesa, Bank)',
    'Tenant directory',
    'Basic analytics dashboard',
    'Maintenance request tracking',
    'Document storage (5GB)',
    'Email support',
  ],
  growth: [
    'Up to 20 properties',
    'Up to 100 units',
    'All payment methods',
    'Advanced analytics & reports',
    'Tenant screening tools',
    'Automated rent reminders',
    'Custom lease templates',
    'SMS notifications',
    'Document storage (25GB)',
    'Priority email & phone support',
    'Vacancy management',
    'Financial reports',
  ],
  enterprise: [
    'Unlimited properties',
    'Unlimited units',
    'All Growth features',
    'API access',
    'Custom integrations',
    'Multi-user accounts & permissions',
    'White-label options',
    'Dedicated account manager',
    'Custom reporting',
    'Document storage (unlimited)',
    '24/7 priority support',
    'Training & onboarding',
    'Custom payment workflows',
  ],
};

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getPrice = (monthly: number) => {
    if (billingCycle === 'annual') {
      const annualPrice = monthly * 12 * 0.8; // 20% discount
      return Math.round(annualPrice / 12);
    }
    return monthly;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a2e4a] to-[#2c4a6e] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-200 mb-8">
            Choose the perfect plan for your property portfolio. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-[#1a2e4a]' : 'text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'annual' ? 'bg-white text-[#1a2e4a]' : 'text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-[#2ecc71] text-white px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 -mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl text-[#1a2e4a] mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for individual landlords getting started</p>

              <div className="mb-6">
                <p className="text-5xl text-[#1a2e4a] mb-2">
                  KES {getPrice(2999).toLocaleString()}
                  <span className="text-lg text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
                </p>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-green-600">Billed annually at KES {(getPrice(2999) * 12).toLocaleString()}</p>
                )}
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-3 mb-6 border-2 border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg"
              >
                Start Free Trial
              </button>

              <div className="space-y-3">
                {FEATURES.starter.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#2ecc71] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Plan - Featured */}
            <div className="bg-gradient-to-br from-[#2ecc71] to-[#27ae60] text-white rounded-lg p-8 shadow-2xl transform lg:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1a2e4a] text-white px-6 py-2 rounded-full text-sm">
                Most Popular
              </div>

              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl mb-2">Growth</h3>
              <p className="text-green-100 mb-6">Ideal for growing property portfolios</p>

              <div className="mb-6">
                <p className="text-5xl mb-2">
                  KES {getPrice(6999).toLocaleString()}
                  <span className="text-lg text-green-100">/{billingCycle === 'monthly' ? 'mo' : 'mo'}</span>
                </p>
                {billingCycle === 'annual' && (
                  <p className="text-sm text-green-100">Billed annually at KES {(getPrice(6999) * 12).toLocaleString()}</p>
                )}
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-3 mb-6 bg-white text-[#2ecc71] hover:bg-gray-100 rounded-lg"
              >
                Start Free Trial
              </button>

              <div className="space-y-3">
                {FEATURES.growth.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-lg">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl text-[#1a2e4a] mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large-scale property management companies</p>

              <div className="mb-6">
                <p className="text-5xl text-[#1a2e4a] mb-2">
                  Custom
                </p>
                <p className="text-sm text-gray-600">Tailored pricing for your needs</p>
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-3 mb-6 border-2 border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg"
              >
                Contact Sales
              </button>

              <div className="space-y-3">
                {FEATURES.enterprise.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#2ecc71] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-[#1a2e4a] text-center mb-12">Detailed Feature Comparison</h2>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Feature</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-600">Starter</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-600 bg-[#2ecc71]/10">Growth</th>
                  <th className="px-6 py-4 text-center text-sm text-gray-600">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Properties</td>
                  <td className="px-6 py-4 text-center">Up to 5</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">Up to 20</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Units</td>
                  <td className="px-6 py-4 text-center">Up to 20</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">Up to 100</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Online Rent Collection</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Analytics Dashboard</td>
                  <td className="px-6 py-4 text-center">Basic</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">Advanced</td>
                  <td className="px-6 py-4 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Tenant Screening</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">API Access</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">-</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Multi-user Accounts</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">-</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-[#2ecc71] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Support</td>
                  <td className="px-6 py-4 text-center">Email</td>
                  <td className="px-6 py-4 text-center bg-[#2ecc71]/5">Priority</td>
                  <td className="px-6 py-4 text-center">24/7 Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why NestKenya */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl text-[#1a2e4a] text-center mb-12">Why Choose NestKenya?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-[#2ecc71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">10,000+ Landlords</h3>
              <p className="text-gray-600">Trusted by property managers across East Africa</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-[#2ecc71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">98% On-Time Payments</h3>
              <p className="text-gray-600">Automated reminders ensure timely rent collection</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-[#2ecc71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Bank-Level Security</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade encryption</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-[#2ecc71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-xl text-[#1a2e4a] mb-2">Local Support Team</h3>
              <p className="text-gray-600">Get help in English and Swahili when you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl text-[#1a2e4a] text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg text-[#1a2e4a] mb-2">How does the free trial work?</h3>
              <p className="text-gray-600">
                Start with a 14-day free trial on any plan. No credit card required. You can cancel anytime during the trial period.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg text-[#1a2e4a] mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg text-[#1a2e4a] mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept M-Pesa, bank transfers, and credit/debit cards. All payments are processed securely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg text-[#1a2e4a] mb-2">Is there a transaction fee for rent collection?</h3>
              <p className="text-gray-600">
                No! Rent collection is included in your subscription at no extra cost. Standard M-Pesa or bank fees may apply.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg text-[#1a2e4a] mb-2">Do you offer discounts for annual billing?</h3>
              <p className="text-gray-600">
                Yes! Save 20% when you pay annually instead of monthly. The discount is automatically applied at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1a2e4a] to-[#2c4a6e] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-4">Ready to Transform Your Property Management?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of landlords managing properties smarter with NestKenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-8 py-3 bg-[#2ecc71] hover:bg-[#27ae60] rounded-lg text-lg"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-3 bg-white text-[#1a2e4a] hover:bg-gray-100 rounded-lg text-lg"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
