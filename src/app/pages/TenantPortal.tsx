import { useState } from 'react';
import {
  CreditCard, FileText, Wrench, MessageSquare, Home, LogOut, Settings,
  Bell, Download, Upload, CheckCircle, Clock, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth';

function useTenancy() {
  return useQuery({
    queryKey: ['tenant-tenancy'],
    queryFn: () => api.get('/tenancies/tenant/mine').then((r) => r.data as any[]),
  });
}

function useInvoices() {
  return useQuery({
    queryKey: ['tenant-invoices'],
    queryFn: () => api.get('/invoices/mine').then((r) => r.data as any[]),
  });
}

function usePayments() {
  return useQuery({
    queryKey: ['tenant-payments'],
    queryFn: () => api.get('/payments/mine').then((r) => r.data as any[]),
  });
}

function useMaintenance() {
  return useQuery({
    queryKey: ['tenant-maintenance'],
    queryFn: () => api.get('/maintenance/mine').then((r) => r.data as any[]),
  });
}

function initials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function formatKES(amount: number) {
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
}

function invoiceStatusColor(status: string) {
  if (status === 'PAID') return 'bg-green-100 text-green-700';
  if (status === 'OVERDUE') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
}

function maintenanceStatusBadge(status: string) {
  if (status === 'RESOLVED') return { color: 'bg-green-100 text-green-700', label: 'Resolved', Icon: CheckCircle };
  if (status === 'IN_PROGRESS') return { color: 'bg-blue-100 text-blue-700', label: 'In Progress', Icon: Clock };
  return { color: 'bg-yellow-100 text-yellow-700', label: 'Open', Icon: Clock };
}

export default function TenantPortal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'maintenance' | 'documents' | 'messages'>('overview');
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintForm, setMaintForm] = useState({ title: '', category: 'PLUMBING', description: '', unitId: '' });

  const { data: tenancies = [], isLoading: loadingTenancy } = useTenancy();
  const { data: invoices = [], isLoading: loadingInvoices } = useInvoices();
  const { data: payments = [], isLoading: loadingPayments } = usePayments();
  const { data: maintenance = [], isLoading: loadingMaint } = useMaintenance();

  const activeTenancy = tenancies.find((t: any) => t.status === 'ACTIVE') ?? tenancies[0];
  const pendingInvoice = invoices.find((inv: any) => inv.status === 'PENDING' || inv.status === 'OVERDUE');

  const submitMaintenance = useMutation({
    mutationFn: (data: any) => api.post('/maintenance', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-maintenance'] });
      setShowMaintenanceForm(false);
      setMaintForm({ title: '', category: 'PLUMBING', description: '', unitId: '' });
    },
  });

  function handleMaintSubmit(e: React.FormEvent) {
    e.preventDefault();
    const unitId = activeTenancy?.unitId ?? maintForm.unitId;
    if (!unitId) return;
    submitMaintenance.mutate({ ...maintForm, unitId });
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Tenant';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Home className="h-6 w-6 text-[#2ecc71]" />
              <span className="text-xl text-[#1a2e4a]">NestKenya</span>
              <span className="text-sm text-gray-500 ml-2">Tenant Portal</span>
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
                  {user ? initials(user.firstName, user.lastName) : '?'}
                </div>
                <span className="text-sm">{displayName}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <div className="p-4">
            <nav className="space-y-1">
              {[
                { key: 'overview', Icon: Home, label: 'Overview' },
                { key: 'payments', Icon: CreditCard, label: 'Payments' },
                { key: 'maintenance', Icon: Wrench, label: 'Maintenance' },
                { key: 'documents', Icon: FileText, label: 'Documents' },
                { key: 'messages', Icon: MessageSquare, label: 'Messages' },
              ].map(({ key, Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === key ? 'bg-[#1a2e4a] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
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

        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Welcome Back, {user?.firstName}</h1>

              {loadingTenancy ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#2ecc71]" /></div>
              ) : !activeTenancy ? (
                <div className="bg-white rounded-lg border border-gray-200 p-10 text-center mb-8">
                  <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl text-[#1a2e4a] mb-2">No active tenancy</h3>
                  <p className="text-gray-500">You don't have an active tenancy yet.</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                  <div className="flex-1">
                    <h2 className="text-2xl text-[#1a2e4a] mb-2">
                      {activeTenancy.unit?.property?.title ?? 'Your Property'} — Unit {activeTenancy.unit?.unitNumber}
                    </h2>
                    <p className="text-gray-600 mb-4">{activeTenancy.unit?.property?.address}, {activeTenancy.unit?.property?.city}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="text-lg text-[#1a2e4a]">{formatKES(activeTenancy.rentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease Start</p>
                        <p className="text-lg text-[#1a2e4a]">{new Date(activeTenancy.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease End</p>
                        <p className="text-lg text-[#1a2e4a]">{activeTenancy.endDate ? new Date(activeTenancy.endDate).toLocaleDateString() : 'Open-ended'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`text-white p-6 rounded-lg ${pendingInvoice ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-[#2ecc71] to-[#27ae60]'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {pendingInvoice ? <Clock className="h-8 w-8" /> : <CheckCircle className="h-8 w-8" />}
                    <h3 className="text-xl">Payment Status</h3>
                  </div>
                  {loadingInvoices ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : pendingInvoice ? (
                    <>
                      <p className="text-3xl mb-2">{formatKES(pendingInvoice.amount)}</p>
                      <p className="text-orange-100">Due by {new Date(pendingInvoice.dueDate).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">All Paid</p>
                      <p className="text-green-100">No outstanding invoices</p>
                    </>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg border-2 border-[#2ecc71]">
                  <h3 className="text-xl text-[#1a2e4a] mb-4">Current Balance</h3>
                  <p className="text-4xl text-[#1a2e4a] mb-2">{formatKES(pendingInvoice?.amount ?? 0)}</p>
                  <p className="text-gray-600 mb-4">{pendingInvoice ? 'Amount due' : 'No outstanding balance'}</p>
                  {pendingInvoice && (
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="w-full py-2 bg-[#1a2e4a] hover:bg-[#2c4a6e] text-white rounded-lg"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setShowMaintenanceForm(true)} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left">
                  <Wrench className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">Request Maintenance</h3>
                  <p className="text-sm text-gray-600">Submit a maintenance request</p>
                </button>
                <button onClick={() => setActiveTab('documents')} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left">
                  <FileText className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">View Documents</h3>
                  <p className="text-sm text-gray-600">Access your lease and receipts</p>
                </button>
                <button onClick={() => setActiveTab('messages')} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left">
                  <MessageSquare className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">Contact Landlord</h3>
                  <p className="text-sm text-gray-600">Send a message to your landlord</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Payments</h1>
              </div>

              {/* Pending invoices */}
              {!loadingInvoices && invoices.filter((i: any) => i.status !== 'PAID').length > 0 && (
                <div className="mb-8 space-y-3">
                  <h2 className="text-lg text-[#1a2e4a]">Outstanding Invoices</h2>
                  {invoices.filter((i: any) => i.status !== 'PAID').map((inv: any) => (
                    <div key={inv.id} className="bg-white p-4 rounded-lg border border-orange-200 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#1a2e4a]">{inv.period} — {formatKES(inv.amount)}</p>
                        <p className="text-sm text-gray-500">Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${invoiceStatusColor(inv.status)}`}>{inv.status}</span>
                        <button className="px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg text-sm">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl text-[#1a2e4a]">Payment History</h2>
                </div>
                {loadingPayments ? (
                  <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#2ecc71]" /></div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Amount</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Method</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No payments yet</td></tr>
                      ) : payments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{new Date(p.paidAt ?? p.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{formatKES(p.amount)}</td>
                          <td className="px-6 py-4 text-gray-600">{p.method}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{p.providerRef ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Maintenance Requests</h1>
                <button onClick={() => setShowMaintenanceForm(!showMaintenanceForm)} className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg">
                  New Request
                </button>
              </div>

              {showMaintenanceForm && (
                <form onSubmit={handleMaintSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8 space-y-4">
                  <h2 className="text-xl text-[#1a2e4a]">Submit Maintenance Request</h2>
                  {submitMaintenance.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {(submitMaintenance.error as any)?.response?.data?.message ?? 'Failed to submit request'}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm mb-2">Issue Title</label>
                    <input type="text" value={maintForm.title} onChange={(e) => setMaintForm((f) => ({ ...f, title: e.target.value }))} required placeholder="Brief description of the issue" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Category</label>
                    <select value={maintForm.category} onChange={(e) => setMaintForm((f) => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                      <option value="PLUMBING">Plumbing</option>
                      <option value="ELECTRICAL">Electrical</option>
                      <option value="APPLIANCES">Appliances</option>
                      <option value="STRUCTURAL">Structural</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Description</label>
                    <textarea rows={4} value={maintForm.description} onChange={(e) => setMaintForm((f) => ({ ...f, description: e.target.value }))} required placeholder="Provide details about the issue" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Photos (optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={submitMaintenance.isPending} className="flex-1 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitMaintenance.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Submit Request
                    </button>
                    <button type="button" onClick={() => setShowMaintenanceForm(false)} className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {loadingMaint ? (
                <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#2ecc71]" /></div>
              ) : maintenance.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                  <Wrench className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No maintenance requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {maintenance.map((req: any) => {
                    const badge = maintenanceStatusBadge(req.status);
                    return (
                      <div key={req.id} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg text-[#1a2e4a] mb-1">{req.title}</h3>
                            <p className="text-gray-600">{req.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${badge.color}`}>
                            <badge.Icon className="h-4 w-4" />
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Documents</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Document storage coming soon</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Messages</h1>
              <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">Messaging coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
