import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { api } from '../utils/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const referralRef = useRef(null);

  useEffect(() => {
    api('/rides')
      .then(data => setRides(data.filter(r => r.driver?._id === user?._id || r.passengers?.some(p => p._id === user?._id || p === user?._id))))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const copyReferral = () => {
    if (referralRef.current) {
      navigator.clipboard.writeText(referralRef.current.textContent);
      alert('Referral code copied!');
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
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="text-primary font-bold">Home</Link>
            <Link to="/search" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">My Rides</Link>
            <Link to="/profile" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Wallet</Link>
          </nav>
          <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-primary cursor-pointer">Logout</button>
          <Link to="/profile" className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        {/* Welcome + Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">Student Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! Save money and the planet today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/post-ride" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
              <span className="material-symbols-outlined text-lg">add_circle</span> Post a Ride
            </Link>
            <Link to="/search" className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <span className="material-symbols-outlined text-lg">search</span> Find a Ride
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-lg">account_balance_wallet</span>
              </div>
              <span className="text-sm text-slate-500">Account Balance</span>
            </div>
            <p className="text-3xl font-black">₹{(user?.balance || 1250).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-green-600 mt-1 font-bold">↗ +12% from last week</p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">savings</span>
              </div>
              <span className="text-sm text-slate-500">Lifetime Savings</span>
            </div>
            <p className="text-3xl font-black">₹{(user?.lifetimeSavings || 4500).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-400 mt-1">Saved by carpooling</p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-lg">payments</span>
              </div>
              <span className="text-sm text-slate-500">Total Earned</span>
            </div>
            <p className="text-3xl font-black">₹{(user?.totalEarned || 8200).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-slate-400 mt-1">Earned as a driver</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Rides */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black">Upcoming Rides</h2>
                <Link to="/search" className="text-sm font-bold text-primary hover:underline">View All</Link>
              </div>
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
              ) : rides.length === 0 ? (
                <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-8 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">directions_car</span>
                  <p className="text-slate-500">No upcoming rides. <Link to="/search" className="text-primary font-bold">Find one!</Link></p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rides.slice(0, 3).map(ride => (
                    <div key={ride._id} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-primary/10 rounded-xl px-3 py-2 min-w-[56px]">
                          <p className="text-[10px] text-primary font-bold uppercase">{new Date(ride.date).toLocaleString('en-US', { month: 'short' })}</p>
                          <p className="text-xl font-black text-primary">{new Date(ride.date).getDate()}</p>
                        </div>
                        <div>
                          <p className="font-bold">{ride.source} → {ride.destination}</p>
                          <p className="text-sm text-slate-500">🕐 {ride.time} · 👤 {ride.seats - ride.passengers.length} Seats Left</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/ride/${ride._id}`} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Details</Link>
                        <Link to={`/ride/${ride._id}`} className="px-4 py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-primary/10 transition-colors">Manage</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-black mb-4">Recent Activity</h2>
              <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-green-600 text-lg">add</span></div>
                    <div>
                      <p className="font-bold text-sm">Ride Completed Payment</p>
                      <p className="text-xs text-slate-500">From Sarah M. · Oct 22</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold text-sm">+₹150.00</span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-primary text-lg">directions_car</span></div>
                    <div>
                      <p className="font-bold text-sm">Ride Booked</p>
                      <p className="text-xs text-slate-500">To Science Park · Oct 21</p>
                    </div>
                  </div>
                  <span className="text-red-500 font-bold text-sm">-₹80.00</span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-amber-600 text-lg">star</span></div>
                    <div>
                      <p className="font-bold text-sm">Rating Received</p>
                      <p className="text-xs text-slate-500">5 stars from David L. · Oct 20</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-amber-500">star</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Referral Card */}
            <div className="bg-primary rounded-2xl p-6 text-white">
              <h3 className="text-lg font-black mb-2">Refer a Friend</h3>
              <p className="text-sm text-white/80 mb-4">Invite your classmates and both of you get ₹100 credit on the next ride!</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-lg px-4 py-2">
                  <span ref={referralRef} className="text-sm font-bold">STUDENT2024</span>
                </div>
                <button onClick={copyReferral} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>
            </div>

            {/* Campus Hubs */}
            <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-6">
              <h3 className="text-lg font-black mb-4">Active Campus Hubs</h3>
              <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 mb-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-bold">24 active rides nearby</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Main Library</span><span className="font-bold">12 Active</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600 dark:text-slate-400">Hostel Block C</span><span className="font-bold">8 Active</span></div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-5 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 text-lg">help</span>
              </div>
              <div>
                <p className="font-bold text-sm">Need help?</p>
                <p className="text-xs text-slate-500">Our 24/7 student support is here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-12 py-6 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2024 ShareMyRide Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Safety Guidelines</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
