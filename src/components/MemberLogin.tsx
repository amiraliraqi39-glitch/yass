import { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from './Router';

export default function MemberLogin() {
  const { memberLogin } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (memberLogin(username, code)) {
      setUsername('');
      setCode('');
      navigate('/member');
    } else {
      setError('اسم المستخدم أو الرمز غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fadeIn rounded-2xl bg-white p-8 shadow-2xl" dir="rtl">
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">✍️</div>
          <h2 className="text-2xl font-bold text-gray-800">دخول الأعضاء</h2>
          <p className="mt-2 text-gray-500">خاص بالأدباء وأعضاء الهيئة الإدارية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-lg border p-3 text-center text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="اسم المستخدم"
              autoFocus
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">الرمز السري</label>
            <input
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full rounded-lg border p-3 text-center text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="الرمز السري"
              dir="ltr"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</div>
          )}

          <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700">
            🚀 دخول
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600">
            ← العودة إلى الموقع
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          احصل على اسمك ورمزك من إدارة الاتحاد
        </p>
      </div>
    </div>
  );
}
