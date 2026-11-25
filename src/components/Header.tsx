import { useState } from 'react';
import { useApp } from '../store';
import { useNavigate, useCurrentPath } from './Router';
import { SocialIcon } from './icons';
import { SOCIAL_PLATFORMS } from '../types';

const NAV_ITEMS = [
  { path: '/', label: 'الرئيسية' },
  { path: '/writers', label: 'الأدباء' },
  { path: '/publications', label: 'المنشورات الأدبية' },
  { path: '/magazine', label: 'مجلة الاتحاد الإلكترونية' },
  { path: '/library', label: 'المكتبة' },
  { path: '/forums', label: 'المنتديات' },
  { path: '/board', label: 'الهيئة الإدارية' },
  { path: '/news', label: 'الأخبار' },
  { path: '/about', label: 'من نحن' },
  { path: '/contact', label: 'اتصل بنا' },
];

export default function Header() {
  const { state } = useApp();
  const { siteSettings, writers, publications } = state;
  const navigate = useNavigate();
  const currentPath = useCurrentPath();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logoError, setLogoError] = useState(false);

  const navColor = siteSettings.navColor || '#14234f';
  const primary = siteSettings.primaryColor || '#2b9fd4';
  const btn1 = siteSettings.navButtonColor || '#a87332';
  const btn2 = siteSettings.navButtonColor2 || '#6d4518';

  const enabledSocial = (siteSettings.social || []).filter(s => s.enabled && s.url);

  // search across writers & publications
  const term = searchTerm.trim();
  const writerResults = term ? writers.filter(w => w.name.includes(term) || w.type.includes(term)).slice(0, 5) : [];
  const pubResults = term ? publications.filter(p => p.title.includes(term) || p.authorName.includes(term)).slice(0, 5) : [];

  const platformColor = (platform: string) => SOCIAL_PLATFORMS.find(p => p.key === platform)?.color || primary;

  return (
    <header>
      {/* News Ticker */}
      {siteSettings.tickerEnabled && siteSettings.tickerText && (
        <div className="overflow-hidden py-2 text-white" style={{ backgroundColor: primary }}>
          <div className="ticker-track whitespace-nowrap text-sm font-medium">
            <span className="mx-4">{siteSettings.tickerText}</span>
            <span className="mx-4">{siteSettings.tickerText}</span>
          </div>
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white py-6 text-center">
        <div className="mx-auto max-w-3xl px-4">
          {siteSettings.logoImage && !logoError ? (
            <img
              src={siteSettings.logoImage}
              alt={siteSettings.siteName}
              className="mx-auto h-36 w-auto cursor-pointer object-contain"
              onClick={() => navigate('/')}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="cursor-pointer text-7xl" onClick={() => navigate('/')}>{siteSettings.siteLogo}</div>
          )}
          <h1
            className="mt-4 cursor-pointer text-2xl font-bold leading-tight md:text-4xl"
            style={{ fontFamily: siteSettings.heroFontFamily, color: navColor }}
            onClick={() => navigate('/')}
          >
            {siteSettings.siteName}
          </h1>
          {siteSettings.siteNameEn && (
            <p className="mt-1 text-sm font-bold tracking-widest md:text-base" style={{ color: navColor }}>
              {siteSettings.siteNameEn}
            </p>
          )}

          {/* Social Icons */}
          {enabledSocial.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {enabledSocial.map(s => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-125"
                  style={{ color: platformColor(s.platform) }}
                  title={SOCIAL_PLATFORMS.find(p => p.key === s.platform)?.label || s.platform}
                >
                  <SocialIcon type={s.platform} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar */}
      <nav style={{ backgroundColor: navColor }} className="sticky top-0 z-40 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-14 w-14 items-center justify-center text-white"
            style={{ backgroundColor: primary }}
            title="بحث"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Desktop nav */}
          <div className="hidden flex-1 flex-wrap items-center justify-center gap-2 py-3 md:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-btn-3d ${currentPath === item.path ? 'nav-btn-3d-active' : ''}`}
                style={{
                  '--btn-c1': btn1,
                  '--btn-c2': btn2,
                } as React.CSSProperties}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="m-2 flex h-10 w-12 items-center justify-center rounded border-2 md:hidden"
            style={{ borderColor: primary, backgroundColor: menuOpen ? primary : 'transparent' }}
            title="القائمة"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="border-t border-white/10 p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث عن أديب أو منشور..."
              className="w-full rounded-lg border-none p-3 text-gray-800 outline-none"
              dir="rtl"
              autoFocus
            />
            {term && (writerResults.length > 0 || pubResults.length > 0) && (
              <div className="mt-2 max-h-72 space-y-1 overflow-y-auto rounded-lg bg-white p-2">
                {writerResults.map(w => (
                  <button
                    key={w.id}
                    onClick={() => { navigate('/writers'); setSearchOpen(false); setSearchTerm(''); }}
                    className="block w-full rounded p-2 text-right text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    👤 <span className="font-bold">{w.name}</span>
                    <span className="mr-2 text-sm text-gray-400">({w.type})</span>
                  </button>
                ))}
                {pubResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { navigate('/publications'); setSearchOpen(false); setSearchTerm(''); }}
                    className="block w-full rounded p-2 text-right text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    📖 <span className="font-bold">{p.title}</span>
                    <span className="mr-2 text-sm text-gray-400">— {p.authorName}</span>
                  </button>
                ))}
              </div>
            )}
            {term && writerResults.length === 0 && pubResults.length === 0 && (
              <p className="mt-2 text-center text-sm text-white/60">لا توجد نتائج</p>
            )}
          </div>
        )}

        {/* Mobile nav */}
        {menuOpen && (
          <div className="animate-slideIn space-y-2 p-3 md:hidden">
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                className={`nav-btn-3d block w-full ${currentPath === item.path ? 'nav-btn-3d-active' : ''}`}
                style={{
                  '--btn-c1': btn1,
                  '--btn-c2': btn2,
                } as React.CSSProperties}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
