import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Homepage() {
  const { dark, toggle } = useTheme();
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* ─────────── HEADER ─────────── */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-700 px-6 md:px-20 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">ShareMyRide</h2>
        </div>

        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-8">
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#how-it-works">How it Works</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#benefits">Benefits</a>
            <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#safety">Safety</a>
          </nav>
          <div className="flex gap-3 items-center">
            <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold transition-all">
              Log In
            </Link>
            <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary text-white hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 transition-all">
              Sign Up
            </Link>
            <button onClick={toggle} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors" title="Toggle theme">
              <span className="material-symbols-outlined">{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>

        <button className="md:hidden text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <main className="flex-1">
        {/* ─────────── HERO SECTION ─────────── */}
        <section className="px-6 md:px-20 py-12 md:py-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-light text-sm font-bold w-fit">
                  Now at 50+ Campuses
                </span>
                <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                  Connecting Campuses, <br />
                  <span className="text-primary">One Ride at a Time</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-normal max-w-lg">
                  The safest and most affordable way for students to travel. Share costs, meet peers, and reduce your carbon footprint.
                </p>
              </div>

              {/* Search Card */}
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Find a Ride</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm text-slate-900 dark:text-white"
                        placeholder="Campus/City"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">near_me</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm text-slate-900 dark:text-white"
                        placeholder="Destination"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                      <input
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary focus:border-primary text-sm text-slate-900 dark:text-white"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined">search</span>
                  Search Available Rides
                </button>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    alt="Group of happy college students sitting together on campus lawn"
                    className="w-full h-full object-cover aspect-[4/3]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZTJamyQKA3UscxNE_uK2rIdexmfehwlo3RIdrzAOaFwb06su43nJBGnoYw21cxhluVkDR-ofaRWskgeGLNbWfmgdRhhCB6jSOTgBTPurO724gUNb4CzRSPrJfAx3Q1mdxm8ZN3CPhe083MUa9us9EHfTeg0G6NkQcJpaZ1i0hJRk9wBO_K3ATSJOFNRQjcqDZQJF0-E_cuwa8-z02XYtbOwZ2ySUEyHBRUjCS4I7mlHSHb25Rk7l-y66l5uIKPMYNhDgqtqq6WnKm"
                  />
                  {/* Floating badge */}
                  <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-surface-dark/90 backdrop-blur p-4 rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOAW-whmjJOHkpXMcSlsEuo3hfRPBdw3przSyN0tUTknUAl4eTOfEPvd3Iz73OfSgstUD3y7pvGSyV1SecLvntS2qJmvnX3wuE8tQEK_tMXxC0CDKOLzxaPp04IDUOdRYGXeCfXuXOuLvls1zQZ-6LmW8-2JIqUrvRgBbp1kN649vrhv2db49BeiMZbvMvaQdGhpnepL8JnTaOPOpG3_R2PAs20ndq-TMKQYWEsNsEi2wc74gcjsOKeHGc3lYK-hjl8kZPOuht-Urw" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvJmylzGNnocWma25CbeCCTpG0nyu4Ubb72KpCYvW9Vq-m2up-LIViQ_nTmQHjreBmAHwvJlmVPiEHhIvdv4K5MGT5VTUuuEC-Gqpgbo3qIaBPkqcb6IcZnSZ1ZDklUHrL3dZrdAvG48uiRo-iSntBkkIe3IEIy7HIzgTTk6Ug9tvAtajNdiXQ0JYG13U4oz1XBvtzjsX1DOi-xNIOcdYewXXSzkdmub1UEewWRGAOCn5DAKXgTxnav4y6eKSbVGDNTP_7JTbR3e0F" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                          <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmP2Ddyys5JUWeEqYaGdVnHaZ0c0DqN2Il7wJZn31gPtjg3Ii8-fD3zRFg5uiNFbefU7w6qs9vBZ-ZDsRoJFtm_CwjwGdCRgdvXWNoL7eXxJkVi3_R32ij4dVH6UokmoZRVXKCTiActoKSqsq4wxvPCfUKEQYv4Xwdpi5bCIC7N1L5P-7drGhe8dM2xk_W1r-QAr3VziWXTE9ZciH1K0_xepCE5reqK8WjqL7cmLM9kcg_G1HV0dncql9g8XN6QVmVlai8pdO4OQDw" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">+1.2k Students riding today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── HOW IT WORKS ─────────── */}
        <section className="py-20 bg-white dark:bg-surface-dark" id="how-it-works">
          <div className="px-6 md:px-20 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">How it Works</h2>
              <p className="text-slate-600 dark:text-slate-400">Your journey starts here in three simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl">search</span>
                </div>
                <h3 className="text-xl font-bold">1. Find or Offer</h3>
                <p className="text-slate-600 dark:text-slate-400">Search for a ride to your destination or list your car to share the journey.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-light flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl">chat_bubble</span>
                </div>
                <h3 className="text-xl font-bold">2. Connect</h3>
                <p className="text-slate-600 dark:text-slate-400">Chat with verified students, confirm details, and agree on a pickup point.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                </div>
                <h3 className="text-xl font-bold">3. Ride &amp; Save</h3>
                <p className="text-slate-600 dark:text-slate-400">Split fuel costs easily. Rides start as low as ₹50 per journey!</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── BENEFITS ─────────── */}
        <section className="py-20" id="benefits">
          <div className="px-6 md:px-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Images Grid */}
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-2xl bg-secondary overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="Student studying with friends in coffee shop"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIhIDxl92fz9UEb9LXtA-m-3eubZlZKYMEYbXRCiGeqzHczLiEosMjYKUeZn6KUjuc-7Nd5GVdNYo3WBsqU_ej0n8FfbYEE3B30z15TeHlTjVbmHGNAhTRg8pGnZySYzKVPkUCjkR9lbnTQHDTDSQPpdkgmgORn9sz_ZX0c8RtJ6qbOQm9E978YxFFUMpcF2C33_fejk2I5N83qX9vrQ1HBmeMQRgrgS4es5Z5b7iBwz4ONugUt1Lu722PnwaFuJ7prQP64g3mdHhV"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl bg-primary mt-8 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="Two students walking on campus and laughing"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4hY0ZfN2OV5JdKITIgIyoTt_RY9m5RFtwpVHGiLV1aRciaughhv7OWjIim9j4dhI6wzGq_wCQuJbo8jRVCcGzeEXgdRGbInZe0Ddun_3CVV6yCtn0GQ_t_faLrdKa_xmWKLQnUpdtosy_kPgncZvqr9bZniidtfmq010AeBaf5hjZfSKlsMrD17kbG2s3N9ApKB8RQDZqFezs51hdy4Xn6AIjUHRc3ZOR0mvqt5ESqb6v5Hz-kJgsZ0s7rWG51nAD6vyfi8WT2XS6"
                    />
                  </div>
                </div>
              </div>

              {/* Benefits Content */}
              <div className="w-full md:w-1/2 flex flex-col gap-8">
                <h2 className="text-4xl font-black leading-tight">
                  Student-First <span className="text-secondary">Benefits</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">verified_user</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Campus Verified</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Every user is verified using their university email ID for maximum safety.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 text-secondary dark:text-secondary-light flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">savings</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Save Money</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Save up to 80% on travel costs compared to traditional taxis or bus rides.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">eco</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Eco Friendly</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Reduce your carbon footprint by filling empty seats and cutting campus traffic.</p>
                    </div>
                  </div>
                </div>
                <button className="w-fit bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all cursor-pointer">
                  Join the Community
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────── CTA SECTION ─────────── */}
        <section className="py-20 bg-primary/5 dark:bg-primary/10">
          <div className="px-6 md:px-20 max-w-7xl mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to start saving on your daily commute?</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">Join thousands of students who are already sharing rides and making campus travel smarter.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer">
                  Download for iOS
                </button>
                <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:scale-[1.02] transition-transform cursor-pointer">
                  Download for Android
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700 py-12">
        <div className="px-6 md:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-primary mb-6">
                <div className="w-6 h-6 flex items-center justify-center bg-primary rounded text-white">
                  <span className="material-symbols-outlined text-sm">directions_car</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">ShareMyRide</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Making campus travel smarter, safer, and more affordable for students across India.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Safety Rules</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Social</h4>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined">share</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined">group</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p>© 2024 ShareMyRide Technologies. All rights reserved. Pricing in ₹ (INR).</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
