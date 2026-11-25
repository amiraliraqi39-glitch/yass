import { useState } from 'react';
import { useApp } from '../store';
import Header from './Header';
import { PublicationCard, SectionTitle, Footer } from './shared';
import { WRITER_TYPES, PUBLICATION_CATEGORIES, FORUM_CATEGORIES } from '../types';

function PageShell({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const { siteSettings } = state;
  const useBg = siteSettings.bgPatternEnabled && siteSettings.bgImage;
  const shellStyle: React.CSSProperties = {
    backgroundColor: siteSettings.bgColor,
    color: siteSettings.textColor,
    ...(useBg
      ? {
          backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${siteSettings.bgColor} 86%, transparent), color-mix(in srgb, ${siteSettings.bgColor} 92%, transparent)), url(${siteSettings.bgImage})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : {}),
  };
  return (
    <div className="min-h-screen" style={shellStyle}>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
      <Footer />
    </div>
  );
}

/* ====== صفحة الأدباء ====== */
export function WritersPage() {
  const { state } = useApp();
  const { writers, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const [filter, setFilter] = useState('الكل');

  const filtered = filter === 'الكل' ? writers : writers.filter(w => w.type === filter);
  const types = ['الكل', ...WRITER_TYPES];

  return (
    <PageShell>
      <SectionTitle icon="📚" title="الأدباء" count={writers.length} />

      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="rounded-full px-4 py-1.5 text-sm font-bold transition-colors"
            style={filter === t
              ? { backgroundColor: teal, color: '#fff' }
              : { backgroundColor: '#fff', color: navColor, border: `1px solid ${teal}` }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">لا يوجد أدباء في هذا التصنيف</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(w => (
            <div
              key={w.id}
              className="flex items-center gap-4 bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
              style={{ borderRadius: siteSettings.cardBorderRadius }}
            >
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: navColor }}
              >
                {w.image ? <img src={w.image} alt={w.name} className="h-full w-full object-cover" /> : w.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>
                  {w.name}
                </h3>
                <span className="inline-block rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: teal }}>
                  {w.type}
                </span>
                {w.bio && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{w.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة المنشورات ====== */
export function PublicationsPage() {
  const { state } = useApp();
  const { publications, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');

  let filtered = filter === 'الكل' ? publications : publications.filter(p => p.category === filter);
  if (search.trim()) {
    filtered = filtered.filter(p => p.title.includes(search) || p.authorName.includes(search));
  }
  const cats = ['الكل', ...PUBLICATION_CATEGORIES];

  return (
    <PageShell>
      <SectionTitle icon="📚🖋️" title="المنشورات الأدبية" count={publications.length} />

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن منشور أو مؤلف..."
          className="w-full max-w-md rounded-full border px-5 py-2.5 outline-none focus:ring-2"
          dir="rtl"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="rounded-full px-4 py-1.5 text-sm font-bold transition-colors"
            style={filter === c
              ? { backgroundColor: teal, color: '#fff' }
              : { backgroundColor: '#fff', color: navColor, border: `1px solid ${teal}` }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">🚫 لا تتوفر منشورات في هذا التصنيف</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map(p => <PublicationCard key={p.id} pub={p} />)}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة الهيئة الإدارية ====== */
export function BoardPage() {
  const { state } = useApp();
  const { board, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';

  return (
    <PageShell>
      <SectionTitle icon="👥" title="الهيئة الإدارية" count={board.length} />
      {board.length === 0 ? (
        <p className="py-12 text-center text-gray-400">لا توجد بيانات</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {board.map(m => (
            <div
              key={m.id}
              className="overflow-hidden bg-white text-center shadow-md transition-shadow hover:shadow-lg"
              style={{ borderRadius: siteSettings.cardBorderRadius }}
            >
              <div className="flex justify-center p-6" style={{ backgroundColor: '#f1f5f9' }}>
                <div
                  className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full text-4xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: navColor }}
                >
                  {m.image ? <img src={m.image} alt={m.name} className="h-full w-full object-cover" /> : m.name.charAt(0)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>
                  {m.name}
                </h3>
                <span className="mt-1 inline-block rounded-full px-3 py-1 text-sm text-white" style={{ backgroundColor: teal }}>
                  {m.position}
                </span>
                {m.bio && <p className="mt-3 text-sm text-gray-500">{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة الأخبار ====== */
export function NewsPage() {
  const { state } = useApp();
  const { news, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';

  return (
    <PageShell>
      <SectionTitle icon="📰" title="الأخبار والفعاليات" count={news.length} />
      {news.length === 0 ? (
        <p className="py-12 text-center text-gray-400">لا توجد أخبار حالياً</p>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          {news.map(n => (
            <div
              key={n.id}
              className="overflow-hidden bg-white shadow-md"
              style={{ borderRadius: siteSettings.cardBorderRadius }}
            >
              <div className="flex flex-col md:flex-row">
                {n.image && (
                  <img src={n.image} alt={n.title} className="h-48 w-full object-cover md:w-64" />
                )}
                <div className="flex-1 p-6">
                  <p className="text-sm text-gray-400">📅 {n.date}</p>
                  <h3 className="mt-1 text-xl font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>
                    {n.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{n.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة مجلة الاتحاد الإلكترونية ====== */
export function MagazinePage() {
  const { state } = useApp();
  const { magazine, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const primary = siteSettings.primaryColor || '#2b9fd4';

  return (
    <PageShell>
      <SectionTitle icon="📰" title="مجلة الاتحاد الإلكترونية" count={magazine.length} />
      {magazine.length === 0 ? (
        <p className="py-12 text-center text-gray-400">لا توجد أعداد منشورة حالياً</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {magazine.map(m => (
            <div
              key={m.id}
              className="group flex flex-col overflow-hidden bg-white shadow-md transition-all hover:shadow-xl"
              style={{ borderRadius: siteSettings.cardBorderRadius }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {m.coverImage ? (
                  <img src={m.coverImage} alt={m.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center" style={{ background: `linear-gradient(135deg, ${navColor}, ${teal})` }}>
                    <div className="text-6xl">📰</div>
                    <p className="mt-4 text-lg font-bold text-white" style={{ fontFamily: siteSettings.heroFontFamily }}>{m.title}</p>
                    {m.issueNumber && <span className="mt-2 rounded-full bg-white/20 px-3 py-1 text-sm text-white">العدد {m.issueNumber}</span>}
                  </div>
                )}
                {m.issueNumber && (
                  <span className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow" style={{ backgroundColor: primary }}>
                    العدد {m.issueNumber}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>{m.title}</h3>
                {m.date && <p className="mt-1 text-sm text-gray-400">📅 {m.date}</p>}
                {m.description && <p className="mt-2 line-clamp-3 text-sm text-gray-500">{m.description}</p>}
                <div className="mt-auto pt-3">
                  {m.pdfUrl ? (
                    <a href={m.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: teal }}>
                      📖 قراءة العدد
                    </a>
                  ) : (
                    <span className="block w-full rounded-lg bg-gray-100 py-2 text-center text-sm text-gray-400">قريباً</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة المكتبة ====== */
export function LibraryPage() {
  const { state } = useApp();
  const { library, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const primary = siteSettings.primaryColor || '#2b9fd4';
  const [filter, setFilter] = useState('الكل');
  const [search, setSearch] = useState('');

  const cats = ['الكل', ...Array.from(new Set(library.map(b => b.category)))];
  let filtered = filter === 'الكل' ? library : library.filter(b => b.category === filter);
  if (search.trim()) filtered = filtered.filter(b => b.title.includes(search) || b.author.includes(search));

  return (
    <PageShell>
      <SectionTitle icon="📚" title="المكتبة" count={library.length} />

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن كتاب أو مؤلف..."
          className="w-full max-w-md rounded-full border px-5 py-2.5 outline-none focus:ring-2"
          dir="rtl"
        />
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="rounded-full px-4 py-1.5 text-sm font-bold transition-colors"
            style={filter === c ? { backgroundColor: teal, color: '#fff' } : { backgroundColor: '#fff', color: navColor, border: `1px solid ${teal}` }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">🚫 لا توجد كتب في هذا التصنيف</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map(b => (
            <div key={b.id} className="group flex flex-col overflow-hidden bg-white shadow-md transition-all hover:shadow-xl" style={{ borderRadius: siteSettings.cardBorderRadius }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {b.coverImage ? (
                  <img src={b.coverImage} alt={b.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: navColor }}>
                    <div className="text-5xl">📕</div>
                    <p className="mt-3 text-sm font-bold text-white" style={{ fontFamily: siteSettings.heroFontFamily }}>{b.title}</p>
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-bold text-white shadow" style={{ backgroundColor: primary }}>{b.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-bold leading-tight" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>{b.title}</h3>
                <p className="mt-1 text-sm text-gray-600">✍ {b.author}</p>
                {b.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{b.description}</p>}
                <div className="mt-auto pt-3">
                  {b.pdfUrl ? (
                    <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: teal }}>
                      📥 تحميل / قراءة
                    </a>
                  ) : (
                    <span className="block w-full rounded-lg bg-gray-100 py-2 text-center text-sm text-gray-400">غير متوفر</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة المنتديات ====== */
export function ForumsPage() {
  const { state } = useApp();
  const { forums, siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const [filter, setFilter] = useState('الكل');

  const cats = ['الكل', ...FORUM_CATEGORIES];
  const filtered = filter === 'الكل' ? forums : forums.filter(t => t.category === filter);

  return (
    <PageShell>
      <SectionTitle icon="💬" title="المنتديات" count={forums.length} />

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="rounded-full px-4 py-1.5 text-sm font-bold transition-colors"
            style={filter === c ? { backgroundColor: teal, color: '#fff' } : { backgroundColor: '#fff', color: navColor, border: `1px solid ${teal}` }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-400">لا توجد مواضيع في هذا القسم</p>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {filtered.map(t => (
            <div key={t.id} className="overflow-hidden bg-white p-5 shadow-md transition-shadow hover:shadow-lg" style={{ borderRadius: siteSettings.cardBorderRadius }}>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl text-white" style={{ backgroundColor: teal }}>💬</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-xs text-white" style={{ backgroundColor: navColor }}>{t.category}</span>
                    <span className="text-xs text-gray-400">📅 {t.date}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>{t.title}</h3>
                  {t.content && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{t.content}</p>}
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <span>👤 {t.author || 'عضو'}</span>
                    <span className="flex items-center gap-1">💬 {t.replies} مشاركة</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

/* ====== صفحة من نحن ====== */
export function AboutPage() {
  const { state } = useApp();
  const { siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';

  return (
    <PageShell>
      <SectionTitle icon="ℹ️" title="من نحن" />
      <div className="mx-auto max-w-3xl">
        <div className="bg-white p-8 shadow-md" style={{ borderRadius: siteSettings.cardBorderRadius }}>
          {siteSettings.logoImage && (
            <img src={siteSettings.logoImage} alt="logo" className="mx-auto mb-6 h-32 object-contain" />
          )}
          <h2 className="mb-4 text-center text-2xl font-bold" style={{ color: navColor, fontFamily: siteSettings.heroFontFamily }}>
            {siteSettings.siteName}
          </h2>
          <p className="text-lg leading-loose text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
            {siteSettings.aboutText}
          </p>
        </div>
      </div>
    </PageShell>
  );
}

/* ====== صفحة اتصل بنا ====== */
export function ContactPage() {
  const { state } = useApp();
  const { siteSettings } = state;
  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const [sent, setSent] = useState(false);

  return (
    <PageShell>
      <SectionTitle icon="✉️" title="اتصل بنا" />
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Contact info */}
        <div className="bg-white p-6 shadow-md" style={{ borderRadius: siteSettings.cardBorderRadius }}>
          <h3 className="mb-4 text-xl font-bold" style={{ color: navColor }}>معلومات التواصل</h3>
          <div className="space-y-4">
            {siteSettings.contactEmail && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                  <p className="font-bold">{siteSettings.contactEmail}</p>
                </div>
              </div>
            )}
            {siteSettings.contactPhone && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-sm text-gray-400">الهاتف</p>
                  <p className="font-bold">{siteSettings.contactPhone}</p>
                </div>
              </div>
            )}
            {siteSettings.contactAddress && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-sm text-gray-400">العنوان</p>
                  <p className="font-bold">{siteSettings.contactAddress}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact form (demo) */}
        <div className="bg-white p-6 shadow-md" style={{ borderRadius: siteSettings.cardBorderRadius }}>
          <h3 className="mb-4 text-xl font-bold" style={{ color: navColor }}>أرسل رسالة</h3>
          {sent ? (
            <div className="rounded-lg bg-green-50 p-4 text-center text-green-700">
              ✓ تم استلام رسالتك، شكراً لتواصلك معنا!
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-3">
              <input type="text" required placeholder="الاسم" className="w-full rounded-lg border p-3" dir="rtl" />
              <input type="email" required placeholder="البريد الإلكتروني" className="w-full rounded-lg border p-3" dir="rtl" />
              <textarea required placeholder="رسالتك" rows={4} className="w-full rounded-lg border p-3" dir="rtl" />
              <button type="submit" className="w-full rounded-lg py-3 font-bold text-white" style={{ backgroundColor: teal }}>
                إرسال
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
