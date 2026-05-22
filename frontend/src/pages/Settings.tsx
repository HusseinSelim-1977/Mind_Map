import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your preferences</p>
      </div>

      <div className="space-y-8">
        {/* Account Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Notifications</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-slate-600">{notifications ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${theme === 'light' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-900">Task assignments</span>
              <button className={`w-10 h-6 rounded-full transition-colors bg-slate-900`} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-900">Task mentions</span>
              <button className={`w-10 h-6 rounded-full transition-colors bg-slate-900`} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-900">Project updates</span>
              <button className={`w-10 h-6 rounded-full transition-colors bg-slate-200`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
