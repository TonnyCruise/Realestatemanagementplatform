import { useState } from 'react';
import {
  Building2, DollarSign, Users, Wrench, Plus, MoreVertical,
  TrendingUp, Home, LogOut, Settings, Bell, Search, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

function useProperties() {
  return useQuery({
    queryKey: ['landlord-properties'],
    queryFn: () => api.get('/properties/landlord/mine').then((r) => r.data as any[]),
  });
}

function useTenancies() {
  return useQuery({
    queryKey: ['landlord-tenancies'],
    queryFn: () => api.get('/tenancies/landlord/mine').then((r) => r.data as any[]),
  });
}

function useMaintenance() {
  return useQuery({
    queryKey: ['landlord-maintenance'],
    queryFn: () => api.get('/maintenance/landlord/all').then((r) => r.data as any[]),
  });
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

function statusColor(status: string) {
  if (status === 'PAID') return 'bg-green-100 text-green-700';
  if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700';
  if (status === 'OVERDUE') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function maintenanceColor(status: string) {
  if (status === 'RESOLVED') return 'bg-green-100 text-green-700';
  if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700';
  return 'bg-yellow-100 text-yellow-700';
}

function maintenanceLabel(status: string) {
  if (status === 'RESOLVED') return 'Resolved';
  if (status === 'IN_PROGRESS') return 'In Progress';
  return 'Open';
}

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'tenants' | 'maintenance'>('overview');

  const { data: properties = [], isLoading: loadingProps } = useProperties();
  const { data: tenancies = [], isLoading: loadingTenancies } = useTenancies();
  const { data: maintenance = [], isLoading: loadingMaint } = useMaintenance();

  const totalUnits = properties.reduce((sum: number, p: any) => sum + (p.units?.length ?? 0), 0);
  const occupiedUnits = properties.reduce((sum: number, p: any) => sum + (p.units?.filter((u: any) => u.status === 'OCCUPIED').length ?? 0), 0);
  const pendingMaintenance = maintenance.filter((m: any) => m.status === 'OPEN').length;
  const activeTenancies = tenancies.filter((t: any) => t.status === 'ACTIVE');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Landlord';

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
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                  {user ? initials(displayName) : '?'}
                </div>
                <span className="text-sm">{displayName}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
              {(['overview', 'properties', 'tenants', 'maintenance'] as const).map((tab) => {
                const Icon = tab === 'overview' ? TrendingUp : tab === 'properties' ? Building2 : tab === 'tenants' ? Users : Wrench;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg capitalize ${
                      activeTab === tab ? 'bg-[#1a2e4a] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={handleLogout}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Building2 className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" label="Total Units" value={loadingProps ? '—' : String(totalUnits)} />
                <StatCard icon={<Users className="h-6 w-6 text-green-600" />} bg="bg-green-100" label="Occupied Units" value={loadingProps ? '—' : String(occupiedUnits)} sub={totalUnits > 0 ? `${Math.round((occupiedUnits / totalUnits) * 100)}% occupancy` : undefined} />
                <StatCard icon={<DollarSign className="h-6 w-6 text-[#2ecc71]" />} bg="bg-[#2ecc71]/10" label="Active Tenancies" value={loadingTenancies ? '—' : String(activeTenancies.length)} />
                <StatCard icon={<Wrench className="h-6 w-6 text-orange-600" />} bg="bg-orange-100" label="Open Maintenance" value={loadingMaint ? '—' : String(pendingMaintenance)} />
              </div>

              {/* Charts — placeholder data until analytics endpoint added */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg text-[#1a2e4a] mb-4">Monthly Revenue</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[{ month: 'This month', revenue: 0 }]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#2ecc71" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg text-[#1a2e4a] mb-4">Properties ({properties.length})</h2>
                  {loadingProps ? (
                    <div className="flex items-center justify-center h-[250px]">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2ecc71]" />
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[250px] text-gray-400">
                      <Building2 className="h-10 w-10 mb-2" />
                      <p className="text-sm">No properties yet</p>
                      <button onClick={() => navigate('/property/new')} className="mt-3 text-[#2ecc71] text-sm hover:underline">Add your first property →</button>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={properties.map((p: any) => ({ name: p.title?.slice(0, 12), units: p.units?.length ?? 0 }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="units" stroke="#1a2e4a" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Recent tenancies */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg text-[#1a2e4a] mb-4">Active Tenants</h2>
                {loadingTenancies ? (
                  <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-[#2ecc71]" /></div>
                ) : activeTenancies.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4 text-center">No active tenants yet</p>
                ) : (
                  <div className="space-y-3">
                    {activeTenancies.slice(0, 5).map((t: any) => (
                      <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                            {initials(`${t.tenant?.firstName ?? '?'} ${t.tenant?.lastName ?? ''}`)}
                          </div>
                          <div>
                            <p>{t.tenant?.firstName} {t.tenant?.lastName}</p>
                            <p className="text-sm text-gray-500">Unit {t.unit?.unitNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1a2e4a]">{formatKES(t.rentAmount)}/mo</p>
                          <p className="text-sm text-green-600">Active</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Properties</h1>
                <button onClick={() => navigate('/property/new')} className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />Add Property
                </button>
              </div>

              {loadingProps ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#2ecc71]" /></div>
              ) : properties.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl text-[#1a2e4a] mb-2">No properties yet</h3>
                  <p className="text-gray-500 mb-6">Add your first property to get started.</p>
                  <button onClick={() => navigate('/property/new')} className="px-6 py-2 bg-[#2ecc71] text-white rounded-lg hover:bg-[#27ae60]">
                    Add Property
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {properties.map((property: any) => {
                    const totalU = property.units?.length ?? 0;
                    const occupiedU = property.units?.filter((u: any) => u.status === 'OCCUPIED').length ?? 0;
                    return (
                      <div key={property.id} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl text-[#1a2e4a] mb-1">{property.title}</h3>
                            <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Units</p>
                            <p className="text-lg text-[#1a2e4a]">{totalU}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Occupied</p>
                            <p className="text-lg text-[#1a2e4a]">{occupiedU}</p>
                          </div>
                        </div>
                        {totalU > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-[#2ecc71] h-2 rounded-full" style={{ width: `${(occupiedU / totalU) * 100}%` }} />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Price/mo</p>
                            <p className="text-lg text-[#1a2e4a]">{formatKES(property.pricePerMonth)}</p>
                          </div>
                          <button onClick={() => navigate(`/property/${property.id}`)} className="px-4 py-2 border border-[#1a2e4a] text-[#1a2e4a] hover:bg-[#1a2e4a] hover:text-white rounded-lg">
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tenants' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Tenants</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Search tenants..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              {loadingTenancies ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#2ecc71]" /></div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Tenant</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Unit</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Rent/mo</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tenancies.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No tenants yet</td></tr>
                      ) : tenancies.map((t: any) => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                                {initials(`${t.tenant?.firstName ?? '?'} ${t.tenant?.lastName ?? ''}`)}
                              </div>
                              <span>{t.tenant?.firstName} {t.tenant?.lastName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">Unit {t.unit?.unitNumber}</td>
                          <td className="px-6 py-4">{formatKES(t.rentAmount)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{new Date(t.startDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Maintenance Requests</h1>
              {loadingMaint ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#2ecc71]" /></div>
              ) : maintenance.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400">No maintenance requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenance.map((req: any) => (
                    <div key={req.id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg text-[#1a2e4a] mb-1">{req.title}</h3>
                          <p className="text-sm text-gray-600">{req.tenant?.firstName} {req.tenant?.lastName} — Unit {req.unit?.unitNumber}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${maintenanceColor(req.status)}`}>
                          {maintenanceLabel(req.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{req.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                        {req.status === 'OPEN' && (
                          <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg text-sm">
                            Mark In Progress
                          </button>
                        )}
                        {req.status === 'IN_PROGRESS' && (
                          <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg text-sm">
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub }: { icon: React.ReactNode; bg: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className={`h-12 w-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>{icon}</div>
      <p className="text-2xl text-[#1a2e4a] mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
      {sub && <p className="text-xs text-green-600 mt-1">{sub}</p>}
    </div>
  );
}
