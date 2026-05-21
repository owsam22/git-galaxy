import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Music, Share2, Code2, ExternalLink, Telescope } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'auto',
      boxSizing: 'border-box',
      backgroundColor: '#05070a',
      color: 'var(--text-primary)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
    }}>
      <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            className="glass-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)',
              cursor: 'pointer', width: 'fit-content',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <ArrowLeft size={18} />
            <span>Back to Galaxy</span>
          </button>

          <button
            onClick={() => navigate('/owsam22')}
            className="glass-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              borderRadius: '100px', border: '1px solid rgba(56,189,248,0.3)',
              background: 'rgba(56,189,248,0.1)', color: '#38bdf8',
              cursor: 'pointer', width: 'fit-content',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,189,248,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(56,189,248,0.1)'}
          >
            <Telescope size={16} />
            <span>My Profile</span>
          </button>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(to right, #fff, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          About GitGalaxy
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* About Section */}
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(5,7,10,0.6)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Telescope size={24} /> What is GitGalaxy?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
              GitGalaxy transforms your GitHub profile into an immersive, interactive 3D universe. Every repository becomes a planet orbiting your star, scaling based on its popularity, size, and activity. It's a completely new, visual way to explore developer portfolios, replacing standard lists with a stunning spatial experience.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Whether you are discovering new developers in the free-roam galaxy mode or showcasing your own solar system, GitGalaxy bridges the gap between code and art.
            </p>
          </section>

          {/* Integration Section */}
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(5,7,10,0.6)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Share2 size={24} /> How to Use & Embed
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              GitGalaxy allows you to embed a 3D visualization of any GitHub profile directly into your portfolio or website. It provides a lightweight, interactive solar system view of a user's repositories.
            </p>

            <div style={{ padding: '1rem 1.5rem', background: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid #38bdf8', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Share2 size={20} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                Go to your profile and click <strong>Share</strong> to get your embed link, and use it in your website and also share with your friends.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Code2 size={20} /> Embedding via Iframe
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                You can easily integrate a specific user's galaxy by adding <code>?embed=true</code> to the URL. This hides the search bar and other extra UI elements, keeping it clean for your portfolio.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflowX: 'auto' }}>
                <pre style={{ margin: 0, color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
{`<iframe 
  src="https://git-galaxy.vercel.app/owsam22?embed=true" 
  width="100%" 
  height="500px" 
  style="border: none; border-radius: 12px; overflow: hidden;"
  title="GitGalaxy Profile"
></iframe>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                <Share2 size={20} /> Sharing Links
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                To share a direct link to someone's galaxy, simply append their GitHub username to the base URL:
              </p>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                https://git-galaxy.vercel.app/owsam22
              </div>
            </div>
          </section>

          {/* Credits Section */}
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(5,7,10,0.6)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Code size={24} /> Credits
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong style={{ minWidth: '100px' }}>Developer:</strong>
                <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                  @owsam22 <ExternalLink size={14} />
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong style={{ minWidth: '100px' }}>Music:</strong>
                <a href="https://youtu.be/LlN8MPS7KQs?si=M0KVc9W1tcNC2xkA" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}>
                  <Music size={16} style={{ color: 'var(--text-secondary)' }} /> Snowfall <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <a href="https://github.com/owsam22" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>GitHub</a>
            <a href="https://linkedin.com/in/owsam22" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>LinkedIn</a>
            <a href="https://samarpan-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Portfolio</a>
          </div>
          <p style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} Git Galaxy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
