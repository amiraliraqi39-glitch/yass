import { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from './Router';
import { PUBLICATION_CATEGORIES } from '../types';
import type { SubmissionTarget } from '../types';

const TARGET_LABELS: Record<SubmissionTarget, string> = {
  publications: 'المنشورات الأدبية',
  library: 'المكتبة',
  magazine: 'مجلة الاتحاد',
};

export default function MemberPortal() {
  const { state, memberLogout, submitContent } = useApp();
  const navigate = useNavigate();
  const member = state.currentMember;

  const [target, setTarget] = useState<SubmissionTarget>('library');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(member?.name || '');
  const [category, setCategory] = useState('رواية');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2026');
  const [done, setDone] = useState(false);

  if (!member) {
    navigate('/member-login');
    return null;
  }

  const mySubs = state.submissions.filter(s => s.submitterId === member.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    submitContent({ target, title, author, category, coverImage, pdfUrl, description, year });
    setTitle(''); setCoverImage(''); setPdfUrl(''); setDescription('');
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  const logout = () => { memberLogout(); navigate('/'); };

  const statusBadge = (status: string) => {
    if (status === 'approved') return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ تمت الموافقة</span>;
    if (status === 'rejected') return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">✕ مرفوض</span>;
    return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">⏳ بانتظار الموافقة</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-l from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">✍️</span>
            <div>
              <h1 className="text-lg font-bold">مرحباً، {member.name}</h1>
              <p className="text-sm opacity-80">{member.role === 'writer' ? 'أديب' : 'عضو الهيئة الإدارية'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">🏠 الموقع</button>
            <button onClick={logout} className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700">🚪 خروج</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Submit Form */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-800">➕ إضافة عمل جديد</h2>
            <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              يمكنك إضافة رواية أو كتاب أو عمل يخصك. سيظهر بعد موافقة إدارة الاتحاد.
            </p>
            {done && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-green-700">
                ✓ تم إرسال عملك بنجاح! بانتظار موافقة الإدارة.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-5 shadow-md">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">القسم المستهدف</label>
                <select value={target} onChange={e => setTarget(e.target.value as SubmissionTarget)} className="w-full rounded-lg border p-3">
                  <option value="library">المكتبة</option>
                  <option value="publications">المنشورات الأدبية</option>
                  <option value="magazine">مجلة الاتحاد</option>
                </select>
                {member.role === 'board' && (
                  <p className="mt-1 text-xs text-gray-400">كعضو هيئة إدارية يمكنك الإضافة إلى أي قسم.</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">العنوان *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg border p-3" required dir="rtl" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">اسم المؤلف</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full rounded-lg border p-3" dir="rtl" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">التصنيف</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border p-3">
                  {PUBLICATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">صورة الغلاف (رابط)</label>
                <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full rounded-lg border p-3" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">رابط الملف PDF</label>
                <input type="text" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} className="w-full rounded-lg border p-3" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">السنة</label>
                <input type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-lg border p-3" dir="rtl" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">الوصف</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border p-3" rows={3} dir="rtl" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700">
                📤 إرسال للمراجعة
              </button>
            </form>
          </div>

          {/* My Submissions */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-800">📋 أعمالي المرسلة ({mySubs.length})</h2>
            {mySubs.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                لم ترسل أي عمل بعد
              </div>
            ) : (
              <div className="space-y-3">
                {mySubs.map(s => (
                  <div key={s.id} className="rounded-xl bg-white p-4 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800">{s.title}</h3>
                      {statusBadge(s.status)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-2 py-0.5">{TARGET_LABELS[s.target]}</span>
                      <span className="rounded bg-gray-100 px-2 py-0.5">{s.category}</span>
                      <span>📅 {s.date}</span>
                    </div>
                    {s.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{s.description}</p>}
                    {s.status === 'rejected' && s.adminNote && (
                      <p className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">📝 ملاحظة الإدارة: {s.adminNote}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
