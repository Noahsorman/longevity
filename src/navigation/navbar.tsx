import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type LinkItem = string | { [label: string]: string };
interface NavbarProps {
  items: { [title: string]: LinkItem };
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
        .nav-container {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem 1.5rem; background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky; top: 0; z-index: 1000;
        }
        .nav-logo { font-weight: 800; font-size: 1.25rem; color: #fff; letter-spacing: -0.5px; text-decoration: none; }
        .desktop-menu { margin:0; display: flex; gap: 2rem; list-style: none; align-items: center; justify-content: center; width: 100vw }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.2s; }
        .nav-link:hover { color: #fff; }
        
        .group-container { position: relative; cursor: default; padding: 10px 0; }
        .group-title { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
        .dropdown { 
          position: absolute; top: 100%; left: 0; background: #1e293b; 
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
          min-width: 180px; padding: 0.5rem; opacity: 0; visibility: hidden;
          transform: translateY(10px); transition: 0.2s; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .group-container:hover .dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-link { 
          display: block; padding: 0.6rem 1rem; color: #cbd5e1; 
          text-decoration: none; font-size: 0.85rem; border-radius: 8px; 
        }
        .dropdown-link:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 5px; }
        .burger-line { width: 22px; height: 2px; background: #fff; margin: 5px 0; transition: 0.3s; border-radius: 2px; }

        /* Mobile Drawer */
        .drawer {
          position: fixed; top: 0; right: 0; width: 300px; height: 100%;
          background: #0f172a; z-index: 2000; padding: 2rem;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-left: 1px solid rgba(255, 255, 255, 0.1);

          .nav-link{
            font-size: 1.5rem
          }
        }
        .drawer.open { transform: translateX(0); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1999; }

        @media (max-width: 768px) {
          .desktop-menu { display: none; }
          .hamburger { display: block; }
        }
      `}</style>

      <nav className="nav-container">        
        <button className="hamburger" onClick={() => setIsOpen(true)}>
          <div className="burger-line"></div>
          <div className="burger-line" style={{width: '16px', marginLeft: 'auto'}}></div>
        </button>

        <ul className="desktop-menu">
          {Object.entries(items).map(([title, value]) => (
            <li key={title}>
              {typeof value === 'string' ? (
                <Link to={value} className="nav-link">{title}</Link>
              ) : (
                <div className="group-container">
                  <span className="group-title">{title} ▾</span>
                  <div className="dropdown">
                    {Object.entries(value).map(([label, href]) => (
                      <Link key={href} to={href} className="dropdown-link">{label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <button onClick={() => setIsOpen(false)} style={{background: 'none', border: 'none', color: '#64748b', marginBottom: '2rem', cursor: 'pointer', fontSize: "1.5rem"}}>✕ Close</button>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {Object.entries(items).map(([title, value]) => (
            <div key={title}>
              {typeof value === 'string' ? (
                <Link to={value} onClick={() => setIsOpen(false)} className="nav-link" style={{fontSize: '2rem'}}>{title}</Link>
              ) : (
                <div>
                  <div style={{color: '#3b82f6', fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase'}}>{title}</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #334155'}}>
                    {Object.entries(value).map(([label, href]) => (
                      <Link key={href} to={href} onClick={() => setIsOpen(false)} className="nav-link">{label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Navbar;