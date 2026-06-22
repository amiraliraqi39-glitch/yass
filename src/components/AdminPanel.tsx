import { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from './Router';
import { FONT_OPTIONS, COLOR_OPTIONS, SOCIAL_PLATFORMS, WRITER_TYPES, PUBLICATION_CATEGORIES, FORUM_CATEGORIES } from '../types';
import type { SiteSettings, Writer, Publication, NewsItem, BoardMember, SocialLink, MagazineIssue, LibraryBook, ForumTopic } from '../types';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from './ImageUpload';

type Tab = 'general' | 'submissions' | 'writers' | 'publications' | 'magazine' | 'library' | 'forums' | 'board' | 'news' | 'appearance' | 'social' | 'tools';

export default function AdminPanel() {
  const app = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('general');

  const logout = () => { app.toggleAdmin(); navigate('/'); };

  const pendingCount = app.state.submissions.filter(s => s.status === 'pending').length;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'general', label: 'عام', icon: '⚙️' },
    { key: 'submissions', label: `الطلبات${pendingCount ? ' (' + pendingCount + ')' : ''}`, icon: '📥' },
    { key: 'writers', label: 'الأدباء', icon: '📚' },
    { key: 'publications', label: 'المنشورات', icon: '📖' },
    { key: 'magazine', label: 'مجلة الاتحاد', icon: '📰' },
    { key: 'library', label: 'المكتبة', icon: '📚' },
    { key: 'forums', label: 'المنتديات', icon: '💬' },
    { key: 'board', label: 'الهيئة الإدارية', icon: '👥' },
    { key: 'news', label: 'الأخبار', icon: '📰' },
    { key: 'appearance', label: 'المظهر', icon: '🎨' },
    { key: 'social', label: 'التواصل', icon: '🔗' },
    { key: 'tools', label: 'أدوات', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">🏠 عرض الموقع</button>
            <button onClick={logout} className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700">🚪 خروج</button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-1 px-4">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.key ? 'border-b-2 border-white text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === 'general' && <GeneralTab />}
        {tab === 'submissions' && <SubmissionsTab />}
        {tab === 'writers' && <WritersTab />}
        {tab === 'publications' && <PublicationsTab />}
        {tab === 'magazine' && <MagazineTab />}
        {tab === 'library' && <LibraryTab />}
        {tab === 'forums' && <ForumsTab />}
        {tab === 'board' && <BoardTab />}
        {tab === 'news' && <NewsTab />}
        {tab === 'appearance' && <AppearanceTab />}
        {tab === 'social' && <SocialTab />}
        {tab === 'tools' && <ToolsTab />}
      </main>
    </div>
  );
}

/* ===== reusable field ===== */
function Field({ label, value, onChange, type = 'text', area, ltr }: { label: string; value: string; onChange: (v: string) => void; type?: string; area?: boolean; ltr?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-gray-700">{label}</label>
      {area ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border p-3" rows={3} dir={ltr ? 'ltr' : 'rtl'} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border p-3" dir={ltr ? 'ltr' : 'rtl'} />
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="h-12 w-20 cursor-pointer rounded-lg border" />
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {COLOR_OPTIONS.map(c => (
          <button key={c.value} onClick={() => onChange(c.value)} title={c.name}
            className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{ backgroundColor: c.value, borderColor: value === c.value ? '#000' : 'transparent' }} />
        ))}
      </div>
    </div>
  );
}

/* ===== General Tab ===== */
function GeneralTab() {
  const { state, updateSiteSettings } = useApp();
  const s = state.siteSettings;
  const up = (k: keyof SiteSettings, v: any) => updateSiteSettings({ ...s, [k]: v });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">⚙️ الإعدادات العامة</h2>
      <div className="grid gap-6 rounded-xl bg-white p-6 shadow-md md:grid-cols-2">
        <Field label="اسم الموقع" value={s.siteName} onChange={v => up('siteName', v)} />
        <Field label="الاسم بالإنجليزية" value={s.siteNameEn} onChange={v => up('siteNameEn', v)} ltr />
        <Field label="شعار (رمز تعبيري)" value={s.siteLogo} onChange={v => up('siteLogo', v)} />
        <ImageUpload label="صورة الشعار" value={s.logoImage} onChange={v => up('logoImage', v)} variant="avatar" maxSize={500} />
        <ImageUpload label="صورة الغلاف" value={s.coverImage} onChange={v => up('coverImage', v)} variant="wide" maxSize={1600} />
        <Field label="الرابط الرسمي للموقع" value={s.officialUrl} onChange={v => up('officialUrl', v)} ltr />
        <div className="md:col-span-2"><Field label="وصف الموقع" value={s.siteDescription} onChange={v => up('siteDescription', v)} area /></div>
        <div className="md:col-span-2"><Field label="نبذة (من نحن)" value={s.aboutText} onChange={v => up('aboutText', v)} area /></div>
        <Field label="البريد الإلكتروني" value={s.contactEmail} onChange={v => up('contactEmail', v)} ltr />
        <Field label="رقم الهاتف" value={s.contactPhone} onChange={v => up('contactPhone', v)} ltr />
        <Field label="العنوان" value={s.contactAddress} onChange={v => up('contactAddress', v)} />
        <Field label="نص التذييل" value={s.footerText} onChange={v => up('footerText', v)} />
        <div>
          <label className="mb-1 block text-sm font-bold text-gray-700">نوع الخط الرئيسي</label>
          <select value={s.heroFontFamily} onChange={e => up('heroFontFamily', e.target.value)} className="w-full rounded-lg border p-3">
            {FONT_OPTIONS.map(f => <option key={f.family} value={f.family}>{f.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <input type="checkbox" checked={s.showFooter} onChange={e => up('showFooter', e.target.checked)} className="h-5 w-5" />
          إظهار التذييل
        </label>
      </div>

      <h3 className="text-xl font-bold text-gray-800">📢 الشريط الإخباري</h3>
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-md">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <input type="checkbox" checked={s.tickerEnabled} onChange={e => up('tickerEnabled', e.target.checked)} className="h-5 w-5" />
          تفعيل الشريط الإخباري المتحرك
        </label>
        <Field label="نص الشريط (افصل بـ •)" value={s.tickerText} onChange={v => up('tickerText', v)} area />
      </div>
    </div>
  );
}

/* ===== Submissions Tab ===== */
const TARGET_LABELS_AR: Record<string, string> = {
  publications: 'المنشورات الأدبية',
  library: 'المكتبة',
  magazine: 'مجلة الاتحاد',
};

function SubmissionsTab() {
  const { state, approveSubmission, rejectSubmission, deleteSubmission } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filtered = filter === 'all' ? state.submissions : state.submissions.filter(s => s.status === filter);

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ تمت الموافقة</span>;
    if (status === 'rejected') return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">✕ مرفوض</span>;
    return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">⏳ بانتظار</span>;
  };

  const tabs: { key: typeof filter; label: string }[] = [
    { key: 'pending', label: 'بانتظار الموافقة' },
    { key: 'approved', label: 'مقبولة' },
    { key: 'rejected', label: 'مرفوضة' },
    { key: 'all', label: 'الكل' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📥 طلبات الأعضاء ({state.submissions.length})</h2>
      <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        الأعمال التي يرسلها الأدباء وأعضاء الهيئة الإدارية. عند الموافقة تُضاف تلقائياً إلى القسم المختار.
      </p>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${filter === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          لا توجد طلبات في هذه القائمة
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <div key={s.id} className="rounded-xl bg-white p-5 shadow-md">
              <div className="flex flex-col gap-4 md:flex-row">
                {s.coverImage && (
                  <img src={s.coverImage} alt={s.title} className="h-32 w-24 flex-shrink-0 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-800">{s.title}</h3>
                    {statusBadge(s.status)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded bg-gray-100 px-2 py-0.5">👤 {s.submitterName}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5">{s.submitterRole === 'writer' ? 'أديب' : 'عضو هيئة'}</span>
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700">→ {TARGET_LABELS_AR[s.target]}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5">{s.category}</span>
                    <span>📅 {s.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">✍ المؤلف: {s.author} {s.year && `• ${s.year}`}</p>
                  {s.description && <p className="mt-2 text-sm text-gray-500">{s.description}</p>}
                  {s.pdfUrl && (
                    <a href={s.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-blue-600 hover:underline">📎 عرض الملف</a>
                  )}
                  {s.status === 'rejected' && s.adminNote && (
                    <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">📝 سبب الرفض: {s.adminNote}</p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.status === 'pending' && (
                      <>
                        <button onClick={() => approveSubmission(s.id)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700">✓ موافقة ونشر</button>
                        <button onClick={() => { const note = prompt('سبب الرفض (اختياري):') || 'لم يُقبل'; rejectSubmission(s.id, note); }} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">✕ رفض</button>
                      </>
                    )}
                    {s.status !== 'pending' && (
                      <button onClick={() => { if (confirm('حذف هذا الطلب نهائياً؟')) deleteSubmission(s.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600">🗑️ حذف الطلب</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Writers Tab ===== */
function WritersTab() {
  const { state, addWriter, updateWriter, deleteWriter } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📚 إدارة الأدباء ({state.writers.length})</h2>
        <button onClick={addWriter} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة أديب</button>
      </div>
      {state.writers.map((w: Writer) => (
        <div key={w.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="الاسم" value={w.name} onChange={v => updateWriter(w.id, { name: v })} />
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">النوع</label>
            <select value={w.type} onChange={e => updateWriter(w.id, { type: e.target.value })} className="w-full rounded-lg border p-3">
              {WRITER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <ImageUpload label="صورة الأديب" value={w.image} onChange={v => updateWriter(w.id, { image: v })} variant="avatar" maxSize={500} />
          <Field label="سنة الميلاد" value={w.birthYear} onChange={v => updateWriter(w.id, { birthYear: v })} />
          <div className="md:col-span-2"><Field label="نبذة" value={w.bio} onChange={v => updateWriter(w.id, { bio: v })} area /></div>
          <div className="md:col-span-2 rounded-lg bg-blue-50 p-3">
            <p className="mb-2 text-sm font-bold text-blue-700">🔑 بيانات دخول الأديب (لإضافة أعماله)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="اسم المستخدم" value={w.username} onChange={v => updateWriter(w.id, { username: v })} ltr />
              <Field label="الرمز السري" value={w.accessCode} onChange={v => updateWriter(w.id, { accessCode: v })} ltr />
            </div>
          </div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${w.name}؟`)) deleteWriter(w.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Publications Tab ===== */
function PublicationsTab() {
  const { state, addPublication, updatePublication, deletePublication } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📖 إدارة المنشورات ({state.publications.length})</h2>
        <button onClick={addPublication} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة منشور</button>
      </div>
      {state.publications.map((p: Publication) => (
        <div key={p.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="العنوان" value={p.title} onChange={v => updatePublication(p.id, { title: v })} />
          <Field label="اسم المؤلف" value={p.authorName} onChange={v => updatePublication(p.id, { authorName: v })} />
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">نوع المؤلف</label>
            <select value={p.authorType} onChange={e => updatePublication(p.id, { authorType: e.target.value })} className="w-full rounded-lg border p-3">
              {WRITER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">التصنيف</label>
            <select value={p.category} onChange={e => updatePublication(p.id, { category: e.target.value })} className="w-full rounded-lg border p-3">
              {PUBLICATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <ImageUpload label="صورة الغلاف" value={p.coverImage} onChange={v => updatePublication(p.id, { coverImage: v })} variant="cover" maxSize={800} />
          <Field label="رابط الملف PDF" value={p.pdfUrl} onChange={v => updatePublication(p.id, { pdfUrl: v })} ltr />
          <Field label="السنة" value={p.year} onChange={v => updatePublication(p.id, { year: v })} />
          <div className="md:col-span-2"><Field label="الوصف" value={p.description} onChange={v => updatePublication(p.id, { description: v })} area /></div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${p.title}؟`)) deletePublication(p.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Board Tab ===== */
function BoardTab() {
  const { state, addBoardMember, updateBoardMember, deleteBoardMember } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">👥 الهيئة الإدارية ({state.board.length})</h2>
        <button onClick={addBoardMember} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة عضو</button>
      </div>
      {state.board.map((m: BoardMember) => (
        <div key={m.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="الاسم" value={m.name} onChange={v => updateBoardMember(m.id, { name: v })} />
          <Field label="المنصب" value={m.position} onChange={v => updateBoardMember(m.id, { position: v })} />
          <ImageUpload label="صورة العضو" value={m.image} onChange={v => updateBoardMember(m.id, { image: v })} variant="avatar" maxSize={500} />
          <div className="md:col-span-2"><Field label="نبذة" value={m.bio} onChange={v => updateBoardMember(m.id, { bio: v })} area /></div>
          <div className="md:col-span-2 rounded-lg bg-blue-50 p-3">
            <p className="mb-2 text-sm font-bold text-blue-700">🔑 بيانات دخول العضو (لإضافة الأعمال لأي قسم)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="اسم المستخدم" value={m.username} onChange={v => updateBoardMember(m.id, { username: v })} ltr />
              <Field label="الرمز السري" value={m.accessCode} onChange={v => updateBoardMember(m.id, { accessCode: v })} ltr />
            </div>
          </div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${m.name}؟`)) deleteBoardMember(m.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Magazine Tab ===== */
function MagazineTab() {
  const { state, addMagazine, updateMagazine, deleteMagazine } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📰 مجلة الاتحاد الإلكترونية ({state.magazine.length})</h2>
        <button onClick={addMagazine} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة عدد</button>
      </div>
      {state.magazine.map((m: MagazineIssue) => (
        <div key={m.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="عنوان العدد" value={m.title} onChange={v => updateMagazine(m.id, { title: v })} />
          <Field label="رقم العدد" value={m.issueNumber} onChange={v => updateMagazine(m.id, { issueNumber: v })} />
          <Field label="تاريخ الإصدار" value={m.date} onChange={v => updateMagazine(m.id, { date: v })} type="date" ltr />
          <ImageUpload label="صورة الغلاف" value={m.coverImage} onChange={v => updateMagazine(m.id, { coverImage: v })} variant="cover" maxSize={800} />
          <Field label="رابط قراءة/تحميل العدد (PDF)" value={m.pdfUrl} onChange={v => updateMagazine(m.id, { pdfUrl: v })} ltr />
          <div className="md:col-span-2"><Field label="الوصف" value={m.description} onChange={v => updateMagazine(m.id, { description: v })} area /></div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${m.title}؟`)) deleteMagazine(m.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Library Tab ===== */
function LibraryTab() {
  const { state, addLibraryBook, updateLibraryBook, deleteLibraryBook } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📚 المكتبة ({state.library.length})</h2>
        <button onClick={addLibraryBook} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة كتاب</button>
      </div>
      {state.library.map((b: LibraryBook) => (
        <div key={b.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="عنوان الكتاب" value={b.title} onChange={v => updateLibraryBook(b.id, { title: v })} />
          <Field label="المؤلف" value={b.author} onChange={v => updateLibraryBook(b.id, { author: v })} />
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">التصنيف</label>
            <select value={b.category} onChange={e => updateLibraryBook(b.id, { category: e.target.value })} className="w-full rounded-lg border p-3">
              {PUBLICATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="السنة" value={b.year} onChange={v => updateLibraryBook(b.id, { year: v })} />
          <ImageUpload label="صورة الغلاف" value={b.coverImage} onChange={v => updateLibraryBook(b.id, { coverImage: v })} variant="cover" maxSize={800} />
          <Field label="رابط الملف PDF" value={b.pdfUrl} onChange={v => updateLibraryBook(b.id, { pdfUrl: v })} ltr />
          <div className="md:col-span-2"><Field label="الوصف" value={b.description} onChange={v => updateLibraryBook(b.id, { description: v })} area /></div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${b.title}؟`)) deleteLibraryBook(b.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Forums Tab ===== */
function ForumsTab() {
  const { state, addForumTopic, updateForumTopic, deleteForumTopic } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">💬 المنتديات ({state.forums.length})</h2>
        <button onClick={addForumTopic} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة موضوع</button>
      </div>
      {state.forums.map((t: ForumTopic) => (
        <div key={t.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="عنوان الموضوع" value={t.title} onChange={v => updateForumTopic(t.id, { title: v })} />
          <Field label="الكاتب" value={t.author} onChange={v => updateForumTopic(t.id, { author: v })} />
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">القسم</label>
            <select value={t.category} onChange={e => updateForumTopic(t.id, { category: e.target.value })} className="w-full rounded-lg border p-3">
              {FORUM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="عدد المشاركات" value={String(t.replies)} onChange={v => updateForumTopic(t.id, { replies: parseInt(v) || 0 })} type="number" ltr />
          <Field label="التاريخ" value={t.date} onChange={v => updateForumTopic(t.id, { date: v })} type="date" ltr />
          <div className="md:col-span-2"><Field label="المحتوى" value={t.content} onChange={v => updateForumTopic(t.id, { content: v })} area /></div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${t.title}؟`)) deleteForumTopic(t.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== News Tab ===== */
function NewsTab() {
  const { state, addNews, updateNews, deleteNews } = useApp();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📰 إدارة الأخبار ({state.news.length})</h2>
        <button onClick={addNews} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة خبر</button>
      </div>
      {state.news.map((n: NewsItem) => (
        <div key={n.id} className="grid gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-2">
          <Field label="العنوان" value={n.title} onChange={v => updateNews(n.id, { title: v })} />
          <Field label="التاريخ" value={n.date} onChange={v => updateNews(n.id, { date: v })} type="date" ltr />
          <ImageUpload label="صورة الخبر" value={n.image} onChange={v => updateNews(n.id, { image: v })} variant="wide" maxSize={1200} />
          <div className="md:col-span-2"><Field label="المحتوى" value={n.content} onChange={v => updateNews(n.id, { content: v })} area /></div>
          <div className="md:col-span-2 text-left">
            <button onClick={() => { if (confirm(`حذف ${n.title}؟`)) deleteNews(n.id); }} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️ حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Appearance Tab ===== */
function AppearanceTab() {
  const { state, updateSiteSettings } = useApp();
  const s = state.siteSettings;
  const up = (k: keyof SiteSettings, v: any) => updateSiteSettings({ ...s, [k]: v });
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🎨 إعدادات المظهر</h2>
      <div className="grid gap-6 rounded-xl bg-white p-6 shadow-md md:grid-cols-3">
        <ColorField label="لون شريط التنقل (الكحلي)" value={s.navColor} onChange={v => up('navColor', v)} />
        <ColorField label="اللون الأساسي (الأزرق)" value={s.primaryColor} onChange={v => up('primaryColor', v)} />
        <ColorField label="اللون الفيروزي" value={s.tealColor} onChange={v => up('tealColor', v)} />
        <ColorField label="لون التمييز" value={s.accentColor} onChange={v => up('accentColor', v)} />
        <ColorField label="لون خلفية الموقع" value={s.bgColor} onChange={v => up('bgColor', v)} />
        <ColorField label="لون النص" value={s.textColor} onChange={v => up('textColor', v)} />
        <ColorField label="لون خلفية البطاقات" value={s.cardBgColor} onChange={v => up('cardBgColor', v)} />
        <ColorField label="لون أزرار القوائم (حضاري)" value={s.navButtonColor} onChange={v => up('navButtonColor', v)} />
        <ColorField label="لون تدرج الأزرار الثاني" value={s.navButtonColor2} onChange={v => up('navButtonColor2', v)} />
        <div>
          <label className="mb-1 block text-sm font-bold text-gray-700">استدارة زوايا البطاقات</label>
          <input type="range" min="0" max="30" value={s.cardBorderRadius} onChange={e => up('cardBorderRadius', parseInt(e.target.value))} className="w-full" />
          <div className="text-center text-xs text-gray-400">{s.cardBorderRadius}px</div>
        </div>
      </div>

      {/* خلفية الموقع المائية الحضارية */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-bold text-gray-800">🖼️ خلفية الموقع المائية الحضارية</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <input type="checkbox" checked={s.bgPatternEnabled} onChange={e => up('bgPatternEnabled', e.target.checked)} className="h-5 w-5 rounded" />
              تفعيل الخلفية الحضارية
            </label>
            <p className="mt-2 text-xs text-gray-400">عند التفعيل تظهر خلفية مائية بطراز حضاري خلف صفحات الموقع.</p>
          </div>
          <ImageUpload label="صورة الخلفية" value={s.bgImage} onChange={v => up('bgImage', v)} variant="wide" maxSize={1600} />
        </div>
      </div>
    </div>
  );
}

/* ===== Social Tab ===== */
function SocialTab() {
  const { state, updateSiteSettings } = useApp();
  const s = state.siteSettings;
  const social = s.social || [];

  const updateLink = (id: string, data: Partial<SocialLink>) => {
    updateSiteSettings({ ...s, social: social.map(l => l.id === id ? { ...l, ...data } : l) });
  };
  const addLink = () => {
    updateSiteSettings({ ...s, social: [...social, { id: uuidv4(), platform: 'facebook', url: '', enabled: true }] });
  };
  const deleteLink = (id: string) => {
    updateSiteSettings({ ...s, social: social.filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">🔗 منصات التواصل الاجتماعي</h2>
        <button onClick={addLink} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">➕ إضافة رابط</button>
      </div>
      <p className="text-sm text-gray-500">أضف روابط مواقعكم. عند الضغط على الأيقونة في الموقع سينتقل الزائر مباشرة إلى الرابط.</p>
      {social.map(l => {
        const platform = SOCIAL_PLATFORMS.find(p => p.key === l.platform);
        return (
          <div key={l.id} className="grid items-end gap-3 rounded-xl bg-white p-4 shadow-md md:grid-cols-[160px_1fr_auto_auto]">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">المنصة</label>
              <select value={l.platform} onChange={e => updateLink(l.id, { platform: e.target.value })} className="w-full rounded-lg border p-3">
                {SOCIAL_PLATFORMS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">الرابط</label>
              <input type="text" value={l.url} onChange={e => updateLink(l.id, { url: e.target.value })} className="w-full rounded-lg border p-3" dir="ltr"
                placeholder={l.platform === 'email' ? 'mailto:info@example.com' : `https://${l.platform}.com/...`} />
            </div>
            <label className="flex items-center gap-2 pb-3 text-sm font-bold" style={{ color: platform?.color }}>
              <input type="checkbox" checked={l.enabled} onChange={e => updateLink(l.id, { enabled: e.target.checked })} className="h-5 w-5" />
              مفعّل
            </label>
            <button onClick={() => deleteLink(l.id)} className="mb-1 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">🗑️</button>
          </div>
        );
      })}
    </div>
  );
}

/* ===== Tools Tab ===== */
function ToolsTab() {
  const { exportData, importData, resetAll, changePassword } = useApp();
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [newPass, setNewPass] = useState('');

  const handleExport = () => {
    navigator.clipboard.writeText(exportData()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const handleDownload = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'basra-writers-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = () => {
    if (importData(importText)) { setMsg('✓ تم الاستيراد بنجاح'); setImportText(''); }
    else setMsg('✗ خطأ في تنسيق البيانات');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🔧 أدوات</h2>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-bold text-gray-700">🔒 تغيير كلمة المرور</h3>
        <div className="flex gap-3">
          <input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} className="flex-1 rounded-lg border p-3" placeholder="كلمة المرور الجديدة" dir="ltr" />
          <button onClick={() => { if (newPass.trim()) { changePassword(newPass.trim()); setMsg('✓ تم تغيير كلمة المرور'); setNewPass(''); } }} className="rounded-lg bg-blue-600 px-6 text-white hover:bg-blue-700">حفظ</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-bold text-gray-700">📤 تصدير / نسخ احتياطي</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">{copied ? '✓ تم النسخ' : '📋 نسخ البيانات'}</button>
          <button onClick={handleDownload} className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">💾 تحميل ملف JSON</button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-bold text-gray-700">📥 استيراد البيانات</h3>
        <textarea value={importText} onChange={e => setImportText(e.target.value)} className="w-full rounded-lg border p-3 font-mono text-sm" rows={5} placeholder='الصق بيانات JSON هنا' dir="ltr" />
        <button onClick={handleImport} className="mt-3 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">📥 استيراد</button>
        {msg && <p className="mt-2 text-sm font-bold">{msg}</p>}
      </div>

      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 shadow-md">
        <h3 className="mb-2 text-lg font-bold text-red-800">⚠️ إعادة تعيين</h3>
        <p className="mb-4 text-sm text-red-600">سيتم حذف كل البيانات والعودة للإعدادات الافتراضية.</p>
        {resetConfirm ? (
          <div className="flex gap-3">
            <button onClick={() => { resetAll(); setResetConfirm(false); }} className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700">نعم، احذف كل شيء</button>
            <button onClick={() => setResetConfirm(false)} className="rounded-lg bg-gray-500 px-6 py-3 text-white hover:bg-gray-600">إلغاء</button>
          </div>
        ) : (
          <button onClick={() => setResetConfirm(true)} className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700">🗑️ إعادة تعيين الموقع</button>
        )}
      </div>
    </div>
  );
}
