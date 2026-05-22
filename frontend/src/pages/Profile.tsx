import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="flex items-center gap-8 mb-8">
          <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.role}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <p className="text-slate-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <p className="text-slate-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <p className="text-slate-900">{user?.role}</p>
            </div>
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        )}
      </div>
    </div>
  );
}
