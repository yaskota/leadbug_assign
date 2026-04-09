import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const TemplateBuilder = () => {
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates");
      setTemplates(res.data);
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await api.post("/templates/create", formData);
      toast.success("Template saved!");
      setFormData({ title: "", content: "" });
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Template Builder</h1>
          <p className="text-slate-500 mt-1">Design reusable email templates with variables.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Internal Name / Title</label>
            <input
              type="text" className="input-field" placeholder="e.g. Fall Flash Sale"
              value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email HTML Content</label>
            <textarea
              rows="10" className="input-field font-mono text-sm"
              placeholder={`<h1>Hi {{name}}!</h1>\n<p>Get {{discount}} off on your next purchase!</p>\n<a href="{{link}}">Shop Now</a>`}
              value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            ></textarea>
            <div className="mt-2 text-xs text-slate-500 flex gap-2">
               Available tags: <span className="bg-slate-100 px-1 rounded">{"{{name}}"}</span> <span className="bg-slate-100 px-1 rounded">{"{{discount}}"}</span> <span className="bg-slate-100 px-1 rounded">{"{{link}}"}</span>
            </div>
          </div>
          <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Save Template"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Saved Templates</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {templates.map(t => (
              <div key={t._id} className="p-3 border border-slate-200 rounded-lg hover:border-brand-300 cursor-pointer transition-colors"
                onClick={() => setFormData({ title: t.title, content: t.content })}
              >
                <div className="font-medium text-slate-800">{t.title}</div>
                <div className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
            {templates.length === 0 && <div className="text-sm text-slate-500">No templates yet.</div>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live Preview</h2>
          <p className="text-slate-500 text-sm mt-1">See how it will look in the inbox.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="text-xs text-slate-400 ml-2 font-mono">Preview rendering</div>
          </div>
          <div className="p-8 prose prose-slate max-w-none flex-1 bg-white" 
            dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-slate-400 text-center italic mt-10">Start typing to see preview...</p>' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
