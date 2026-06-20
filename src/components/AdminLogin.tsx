import { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from './Router';

export default function AdminLogin() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      setPassword('');
      navigate('/admin');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fadeIn rounded-2xl bg-white p-8 shadow-2xl" dir="rtl">
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
          <p className="mt-2 text-gray-500">أدخل كلمة المرور للدخول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3 text-center text-lg transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="admin123"
              autoFocus
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700"
          >
            🚀 دخول
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            ← العودة إلى الموقع
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          كلمة المرور الافتراضية: admin123
        </p>
      </div>
    </div>
  );
}
