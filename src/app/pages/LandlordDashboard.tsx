import { useState } from 'react';
import {
  Building2,
  DollarSign,
  Users,
  Wrench,
  Plus,
  MoreVertical,
  TrendingUp,
  Home,
  LogOut,
  Settings,
  Bell,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 420000 },
  { month: 'Feb', revenue: 450000 },
  { month: 'Mar', revenue: 480000 },
  { month: 'Apr', revenue: 465000 },
  { month: 'May', revenue: 520000 },
  { month: 'Jun', revenue: 495000 },
];

const OCCUPANCY_DATA = [
  { month: 'Jan', rate: 85 },
  { month: 'Feb', rate: 88 },
  { month: 'Mar', rate: 92 },
  { month: 'Apr', rate: 90 },
  { month: 'May', rate: 95 },
  { month: 'Jun', rate: 93 },
];

const PROPERTIES = [
  {
    id: 1,
    name: 'Westlands Apartments',
    location: 'Westlands, Nairobi',
    units: 12,
    occupied: 11,
    revenue: 'KES 495,000',
    status: 'active',
  },
  {
    id: 2,
    name: 'Karen Villas',
    location: 'Karen, Nairobi',
    units: 4,
    occupied: 4,
    revenue: 'KES 340,000',
    status: 'active',
  },
  {
    id: 3,
    name: 'CBD Studio Complex',
    location: 'CBD, Nairobi',
    units: 8,
    occupied: 7,
    revenue: 'KES 224,000',
    status: 'active',
  },
];

const TENANTS = [
  {
    id: 1,
    name: 'Sarah Ochieng',
    unit: 'Westlands Apt - Unit 2A',
    rent: 'KES 45,000',
    status: 'paid',
    nextDue: '2026-06-01',
  },
  {
    id: 2,
    name: 'David Mutua',
    unit: 'Karen Villa 3',
    rent: 'KES 85,000',
    status: 'paid',
    nextDue: '2026-06-01',
  },
  {
    id: 3,
    name: 'Grace Wanjiru',
    unit: 'CBD Studio 5',
    rent: 'KES 28,000',
    status: 'pending',
    nextDue: '2026-05-15',
  },
  {
    id: 4,
    name: 'Peter Kimani',
    unit: 'Westlands Apt - Unit 1B',
    rent: 'KES 45,000',
    status: 'overdue',
    nextDue: '2026-05-01',
  },
];

const MAINTENANCE_REQUESTS = [
  {
    id: 1,
    tenant: 'Sarah Ochieng',
    unit: 'Westlands Apt - Unit 2A',
    issue: 'Leaking faucet in kitchen',
    status: 'pending',
    date: '2026-05-07',
  },
  {
    id: 2,
    tenant: 'Grace Wanjiru',
    unit: 'CBD Studio 5',
    issue: 'Air conditioning not cooling',
    status: 'in-progress',
    date: '2026-05-06',
  },
  {
    id: 3,
    tenant: 'David Mutua',
    unit: 'Karen Villa 3',
    issue: 'Garden maintenance needed',
    status: 'completed',
    date: '2026-05-04',
  },
];

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'tenants' | 'maintenance'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Home className="h-6 w-6 text-[#2ecc71]" />
              <span className="text-xl text-[#1a2e4a]">NestKenya</span>
              <span className="text-sm text-gray-500 ml-2">Landlord Portal</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                  JM
                </div>
                <span className="text-sm">John Mwangi</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <div className="p-4">
            <button
              className="w-full py-2 px-4 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg flex items-center justify-center gap-2 mb-6"
              onClick={() => navigate('/property/new')}
            >
              <Plus className="h-5 w-5" />
              Add Property
            </button>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'properties'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Properties</span>
              </button>
              <button
                onClick={() => setActiveTab('tenants')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'tenants'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Tenants</span>
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'maintenance'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span>Maintenance</span>
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Dashboard Overview</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-[#1a2e4a] mb-1">24</p>
                  <p className="text-sm text-gray-600">Total Units</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-[#1a2e4a] mb-1">22</p>
                  <p className="text-sm text-gray-600">Occupied Units</p>
                  <p className="text-xs text-green-600 mt-1">92% occupancy</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#2ecc71]/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#2ecc71]" />
                    </div>
                  </div>
                  <p className="text-2xl text-[#1a2e4a] mb-1">KES 1.06M</p>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-2xl text-[#1a2e4a] mb-1">3</p>
                  <p className="text-sm text-gray-600">Pending Maintenance</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg text-[#1a2e4a] mb-4">Monthly Revenue</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#2ecc71" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg text-[#1a2e4a] mb-4">Occupancy Rate</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={OCCUPANCY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#1a2e4a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg text-[#1a2e4a] mb-4">Recent Rent Payments</h2>
                <div className="space-y-3">
                  {TENANTS.slice(0, 3).map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                          {tenant.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p>{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#1a2e4a]">{tenant.rent}</p>
                        <p className={`text-sm ${tenant.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                          {tenant.status === 'paid' ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Properties</h1>
                <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Property
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PROPERTIES.map((property) => (
                  <div key={property.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl text-[#1a2e4a] mb-1">{property.name}</h3>
                        <p className="text-sm text-gray-600">{property.location}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Units</p>
                        <p className="text-lg text-[#1a2e4a]">{property.units}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Occupied</p>
                        <p className="text-lg text-[#1a2e4a]">{property.occupied}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#2ecc71] h-2 rounded-full"
                          style={{ width: `${(property.occupied / property.units) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Revenue</p>
                        <p className="text-lg text-[#1a2e4a]">{property.revenue}</p>
                      </div>
                      <button className="px-4 py-2 border border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Tenants</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Tenant</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Unit</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Rent</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Next Due</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {TENANTS.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                              {tenant.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span>{tenant.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{tenant.unit}</td>
                        <td className="px-6 py-4 text-gray-900">{tenant.rent}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tenant.status === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : tenant.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {tenant.status === 'paid' ? 'Paid' : tenant.status === 'pending' ? 'Pending' : 'Overdue'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{tenant.nextDue}</td>
                        <td className="px-6 py-4">
                          <button className="text-[#2ecc71] hover:text-[#27ae60]">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Maintenance Requests</h1>

              <div className="space-y-4">
                {MAINTENANCE_REQUESTS.map((request) => (
                  <div key={request.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg text-[#1a2e4a] mb-1">{request.issue}</h3>
                        <p className="text-sm text-gray-600">
                          {request.tenant} - {request.unit}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          request.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {request.status === 'completed'
                          ? 'Completed'
                          : request.status === 'in-progress'
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Submitted: {request.date}</p>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg text-sm">
                              Assign Worker
                            </button>
                            <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm">
                              Contact Tenant
                            </button>
                          </>
                        )}
                        {request.status === 'in-progress' && (
                          <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg text-sm">
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
