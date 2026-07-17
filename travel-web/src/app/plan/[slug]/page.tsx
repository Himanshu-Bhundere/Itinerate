import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

export default async function PlanDetailPage({ params }: { params: { slug: string } }) {
  // Try to find the plan by slug or by id
  const { data: plan } = await supabase
    .from('plans')
    .select('*, profiles(display_name)')
    .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
    .single();

  if (!plan) {
    notFound();
  }

  // Fetch the places
  const { data: places } = await supabase
    .from('plan_places')
    .select('*, places(*)')
    .eq('plan_id', plan.id)
    .order('day_number', { ascending: true })
    .order('sort_order', { ascending: true });

  const typedPlaces = places as any[];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">Itinerate</Link>
            <Link href="/explore" className="text-slate-600 font-medium">Explore</Link>
          </div>
        </div>
      </nav>

      {/* Plan Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{plan.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wide">
              {plan.location}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm uppercase tracking-wide">
              {plan.duration_days} Days
            </span>
            <span className="text-slate-500 font-medium text-sm">
              Created by <span className="text-slate-900 font-bold">{plan.profiles?.display_name || 'Traveler'}</span>
            </span>
          </div>
          {plan.description && (
            <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
              {plan.description}
            </p>
          )}
        </div>
      </header>

      {/* Main Content (Itinerary) */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-slate-900">The Itinerary</h2>
          <Link href="/download" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md">
            Save in App
          </Link>
        </div>

        {(!typedPlaces || typedPlaces.length === 0) ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-lg">No places have been added to this itinerary yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {typedPlaces.map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.places?.name}</h3>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{item.places?.category}</p>
                    {item.notes && (
                      <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
