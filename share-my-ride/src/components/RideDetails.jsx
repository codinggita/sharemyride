import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

export default function RideDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api(`/rides/${id}`)
      .then(setRide)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    setError('');
    try {
      const updated = await api(`/rides/${id}/book`, { method: 'POST' });
      setRide(updated);
      setSuccess('Ride booked successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  const platformFee = 45;
  const taxes = 25;
  const baseFare = ride ? ride.cost - platformFee - taxes : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!ride) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark font-display gap-4">
      <span className="material-symbols-outlined text-6xl text-slate-300">error</span>
      <p className="text-slate-500">Ride not found.</p>
      <Link to="/search" className="text-primary font-bold">Back to search</Link>
    </div>
  );

  const seatsLeft = ride.seats - ride.passengers.length;
  const isDriver = ride.driver?._id === user?._id;
  const isPassenger = ride.passengers?.some(p => (p._id || p) === user?._id);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 md:px-20 py-3 bg-background-light/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">directions_car</span>
            <span className="font-black text-lg text-slate-900 dark:text-white">Ride Details</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-lg">share</span></button>
          <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-lg">favorite</span></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        {error && <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 text-sm">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Route + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl h-52 relative overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-primary/30">map</span>
              <div className="absolute bottom-4 left-4 bg-white dark:bg-surface-dark rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div><span className="text-xs font-bold text-primary uppercase">Pickup</span></div>
                <p className="text-sm font-bold">{ride.source}</p>
                <div className="flex items-center gap-2 mt-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span className="text-xs font-bold text-red-500 uppercase">Drop-off</span></div>
                <p className="text-sm font-bold">{ride.destination}</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-white dark:bg-surface-dark px-4 py-2 rounded-lg shadow font-bold text-primary">₹{ride.cost} <span className="text-xs text-slate-400 font-normal">Per seat</span></div>
            </div>

            {/* Driver + Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-primary">person</span><h3 className="font-black">Driver Profile</h3></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">{ride.driver?.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <p className="font-bold text-lg">{ride.driver?.name || 'Unknown'}</p>
                    <p className="text-xs text-amber-500 font-bold">★ {ride.driver?.driverRating?.toFixed(1)} ({ride.driver?.totalRides} rides)</p>
                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">Verified Driver</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 cursor-pointer">
                  <span className="material-symbols-outlined text-lg">chat</span> Chat
                </button>
              </div>

              <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4"><span className="material-symbols-outlined text-primary">directions_car</span><h3 className="font-black">Vehicle</h3></div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl h-24 mb-3 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300">directions_car</span>
                </div>
                <p className="font-bold">{ride.vehicleModel || 'Not specified'}</p>
                <p className="text-sm text-slate-500">{ride.vehicleColor || ''}</p>
                <div className="flex gap-2 mt-2">
                  {ride.preferences?.music && <span className="material-symbols-outlined text-primary text-lg" title="AC">ac_unit</span>}
                </div>
              </div>
            </div>

            {/* Co-passengers */}
            <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary">groups</span><h3 className="font-black">Co-passengers</h3></div>
                <span className="text-sm text-slate-500">{seatsLeft} seats available</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {ride.passengers.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">{(p.name || 'U').charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold">{p.name || 'Passenger'}</p>
                    </div>
                  </div>
                ))}
                {Array.from({ length: seatsLeft }).map((_, i) => (
                  <div key={`e-${i}`} className="flex items-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    <span className="text-sm">Available</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Booking Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-black text-lg mb-4">Cost Breakdown</h3>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between"><span className="text-slate-500">Base Fare (1 seat)</span><span className="font-bold">₹{baseFare > 0 ? baseFare.toFixed(2) : ride.cost.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Platform Fee</span><span className="font-bold">₹{platformFee}.00</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Taxes & GST</span><span className="font-bold">₹{taxes}.00</span></div>
                <hr className="border-slate-200 dark:border-slate-700" />
                <div className="flex justify-between text-lg"><span className="font-black">Total Amount</span><span className="font-black text-primary">₹{ride.cost.toFixed(2)}</span></div>
              </div>
              <button onClick={handleBook} disabled={booking || isDriver || isPassenger || seatsLeft === 0}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer mb-3">
                {isPassenger ? 'Already Booked' : isDriver ? 'Your Ride' : booking ? 'Booking...' : 'Request to Join'}
              </button>
              <p className="text-[10px] text-slate-400 text-center">By clicking, you agree to our ride-sharing community guidelines and safety terms.</p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-blue-600">schedule</span>
                  <div><p className="text-xs font-bold text-blue-600 uppercase">Departure</p><p className="text-sm font-bold">{ride.date}, {ride.time}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-green-600">verified_user</span>
                  <div><p className="text-xs font-bold text-green-600 uppercase">Safe Ride</p><p className="text-sm font-bold">Verified driver & insurance</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-surface-dark shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
              <h4 className="font-bold mb-2">Need Help?</h4>
              <p className="text-sm text-slate-500 mb-3">Have questions about this ride? You can contact the driver directly or reach out to our 24/7 support team.</p>
              <button className="w-full border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">Contact Support</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 py-6 px-6 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2024 ShareMyRide Inc. All rights reserved.</p>
          <div className="flex gap-4"><a href="#" className="hover:text-primary">Safety</a><a href="#" className="hover:text-primary">Privacy</a><a href="#" className="hover:text-primary">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}
