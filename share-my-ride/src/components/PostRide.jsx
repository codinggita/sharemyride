import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

export default function PostRide() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const sourceRef = useRef(null);

  const [form, setForm] = useState({
    source: '', destination: '', date: '', time: '',
    seats: '1', cost: '', vehicleModel: '', vehicleColor: '',
    smoking: false, music: true, pets: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = 'Source is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.cost || Number(form.cost) <= 0) e.cost = 'Enter a valid cost';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      sourceRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setServerError('');
    try {
      await api('/rides', {
        method: 'POST',
        body: JSON.stringify({
          source: form.source,
          destination: form.destination,
          date: form.date,
          time: form.time,
          seats: Number(form.seats),
          cost: Number(form.cost),
          vehicleModel: form.vehicleModel,
          vehicleColor: form.vehicleColor,
          preferences: { smoking: form.smoking, music: form.music, pets: form.pets },
        }),
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 md:px-20 py-4 bg-background-light/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ShareMyRide</h2>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <Link to="/search" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Find a Ride</Link>
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-2">Post a Ride</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Fill in the details to share your journey and save costs.</p>

        {serverError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{serverError}</div>}

        <div className="bg-white dark:bg-surface-dark shadow-2xl border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. Journey Details */}
            <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <h2 className="text-xl font-black">Journey Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Source</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">my_location</span>
                  <input ref={sourceRef} value={form.source} onChange={e => handleChange('source', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.source ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm`}
                    placeholder="Enter pickup location" />
                </div>
                {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Destination</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">location_on</span>
                  <input value={form.destination} onChange={e => handleChange('destination', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.destination ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm`}
                    placeholder="Enter drop-off location" />
                </div>
                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
                  <input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.date ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm`} />
                </div>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Time</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">schedule</span>
                  <input type="time" value={form.time} onChange={e => handleChange('time', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.time ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm`} />
                </div>
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>
          </section>

          {/* 2. Capacity & Cost */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <h2 className="text-xl font-black">Capacity & Cost</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Available Seats</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">groups</span>
                  <select value={form.seats} onChange={e => handleChange('seats', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm appearance-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Cost per Seat (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                  <input type="number" min="0" value={form.cost} onChange={e => handleChange('cost', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.cost ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm`}
                    placeholder="Enter amount" />
                </div>
                {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
              </div>
            </div>
          </section>

          {/* 3. Vehicle Details */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <h2 className="text-xl font-black">Vehicle Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Model</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">directions_car</span>
                  <input value={form.vehicleModel} onChange={e => handleChange('vehicleModel', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="e.g. Honda City" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1 block">Color</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">palette</span>
                  <input value={form.vehicleColor} onChange={e => handleChange('vehicleColor', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm" placeholder="e.g. Silver Metallic" />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Preferences */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <h2 className="text-xl font-black">Preferences</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'smoking', label: 'Smoking', icon: 'smoking_rooms' },
                { key: 'music', label: 'Music Allowed', icon: 'music_note' },
                { key: 'pets', label: 'Pets Welcome', icon: 'pets' },
              ].map(pref => (
                <label key={pref.key} className={`flex items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${form[pref.key] ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                  <input type="checkbox" checked={form[pref.key]} onChange={e => handleChange(pref.key, e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                  <span className="material-symbols-outlined text-lg text-slate-500">{pref.icon}</span>
                  <span className="text-sm font-medium">{pref.label}</span>
                </label>
              ))}
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-700" />

            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer">
              <span className="material-symbols-outlined">flight_takeoff</span>
              {submitting ? 'Publishing...' : 'Publish Ride'}
            </button>
            <p className="text-xs text-slate-400 text-center">By publishing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Safety Guidelines</a>.</p>
          </form>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 py-6 px-6 md:px-20 mt-8">
        <div className="max-w-2xl mx-auto flex justify-between text-xs text-slate-400">
          <p className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">directions_car</span> ShareMyRide © 2024</p>
          <div className="flex gap-4"><a href="#" className="hover:text-primary">Help Center</a><a href="#" className="hover:text-primary">Safety</a></div>
        </div>
      </footer>
    </div>
  );
}
