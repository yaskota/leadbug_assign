import { useState, useEffect } from "react";
import api from "../utils/api";
import { Copy, Plus, Activity, Mail, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaign/status");
      setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRecipients = campaigns.reduce((acc, c) => acc + c.recipients.length, 0);
    const sent = campaigns.reduce((acc, c) => acc + c.recipients.filter(r => r.status === 'sent').length, 0);
    const failed = campaigns.reduce((acc, c) => acc + c.recipients.filter(r => r.status === 'failed').length, 0);
    
    return { total: totalRecipients, sent, failed };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your email campaigns</p>
        </div>
        <Link to="/campaigns/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
           <div className="p-3 bg-brand-50 text-brand-600 rounded-lg"><Mail size={24}/></div>
           <div>
             <p className="text-sm text-slate-500 font-medium">Total Emails Sent</p>
             <h3 className="text-2xl font-bold text-slate-800">{stats.sent}</h3>
           </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
           <div className="p-3 bg-orange-50 text-orange-500 rounded-lg"><Activity size={24}/></div>
           <div>
             <p className="text-sm text-slate-500 font-medium">Total Campaigns</p>
             <h3 className="text-2xl font-bold text-slate-800">{campaigns.length}</h3>
           </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
           <div className="p-3 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={24}/></div>
           <div>
             <p className="text-sm text-slate-500 font-medium">Failed Emails</p>
             <h3 className="text-2xl font-bold text-slate-800">{stats.failed}</h3>
           </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Recent Campaigns</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading tracking data...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No campaigns yet</h3>
            <p className="text-slate-500 mt-1">Create your first campaign to see stats here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="px-6 py-4">Template</th>
                  <th className="px-6 py-4">Recipients</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{camp.templateId?.title || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{camp._id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{camp.recipients.length}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {camp.recipients.slice(0, 3).map((r, i) => (
                          <span key={i} title={r.email} className={`w-2.5 h-2.5 rounded-full ${
                            r.status === 'sent' ? 'bg-green-500' :
                            r.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                        ))}
                        {camp.recipients.length > 3 && <span className="text-xs text-slate-400">+{camp.recipients.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(camp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
