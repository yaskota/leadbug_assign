import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Check, ChevronRight, UserPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = ["Set Variables", "Select Template", "Add Recipients", "Review & Send"];

const CampaignWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  
  // State for steps
  const [dynamicData, setDynamicData] = useState({ discount: "20%", link: "https://yourstore.com" });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [recipients, setRecipients] = useState([{ name: "", email: "" }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/templates").then(res => setTemplates(res.data)).catch(() => {});
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && !selectedTemplate) return toast.error("Please select a template");
    if (currentStep === 2 && recipients.some(r => !r.email)) return toast.error("Please fill all emails");
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleAddRecipient = () => setRecipients([...recipients, { name: "", email: "" }]);
  const handleRemoveRecipient = (index) => {
    if (recipients.length > 1) {
      const newR = [...recipients];
      newR.splice(index, 1);
      setRecipients(newR);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      await api.post("/campaign/send", {
        templateId: selectedTemplate._id,
        dynamicData,
        recipients
      });
      toast.success("Campaign Started!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Launch Campaign</h1>
        <p className="text-slate-500 mt-1">Send personalized emails in 4 easy steps.</p>
      </div>

      {/* Stepper */}
      <div className="flex border-b border-slate-200 mb-8 pb-4">
        {STEPS.map((step, idx) => (
          <div key={idx} className={`flex items-center ${idx !== STEPS.length - 1 ? "flex-1" : ""} ${currentStep >= idx ? "text-brand-600" : "text-slate-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= idx ? "bg-brand-100" : "bg-slate-100"}`}>
              {currentStep > idx ? <Check size={16} /> : idx + 1}
            </div>
            <span className="ml-3 font-medium text-sm hidden sm:block">{step}</span>
            {idx !== STEPS.length - 1 && <div className="flex-1 border-t-2 border-slate-100 mx-4" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
        
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-800">Global Variables</h2>
            <p className="text-slate-500 text-sm">Set fallback variables that will be used. User's specific `{"{{name}}"}` will be picked from recipients list automatically.</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount {"{{discount}}"}</label>
                <input type="text" className="input-field" value={dynamicData.discount || ''} onChange={e => setDynamicData({...dynamicData, discount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link {"{{link}}"}</label>
                <input type="text" className="input-field" value={dynamicData.link || ''} onChange={e => setDynamicData({...dynamicData, link: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold text-slate-800">Select Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(t => (
                <div 
                  key={t._id} 
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplate?._id === t._id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}
                >
                  <h3 className="font-bold text-slate-800">{t.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Created: {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {templates.length === 0 && <p className="text-slate-500 col-span-2">No templates available. Create one first.</p>}
            </div>
            
            {selectedTemplate && (
              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">Preview with variables</h4>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 prose prose-sm max-w-none" 
                  dangerouslySetInnerHTML={{ 
                    __html: selectedTemplate.content
                      .replace(/\{\{discount\}\}/g, dynamicData.discount || '')
                      .replace(/\{\{link\}\}/g, dynamicData.link || '')
                      .replace(/\{\{name\}\}/g, 'John Doe')
                  }} 
                />
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add Recipients</h2>
              <button type="button" onClick={handleAddRecipient} className="btn-secondary flex items-center gap-2 py-2 px-4 shadow-sm text-sm">
                <UserPlus size={16} /> Add 
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {recipients.map((r, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-8 text-center text-slate-400 font-medium">{idx + 1}</div>
                  <input type="text" placeholder="Name" className="input-field flex-1 !py-2" 
                    value={r.name} onChange={e => {
                      const newR = [...recipients]; newR[idx].name = e.target.value; setRecipients(newR);
                    }}/>
                  <input type="email" placeholder="Email" className="input-field flex-1 !py-2" required
                    value={r.email} onChange={e => {
                      const newR = [...recipients]; newR[idx].email = e.target.value; setRecipients(newR);
                    }}/>
                  <button type="button" onClick={() => handleRemoveRecipient(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in text-center py-8">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-600 mb-6">
              <Send size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Ready to Launch!</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              You are about to send <strong>{selectedTemplate?.title}</strong> to <strong>{recipients.length}</strong> recipients.
            </p>
            <div className="pt-8">
              <button onClick={handleSend} disabled={loading} className="btn-primary text-lg px-12 py-4 shadow-brand-500/30">
                {loading ? "Sending..." : "Blast Campaign 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={handleBack} 
          disabled={currentStep === 0} 
          className={`btn-secondary ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Back
        </button>
        {currentStep < STEPS.length - 1 && (
          <button onClick={handleNext} className="btn-primary flex items-center gap-2">
            Next <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// Lucide icon import fallback for Send in this file
import { Send } from "lucide-react";

export default CampaignWizard;
