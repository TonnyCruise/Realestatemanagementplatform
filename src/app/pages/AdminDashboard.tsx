import { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Home,
  LogOut,
  MapPin,
  Settings,
  BarChart3,
  Calendar,
  Eye,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COUNTRIES = ['All Countries', 'Kenya', 'Tanzania', 'Uganda'];

const MONTHLY_REVENUE = [
  { month: 'Jan', kenya: 1200000, tanzania: 850000, uganda: 620000 },
  { month: 'Feb', kenya: 1350000, tanzania: 920000, uganda: 680000 },
  { month: 'Mar', kenya: 1480000, tanzania: 1050000, uganda: 750000 },
  { month: 'Apr', kenya: 1620000, tanzania: 1180000, uganda: 820000 },
  { month: 'May', kenya: 1750000, tanzania: 1280000, uganda: 890000 },
  { month: 'Jun', kenya: 1880000, tanzania: 1350000, uganda: 950000 },
];

const PROPERTY_TYPES = [
  { name: 'Apartments', value: 450, color: '#2ecc71' },
  { name: 'Houses', value: 280, color: '#1a2e4a' },
  { name: 'Studios', value: 320, color: '#3498db' },
  { name: 'Commercial', value: 150, color: '#e74c3c' },
];

const USER_GROWTH = [
  { month: 'Jan', landlords: 820, tenants: 3200, seekers: 5400 },
  { month: 'Feb', landlords: 950, tenants: 3800, seekers: 6200 },
  { month: 'Mar', landlords: 1100, tenants: 4500, seekers: 7100 },
  { month: 'Apr', landlords: 1280, tenants: 5300, seekers: 8200 },
  { month: 'May', landlords: 1450, tenants: 6100, seekers: 9500 },
  { month: 'Jun', landlords: 1620, tenants: 6900, seekers: 10800 },
];

const TOP_LANDLORDS = [
  { id: 1, name: 'John Mwangi', properties: 24, revenue: 'KES 1,080,000', country: 'Kenya' },
  { id: 2, name: 'Amina Hassan', properties: 18, revenue: 'TZS 18,500,000', country: 'Tanzania' },
  { id: 3, name: 'Peter Mugisha', properties: 15, revenue: 'UGX 38,000,000', country: 'Uganda' },
  { id: 4, name: 'Grace Wanjiru', properties: 12, revenue: 'KES 540,000', country: 'Kenya' },
  { id: 5, name: 'David Ochieng', properties: 10, revenue: 'KES 450,000', country: 'Kenya' },
];

const RECENT_TRANSACTIONS = [
  { id: 1, tenant: 'Sarah Ochieng', amount: 'KES 45,000', property: 'Westlands Apt 2A', date: '2026-05-08' },
  { id: 2, tenant: 'James Kimani', amount: 'KES 85,000', property: 'Karen Villa 3', date: '2026-05-08' },
  { id: 3, tenant: 'Lucy Mutua', amount: 'TZS 850,000', property: 'Masaki Serviced Apt', date: '2026-05-08' },
  { id: 4, tenant: 'Moses Okello', amount: 'UGX 2,500,000', property: 'Kololo Villa 1', date: '2026-05-07' },
  { id: 5, tenant: 'Grace Wanjiru', amount: 'KES 28,000', property: 'CBD Studio 5', date: '2026-05-07' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Home className="h-6 w-6 text-[#2ecc71]" />
              <span className="text-xl text-[#1a2e4a]">NestKenya</span>
              <span className="text-sm text-gray-500 ml-2">Admin Portal</span>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last Year</option>
              </select>

              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                  AD
                </div>
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-[#1a2e4a]">Platform Analytics</h1>
            <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Export Report
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl text-[#1a2e4a] mb-1">1,620</p>
              <p className="text-sm text-gray-600">Active Landlords</p>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl text-[#1a2e4a] mb-1">1,200</p>
              <p className="text-sm text-gray-600">Active Listings</p>
              <p className="text-xs text-green-600 mt-2">+8% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl text-[#1a2e4a] mb-1">19,420</p>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xs text-green-600 mt-2">+15% from last month</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-[#2ecc71]/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[#2ecc71]" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl text-[#1a2e4a] mb-1">KES 4.98M</p>
              <p className="text-sm text-gray-600">Monthly Transactions</p>
              <p className="text-xs text-green-600 mt-2">+18% from last month</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue by Country */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl text-[#1a2e4a] mb-4">Monthly Revenue by Country</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MONTHLY_REVENUE}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="kenya" fill="#2ecc71" name="Kenya" />
                  <Bar dataKey="tanzania" fill="#1a2e4a" name="Tanzania" />
                  <Bar dataKey="uganda" fill="#3498db" name="Uganda" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Property Types Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl text-[#1a2e4a] mb-4">Property Types Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={PROPERTY_TYPES}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {PROPERTY_TYPES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl text-[#1a2e4a] mb-4">User Growth Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={USER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="landlords" stroke="#1a2e4a" strokeWidth={2} name="Landlords" />
                <Line type="monotone" dataKey="tenants" stroke="#2ecc71" strokeWidth={2} name="Tenants" />
                <Line type="monotone" dataKey="seekers" stroke="#3498db" strokeWidth={2} name="House Seekers" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Landlords */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-[#1a2e4a]">Top Landlords by Revenue</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Name</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Properties</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {TOP_LANDLORDS.map((landlord) => (
                      <tr key={landlord.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p>{landlord.name}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {landlord.country}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{landlord.properties}</td>
                        <td className="px-6 py-4 text-gray-900">{landlord.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-[#1a2e4a]">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Tenant</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Amount</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {RECENT_TRANSACTIONS.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p>{transaction.tenant}</p>
                            <p className="text-xs text-gray-500">{transaction.property}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{transaction.amount}</td>
                        <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-gradient-to-br from-[#1a2e4a] to-[#2c4a6e] text-white p-8 rounded-lg">
            <h2 className="text-2xl mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-3xl mb-2">89%</p>
                <p className="text-gray-200">Avg Occupancy Rate</p>
              </div>
              <div>
                <p className="text-3xl mb-2">4.7</p>
                <p className="text-gray-200">Avg Property Rating</p>
              </div>
              <div>
                <p className="text-3xl mb-2">2.8 days</p>
                <p className="text-gray-200">Avg Listing Time</p>
              </div>
              <div>
                <p className="text-3xl mb-2">96%</p>
                <p className="text-gray-200">Payment Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
