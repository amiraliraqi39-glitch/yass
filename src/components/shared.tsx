import { useApp } from '../store';
import { useNavigate } from './Router';
import { SocialIcon } from './icons';
import { SOCIAL_PLATFORMS } from '../types';
import type { Publication } from '../types';

export function PublicationCard({ pub }: { pub: Publication }) {
  const { state } = useApp();
  const { siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const primary = siteSettings.primaryColor || '#2b9fd4';

  return (
    <div
      className="group flex flex-col overflow-hidden bg-white shadow-md transition-all hover:shadow-xl"
      style={{ borderRadius: siteSettings.cardBorderRadius }}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {pub.coverImage ? (
          <img
            src={pub.coverImage}
            alt={pub.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: navColor }}>
            <div className="text-5xl">📖</div>
            <p className="mt-3 text-sm font-bold text-white" style={{ fontFamily: siteSettings.heroFontFamily }}>
              {pub.title}
            </p>
          </div>
        )}
        {/* Category badge */}
        <span
          className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow"
          style={{ backgroundColor: primary }}
        >
          {pub.category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold leading-tight" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>
          {pub.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          ✍ {pub.authorName} {pub.authorType && <span className="text-gray-400">({pub.authorType})</span>}
        </p>
        {pub.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-500">{pub.description}</p>
        )}
        <div className="mt-auto pt-3">
          {pub.pdfUrl ? (
            <a
              href={pub.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primary }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              عرض الملف
            </a>
          ) : (
            <span className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-bold text-gray-400">
              لا يوجد ملف
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ icon, title, count }: { icon: string; title: string; count?: number }) {
  const { state } = useApp();
  const { siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  return (
    <div className="mb-6 flex items-center justify-center gap-3 text-center">
      <h2
        className="inline-flex items-center gap-2 border-b-4 pb-2 text-2xl font-bold md:text-3xl"
        style={{ color: navColor, borderColor: teal, fontFamily: siteSettings.heroFontFamily }}
      >
        <span>{icon}</span>
        <span>{title}</span>
        {count !== undefined && (
          <span className="rounded-full px-3 py-0.5 text-base text-white" style={{ backgroundColor: teal }}>
            {count}
          </span>
        )}
      </h2>
    </div>
  );
}

export function Footer() {
  const { state } = useApp();
  const { siteSettings } = state;
  const navigate = useNavigate();
  if (!siteSettings.showFooter) return null;

  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const enabledSocial = (siteSettings.social || []).filter(s => s.enabled && s.url);
  const platformColor = (platform: string) => SOCIAL_PLATFORMS.find(p => p.key === platform)?.color || teal;

  const links = [
    { path: '/writers', label: 'الأدباء' },
    { path: '/publications', label: 'المنشورات الأدبية' },
    { path: '/board', label: 'الهيئة الإدارية' },
    { path: '/news', label: 'الأخبار' },
    { path: '/about', label: 'من نحن' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: navColor }}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 text-center md:grid-cols-3 md:text-right">
          <div>
            <div className="mb-3 text-3xl">{siteSettings.siteLogo}</div>
            <h3 className="mb-2 text-lg font-bold" style={{ fontFamily: siteSettings.heroFontFamily }}>
              {siteSettings.siteName}
            </h3>
            <p className="text-sm opacity-70">{siteSettings.siteDescription}</p>
            {enabledSocial.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                {enabledSocial.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="transition-transform hover:scale-125" style={{ color: platformColor(s.platform) }}>
                    <SocialIcon type={s.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold" style={{ color: teal }}>روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              {links.map(l => (
                <li key={l.path}>
                  <button onClick={() => navigate(l.path)} className="opacity-70 transition-opacity hover:opacity-100">
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/member-login')} className="font-bold opacity-90 transition-opacity hover:opacity-100" style={{ color: teal }}>
                  ✍️ دخول الأعضاء
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-bold" style={{ color: teal }}>تواصل معنا</h3>
            {siteSettings.contactEmail && <p className="text-sm opacity-70">✉️ {siteSettings.contactEmail}</p>}
            {siteSettings.contactPhone && <p className="mt-2 text-sm opacity-70">📞 {siteSettings.contactPhone}</p>}
            {siteSettings.contactAddress && <p className="mt-2 text-sm opacity-70">📍 {siteSettings.contactAddress}</p>}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm opacity-60">
          <p style={{ fontFamily: siteSettings.heroFontFamily }}>{siteSettings.footerText}</p>
        </div>
      </div>
    </footer>
  );
}
