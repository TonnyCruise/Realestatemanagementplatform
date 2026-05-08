import { useState } from 'react';
import {
  CreditCard,
  FileText,
  Wrench,
  MessageSquare,
  Home,
  LogOut,
  Settings,
  Bell,
  Download,
  Upload,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const PAYMENT_HISTORY = [
  { id: 1, date: '2026-05-01', amount: 'KES 45,000', method: 'M-Pesa', status: 'completed' },
  { id: 2, date: '2026-04-01', amount: 'KES 45,000', method: 'M-Pesa', status: 'completed' },
  { id: 3, date: '2026-03-01', amount: 'KES 45,000', method: 'Bank Transfer', status: 'completed' },
  { id: 4, date: '2026-02-01', amount: 'KES 45,000', method: 'M-Pesa', status: 'completed' },
  { id: 5, date: '2026-01-01', amount: 'KES 45,000', method: 'M-Pesa', status: 'completed' },
];

const MAINTENANCE_HISTORY = [
  {
    id: 1,
    title: 'Leaking faucet in kitchen',
    date: '2026-05-07',
    status: 'pending',
    description: 'The kitchen sink faucet has been dripping continuously for 2 days.',
  },
  {
    id: 2,
    title: 'Broken window latch',
    date: '2026-04-15',
    status: 'completed',
    description: 'Window in bedroom does not close properly.',
  },
  {
    id: 3,
    title: 'Light bulb replacement',
    date: '2026-03-28',
    status: 'completed',
    description: 'Living room ceiling light needs new bulb.',
  },
];

const DOCUMENTS = [
  { id: 1, name: 'Lease Agreement', type: 'PDF', size: '2.4 MB', date: '2026-01-01' },
  { id: 2, name: 'Move-in Inspection Report', type: 'PDF', size: '1.8 MB', date: '2026-01-01' },
  { id: 3, name: 'Rent Receipt - May 2026', type: 'PDF', size: '156 KB', date: '2026-05-01' },
  { id: 4, name: 'Rent Receipt - April 2026', type: 'PDF', size: '156 KB', date: '2026-04-01' },
];

export default function TenantPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'maintenance' | 'documents' | 'messages'>(
    'overview'
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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
                  SO
                </div>
                <span className="text-sm">Sarah Ochieng</span>
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
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'payments'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
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
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'documents'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Documents</span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === 'messages'
                    ? 'bg-[#1a2e4a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
                <span className="ml-auto bg-[#2ecc71] text-white text-xs px-2 py-1 rounded-full">2</span>
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
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Welcome Back, Sarah</h1>

              {/* Property Info Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&h=150&fit=crop"
                    alt="Property"
                    className="w-48 h-36 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl text-[#1a2e4a] mb-2">Westlands Apartments - Unit 2A</h2>
                    <p className="text-gray-600 mb-4">Westlands, Nairobi, Kenya</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p className="text-lg text-[#1a2e4a]">KES 45,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease Start</p>
                        <p className="text-lg text-[#1a2e4a]">Jan 1, 2026</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lease End</p>
                        <p className="text-lg text-[#1a2e4a]">Dec 31, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#2ecc71] to-[#27ae60] text-white p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8" />
                    <h3 className="text-xl">Payment Status</h3>
                  </div>
                  <p className="text-3xl mb-2">Paid</p>
                  <p className="text-green-100">May 2026 rent paid on May 1, 2026</p>
                  <p className="text-sm text-green-100 mt-4">Next payment due: June 1, 2026</p>
                </div>

                <div className="bg-white p-6 rounded-lg border-2 border-[#2ecc71]">
                  <h3 className="text-xl text-[#1a2e4a] mb-4">Current Balance</h3>
                  <p className="text-4xl text-[#1a2e4a] mb-2">KES 0</p>
                  <p className="text-gray-600 mb-4">No outstanding balance</p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full py-2 bg-[#1a2e4a] hover:bg-[#2c4a6e] text-white rounded-lg"
                  >
                    Make a Payment
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left"
                >
                  <Wrench className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">Request Maintenance</h3>
                  <p className="text-sm text-gray-600">Submit a maintenance request</p>
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left"
                >
                  <FileText className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">View Documents</h3>
                  <p className="text-sm text-gray-600">Access your lease and receipts</p>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-left"
                >
                  <MessageSquare className="h-8 w-8 text-[#2ecc71] mb-3" />
                  <h3 className="text-lg text-[#1a2e4a] mb-2">Contact Landlord</h3>
                  <p className="text-sm text-gray-600">Send a message to your landlord</p>
                </button>
              </div>

              {/* Landlord Contact */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg text-[#1a2e4a] mb-4">Your Landlord</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-2xl">
                    JM
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg text-[#1a2e4a]">John Mwangi</h4>
                    <p className="text-gray-600">Property Manager</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Payments</h1>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg"
                >
                  Make Payment
                </button>
              </div>

              {showPaymentForm && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                  <h2 className="text-xl text-[#1a2e4a] mb-4">Make a Payment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-2">Amount</label>
                      <input
                        type="text"
                        value="KES 45,000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Payment Method</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option>M-Pesa</option>
                        <option>Bank Transfer</option>
                        <option>Credit/Debit Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0712345678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg">
                      Continue to Payment
                    </button>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl text-[#1a2e4a]">Payment History</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Amount</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Method</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {PAYMENT_HISTORY.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{payment.date}</td>
                        <td className="px-6 py-4 text-gray-900">{payment.amount}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[#2ecc71] hover:text-[#27ae60] flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
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
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl text-[#1a2e4a]">Maintenance Requests</h1>
                <button
                  onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
                  className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg"
                >
                  New Request
                </button>
              </div>

              {showMaintenanceForm && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                  <h2 className="text-xl text-[#1a2e4a] mb-4">Submit Maintenance Request</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Issue Title</label>
                      <input
                        type="text"
                        placeholder="Brief description of the issue"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Category</label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Select category</option>
                        <option>Plumbing</option>
                        <option>Electrical</option>
                        <option>Appliances</option>
                        <option>Structural</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Description</label>
                      <textarea
                        rows={4}
                        placeholder="Provide detailed information about the issue"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Photos (optional)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg">
                        Submit Request
                      </button>
                      <button
                        onClick={() => setShowMaintenanceForm(false)}
                        className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {MAINTENANCE_HISTORY.map((request) => (
                  <div key={request.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg text-[#1a2e4a] mb-1">{request.title}</h3>
                        <p className="text-gray-600">{request.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                          request.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {request.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                        {request.status === 'completed'
                          ? 'Completed'
                          : request.status === 'in-progress'
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Submitted: {request.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Documents</h1>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Document Name</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Type</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Size</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {DOCUMENTS.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span>{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{doc.type}</td>
                        <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                        <td className="px-6 py-4 text-gray-600">{doc.date}</td>
                        <td className="px-6 py-4">
                          <button className="text-[#2ecc71] hover:text-[#27ae60] flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl text-[#1a2e4a] mb-8">Messages</h1>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg text-[#1a2e4a]">Conversations</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                          JM
                        </div>
                        <div className="flex-1">
                          <p>John Mwangi</p>
                          <p className="text-sm text-gray-500">Landlord</p>
                        </div>
                        <span className="h-2 w-2 bg-[#2ecc71] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white">
                        JM
                      </div>
                      <div>
                        <p>John Mwangi</p>
                        <p className="text-sm text-gray-500">Landlord</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 h-96 overflow-y-auto space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 bg-[#1a2e4a] rounded-full flex items-center justify-center text-white text-sm">
                        JM
                      </div>
                      <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm">Hi Sarah, your maintenance request has been received. We'll send someone tomorrow.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3 flex-row-reverse">
                      <div className="h-8 w-8 bg-[#2ecc71] rounded-full flex items-center justify-center text-white text-sm">
                        SO
                      </div>
                      <div className="flex-1 bg-[#2ecc71] text-white p-3 rounded-lg">
                        <p className="text-sm">Thank you! What time should I expect them?</p>
                        <p className="text-xs text-green-100 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <button className="px-6 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-lg">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
