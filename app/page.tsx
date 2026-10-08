'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { exportToExcel } from './exportExcel';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [items, setItems] = useState<any[]>([]);
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchItems();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session) fetchItems();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch ALL inventory records across the company (Master View)
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !session?.user?.id) return;
    
    const { error } = await supabase.from('inventory').insert([
      {
        item_name: itemName,
        serial_number: serialNumber || '—',
        description: description || 'N/A',
        user_id: session.user.id // Satisfies the database not-null constraint
      }
    ]);
    
    if (!error) {
      setItemName('');
      setSerialNumber('');
      setDescription('');
      fetchItems();
    } else {
      alert('Error adding item: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (!error) {
      fetchItems();
    } else {
      alert('Error deleting item: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white">
        <p className="text-sm tracking-widest uppercase">Loading ABIC AssetLedger...</p>
      </div>
    );
  }

  // 1. SIGN IN SCREEN (If not logged in)
  if (!session) {
    return (
      <main className="min-h-screen bg-[#0A192F] flex flex-col justify-between p-6 md:p-12 text-slate-100 font-sans">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A8A] text-white font-bold px-3 py-1.5 rounded text-sm tracking-wider shadow">
              ABIC
            </div>
            <span className="font-semibold tracking-wide text-lg">AssetLedger</span>
          </div>
          <span className="text-xs text-slate-400">ENTERPRISE PROPERTY PORTAL</span>
        </div>

        <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div>
            <span className="bg-[#1E3A8A]/30 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full font-medium">
              SECURE ACCESS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-3">Sign In to Workspace</h1>
            <p className="text-xs text-slate-400 mt-1">Enter your assigned employee email and password to access your inventory.</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
              {authError}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Work Email Address</label>
              <input 
                type="email"
                required
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-md"
            >
              Sign In to Portal →
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          © 2026 ABIC Company Inventory Systems. All rights reserved. Protected by Supabase Auth with Row Level Security (RLS).
        </div>
      </main>
    );
  }

  // 2. DASHBOARD SCREEN (Master View - All Records)
  const filteredItems = items.filter(item => 
    (item.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-[#0A192F] text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-[#1E3A8A] text-white font-bold px-3 py-1.5 rounded text-sm tracking-wider shadow">
            ABIC
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">AssetLedger</h1>
            <p className="text-xs text-slate-300">ENTERPRISE INVENTORY SYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-300">Logged in as <strong className="text-white">{session.user.email}</strong></span>
          <button 
            onClick={handleSignOut}
            className="border border-slate-500 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Total Company Items</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-3xl font-bold text-[#0A192F]">{items.length}</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Master Sync
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Employee Account</p>
            <p className="text-sm font-medium text-slate-800 mt-3 truncate">{session.user.email}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Security Protocol</p>
            <p className="text-sm font-medium text-emerald-700 mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Supabase RLS Protected
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Add Item to Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">Submit hardware or personal property tags.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Dell XPS 15 Laptop"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Serial Number / Tag</label>
                <input 
                  type="text"
                  placeholder="e.g. SN-8839201"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Condition</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Good condition, assigned to workstation 4."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#0A192F] text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm"
              >
                + Register Property Item
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Company Property Inventory</h2>
                <p className="text-xs text-slate-500">Master record view for all company inputs.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="Filter items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] w-full sm:w-48"
                />
                
                <button
                  onClick={() => exportToExcel(items, session.user.email)}
                  className="bg-[#1E3A8A] hover:bg-[#0A192F] text-white font-medium px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition shadow-sm whitespace-nowrap"
                >
                  Export Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">Serial / Tag</th>
                    <th className="py-3 px-4">Date Registered</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400">
                        No inventory records found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{item.item_name}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.serial_number !== '—' ? (
                            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2 py-0.5 rounded font-mono">
                              {item.serial_number}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
