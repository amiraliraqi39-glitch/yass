import { AppProvider, useApp } from './store';
import { RouterProvider, useCurrentPath, useNavigate } from './components/Router';
import PublicHome from './components/PublicHome';
import { WritersPage, PublicationsPage, BoardPage, NewsPage, AboutPage, ContactPage, MagazinePage, LibraryPage, ForumsPage } from './components/Pages';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import MemberLogin from './components/MemberLogin';
import MemberPortal from './components/MemberPortal';

function AppContent() {
  const { state } = useApp();
  const currentPath = useCurrentPath();
  const navigate = useNavigate();

  // Admin login
  if (currentPath === '/admin-login') {
    if (state.isAdmin) { navigate('/admin'); return null; }
    return <AdminLogin />;
  }

  // Admin panel
  if (currentPath === '/admin' && state.isAdmin) {
    return <AdminPanel />;
  }

  // Member login
  if (currentPath === '/member-login') {
    if (state.currentMember) { navigate('/member'); return null; }
    return <MemberLogin />;
  }

  // Member portal
  if (currentPath === '/member') {
    if (!state.currentMember) { navigate('/member-login'); return null; }
    return <MemberPortal />;
  }

  // Public pages
  let page;
  switch (currentPath) {
    case '/writers': page = <WritersPage />; break;
    case '/publications': page = <PublicationsPage />; break;
    case '/magazine': page = <MagazinePage />; break;
    case '/library': page = <LibraryPage />; break;
    case '/forums': page = <ForumsPage />; break;
    case '/board': page = <BoardPage />; break;
    case '/news': page = <NewsPage />; break;
    case '/about': page = <AboutPage />; break;
    case '/contact': page = <ContactPage />; break;
    default: page = <PublicHome />;
  }

  return (
    <div className="relative">
      {/* Admin Access Button */}
      <button
        onClick={() => navigate(state.isAdmin ? '/admin' : '/admin-login')}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-2xl text-white shadow-lg transition-all hover:scale-110 hover:bg-gray-700"
        title="لوحة التحكم"
      >
        ⚙️
      </button>

      {/* Member Access Button */}
      <button
        onClick={() => navigate(state.currentMember ? '/member' : '/member-login')}
        className="fixed bottom-6 left-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-700"
        title="دخول الأعضاء (الأدباء والهيئة الإدارية)"
      >
        ✍️
      </button>

      {state.isAdmin && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white shadow-lg">
          <span>🛡️</span><span>وضع المشرف</span>
        </div>
      )}

      {page}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AppProvider>
  );
}
