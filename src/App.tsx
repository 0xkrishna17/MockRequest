import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Settings, 
  Database, 
  Zap, 
  Activity, 
  Trash2, 
  Copy, 
  Check, 
  ChevronRight, 
  Save, 
  Play, 
  X,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, MockEndpoint, HttpMethod, PlaygroundLog } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mocks, setMocks] = useState<MockEndpoint[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
  const [view, setView] = useState<'endpoints' | 'database' | 'playground' | 'settings'>('endpoints');
  const [toast, setToast] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const p = storage.getProjects();
    const m = storage.getMocks();
    setProjects(p);
    setMocks(m);
    if (p.length > 0) setSelectedProjectId(p[0].id);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId),
  [projects, selectedProjectId]);

  const projectMocks = useMemo(() => 
    mocks.filter(m => m.projectId === selectedProjectId),
  [mocks, selectedProjectId]);

  const selectedMock = useMemo(() => 
    mocks.find(m => m.id === selectedMockId),
  [mocks, selectedMockId]);

  // Actions
  const handleAddProject = () => {
    const name = `New Project ${projects.length + 1}`;
    const p = storage.addProject(name, ['https://api.example.com']);
    setProjects([...projects, p]);
    setSelectedProjectId(p.id);
  };

  const handleUpdateProject = (updated: Project, message: string = 'Settings saved') => {
    const newProjects = projects.map(p => p.id === updated.id ? updated : p);
    setProjects(newProjects);
    storage.saveProjects(newProjects);
    showToast(message);
  };

  const handleDeleteProject = (id: string) => {
    const newProjects = projects.filter(p => p.id !== id);
    const newMocks = mocks.filter(m => m.projectId !== id);
    setProjects(newProjects);
    setMocks(newMocks);
    storage.saveProjects(newProjects);
    storage.saveMocks(newMocks);
    if (selectedProjectId === id) {
      setSelectedProjectId(newProjects[0]?.id || null);
    }
  };

  const handleAddMock = () => {
    if (!selectedProjectId) return;
    const m = storage.addMock(selectedProjectId, '/new-endpoint', HttpMethod.GET);
    setMocks([...mocks, m]);
    setSelectedMockId(m.id);
  };

  const handleUpdateMock = (updated: MockEndpoint) => {
    const newMocks = mocks.map(m => m.id === updated.id ? updated : m);
    setMocks(newMocks);
    storage.saveMocks(newMocks);
    showToast('Mock saved');
  };

  const handleDeleteMock = (id: string) => {
    const newMocks = mocks.filter(m => m.id !== id);
    setMocks(newMocks);
    storage.saveMocks(newMocks);
    if (selectedMockId === id) setSelectedMockId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[var(--color-line)] flex flex-col bg-[var(--color-bg)]">
        <div className="p-6 border-b border-[var(--color-line)] flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <Activity size={24} />
            <span>PROXYMOCKER</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="col-header flex items-center justify-between">
            <span>Groups / Base URLs</span>
            <button onClick={handleAddProject} className="hover:opacity-100 opacity-50 cursor-pointer">
              <Plus size={14} />
            </button>
          </div>
          
          {projects.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`data-row group relative ${selectedProjectId === p.id ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : ''}`}
            >
              <div className="flex flex-col gap-1 w-full overflow-hidden">
                <span className="font-medium truncate">{p.name}</span>
                <span className="mono text-[10px] opacity-60 truncate">
                  {p.baseUrls.join(', ')}
                </span>
              </div>
              <ChevronRight size={14} className={`ml-auto ${selectedProjectId === p.id ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--color-line)] flex gap-2">
          <button 
            onClick={() => setView('playground')}
            className={`flex-1 p-2 border border-[var(--color-line)] flex items-center justify-center gap-2 text-xs font-bold transition-colors ${view === 'playground' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]'}`}
          >
            <Zap size={14} /> PLAYGROUND
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm">
        {selectedProject ? (
          <>
            <header className="h-16 border-b border-[var(--color-line)] flex items-center justify-between px-6 bg-[var(--color-bg)]/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <h2 className="font-bold tracking-tight uppercase">{selectedProject.name}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setView('endpoints')}
                    className={`px-3 py-1 text-xs font-bold border border-[var(--color-line)] transition-colors ${view === 'endpoints' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]'}`}
                  >
                    MOCKS
                  </button>
                  <button 
                    onClick={() => setView('database')}
                    className={`px-3 py-1 text-xs font-bold border border-[var(--color-line)] transition-colors ${view === 'database' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]'}`}
                  >
                    DATABASE
                  </button>
                  <button 
                    onClick={() => setView('settings')}
                    className={`px-3 py-1 text-xs font-bold border border-[var(--color-line)] transition-colors ${view === 'settings' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]'}`}
                  >
                    CONFIG
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="p-2 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-hidden flex">
              {view === 'endpoints' && (
                <>
                  <div className="flex-1 overflow-y-auto">
                    <div className="col-header flex items-center justify-between">
                      <span>Mocks / Paths</span>
                      <button onClick={handleAddMock} className="p-1 hover:bg-black/5 rounded">
                        <Plus size={14} />
                      </button>
                    </div>
                    {projectMocks.length === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center gap-4 opacity-30">
                        <Database size={48} />
                        <p className="font-serif italic text-sm">No mocks defined for this group</p>
                      </div>
                    ) : (
                      projectMocks.map(m => (
                        <div 
                          key={m.id}
                          onClick={() => setSelectedMockId(m.id)}
                          className={`data-row group ${selectedMockId === m.id ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : ''}`}
                        >
                          <div className={`w-16 mono text-[10px] font-bold ${m.method === 'GET' ? 'text-green-600' : 'text-blue-600'}`}>
                            {m.method}
                          </div>
                          <div className="mono text-sm flex-1 truncate">
                            {m.path}
                          </div>
                          <div className="opacity-40 mono text-[10px] mr-4">
                            {m.statusCode}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Sidebar Editor */}
                  <AnimatePresence>
                    {selectedMock && (
                      <motion.div 
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="w-[450px] border-l border-[var(--color-line)] bg-[var(--color-bg)] overflow-y-auto flex flex-col shadow-2xl"
                      >
                        <MockEditor 
                          mock={selectedMock} 
                          onUpdate={handleUpdateMock} 
                          onDelete={() => handleDeleteMock(selectedMock.id)} 
                          onClose={() => setSelectedMockId(null)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {view === 'database' && (
                <div className="flex-1 p-0 overflow-hidden">
                  <DatabaseView 
                    project={selectedProject} 
                    onUpdate={(p) => handleUpdateProject(p, 'Database saved')} 
                  />
                </div>
              )}

              {view === 'settings' && (
                <div className="flex-1 p-12 overflow-y-auto">
                  <ProjectSettings project={selectedProject} onUpdate={handleUpdateProject} />
                </div>
              )}

              {view === 'playground' && (
                <div className="flex-1 p-0 overflow-hidden">
                  <Playground projects={projects} mocks={mocks} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20">
            <Zap size={64} strokeWidth={1} />
            <h1 className="text-2xl font-bold tracking-[0.2em]">SELECT A GROUP TO START</h1>
          </div>
        )}
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bg)] font-bold text-xs tracking-widest uppercase z-50 border border-[var(--color-line)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MockEditor({ mock, onUpdate, onDelete, onClose }: { 
  mock: MockEndpoint, 
  onUpdate: (m: MockEndpoint) => void, 
  onDelete: () => void,
  onClose: () => void
}) {
  const [body, setBody] = useState(mock.responseBody);

  useEffect(() => {
    setBody(mock.responseBody);
  }, [mock.id]);

  const handleSave = () => {
    try {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (inner) {
        // Lenient parsing for JS-like objects (unquoted keys, single quotes)
        parsed = (new Function(`return ${body}`))();
      }
      const formatted = JSON.stringify(parsed, null, 2);
      setBody(formatted);
      onUpdate({ ...mock, responseBody: formatted });
    } catch (e) {
      alert("Invalid format. Please provide valid JSON or a JS object literal.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--color-line)] flex items-center justify-between">
        <span className="font-bold text-xs uppercase tracking-widest">Editor</span>
        <div className="flex gap-1">
          <button 
            onClick={handleSave} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-ink)] text-[var(--color-bg)] text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            <Save size={12}/> SAVE
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 transition-colors border border-[var(--color-line)]"><X size={16}/></button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <label className="col-header p-0 border-none">Endpoint Path</label>
          <input 
            type="text" 
            value={mock.path} 
            onChange={e => onUpdate({ ...mock, path: e.target.value })}
            className="w-full bg-white border border-[var(--color-line)] p-2 mono text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="col-header p-0 border-none">Method</label>
            <select 
              value={mock.method}
              onChange={e => onUpdate({ ...mock, method: e.target.value as HttpMethod })}
              className="w-full bg-white border border-[var(--color-line)] p-2 mono text-sm focus:outline-none"
            >
              {Object.values(HttpMethod).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="col-header p-0 border-none">Status</label>
            <input 
              type="number" 
              value={mock.statusCode} 
              onChange={e => onUpdate({ ...mock, statusCode: parseInt(e.target.value) })}
              className="w-full bg-white border border-[var(--color-line)] p-2 mono text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1 flex-1 flex flex-col">
          <label className="col-header p-0 border-none">Response Body (JSON)</label>
          <textarea 
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full h-[300px] bg-white border border-[var(--color-line)] p-4 mono text-xs focus:outline-none resize-none"
          />
        </div>

        <button 
          onClick={onDelete}
          className="w-full p-3 border border-red-200 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
        >
          Delete Endpoint
        </button>
      </div>
    </div>
  );
}

function ProjectSettings({ project, onUpdate }: { project: Project, onUpdate: (p: Project) => void }) {
  const [urls, setUrls] = useState(project.baseUrls.join('\n'));

  const handleSave = () => {
    const list = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    onUpdate({ ...project, baseUrls: list });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-4">
        <h3 className="font-serif italic text-2xl">Configuration</h3>
        <p className="text-sm opacity-60">Define the base URLs that should be mapped to this source of truth.</p>
      </div>

      <div className="space-y-2">
        <label className="col-header p-0 border-none">Group Name</label>
        <input 
          type="text" 
          value={project.name} 
          onChange={e => onUpdate({ ...project, name: e.target.value })}
          className="w-full bg-white border border-[var(--color-line)] p-3 mono font-bold focus:outline-none text-lg"
        />
      </div>

      <div className="space-y-2">
        <label className="col-header p-0 border-none">Base URLs (One per line)</label>
        <textarea 
          value={urls}
          onChange={e => setUrls(e.target.value)}
          className="w-full h-[150px] bg-white border border-[var(--color-line)] p-4 mono text-sm focus:outline-none resize-none"
          placeholder="https://api.myapp.com"
        />
        <button 
          onClick={handleSave}
          className="bg-[var(--color-ink)] text-[var(--color-bg)] px-6 py-2 font-bold text-xs uppercase tracking-widest hover:opacity-90"
        >
          Apply Changes
        </button>
      </div>

      <div className="p-6 bg-amber-50 border border-amber-200 space-y-4">
        <div className="flex items-center gap-2 text-amber-800">
          <Settings size={16} />
          <span className="font-bold text-xs uppercase tracking-widest">Interception Script</span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Copy this script and paste it into your application's entry point to start intercepting calls automatically.
        </p>
        <div className="relative group">
          <pre className="p-4 bg-white border border-amber-200 text-[10px] overflow-x-auto mono text-amber-900 leading-tight">
{`const ORIGINAL_FETCH = window.fetch;
window.fetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  
  // Real-time lookup from source of truth
  const projects = JSON.parse(localStorage.getItem('proxymocker_projects') || '[]');
  const mocks = JSON.parse(localStorage.getItem('proxymocker_mocks') || '[]');
  
  const targetProject = projects.find(p => 
    p.baseUrls.some(base => url.toString().startsWith(base))
  );

  if (targetProject) {
    const urlObj = new URL(url.toString(), 'http://dummy.com');
    const path = urlObj.pathname;
    const cleanPath = path.replace(/^\\/+/, '');
    
    // 1. Try explicit mock match first
    const match = mocks.find(m => 
      m.projectId === targetProject.id && 
      (m.path === path || m.path === \`/\${cleanPath}\`) && 
      m.method === method
    );

    if (match) {
      return new Response(match.responseBody, {
        status: match.statusCode,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Try JSON Database match
    if (targetProject.databaseJson && method === 'GET') {
      try {
        const db = JSON.parse(targetProject.databaseJson);
        const parts = cleanPath.split('/');
        let current = db;
        for (const part of parts) {
          if (part && current && typeof current === 'object') {
            current = current[part];
          }
        }
        if (current !== undefined) {
          return new Response(JSON.stringify(current), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (e) {}
    }
  }
  return ORIGINAL_FETCH(url, options);
};`}
          </pre>
          <button 
            onClick={() => {
              const code = document.querySelector('pre')?.innerText;
              if (code) navigator.clipboard.writeText(code);
            }}
            className="absolute top-2 right-2 p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 transition-colors"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DatabaseView({ project, onUpdate }: { project: Project, onUpdate: (p: Project) => void }) {
  const [json, setJson] = useState(project.databaseJson || '{}');

  useEffect(() => {
    setJson(project.databaseJson || '{}');
  }, [project.id]);

  const handleSave = () => {
    try {
      let parsed;
      try {
        parsed = JSON.parse(json);
      } catch (inner) {
        // Lenient parsing for JS-like objects (unquoted keys, single quotes)
        parsed = (new Function(`return ${json}`))();
      }
      const formatted = JSON.stringify(parsed, null, 2);
      setJson(formatted);
      onUpdate({ ...project, databaseJson: formatted });
    } catch (e) {
      alert("Invalid format. Please check your syntax (use valid JSON or a JS object).");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-[var(--color-line)] flex items-center justify-between bg-[var(--color-bg)]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xs uppercase tracking-widest">Global JSON Store</span>
          <p className="text-[10px] opacity-60 font-serif italic">Endpoints will automatically map to keys in this JSON.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-[var(--color-ink)] text-[var(--color-bg)] px-4 py-2 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
        >
          <Save size={14} /> SAVE DATABASE
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex">
        <textarea 
          value={json}
          onChange={e => setJson(e.target.value)}
          className="flex-1 p-8 mono text-xs focus:outline-none resize-none leading-relaxed"
          placeholder='{ "users": [], "settings": {} }'
        />
        <div className="w-80 border-l border-[var(--color-line)] bg-[var(--color-bg)]/30 p-6 space-y-4">
          <h4 className="font-bold text-[10px] uppercase tracking-widest opacity-50">Mapping Logic</h4>
          <div className="text-[10px] space-y-4 leading-relaxed font-mono">
            <div className="p-3 bg-white border border-[var(--color-line)]">
              <div className="opacity-40">URL:</div>
              /users
              <div className="mt-2 opacity-40">MAPS TO:</div>
              db.users
            </div>
            <div className="p-3 bg-white border border-[var(--color-line)]">
              <div className="opacity-40">URL:</div>
              /config/app/theme
              <div className="mt-2 opacity-40">MAPS TO:</div>
              db.config.app.theme
            </div>
          </div>
          <p className="font-serif italic text-xs leading-snug">
            Explicitly defined mocks always take precedence over the global database.
          </p>
        </div>
      </div>
    </div>
  );
}

function Playground({ projects, mocks }: { projects: Project[], mocks: MockEndpoint[] }) {
  const [url, setUrl] = useState('https://api.example.com/users');
  const [method, setMethod] = useState<HttpMethod>(HttpMethod.GET);
  const [logs, setLogs] = useState<PlaygroundLog[]>([]);

  const handleTest = () => {
    // Simulate interception
    const targetProject = projects.find(p => 
      p.baseUrls.some(base => url.startsWith(base))
    );

    let result: any = null;
    let intercepted = false;
    let status = 200;

    if (targetProject) {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const cleanPath = path.replace(/^\/+/, '');
        
        // 1. Check mocks
        const match = mocks.find(m => 
          m.projectId === targetProject.id && 
          m.path === path && 
          m.method === method
        );

        if (match) {
          result = JSON.parse(match.responseBody);
          intercepted = true;
          status = match.statusCode;
        } 
        // 2. Check Database
        else if (targetProject.databaseJson && method === HttpMethod.GET) {
          const db = JSON.parse(targetProject.databaseJson);
          const parts = cleanPath.split('/');
          let current = db;
          for (const part of parts) {
            if (part && current && typeof current === 'object') {
              current = current[part];
            }
          }
          if (current !== undefined) {
            result = current;
            intercepted = true;
            status = 200;
          }
        }
      } catch (e) {}
    }

    if (!intercepted) {
      result = { error: "No mock found for this URL/Method combination" };
      status = 404;
    }

    const newLog: PlaygroundLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      url,
      method,
      status,
      intercepted,
      response: result
    };

    setLogs([newLog, ...logs]);
  };

  return (
    <div className="flex h-full">
      <div className="w-[450px] border-r border-[var(--color-line)] p-8 space-y-6">
        <h3 className="font-serif italic text-2xl">Playground</h3>
        <p className="text-xs opacity-60">Test your interception logic before deploying it to your app.</p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="col-header p-0 border-none">Test URL</label>
            <input 
              type="text" 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-white border border-[var(--color-line)] p-2 mono text-sm focus:outline-none"
              placeholder="https://api.example.com/users"
            />
          </div>

          <div className="space-y-1">
            <label className="col-header p-0 border-none">Method</label>
            <div className="flex gap-2">
              {Object.values(HttpMethod).map(h => (
                <button
                  key={h}
                  onClick={() => setMethod(h)}
                  className={`flex-1 p-2 border border-[var(--color-line)] mono text-[10px] font-bold transition-colors ${method === h ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'hover:bg-black/5'}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleTest}
            className="w-full bg-[var(--color-ink)] text-[var(--color-bg)] p-4 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90"
          >
            <Play size={14} /> Send Request
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-blue-800">
            <Code size={14} />
            <span className="font-bold text-[10px] uppercase tracking-widest">How it works</span>
          </div>
          <p className="text-[10px] text-blue-700 leading-relaxed italic">
            This simulator checks your local database. If a base URL matches and the path/method is defined, it returns the mock data instantly.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white flex flex-col">
        <div className="col-header">Console Logs</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center opacity-20 mono text-xs uppercase tracking-widest">
              Logs will appear here
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="border border-[var(--color-line)] overflow-hidden">
                <div className={`p-2 font-bold mono text-[10px] flex items-center justify-between ${log.intercepted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="px-1 border border-current">{log.method}</span>
                    <span>{log.url}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {log.intercepted && <span className="flex items-center gap-1"><Zap size={10} /> INTERCEPTED</span>}
                    <span>STATUS: {log.status}</span>
                  </div>
                </div>
                <div className="p-4 bg-[var(--color-bg)]/30 mono text-[10px] whitespace-pre-wrap">
                  {JSON.stringify(log.response, null, 2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

