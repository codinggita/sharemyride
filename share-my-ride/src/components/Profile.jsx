import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', campus: '',
    vehicleModel: '', vehicleColor: '', licensePlate: '',
  });
  const [preferences, setPreferences] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        campus: user.campus || 'North Campus Main',
        vehicleModel: user.vehicleModel || '',
        vehicleColor: user.vehicleColor || '',
        licensePlate: user.licensePlate || '',
      });
      setPreferences(user.preferences || ['Music Allowed']);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const togglePref = (pref) => {
    setPreferences(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
  };

  const handleSave = async () => {
    setSaving(true); setMsg(''); setError('');
    try {
      await api('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ ...form, preferences }),
      });
      setMsg('Profile saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const allPrefs = ['No Smoking', 'Music Allowed', 'Pets Welcome', 'Talkative'];
  const prefColors = { 'No Smoking': 'text-red-500 border-red-200 bg-red-50', 'Music Allowed': 'text-primary border-primary/20 bg-primary/5', 'Pets Welcome': 'text-slate-600 border-slate-200 bg-slate-50', 'Talkative': 'text-primary border-primary/20 bg-primary/5' };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 md:px-20 py-4 bg-background-light/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShareMyRide</h2>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><span className="material-symbols-outlined">notifications</span></button>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><span className="material-symbols-outlined">settings</span></button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {msg && <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 text-sm">{msg}</div>}
        {error && <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm">{error}</div>}

        {/* Profile Header */}
        <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="h-28 bg-gradient-to-r from-primary/20 to-primary/5"></div>
          <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-white dark:border-surface-dark flex items-center justify-center text-primary text-3xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-black">{user?.name || 'User'}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">🛡 Student Verified</span>
                  <span className="text-slate-400">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-2xl font-black text-amber-500">★ {user?.driverRating?.toFixed(1) || '4.9'}</p>
            <p className="text-sm text-slate-500">Driver Rating</p>
          </div>
          <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-2xl font-black text-primary">🚌 {user?.passengerRating?.toFixed(1) || '5.0'}</p>
            <p className="text-sm text-slate-500">Passenger Rating</p>
          </div>
          <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-2xl font-black">{user?.totalRides || 0}</p>
            <p className="text-sm text-slate-500">Total Rides</p>
          </div>
        </div>

        {/* Contact + Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5"><span className="material-symbols-outlined text-primary">contact_phone</span><h3 className="font-black">Contact Information</h3></div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Email Address</label>
                <input value={form.email} disabled className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm opacity-60" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-primary">Phone Number</label>
                <input value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                  className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-primary">University Campus</label>
                <select value={form.campus} onChange={e => handleChange('campus', e.target.value)}
                  className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm cursor-pointer">
                  <option>North Campus Main</option>
                  <option>South Campus</option>
                  <option>Engineering Block</option>
                  <option>Medical Campus</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5"><span className="material-symbols-outlined text-primary">directions_car</span><h3 className="font-black">Vehicle Details</h3></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Make & Model</label>
                  <input value={form.vehicleModel} onChange={e => handleChange('vehicleModel', e.target.value)}
                    className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Toyota Prius" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Color</label>
                  <input value={form.vehicleColor} onChange={e => handleChange('vehicleColor', e.target.value)}
                    className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Silver" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">License Plate</label>
                <input value={form.licensePlate} onChange={e => handleChange('licensePlate', e.target.value)}
                  className="w-full mt-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="ABC-1234" />
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                <span className="material-symbols-outlined text-primary text-lg">info</span>
                <span>Insurance documents verified through Dec 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-5"><span className="material-symbols-outlined text-primary">tune</span><h3 className="font-black">Ride Preferences</h3></div>
          <div className="flex flex-wrap gap-3">
            {allPrefs.map(p => (
              <button key={p} onClick={() => togglePref(p)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer ${preferences.includes(p) ? (prefColors[p] || 'text-primary border-primary/20 bg-primary/5') : 'text-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end gap-3">
          <Link to="/dashboard" className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Discard Changes</Link>
          <button onClick={handleSave} disabled={saving}
            className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
