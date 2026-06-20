// ====== أنواع الأدباء ======
export const WRITER_TYPES = ['شاعر', 'روائي', 'قاص', 'ناقد', 'كاتب', 'باحث', 'مترجم', 'مسرحي'] as const;
export type WriterType = typeof WRITER_TYPES[number];

// ====== تصنيفات المنشورات ======
export const PUBLICATION_CATEGORIES = ['رواية', 'قصة', 'شعر', 'نقد', 'مقالة', 'بحث', 'مسرح', 'ترجمة'] as const;
export type PublicationCategory = typeof PUBLICATION_CATEGORIES[number];

export interface Writer {
  id: string;
  name: string;
  type: string;       // شاعر / روائي / قاص ...
  bio: string;
  image: string;
  birthYear: string;
  username: string;   // اسم الدخول الخاص بالأديب
  accessCode: string; // الرمز السري الخاص بالأديب
}

export interface Publication {
  id: string;
  title: string;
  authorName: string;
  authorType: string;   // نوع الأديب (شاعر/روائي/قاص)
  category: string;     // التصنيف (رواية/قصة/شعر/...)
  coverImage: string;   // صورة الغلاف
  pdfUrl: string;       // رابط الملف PDF
  description: string;
  year: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
}

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  username: string;   // اسم الدخول الخاص بالعضو
  accessCode: string; // الرمز السري الخاص بالعضو
}

// ====== طلبات الإضافة (بانتظار موافقة الأدمن) ======
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type SubmissionTarget = 'publications' | 'library' | 'magazine';

export interface Submission {
  id: string;
  submitterId: string;     // معرّف الأديب أو العضو
  submitterName: string;   // اسم مقدّم الطلب
  submitterRole: 'writer' | 'board'; // أديب أو عضو هيئة
  target: SubmissionTarget; // إلى أي قسم (المنشورات / المكتبة / المجلة)
  title: string;
  author: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
  description: string;
  year: string;
  status: SubmissionStatus;
  date: string;
  adminNote: string;       // ملاحظة الأدمن عند الرفض
}

// ====== مجلة الاتحاد الإلكترونية ======
export interface MagazineIssue {
  id: string;
  title: string;       // عنوان العدد
  issueNumber: string; // رقم العدد
  date: string;        // تاريخ الإصدار
  coverImage: string;  // صورة الغلاف
  pdfUrl: string;      // رابط قراءة/تحميل العدد
  description: string;
}

// ====== المكتبة ======
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;    // التصنيف (رواية/شعر/قصة/...)
  coverImage: string;
  pdfUrl: string;
  description: string;
  year: string;
}

// ====== المنتديات ======
export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  category: string;    // قسم المنتدى
  content: string;
  date: string;
  replies: number;     // عدد المشاركات
}

export const FORUM_CATEGORIES = ['الشعر', 'القصة والرواية', 'النقد الأدبي', 'حوارات ثقافية', 'عام'] as const;

export interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  siteDescription: string;
  siteLogo: string;
  logoImage: string;
  coverImage: string;
  officialUrl: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  heroFontFamily: string;
  navColor: string;
  primaryColor: string;
  tealColor: string;
  accentColor: string;
  bgColor: string;
  bgImage: string;          // خلفية الموقع المائية الحضارية
  bgPatternEnabled: boolean;// تفعيل الخلفية الزخرفية
  navButtonColor: string;   // لون أزرار القوائم الحضاري ثلاثي الأبعاد
  navButtonColor2: string;  // لون التدرج الثاني للأزرار
  textColor: string;
  cardBgColor: string;
  cardBorderRadius: number;
  showFooter: boolean;
  footerText: string;
  tickerEnabled: boolean;
  tickerText: string;
  social: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;   // facebook / instagram / twitter / youtube / telegram / whatsapp / email
  url: string;
  enabled: boolean;
}

export interface FontOption {
  name: string;
  className: string;
  family: string;
  category: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { name: 'رقعة (Aref Ruqaa)', className: 'font-aref-ruqaa', family: "'Aref Ruqaa', serif", category: 'تقليدي' },
  { name: 'نسخ (Noto Naskh)', className: 'font-noto-naskh', family: "'Noto Naskh Arabic', serif", category: 'نسخ' },
  { name: 'كوفي (Reem Kufi)', className: 'font-reem-kufi', family: "'Reem Kufi', sans-serif", category: 'كوفي' },
  { name: 'كايرو (Cairo)', className: 'font-cairo', family: "'Cairo', sans-serif", category: 'حديث' },
  { name: 'المسيري (El Messiri)', className: 'font-el-messiri', family: "'El Messiri', sans-serif", category: 'حديث' },
  { name: 'تاجوال (Tajawal)', className: 'font-tajawal', family: "'Tajawal', sans-serif", category: 'حديث' },
  { name: 'لمونادا (Lemonada)', className: 'font-lemonada', family: "'Lemonada', cursive", category: 'زخرفي' },
  { name: 'رقاص (Rakkas)', className: 'font-rakkas', family: "'Rakkas', cursive", category: 'زخرفي' },
  { name: 'مركزي (Markazi Text)', className: 'font-markazi', family: "'Markazi Text', serif", category: 'تقليدي' },
  { name: 'لطيف (Lateef)', className: 'font-lateef', family: "'Lateef', serif", category: 'تقليدي' },
  { name: 'شهرزاد (Scheherazade)', className: 'font-scheherazade', family: "'Scheherazade New', serif", category: 'تقليدي' },
  { name: 'أميري (Amiri)', className: 'font-amiri', family: "'Amiri', serif", category: 'تقليدي' },
];

export const COLOR_OPTIONS = [
  { name: 'أزرق', value: '#1e40af' },
  { name: 'أزرق سماوي', value: '#2b9fd4' },
  { name: 'كحلي', value: '#14234f' },
  { name: 'فيروزي', value: '#1ba5c4' },
  { name: 'أخضر', value: '#15803d' },
  { name: 'أحمر', value: '#b91c1c' },
  { name: 'بنفسجي', value: '#7c3aed' },
  { name: 'برتقالي', value: '#c2410c' },
  { name: 'ذهبي', value: '#a16207' },
  { name: 'وردي', value: '#be185d' },
];

export const SOCIAL_PLATFORMS = [
  { key: 'facebook', label: 'فيسبوك', color: '#1877f2' },
  { key: 'instagram', label: 'انستغرام', color: '#e4405f' },
  { key: 'twitter', label: 'تويتر / إكس', color: '#1da1f2' },
  { key: 'youtube', label: 'يوتيوب', color: '#ff0000' },
  { key: 'telegram', label: 'تيليغرام', color: '#0088cc' },
  { key: 'whatsapp', label: 'واتساب', color: '#25d366' },
  { key: 'email', label: 'البريد', color: '#ea4335' },
  { key: 'tiktok', label: 'تيك توك', color: '#000000' },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'اتحاد الادباء والكتاب في البصرة',
  siteNameEn: 'THE UNION OF BASRA WRITERS',
  siteDescription: 'الموقع الرسمي لاتحاد الادباء والكتاب في البصرة - منصة الأدباء والكتاب والمثقفين',
  siteLogo: '📚',
  logoImage: '/images/logo.png',
  coverImage: '/images/cover.jpg',
  officialUrl: '',
  aboutText: 'اتحاد الادباء والكتاب في البصرة هو منظمة ثقافية أدبية تضم نخبة من الأدباء والكتاب والمثقفين في محافظة البصرة، يسعى إلى رعاية الإبداع الأدبي ونشر الثقافة وتنظيم الفعاليات والأمسيات الأدبية والثقافية.',
  contactEmail: 'info@basrawriters.com',
  contactPhone: '+964 770 000 0000',
  contactAddress: 'البصرة - العراق',
  heroFontFamily: "'Aref Ruqaa', serif",
  navColor: '#14234f',
  primaryColor: '#2b9fd4',
  tealColor: '#1ba5c4',
  accentColor: '#b91c1c',
  bgColor: '#f4f6f9',
  bgImage: '/images/bg-heritage.jpg',
  bgPatternEnabled: true,
  navButtonColor: '#a87332',
  navButtonColor2: '#6d4518',
  textColor: '#1e293b',
  cardBgColor: '#ffffff',
  cardBorderRadius: 10,
  showFooter: true,
  footerText: 'جميع الحقوق محفوظة © 2026 اتحاد الادباء والكتاب في البصرة',
  tickerEnabled: true,
  tickerText: 'اتحاد أدباء البصرة.. إصدار روائي لمهدي علي ازبين يغوص في تفاصيل الحياة • أمسية شعرية كبرى في مقر الاتحاد • صدور العدد الجديد من مجلة الاتحاد',
  social: [
    { id: 's1', platform: 'facebook', url: 'https://facebook.com', enabled: true },
    { id: 's2', platform: 'instagram', url: 'https://instagram.com', enabled: true },
    { id: 's3', platform: 'twitter', url: 'https://twitter.com', enabled: true },
    { id: 's4', platform: 'youtube', url: 'https://youtube.com', enabled: true },
    { id: 's5', platform: 'telegram', url: 'https://telegram.org', enabled: true },
    { id: 's6', platform: 'email', url: 'mailto:info@basrawriters.com', enabled: true },
  ],
};
