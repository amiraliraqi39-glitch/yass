import { useRef, useState } from 'react';

interface ImageUploadProps {
  label?: string;
  value: string;                 // رابط الصورة أو بيانات base64
  onChange: (value: string) => void;
  /** أقصى عرض للصورة بالبكسل قبل الضغط (افتراضي 800) */
  maxWidth?: number;
  /** نسبة العرض إلى الارتفاع للمعاينة، مثل "3/4" أو "1/1" */
  aspect?: string;
}

/**
 * مكوّن رفع الصور: يتيح اختيار صورة من الجهاز أو لصق رابط.
 * يقوم بضغط الصورة وتحويلها إلى صيغة base64 لتُحفظ محلياً (localStorage) بدون خادم.
 */
export default function ImageUpload({
  label = 'الصورة',
  value,
  onChange,
  maxWidth = 800,
  aspect = '3/4',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('الرجاء اختيار ملف صورة صالح');
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            onChange(String(e.target?.result || ''));
            setLoading(false);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          onChange(dataUrl);
        } catch {
          onChange(String(e.target?.result || ''));
        }
        setLoading(false);
      };
      img.onerror = () => {
        setError('تعذّر قراءة الصورة');
        setLoading(false);
      };
      img.src = String(e.target?.result || '');
    };
    reader.onerror = () => {
      setError('تعذّر تحميل الملف');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-bold text-gray-700">{label}</label>}

      {/* تبديل بين الرفع والرابط */}
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          📁 رفع صورة
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${mode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          🔗 رابط
        </button>
      </div>

      <div className="flex items-start gap-3">
        {/* معاينة */}
        <div
          className="flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50"
          style={{ width: 80, aspectRatio: aspect }}
        >
          {value ? (
            <img src={value} alt="معاينة" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-gray-300">🖼️</div>
          )}
        </div>

        <div className="flex-1">
          {mode === 'upload' ? (
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
            >
              <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
              {loading ? (
                <p className="text-sm text-blue-600">⏳ جاري المعالجة...</p>
              ) : (
                <p className="text-sm text-gray-500">انقر لاختيار صورة أو اسحبها هنا</p>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border p-2.5 text-sm"
              dir="ltr"
            />
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="mt-2 text-xs text-red-500 hover:text-red-600"
            >
              🗑️ إزالة الصورة
            </button>
          )}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
