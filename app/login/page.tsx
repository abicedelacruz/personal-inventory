'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div style={styles.container}>
      {/* Inline styles reset and full screen cover */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body, html { width: 100%; height: 100%; background-color: #030712; color: #f9fafb; overflow-x: hidden; }
        input:focus { outline: 2px solid #6366f1; outline-offset: -1px; }
      `}</style>

      {/* Main Grid Container filling 100vh */}
      <div style={styles.gridContainer}>
        {/* Left Side: Branding Hero */}
        <div style={styles.leftHero}>
          <div style={styles.glowBg}></div>
          <div style={styles.brandHeader}>
            <div style={styles.logoBadge}>IP</div>
            <span style={styles.brandTitle}>AssetLedger</span>
          </div>

          <div style={styles.heroBody}>
            <div style={styles.statusBadge}>
              <span style={styles.statusDot}></span>
              <span>ENTERPRISE PROPERTY PORTAL</span>
            </div>
            <h1 style={styles.heroHeading}>
              Real-time Hardware & Personal Asset Ledger
            </h1>
            <p style={styles.heroSubtext}>
              Securely register personal property, assign equipment tags, and manage organizational inventory across all 45 employee profiles.
            </p>
          </div>

          <div style={styles.heroFooter}>
            © {new Date().getFullYear()} Property Inventory Systems. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={styles.rightFormArea}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Sign In to Workspace</h2>
              <p style={styles.formSubtitle}>
                Enter your assigned employee email and password to access your inventory.
              </p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Work Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@company.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal →'}
              </button>
            </form>

            <div style={styles.formFooter}>
              Protected by Supabase Auth with Row-Level Security (RLS).
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Full page styled layout with vivid colors
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#030712',
    display: 'flex',
    alignItems: 'stretch',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    width: '100%',
    minHeight: '100vh',
  },
  leftHero: {
    gridColumn: 'span 6',
    backgroundColor: '#090d16',
    borderRight: '1px solid #1f2937',
    padding: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  glowBg: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    width: '140%',
    height: '140%',
    background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative',
    zIndex: 10,
  },
  logoBadge: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '0.75rem',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.025em',
  },
  heroBody: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '28rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    color: '#a5b4fc',
    fontSize: '0.725rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    letterSpacing: '0.05em',
  },
  statusDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  heroHeading: {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.2,
    letterSpacing: '-0.03em',
    marginBottom: '1rem',
  },
  heroSubtext: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  heroFooter: {
    fontSize: '0.75rem',
    color: '#4b5563',
    position: 'relative',
    zIndex: 10,
  },
  rightFormArea: {
    gridColumn: 'span 6',
    backgroundColor: '#030712',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  formCard: {
    width: '100%',
    maxWidth: '26rem',
    backgroundColor: '#0b0f19',
    border: '1px solid #1f2937',
    borderRadius: '1.25rem',
    padding: '2.5rem',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
  },
  formHeader: {
    marginBottom: '1.75rem',
  },
  formTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '0.35rem',
  },
  formSubtitle: {
    fontSize: '0.825rem',
    color: '#9ca3af',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    color: '#fca5a5',
    fontSize: '0.8rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.625rem',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.15rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.725rem',
    fontWeight: 600,
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '0.625rem',
    color: '#ffffff',
    fontSize: '0.875rem',
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: '0.625rem',
    border: 'none',
    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
    marginTop: '0.5rem',
  },
  formFooter: {
    marginTop: '1.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid #1f2937',
    textAlign: 'center',
    fontSize: '0.725rem',
    color: '#6b7280',
  },
}
