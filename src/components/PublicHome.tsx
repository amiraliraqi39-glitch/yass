import { useApp } from '../store';
import { useNavigate } from './Router';
import Header from './Header';
import { PublicationCard, SectionTitle, Footer } from './shared';

export default function PublicHome() {
  const { state } = useApp();
  const { siteSettings, writers, publications, news } = state;
  const navigate = useNavigate();

  const navColor = siteSettings.navColor || '#14234f';
  const teal = siteSettings.tealColor || '#1ba5c4';
  const primary = siteSettings.primaryColor || '#2b9fd4';

  const useBg = siteSettings.bgPatternEnabled && siteSettings.bgImage;
  const mainStyle: React.CSSProperties = {
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

  // Group publications by category for the showcase
  const recentPubs = publications.slice(0, 10);
  const storyPubs = publications.filter(p => p.category === 'قصة');
  const novelPubs = publications.filter(p => p.category === 'رواية');
  const poetryPubs = publications.filter(p => p.category === 'شعر');

  return (
    <div className="min-h-screen" style={mainStyle}>
      <Header />

      {/* Cover Image */}
      {siteSettings.coverImage && (
        <div className="relative h-48 w-full overflow-hidden md:h-72 lg:h-96">
          <img src={siteSettings.coverImage} alt="غلاف" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Quick Stats / Writers */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate('/writers')}
            className="flex items-center justify-between rounded-xl p-6 text-white shadow-md transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: navColor }}
          >
            <div className="text-right">
              <div className="text-3xl font-bold">{writers.length}</div>
              <div className="opacity-80">أديباً</div>
            </div>
            <div className="text-4xl">📚</div>
          </button>
          <button
            onClick={() => navigate('/publications')}
            className="flex items-center justify-between rounded-xl p-6 text-white shadow-md transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: teal }}
          >
            <div className="text-right">
              <div className="text-3xl font-bold">{publications.length}</div>
              <div className="opacity-80">منشوراً أدبياً</div>
            </div>
            <div className="text-4xl">📖</div>
          </button>
          <button
            onClick={() => navigate('/news')}
            className="flex items-center justify-between rounded-xl p-6 text-white shadow-md transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: primary }}
          >
            <div className="text-right">
              <div className="text-3xl font-bold">{news.length}</div>
              <div className="opacity-80">خبراً وفعالية</div>
            </div>
            <div className="text-4xl">📰</div>
          </button>
        </div>

        {/* Quick Access to new sections */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => navigate('/magazine')}
            className="flex items-center justify-between rounded-xl border-2 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
            style={{ borderColor: navColor }}
          >
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: navColor }}>مجلة الاتحاد الإلكترونية</div>
              <div className="text-sm text-gray-500">{state.magazine.length} عدد منشور</div>
            </div>
            <div className="text-4xl">📰</div>
          </button>
          <button
            onClick={() => navigate('/library')}
            className="flex items-center justify-between rounded-xl border-2 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
            style={{ borderColor: teal }}
          >
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: teal }}>المكتبة</div>
              <div className="text-sm text-gray-500">{state.library.length} كتاب</div>
            </div>
            <div className="text-4xl">📚</div>
          </button>
          <button
            onClick={() => navigate('/forums')}
            className="flex items-center justify-between rounded-xl border-2 bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
            style={{ borderColor: primary }}
          >
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: primary }}>المنتديات</div>
              <div className="text-sm text-gray-500">{state.forums.length} موضوع نقاش</div>
            </div>
            <div className="text-4xl">💬</div>
          </button>
        </div>

        {/* Latest Publications */}
        <section className="mb-12">
          <SectionTitle icon="📚🖋️" title="المنشورات الأدبية" count={publications.length} />
          {recentPubs.length === 0 ? (
            <EmptyState text="لا تتوفر منشورات حالياً" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recentPubs.map(p => <PublicationCard key={p.id} pub={p} />)}
            </div>
          )}
          {publications.length > 10 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/publications')}
                className="rounded-lg px-6 py-2 font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primary }}
              >
                عرض كل المنشورات ←
              </button>
            </div>
          )}
        </section>

        {/* Novels */}
        {novelPubs.length > 0 && (
          <section className="mb-12">
            <SectionTitle icon="📕" title="المنجزات الروائية" count={novelPubs.length} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {novelPubs.slice(0, 5).map(p => <PublicationCard key={p.id} pub={p} />)}
            </div>
          </section>
        )}

        {/* Stories */}
        <section className="mb-12">
          <SectionTitle icon="📘" title="المنجزات القصصية" count={storyPubs.length} />
          {storyPubs.length === 0 ? (
            <EmptyState text="🚫 لا تتوفر منشورات حالياً" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {storyPubs.slice(0, 5).map(p => <PublicationCard key={p.id} pub={p} />)}
            </div>
          )}
        </section>

        {/* Poetry */}
        {poetryPubs.length > 0 && (
          <section className="mb-12">
            <SectionTitle icon="📗" title="المنجزات الشعرية" count={poetryPubs.length} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {poetryPubs.slice(0, 5).map(p => <PublicationCard key={p.id} pub={p} />)}
            </div>
          </section>
        )}

        {/* Latest News */}
        {news.length > 0 && (
          <section className="mb-6">
            <SectionTitle icon="📰" title="آخر الأخبار" />
            <div className="grid gap-4 md:grid-cols-3">
              {news.slice(0, 3).map(n => (
                <button
                  key={n.id}
                  onClick={() => navigate('/news')}
                  className="overflow-hidden rounded-xl bg-white text-right shadow-md transition-shadow hover:shadow-xl"
                >
                  {n.image && <img src={n.image} alt={n.title} className="h-40 w-full object-cover" />}
                  <div className="p-4">
                    <p className="text-xs text-gray-400">{n.date}</p>
                    <h3 className="mt-1 font-bold" style={{ color: navColor }}>{n.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">{n.content}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
      <p className="text-lg text-gray-400">{text}</p>
    </div>
  );
}
