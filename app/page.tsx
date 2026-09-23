'use client'

import React, { useState } from 'react'
import {
Shield,
Search,
Plus,
Trash2,
Cpu,
Monitor,
Smartphone,
CheckCircle2,
AlertCircle,
Download,
X,
Layers,
ArrowRight,
Lock,
Zap,
Activity,
Box,
ChevronRight,
Sparkles
} from 'lucide-react'

// Embedded CSS to guarantee full-page styles, colors, reset & dark mode regardless of Tailwind setup
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

{
box-sizing: border-box;
margin: 0;
padding: 0;
}

body, html {
width: 100%;
min-height: 100vh;
background-color: #030712;
color: #f3f4f6;
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
overflow-x: hidden;
}

.glass-card {
background: rgba(17, 24, 39, 0.7);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-input {
background: rgba(3, 7, 18, 0.6);
border: 1px solid rgba(255, 255, 255, 0.12);
color: #fff;
}

.glass-input:focus {
border-color: #6366f1;
outline: none;
box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.gradient-text {
background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
}

.gradient-btn {
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
transition: all 0.2s ease-in-out;
}

.gradient-btn:hover {
transform: translateY(-1px);
box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

.glow-bg {
position: absolute;
border-radius: 50%;
filter: blur(120px);
pointer-events: none;
z-index: 0;
}

.custom-scrollbar::-webkit-scrollbar {
width: 6px;
height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
background: rgba(15, 23, 42, 0.6);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
background: rgba(255, 255, 255, 0.15);
border-radius: 4px;
}
`

const INITIAL_ASSETS = [
{
id: 'AST-0921',
item_name: 'MacBook Pro 16" M3 Max',
category: 'Laptop',
serial_number: 'C02G1024MD6M',
assigned_to: 'alex.rivera@enterprise.co',
status: 'Active',
condition: 'Excellent',
location: 'Building A - Floor 4',
created_at: '2026-01-15'
},
{
id: 'AST-0842',
item_name: 'Dell UltraSharp 32" 4K Monitor',
category: 'Display',
serial_number: 'CN-0W983D-72872',
assigned_to: 'alex.rivera@enterprise.co',
status: 'Active',
condition: 'Good',
location: 'Remote / Home Office',
created_at: '2025-11-20'
},
{
id: 'AST-0711',
item_name: 'iPhone 15 Pro Enterprise',
category: 'Mobile',
serial_number: 'DN6FT298P0X1',
assigned_to: 'alex.rivera@enterprise.co',
status: 'Maintenance',
condition: 'Fair',
location: 'IT Helpdesk HQ',
created_at: '2025-08-04'
},
{
id: 'AST-0599',
item_name: 'YubiKey 5C NFC Security Key',
category: 'Security',
serial_number: 'YK-8849201',
assigned_to: 'alex.rivera@enterprise.co',
status: 'Active',
condition: 'New',
location: 'Personal Vault',
created_at: '2026-02-01'
}
]

export default function App() {
const [activeTab, setActiveTab] = useState<'overview' | 'portal'>('overview')
const [items, setItems] = useState(INITIAL_ASSETS)
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')
const [isModalOpen, setIsModalOpen] = useState(false)
const [isLoggedIn, setIsLoggedIn] = useState(true)

// Auth state
const [email, setEmail] = useState('employee@company.com')
const [password, setPassword] = useState('••••••••••••')

// New item form
const [newItem, setNewItem] = useState({
item_name: '',
category: 'Laptop',
serial_number: '',
status: 'Active',
location: ''
})

const filteredItems = items.filter((item) => {
const matchesSearch =
item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.id.toLowerCase().includes(searchTerm.toLowerCase())
const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
return matchesSearch && matchesCategory
})

const handleAddItem = (e: React.FormEvent) => {
e.preventDefault()
if (!newItem.item_name) return
const created = {
id: AST-${Math.floor(1000 + Math.random() * 9000)},
...newItem,
assigned_to: email,
condition: 'Excellent',
created_at: new Date().toISOString().split('T')[0]
}
setItems([created, ...items])
setIsModalOpen(false)
setNewItem({
item_name: '',
category: 'Laptop',
serial_number: '',
status: 'Active',
location: ''
})
}

const handleDelete = (id: string) => {
setItems(items.filter((i) => i.id !== id))
}

return (
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
{globalStyles}

  {/* Glow Orbs */}
  <div
    className="glow-bg"
    style={{
      width: '500px',
      height: '500px',
      background: 'rgba(79, 70, 229, 0.15)',
      top: '-100px',
      left: '-100px'
    }}
  />
  <div
    className="glow-bg"
    style={{
      width: '600px',
      height: '600px',
      background: 'rgba(168, 85, 247, 0.12)',
      bottom: '-150px',
      right: '-100px'
    }}
  />

  {/* Navigation */}
  <header
    className="glass-card"
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: 'none'
    }}
  >
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Shield style={{ width: '20px', height: '20px', color: '#fff' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '-0.5px',
                color: '#fff'
              }}
            >
              AssetLedger
            </span>
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'JetBrains Mono',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              PRO v2.8
            </span>
          </div>
          <p
            style={{
              fontSize: '10px',
              color: '#9ca3af',
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.5px'
            }}
          >
            ENTERPRISE PROPERTY PORTAL
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <nav
          style={{
            display: 'flex',
            gap: '4px',
            background: 'rgba(3, 7, 18, 0.8)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'overview' ? '#4f46e5' : 'transparent',
              color: activeTab === 'overview' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            Landing / Login
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'portal' ? '#4f46e5' : 'transparent',
              color: activeTab === 'portal' ? '#fff' : '#9ca3af',
              transition: 'all 0.2s'
            }}
          >
            Live Inventory Ledger
          </button>
        </nav>

        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            background: isLoggedIn ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: isLoggedIn ? '#f87171' : '#34d399',
            border: isLoggedIn
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : '1px solid rgba(16, 185, 129, 0.3)',
            cursor: 'pointer'
          }}
        >
          {isLoggedIn ? 'Sign Out Session' : 'Quick Auth'}
        </button>
      </div>
    </div>
  </header>

  {/* MAIN BODY AREA - FULL SCREEN EXPANDED */}
  <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '32px 24px' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {activeTab === 'overview' ? (
        /* HERO / LANDING PAGE VIEW WITH INTEGRATED SIGN IN */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px',
            alignItems: 'center',
            minHeight: 'calc(100vh - 170px)'
          }}
        >
          {/* Left Column: Value Prop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#818cf8',
                fontSize: '12px',
                fontWeight: 600,
                width: 'fit-content'
              }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Next-Gen Enterprise Infrastructure</span>
            </div>

            <h1
              style={{
                fontSize: '48px',
                fontWeight: 800,
                lineHeight: '1.15',
                letterSpacing: '-1px'
              }}
            >
              Precision Property Tracking for <span className="gradient-text">Enterprises.</span>
            </h1>

            <p style={{ fontSize: '16px', color: '#9ca3af', lineHeight: '1.6', maxWidth: '560px' }}>
              Record, audit, and organize your hardware, serial tags, and hardware allocation seamlessly in one centralized real-time ledger.
            </p>

            {/* Feature Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
                <Zap style={{ color: '#818cf8', width: '20px', height: '20px', marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Instant Audit</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Real-time telemetry</div>
              </div>
              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
                <Lock style={{ color: '#c084fc', width: '20px', height: '20px', marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>RLS Security</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Encrypted vaults</div>
              </div>
              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
                <Activity style={{ color: '#f472b6', width: '20px', height: '20px', marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>99.9% Uptime</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Enterprise SLA</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button
                onClick={() => setActiveTab('portal')}
                className="gradient-btn"
                style={{
                  padding: '14px 28px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Launch Live Ledger</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Right Column: High-End Auth Portal Box */}
          <div
            className="glass-card"
            style={{
              padding: '36px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Sign In to Portal</h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                Enter your corporate email and SSO credentials below.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setIsLoggedIn(true)
                setActiveTab('portal')
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#9ca3af',
                    marginBottom: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  className="glass-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#9ca3af',
                    marginBottom: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
              </div>

              <button
                type="submit"
                className="gradient-btn"
                style={{
                  marginTop: '8px',
                  padding: '14px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Access Asset Ledger</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </form>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: '#6b7280',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono'
              }}
            >
              <Lock style={{ width: '12px', height: '12px' }} />
              <span>Protected by Supabase Auth RLS Policies</span>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE ASSET PORTAL DASHBOARD VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stat Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="glass-card" style={{ padding: '20px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
                  Total Assets Tracked
                </span>
                <Box style={{ width: '18px', height: '18px', color: '#818cf8' }} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
                {items.length}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
                  Active Deployed
                </span>
                <CheckCircle2 style={{ width: '18px', height: '18px', color: '#34d399' }} />
              </div>
              <div style={{ fontSize: '32px', fontWeight 800, marginTop: '8px', color: '#34d399' }}>
                {items.filter((i) => i.status === 'Active').length}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
                  In Maintenance
                </span>
                <AlertCircle style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
              </div>
              <div style={{ fontSize: '32px', fontWeight 800, marginTop: '8px', color: '#fbbf24' }}>
                {items.filter((i) => i.status === 'Maintenance').length}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  style={{
                    width: '16px',
                    height: '16px',
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search asset, serial number, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input"
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', itemsCenter: 'center', gap: '12px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input"
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              >
                <option value="All">All Categories</option>
                <option value="Laptop">Laptop</option>
                <option value="Display">Display</option>
                <option value="Mobile">Mobile</option>
                <option value="Security">Security</option>
              </select>

              <button
                onClick={() => setIsModalOpen(true)}
                className="gradient-btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>Register Asset</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div
            className="glass-card"
            style={{
              borderRadius: '14px',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr
                    style={{
                      background: 'rgba(3, 7, 18, 0.8)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '10px',
                      fontFamily: 'JetBrains Mono',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}
                  >
                    <th style={{ padding: '16px 20px' }}>Asset Item</th>
                    <th style={{ padding: '16px 20px' }}>Asset Tag / ID</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                    <th style={{ padding: '16px 20px' }}>Location</th>
                    <th style={{ padding: '16px 20px' }}>Date Registered</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '13px', color: '#e5e7eb' }}>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No assets matching criteria found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.15s'
                        }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{item.item_name}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                            {item.category}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                          <div>{item.id}</div>
                          <div style={{ color: '#6b7280', fontSize: '10px' }}>{item.serial_number}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background:
                                item.status === 'Active'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                              color: item.status === 'Active' ? '#34d399' : '#fbbf24',
                              border:
                                item.status === 'Active'
                                  ? '1px solid rgba(16, 185, 129, 0.3)'
                                  : '1px solid rgba(245, 158, 11, 0.3)'
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: item.status === 'Active' ? '#34d399' : '#fbbf24'
                              }}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#9ca3af' }}>{item.location}</td>
                        <td
                          style={{
                            padding: '16px 20px',
                            color: '#6b7280',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                          }}
                        >
                          {item.created_at}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '6px'
                            }}
                            title="Delete Asset"
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
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
      )}
    </div>
  </div>

  {/* ADD ASSET MODAL */}
  {isModalOpen && (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          borderRadius: '16px',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Register New Asset</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              Item Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MacBook Pro M3"
              className="glass-input"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                Category
              </label>
              <select
                className="glass-input"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="Laptop">Laptop</option>
                <option value="Display">Display</option>
                <option value="Mobile">Mobile</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                Status
              </label>
              <select
                className="glass-input"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              Serial Tag
            </label>
            <input
              type="text"
              placeholder="e.g. SN-99823011"
              className="glass-input"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
              value={newItem.serial_number}
              onChange={(e) => setNewItem({ ...newItem, serial_number: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              Location / Enclave
            </label>
            <input
              type="text"
              placeholder="e.g. Floor 3 - Desk 12"
              className="glass-input"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', fontSize: '12px' }}
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifySelf: 'end' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-btn"
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


)
}
