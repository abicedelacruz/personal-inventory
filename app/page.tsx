'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([])
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)

    const { error } = await supabase.from('inventory').insert([
      {
        user_id: user.id,
        item_name: itemName,
        description,
        serial_number: serialNumber,
      },
    ])

    if (error) {
      alert('Failed to add item: ' + error.message)
    } else {
      setItemName('')
      setDescription('')
      setSerialNumber('')
      await loadData()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property item?')) return
    const { error } = await supabase.from('inventory').delete().eq('id', id)
    if (error) {
      alert('Failed to delete item: ' + error.message)
    } else {
      await loadData()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredItems = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading && !user) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingText}>Loading Asset Portal...</div>
      </div>
    )
  }

  return (
    <div style={styles.pageContainer}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body, html { width: 100%; min-height: 100vh; background-color: #030712; color: #f9fafb; overflow-x: hidden; }
        input:focus, textarea:focus { outline: 2px solid #6366f1; outline-offset: -1px; }
      `}</style>

      {/* Top Bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brandGroup}>
            <div style={styles.logoBadge}>IP</div>
            <div>
              <h1 style={styles.brandName}>AssetLedger</h1>
              <p style={styles.brandSub}>ENTERPRISE INVENTORY SYSTEM</p>
            </div>
          </div>

          <div style={styles.userGroup}>
            <div style={styles.userInfo}>
              <span style={styles.userLabel}>Logged In As</span>
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
            <button onClick={handleSignOut} style={styles.signOutBtn}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Metric Cards */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Total Items Registered</span>
            <div style={styles.metricValRow}>
              <span style={styles.metricValue}>{items.length}</span>
              <span style={styles.activeTag}>● Active Sync</span>
            </div>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Employee Account</span>
            <div style={styles.metricEmailRow}>{user?.email}</div>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Security Protocol</span>
            <div style={styles.metricStatusRow}>
              <span style={styles.greenDot}></span>
              <span>Supabase RLS Protected</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div style={styles.contentGrid}>
          {/* Add Item Panel */}
          <div style={styles.formCard}>
            <h2 style={styles.cardTitle}>Add Item to Ledger</h2>
            <p style={styles.cardSub}>Submit hardware or personal property tags.</p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Item Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Dell XPS 15 Laptop"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Serial Number / Tag</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. SN-8839201"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description / Condition</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Good condition, assigned to workstation 4."
                  style={{ ...styles.input, resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Saving Property...' : '+ Register Property Item'}
              </button>
            </form>
          </div>

          {/* Item Table Panel */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <div>
                <h2 style={styles.cardTitle}>Property Inventory</h2>
                <p style={styles.cardSub}>Real-time records for your logged account.</p>
              </div>
              <input
                type="text"
                placeholder="Filter items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.filterInput}
              />
            </div>

            {filteredItems.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>No items found</p>
                <p style={styles.emptySub}>
                  {searchTerm ? 'No entries match your search.' : 'Use the form on the left to register your first item.'}
                </p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Item Details</th>
                      <th style={styles.th}>Serial / Tag</th>
                      <th style={styles.th}>Date Registered</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.itemName}>{item.item_name}</div>
                          {item.description && (
                            <div style={styles.itemDesc}>{item.description}</div>
                          )}
                        </td>
                        <td style={styles.td}>
                          {item.serial_number ? (
                            <span style={styles.serialTag}>{item.serial_number}</span>
                          ) : (
                            <span style={{ color: '#4b5563', italic: 'true' }}>—</span>
                          )}
                        </td>
                        <td style={{ ...styles.td, color: '#9ca3af', fontSize: '0.8rem' }}>
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030712',
    color: '#a5b4fc',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#030712',
    color: '#f9fafb',
  },
  header: {
    borderBottom: '1px solid #1f2937',
    backgroundColor: '#090d16',
    sticky: 'top',
    top: 0,
    zIndex: 20,
  },
  headerInner: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoBadge: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.625rem',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  brandSub: {
    fontSize: '0.625rem',
    color: '#6b7280',
    letterSpacing: '0.05em',
  },
  userGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  userLabel: {
    fontSize: '0.625rem',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  userEmail: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  signOutBtn: {
    padding: '0.4rem 0.85rem',
    borderRadius: '0.5rem',
    border: '1px solid #374151',
    backgroundColor: '#111827',
    color: '#d1d5db',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  main: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  metricCard: {
    backgroundColor: '#0b0f19',
    border: '1px solid #1f2937',
    borderRadius: '0.875rem',
    padding: '1.25rem',
  },
  metricLabel: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metricValRow: {
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  metricValue: {
    fontSize: '1.875rem',
    fontWeight: 800,
    color: '#ffffff',
  },
  activeTag: {
    fontSize: '0.7rem',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  metricEmailRow: {
    marginTop: '0.625rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  metricStatusRow: {
    marginTop: '0.625rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e5e7eb',
  },
  greenDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '1.5rem',
  },
  formCard: {
    gridColumn: 'span 4',
    backgroundColor: '#0b0f19',
    border: '1px solid #1f2937',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  cardSub: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.15rem',
  },
  form: {
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '0.85rem',
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.85rem',
    borderRadius: '0.5rem',
    border: 'none',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
    marginTop: '0.25rem',
  },
  tableCard: {
    gridColumn: 'span 8',
    backgroundColor: '#0b0f19',
    border: '1px solid #1f2937',
    borderRadius: '1rem',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterInput: {
    width: '12rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '0.75rem',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  emptySub: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    backgroundColor: '#030712',
    borderBottom: '1px solid #1f2937',
  },
  th: {
    padding: '0.75rem 1.25rem',
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #111827',
  },
  td: {
    padding: '1rem 1.25rem',
    fontSize: '0.85rem',
  },
  itemName: {
    fontWeight: 600,
    color: '#f9fafb',
  },
  itemDesc: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.15rem',
  },
  serialTag: {
    padding: '0.2rem 0.5rem',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: '#a5b4fc',
  },
  deleteBtn: {
    padding: '0.25rem 0.6rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
