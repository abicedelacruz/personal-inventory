'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/utils/exportExcel';

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Replace with active user email / session
  const userEmail = "abic.edelacruz@gmail.com";

  // Fetch or mock items for demonstration
  useEffect(() => {
    // Simulated initial data load or Supabase fetch
    setItems([
      { id: '1', item_name: 'Wifi Dongle', description: 'Black', serial_number: '—', created_at: '2026-09-28' },
      { id: '2', item_name: 'Keyboard', description: 'White', serial_number: 'K-016', created_at: '2026-09-28' },
      { id: '3', item_name: 'Mouse', description: 'Black', serial_number: '—', created_at: '2026-09-28' },
    ]);
    setLoading(false);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;
    const newItem = {
      id: Date.now().toString(),
      item_name: itemName,
      serial_number: serialNumber || '—',
      description: description || 'N/A',
      created_at: new Date().toISOString().split('T')[0],
    };
    setItems([newItem, ...items]);
    setItemName('');
    setSerialNumber('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {/* ABIC Corporate Header Navbar */}
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
          <span className="text-slate-300">Logged in as <strong className="text-white">{userEmail}</strong></span>
          <button 
            onClick={() => alert('Signed out')}
            className="border border-slate-500 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Total Items Registered</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-3xl font-bold text-[#0A192F]">{items.length}</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Active Sync
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Employee Account</p>
            <p className="text-sm font-medium text-slate-800 mt-3 truncate">{userEmail}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Security Protocol</p>
            <p className="text-sm font-medium text-emerald-700 mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Supabase RLS Protected
            </p>
          </div>
        </div>

        {/* Content Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Serial Number / Tag</label>
                <input 
                  type="text"
                  placeholder="e.g. SN-8839201"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Condition</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Good condition, assigned to workstation 4."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
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

          {/* Table Column */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Header Controls */}
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Property Inventory</h2>
                <p className="text-xs text-slate-500">Real-time records for your logged account.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="Filter items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] w-full sm:w-48"
                />
                
                {/* Branded Corporate Excel Export Button */}
                <button
                  onClick={() => exportToExcel(items, userEmail)}
                  className="bg-[#1E3A8A] hover:bg-[#0A192F] text-white font-medium px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition shadow-sm whitespace-nowrap"
                >
                  Export Excel
                </button>
              </div>
            </div>

            {/* Inventory Table */}
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
                          {item.created_at}
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
