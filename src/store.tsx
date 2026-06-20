import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { SiteSettings, Writer, Publication, NewsItem, BoardMember, MagazineIssue, LibraryBook, ForumTopic, Submission, SubmissionTarget } from './types';
import { DEFAULT_SITE_SETTINGS } from './types';

// العضو الحالي الذي سجّل الدخول (أديب أو عضو هيئة)
export interface CurrentMember {
  id: string;
  name: string;
  role: 'writer' | 'board';
}

// ====== البيانات الافتراضية ======
const DEFAULT_WRITERS: Writer[] = [
  { id: uuidv4(), name: 'حيدر جاسم المشكور', type: 'روائي', bio: 'روائي عراقي من البصرة، له عدة أعمال روائية متميزة.', image: '', birthYear: '', username: 'haidar', accessCode: 'h1234' },
  { id: uuidv4(), name: 'أزهار السيلاوي', type: 'شاعر', bio: 'شاعرة عراقية من البصرة، لها دواوين شعرية عديدة.', image: '', birthYear: '', username: 'azhar', accessCode: 'a1234' },
  { id: uuidv4(), name: 'داود الفريح', type: 'قاص', bio: 'قاص عراقي من البصرة، متخصص في القصة القصيرة.', image: '', birthYear: '', username: 'dawood', accessCode: 'd1234' },
  { id: uuidv4(), name: 'حيدر الأسدي', type: 'شاعر', bio: 'شاعر وباحث عراقي من البصرة، له اهتمامات في المسرح والإعلام.', image: '', birthYear: '', username: 'asadi', accessCode: 'as123' },
  { id: uuidv4(), name: 'اسماعيل القريشي', type: 'شاعر', bio: 'شاعر عراقي من البصرة، له عدة دواوين ومؤلفات فكرية.', image: '', birthYear: '', username: 'ismael', accessCode: 'is123' },
];

const DEFAULT_PUBLICATIONS: Publication[] = [
  { id: uuidv4(), title: 'حلم الرب', authorName: 'حيدر جاسم المشكور', authorType: 'روائي', category: 'رواية', coverImage: '', pdfUrl: '', description: 'رواية تغوص في تفاصيل الحياة والوجود.', year: '2025' },
  { id: uuidv4(), title: 'سأعيد أمجادي مع امرأة أخرى', authorName: 'حيدر جاسم المشكور', authorType: 'روائي', category: 'رواية', coverImage: '', pdfUrl: '', description: 'رواية عن الحب والذكريات.', year: '2025' },
  { id: uuidv4(), title: 'مجنون متفق عليه', authorName: 'حيدر جاسم المشكور', authorType: 'روائي', category: 'رواية', coverImage: '', pdfUrl: '', description: 'عمل روائي مميز.', year: '2025' },
  { id: uuidv4(), title: 'عناق في قطر المحيط', authorName: 'أزهار السيلاوي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'ساعة مقتل الفئران', authorName: 'داود الفريح', authorType: 'قاص', category: 'قصة', coverImage: '', pdfUrl: '', description: 'مجموعة قصصية.', year: '2025' },
  { id: uuidv4(), title: 'الإعلام الاقتصادي', authorName: 'حيدر الأسدي', authorType: 'شاعر', category: 'بحث', coverImage: '', pdfUrl: '', description: 'دراسة في الإعلام الاقتصادي.', year: '2025' },
  { id: uuidv4(), title: 'إدارة الأزمات في الخطاب المسرحي العالمي', authorName: 'حيدر الأسدي', authorType: 'شاعر', category: 'مسرح', coverImage: '', pdfUrl: '', description: 'بحث في المسرح العالمي.', year: '2025' },
  { id: uuidv4(), title: 'البصرة أيقونة الجمال السرمدي', authorName: 'حيدر الأسدي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان عن جمال البصرة.', year: '2025' },
  { id: uuidv4(), title: 'أفلا يتفكرون', authorName: 'اسماعيل القريشي', authorType: 'شاعر', category: 'مقالة', coverImage: '', pdfUrl: '', description: 'مقالات فكرية.', year: '2025' },
  { id: uuidv4(), title: 'فيض من الشجون', authorName: 'اسماعيل القريشي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'أريج الزهر', authorName: 'اسماعيل القريشي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'لقاء على شفاه الحب', authorName: 'أزهار السيلاوي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'قبلة على جنح السراب', authorName: 'أزهار السيلاوي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'طقوس لأزمنة اسراب', authorName: 'أزهار السيلاوي', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
];

const DEFAULT_NEWS: NewsItem[] = [
  { id: uuidv4(), title: 'أمسية شعرية كبرى في مقر الاتحاد', content: 'أقام اتحاد الكتاب والأدباء في البصرة أمسية شعرية حضرها نخبة من الشعراء والمثقفين.', date: '2026-01-15', image: '' },
  { id: uuidv4(), title: 'صدور إصدار روائي جديد', content: 'صدر عن الاتحاد إصدار روائي جديد لمهدي علي ازبين يغوص في تفاصيل الحياة.', date: '2026-01-10', image: '' },
  { id: uuidv4(), title: 'تكريم الأدباء المبدعين', content: 'كرّم الاتحاد مجموعة من الأدباء المبدعين تقديراً لعطائهم الأدبي.', date: '2026-01-05', image: '' },
];

const DEFAULT_BOARD: BoardMember[] = [
  { id: uuidv4(), name: 'رئيس الاتحاد', position: 'رئيس الاتحاد', bio: 'رئيس اتحاد الكتاب والأدباء في البصرة.', image: '', username: 'rayes', accessCode: 'r1234' },
  { id: uuidv4(), name: 'نائب الرئيس', position: 'نائب رئيس الاتحاد', bio: 'نائب رئيس الاتحاد.', image: '', username: 'naib', accessCode: 'n1234' },
  { id: uuidv4(), name: 'الأمين العام', position: 'الأمين العام', bio: 'الأمين العام للاتحاد.', image: '', username: 'ameen', accessCode: 'am123' },
  { id: uuidv4(), name: 'أمين الصندوق', position: 'أمين الصندوق', bio: 'المسؤول المالي للاتحاد.', image: '', username: 'sundooq', accessCode: 's1234' },
];

const DEFAULT_MAGAZINE: MagazineIssue[] = [
  { id: uuidv4(), title: 'مجلة الاتحاد - العدد الأول', issueNumber: '1', date: '2026-01-01', coverImage: '', pdfUrl: '', description: 'العدد الافتتاحي لمجلة اتحاد الأدباء والكتاب في البصرة، يضم نخبة من المقالات والقصائد والدراسات النقدية.' },
  { id: uuidv4(), title: 'مجلة الاتحاد - العدد الثاني', issueNumber: '2', date: '2026-04-01', coverImage: '', pdfUrl: '', description: 'ملف خاص عن الشعر البصري المعاصر، مع حوارات وقراءات نقدية لأبرز الإصدارات.' },
  { id: uuidv4(), title: 'مجلة الاتحاد - العدد الثالث', issueNumber: '3', date: '2026-07-01', coverImage: '', pdfUrl: '', description: 'ملف عن الرواية العراقية، ونصوص إبداعية مختارة من أعضاء الاتحاد.' },
];

const DEFAULT_LIBRARY: LibraryBook[] = [
  { id: uuidv4(), title: 'حلم الرب', author: 'حيدر جاسم المشكور', category: 'رواية', coverImage: '', pdfUrl: '', description: 'رواية تغوص في تفاصيل الحياة والوجود.', year: '2025' },
  { id: uuidv4(), title: 'عناق في قطر المحيط', author: 'أزهار السيلاوي', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
  { id: uuidv4(), title: 'ساعة مقتل الفئران', author: 'داود الفريح', category: 'قصة', coverImage: '', pdfUrl: '', description: 'مجموعة قصصية.', year: '2025' },
  { id: uuidv4(), title: 'البصرة أيقونة الجمال السرمدي', author: 'حيدر الأسدي', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان عن جمال البصرة.', year: '2025' },
  { id: uuidv4(), title: 'فيض من الشجون', author: 'اسماعيل القريشي', category: 'شعر', coverImage: '', pdfUrl: '', description: 'ديوان شعري.', year: '2025' },
];

const DEFAULT_FORUMS: ForumTopic[] = [
  { id: uuidv4(), title: 'أمسية شعرية: ما رأيكم بقصائد العدد الجديد؟', author: 'إدارة المنتدى', category: 'الشعر', content: 'نفتح باب النقاش حول القصائد المنشورة في العدد الأخير من مجلة الاتحاد، شاركونا آراءكم.', date: '2026-01-12', replies: 8 },
  { id: uuidv4(), title: 'نقاش حول مستقبل الرواية في البصرة', author: 'عضو الاتحاد', category: 'القصة والرواية', content: 'دعوة لمناقشة واقع ومستقبل الرواية البصرية والتحديات التي تواجه الروائيين.', date: '2026-01-08', replies: 15 },
  { id: uuidv4(), title: 'قراءة نقدية في ديوان (عناق في قطر المحيط)', author: 'ناقد أدبي', category: 'النقد الأدبي', content: 'قراءة تحليلية في أحدث إصدارات الشاعرة أزهار السيلاوي.', date: '2026-01-05', replies: 6 },
  { id: uuidv4(), title: 'ترحيب بالأعضاء الجدد في الاتحاد', author: 'إدارة المنتدى', category: 'عام', content: 'نرحب بجميع الأعضاء الجدد، عرفونا بأنفسكم واهتماماتكم الأدبية.', date: '2026-01-02', replies: 22 },
];

interface AppState {
  siteSettings: SiteSettings;
  writers: Writer[];
  publications: Publication[];
  news: NewsItem[];
  board: BoardMember[];
  magazine: MagazineIssue[];
  library: LibraryBook[];
  forums: ForumTopic[];
  submissions: Submission[];
  currentMember: CurrentMember | null;
  isAdmin: boolean;
  adminPassword: string;
}

interface AppContextType {
  state: AppState;
  updateSiteSettings: (s: SiteSettings) => void;
  // Writers
  addWriter: () => void;
  updateWriter: (id: string, data: Partial<Writer>) => void;
  deleteWriter: (id: string) => void;
  // Publications
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  // News
  addNews: () => void;
  updateNews: (id: string, data: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  // Board
  addBoardMember: () => void;
  updateBoardMember: (id: string, data: Partial<BoardMember>) => void;
  deleteBoardMember: (id: string) => void;
  // Magazine
  addMagazine: () => void;
  updateMagazine: (id: string, data: Partial<MagazineIssue>) => void;
  deleteMagazine: (id: string) => void;
  // Library
  addLibraryBook: () => void;
  updateLibraryBook: (id: string, data: Partial<LibraryBook>) => void;
  deleteLibraryBook: (id: string) => void;
  // Forums
  addForumTopic: () => void;
  updateForumTopic: (id: string, data: Partial<ForumTopic>) => void;
  deleteForumTopic: (id: string) => void;
  // Member auth + submissions
  memberLogin: (username: string, accessCode: string) => boolean;
  memberLogout: () => void;
  submitContent: (data: { target: SubmissionTarget; title: string; author: string; category: string; coverImage: string; pdfUrl: string; description: string; year: string }) => void;
  approveSubmission: (id: string) => void;
  rejectSubmission: (id: string, note: string) => void;
  deleteSubmission: (id: string) => void;
  // Auth + tools
  toggleAdmin: () => void;
  login: (password: string) => boolean;
  changePassword: (newPass: string) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'basra-writers-union-v2';

function defaultState(): AppState {
  return {
    siteSettings: { ...DEFAULT_SITE_SETTINGS },
    writers: DEFAULT_WRITERS,
    publications: DEFAULT_PUBLICATIONS,
    news: DEFAULT_NEWS,
    board: DEFAULT_BOARD,
    magazine: DEFAULT_MAGAZINE,
    library: DEFAULT_LIBRARY,
    forums: DEFAULT_FORUMS,
    submissions: [],
    currentMember: null,
    isAdmin: false,
    adminPassword: 'admin123',
  };
}

const LEGACY_NAME = 'اتحاد الكتاب والادباء في البصرة';
const NEW_NAME = 'اتحاد الادباء والكتاب في البصرة';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = {
        ...defaultState(),
        ...parsed,
        siteSettings: { ...DEFAULT_SITE_SETTINGS, ...parsed.siteSettings },
      };
      // ترحيل الاسم القديم إلى الاسم الجديد
      const ss = merged.siteSettings;
      if (ss.siteName === LEGACY_NAME) ss.siteName = NEW_NAME;
      if (ss.footerText === `جميع الحقوق محفوظة © 2026 ${LEGACY_NAME}`) ss.footerText = `جميع الحقوق محفوظة © 2026 ${NEW_NAME}`;
      if (ss.siteDescription === `الموقع الرسمي ل${LEGACY_NAME} - منصة الأدباء والكتاب والمثقفين`) ss.siteDescription = `الموقع الرسمي ل${NEW_NAME} - منصة الأدباء والكتاب والمثقفين`;
      return merged;
    }
  } catch {}
  return defaultState();
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => { saveState(state); }, [state]);

  const updateSiteSettings = useCallback((s: SiteSettings) => {
    setState(prev => ({ ...prev, siteSettings: s }));
  }, []);

  // ===== Writers =====
  const addWriter = useCallback(() => {
    const w: Writer = { id: uuidv4(), name: 'أديب جديد', type: 'شاعر', bio: '', image: '', birthYear: '', username: 'user' + Math.floor(Math.random() * 9000 + 1000), accessCode: Math.random().toString(36).slice(2, 8) };
    setState(prev => ({ ...prev, writers: [w, ...prev.writers] }));
  }, []);
  const updateWriter = useCallback((id: string, data: Partial<Writer>) => {
    setState(prev => ({ ...prev, writers: prev.writers.map(w => w.id === id ? { ...w, ...data } : w) }));
  }, []);
  const deleteWriter = useCallback((id: string) => {
    setState(prev => ({ ...prev, writers: prev.writers.filter(w => w.id !== id) }));
  }, []);

  // ===== Publications =====
  const addPublication = useCallback(() => {
    const p: Publication = { id: uuidv4(), title: 'منشور جديد', authorName: '', authorType: 'شاعر', category: 'شعر', coverImage: '', pdfUrl: '', description: '', year: '2026' };
    setState(prev => ({ ...prev, publications: [p, ...prev.publications] }));
  }, []);
  const updatePublication = useCallback((id: string, data: Partial<Publication>) => {
    setState(prev => ({ ...prev, publications: prev.publications.map(p => p.id === id ? { ...p, ...data } : p) }));
  }, []);
  const deletePublication = useCallback((id: string) => {
    setState(prev => ({ ...prev, publications: prev.publications.filter(p => p.id !== id) }));
  }, []);

  // ===== News =====
  const addNews = useCallback(() => {
    const n: NewsItem = { id: uuidv4(), title: 'خبر جديد', content: '', date: new Date().toISOString().slice(0, 10), image: '' };
    setState(prev => ({ ...prev, news: [n, ...prev.news] }));
  }, []);
  const updateNews = useCallback((id: string, data: Partial<NewsItem>) => {
    setState(prev => ({ ...prev, news: prev.news.map(n => n.id === id ? { ...n, ...data } : n) }));
  }, []);
  const deleteNews = useCallback((id: string) => {
    setState(prev => ({ ...prev, news: prev.news.filter(n => n.id !== id) }));
  }, []);

  // ===== Board =====
  const addBoardMember = useCallback(() => {
    const b: BoardMember = { id: uuidv4(), name: 'عضو جديد', position: 'عضو', bio: '', image: '', username: 'member' + Math.floor(Math.random() * 9000 + 1000), accessCode: Math.random().toString(36).slice(2, 8) };
    setState(prev => ({ ...prev, board: [...prev.board, b] }));
  }, []);
  const updateBoardMember = useCallback((id: string, data: Partial<BoardMember>) => {
    setState(prev => ({ ...prev, board: prev.board.map(b => b.id === id ? { ...b, ...data } : b) }));
  }, []);
  const deleteBoardMember = useCallback((id: string) => {
    setState(prev => ({ ...prev, board: prev.board.filter(b => b.id !== id) }));
  }, []);

  // ===== Magazine =====
  const addMagazine = useCallback(() => {
    const m: MagazineIssue = { id: uuidv4(), title: 'عدد جديد', issueNumber: '', date: new Date().toISOString().slice(0, 10), coverImage: '', pdfUrl: '', description: '' };
    setState(prev => ({ ...prev, magazine: [m, ...prev.magazine] }));
  }, []);
  const updateMagazine = useCallback((id: string, data: Partial<MagazineIssue>) => {
    setState(prev => ({ ...prev, magazine: prev.magazine.map(m => m.id === id ? { ...m, ...data } : m) }));
  }, []);
  const deleteMagazine = useCallback((id: string) => {
    setState(prev => ({ ...prev, magazine: prev.magazine.filter(m => m.id !== id) }));
  }, []);

  // ===== Library =====
  const addLibraryBook = useCallback(() => {
    const b: LibraryBook = { id: uuidv4(), title: 'كتاب جديد', author: '', category: 'رواية', coverImage: '', pdfUrl: '', description: '', year: '2026' };
    setState(prev => ({ ...prev, library: [b, ...prev.library] }));
  }, []);
  const updateLibraryBook = useCallback((id: string, data: Partial<LibraryBook>) => {
    setState(prev => ({ ...prev, library: prev.library.map(b => b.id === id ? { ...b, ...data } : b) }));
  }, []);
  const deleteLibraryBook = useCallback((id: string) => {
    setState(prev => ({ ...prev, library: prev.library.filter(b => b.id !== id) }));
  }, []);

  // ===== Forums =====
  const addForumTopic = useCallback(() => {
    const t: ForumTopic = { id: uuidv4(), title: 'موضوع جديد', author: '', category: 'عام', content: '', date: new Date().toISOString().slice(0, 10), replies: 0 };
    setState(prev => ({ ...prev, forums: [t, ...prev.forums] }));
  }, []);
  const updateForumTopic = useCallback((id: string, data: Partial<ForumTopic>) => {
    setState(prev => ({ ...prev, forums: prev.forums.map(t => t.id === id ? { ...t, ...data } : t) }));
  }, []);
  const deleteForumTopic = useCallback((id: string) => {
    setState(prev => ({ ...prev, forums: prev.forums.filter(t => t.id !== id) }));
  }, []);

  // ===== Member Auth + Submissions =====
  const memberLogin = useCallback((username: string, accessCode: string) => {
    const u = username.trim();
    const c = accessCode.trim();
    let ok = false;
    setState(prev => {
      const writer = prev.writers.find(w => w.username === u && w.accessCode === c);
      if (writer) { ok = true; return { ...prev, currentMember: { id: writer.id, name: writer.name, role: 'writer' } }; }
      const member = prev.board.find(b => b.username === u && b.accessCode === c);
      if (member) { ok = true; return { ...prev, currentMember: { id: member.id, name: member.name, role: 'board' } }; }
      return prev;
    });
    return ok;
  }, []);
  const memberLogout = useCallback(() => {
    setState(prev => ({ ...prev, currentMember: null }));
  }, []);
  const submitContent = useCallback((data: { target: SubmissionTarget; title: string; author: string; category: string; coverImage: string; pdfUrl: string; description: string; year: string }) => {
    setState(prev => {
      if (!prev.currentMember) return prev;
      const sub: Submission = {
        id: uuidv4(),
        submitterId: prev.currentMember.id,
        submitterName: prev.currentMember.name,
        submitterRole: prev.currentMember.role,
        target: data.target,
        title: data.title,
        author: data.author || prev.currentMember.name,
        category: data.category,
        coverImage: data.coverImage,
        pdfUrl: data.pdfUrl,
        description: data.description,
        year: data.year,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
        adminNote: '',
      };
      return { ...prev, submissions: [sub, ...prev.submissions] };
    });
  }, []);
  const approveSubmission = useCallback((id: string) => {
    setState(prev => {
      const sub = prev.submissions.find(s => s.id === id);
      if (!sub) return prev;
      const next = { ...prev, submissions: prev.submissions.map(s => s.id === id ? { ...s, status: 'approved' as const } : s) };
      if (sub.target === 'publications') {
        const p: Publication = { id: uuidv4(), title: sub.title, authorName: sub.author, authorType: 'كاتب', category: sub.category, coverImage: sub.coverImage, pdfUrl: sub.pdfUrl, description: sub.description, year: sub.year };
        next.publications = [p, ...prev.publications];
      } else if (sub.target === 'library') {
        const b: LibraryBook = { id: uuidv4(), title: sub.title, author: sub.author, category: sub.category, coverImage: sub.coverImage, pdfUrl: sub.pdfUrl, description: sub.description, year: sub.year };
        next.library = [b, ...prev.library];
      } else if (sub.target === 'magazine') {
        const m: MagazineIssue = { id: uuidv4(), title: sub.title, issueNumber: '', date: sub.date, coverImage: sub.coverImage, pdfUrl: sub.pdfUrl, description: sub.description };
        next.magazine = [m, ...prev.magazine];
      }
      return next;
    });
  }, []);
  const rejectSubmission = useCallback((id: string, note: string) => {
    setState(prev => ({ ...prev, submissions: prev.submissions.map(s => s.id === id ? { ...s, status: 'rejected' as const, adminNote: note } : s) }));
  }, []);
  const deleteSubmission = useCallback((id: string) => {
    setState(prev => ({ ...prev, submissions: prev.submissions.filter(s => s.id !== id) }));
  }, []);

  // ===== Auth + Tools =====
  const toggleAdmin = useCallback(() => {
    setState(prev => ({ ...prev, isAdmin: !prev.isAdmin }));
  }, []);
  const login = useCallback((password: string) => {
    let ok = false;
    setState(prev => {
      if (password === prev.adminPassword) { ok = true; return { ...prev, isAdmin: true }; }
      return prev;
    });
    return ok;
  }, []);
  const changePassword = useCallback((newPass: string) => {
    setState(prev => ({ ...prev, adminPassword: newPass }));
  }, []);
  const exportData = useCallback(() => {
    return JSON.stringify({
      siteSettings: state.siteSettings,
      writers: state.writers,
      publications: state.publications,
      news: state.news,
      board: state.board,
      magazine: state.magazine,
      library: state.library,
      forums: state.forums,
      submissions: state.submissions,
    }, null, 2);
  }, [state]);
  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      setState(prev => ({
        ...prev,
        siteSettings: data.siteSettings ? { ...DEFAULT_SITE_SETTINGS, ...data.siteSettings } : prev.siteSettings,
        writers: data.writers ?? prev.writers,
        publications: data.publications ?? prev.publications,
        news: data.news ?? prev.news,
        board: data.board ?? prev.board,
        magazine: data.magazine ?? prev.magazine,
        library: data.library ?? prev.library,
        forums: data.forums ?? prev.forums,
        submissions: data.submissions ?? prev.submissions,
      }));
      return true;
    } catch { return false; }
  }, []);
  const resetAll = useCallback(() => {
    setState(defaultState());
  }, []);

  return (
    <AppContext.Provider value={{
      state, updateSiteSettings,
      addWriter, updateWriter, deleteWriter,
      addPublication, updatePublication, deletePublication,
      addNews, updateNews, deleteNews,
      addBoardMember, updateBoardMember, deleteBoardMember,
      addMagazine, updateMagazine, deleteMagazine,
      addLibraryBook, updateLibraryBook, deleteLibraryBook,
      addForumTopic, updateForumTopic, deleteForumTopic,
      memberLogin, memberLogout, submitContent, approveSubmission, rejectSubmission, deleteSubmission,
      toggleAdmin, login, changePassword, exportData, importData, resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
