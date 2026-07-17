import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch some public plans for the landing page
  const { data: plans } = await supabase
    .from('plans')
    .select('*, profiles(display_name)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Itinerate
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/explore" className="text-slate-600 hover:text-blue-600 font-medium">Explore</Link>
              <Link href="/download" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                Get the App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Plan trips that <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">actually happen.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Discover curated itineraries, organize your places, and share your adventures. Itinerate is your all-in-one travel companion.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/explore" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-lg">
            Start Exploring
          </Link>
          <Link href="/download" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition">
            Download App
          </Link>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Itineraries</h2>
              <p className="text-slate-600">Discover where the community is heading next.</p>
            </div>
            <Link href="/explore" className="text-blue-600 font-medium hover:underline">View all &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans?.map((plan) => (
              <Link href={`/plan/${plan.slug || plan.id}`} key={plan.id} className="group">
                <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-100 hover:border-blue-200 hover:shadow-xl transition duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">{plan.title}</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {plan.location}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-3">{plan.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-500">By {plan.profiles?.display_name || 'Traveler'}</span>
                    <span className="text-sm font-bold text-slate-700">{plan.duration_days} Days</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {(!plans || plans.length === 0) && (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No plans published yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-2xl font-bold text-white mb-6 block">Itinerate</span>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            The modern way to discover, plan, and share your travel experiences.
          </p>
          <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Itinerate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
