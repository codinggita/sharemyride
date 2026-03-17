import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

const ITEMS_PER_PAGE = 4;

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchRides() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const searchRef = useRef(null);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('earliest');
  const [timeFilter, setTimeFilter] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchRides = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('destination', debouncedSearch);
      const data = await api(`/rides?${params.toString()}`);
      setRides(data);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchRides(); }, [fetchRides]);
  useEffect(() => { searchRef.current?.focus(); }, []);

  // Sort
  const sorted = [...rides].sort((a, b) => {
    if (sortBy === 'earliest') return `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);
    if (sortBy === 'cheapest') return a.cost - b.cost;
    if (sortBy === 'expensive') return b.cost - a.cost;
    return 0;
  });

  // Time filter
  const filtered = timeFilter ? sorted.filter(r => {
    const h = parseInt(r.time.split(':')[0], 10);
    if (timeFilter === 'Morning') return h >= 5 && h < 12;
    if (timeFilter === 'Afternoon') return h >= 12 && h < 17;
    if (timeFilter === 'Evening') return h >= 17 && h < 21;
    if (timeFilter === 'Night') return h >= 21 || h < 5;
    return true;
  }) : sorted;

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 md:px-10 py-3 bg-background-light/80 backdrop-blur-md sticky top-0 z-50 gap-4">
        <Link to="/" className="flex items-center gap-2 text-primary shrink-0">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <h2 className="hidden md:block text-lg font-bold tracking-tight text-slate-900 dark:text-white">ShareMyRide</h2>
        </Link>
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input ref={searchRef} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Where to?" />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/search" className="text-primary font-bold">Find a Ride</Link>
          <Link to="/post-ride" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Offer a Ride</Link>
          <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">My Bookings</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-xl">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          {user ? (
            <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{user.name?.charAt(0)?.toUpperCase()}</Link>
          ) : (
            <Link to="/login" className="text-sm font-bold text-primary">Login</Link>
          )}
        </div>
      </header>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar — Filters */}
        <aside className="hidden lg:block w-60 p-6 border-r border-slate-200 dark:border-slate-700 space-y-6 shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="font-black">Filters</h3>
            <button onClick={() => { setTimeFilter(''); setSearchTerm(''); setSortBy('earliest'); }} className="text-xs font-bold text-primary cursor-pointer">RESET</button>
          </div>

          {/* Departure Time */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-lg">schedule</span>
              <span className="text-sm font-bold">Departure Time</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
                <button key={t} onClick={() => setTimeFilter(prev => prev === t ? '' : t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeFilter === t ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center — Results */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">Available Rides <span className="text-sm font-normal text-slate-500">({filtered.length} results)</span></h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border-none bg-transparent text-primary font-bold cursor-pointer focus:ring-0 text-sm">
                <option value="earliest">Earliest</option>
                <option value="cheapest">Cheapest</option>
                <option value="expensive">Most Expensive</option>
              </select>
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm mb-4">{error}</div>}

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">search_off</span>
              <p className="text-slate-500 text-lg">No rides found. Try a different search or <Link to="/post-ride" className="text-primary font-bold">post a ride</Link>.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginated.map(ride => (
                <div key={ride._id} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-5 flex flex-col lg:flex-row gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all">
                  {/* Driver */}
                  <div className="flex items-center gap-3 lg:w-40 shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">{ride.driver?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-surface-dark"></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{ride.driver?.name || 'Unknown'}</p>
                      <p className="text-xs text-amber-500 font-bold">★ {ride.driver?.driverRating?.toFixed(1) || '5.0'} ({ride.driver?.totalRides || 0})</p>
                    </div>
                  </div>

                  {/* Route & Time */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-primary"></div>
                        <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-bold">{ride.time}</p>
                          <p className="text-xs text-slate-500">{ride.source}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:w-32">
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">₹{ride.cost}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">per seat</p>
                    </div>
                    <Link to={`/ride/${ride._id}`} className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all text-center">Book Now</Link>
                    <p className="text-[10px] text-green-600 font-bold">{ride.seats - ride.passengers.length} seats remaining</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold cursor-pointer transition-all ${page === i + 1 ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
            </div>
          )}
        </div>

        {/* Right Sidebar — Route Overview */}
        <aside className="hidden xl:block w-72 p-6 border-l border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="font-black mb-4">Route Overview</h3>
          <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl h-64 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary/40">map</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div><p className="text-xs text-slate-500">Estimated Distance</p><p className="font-bold">24.5 km</p></div>
            <div><p className="text-xs text-slate-500">Estimated Time</p><p className="font-bold text-primary">~55 mins</p></div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-4 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">directions_car</span> © 2024 ShareMyRide Inc.</p>
          <div className="flex gap-4"><a href="#" className="hover:text-primary">Privacy Policy</a><a href="#" className="hover:text-primary">Terms of Service</a><a href="#" className="hover:text-primary">Safety Center</a></div>
        </div>
      </footer>
    </div>
  );
}
