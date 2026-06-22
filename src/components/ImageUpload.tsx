import { useRef } from 'react';

type Variant = 'avatar' | 'cover' | 'wide';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  variant?: Variant;
  maxSize?: number;
}

const aspectClass: Record<Variant, string> = {
  avatar: 'aspect-square max-w-[160px]',
  cover: 'aspect-[3/4] max-w-[160px]',
  wide: 'aspect-video max-w-xs',
};

function resizeImage(file: File, maxPx: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ImageUpload({ label, value, onChange, variant = 'cover', maxSize = 800 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, maxSize);
      onChange(dataUrl);
    } catch {
      // fall back to raw data URL if canvas fails
      const reader = new FileReader();
      reader.onload = ev => onChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-gray-700">{label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className={`relative overflow-hidden rounded-lg border bg-gray-100 ${aspectClass[variant]}`}>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs text-white hover:bg-black/70"
              title="إزالة الصورة"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500 ${aspectClass[variant]}`}
          >
            <span className="text-center text-xs leading-tight">
              📷<br />رفع صورة
            </span>
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 rounded-lg border px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            تغيير
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
