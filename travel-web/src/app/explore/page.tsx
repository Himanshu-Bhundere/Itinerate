import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function ExplorePage() {
  const { data: plans } = await supabase
    .from('plans')
    .select('*, profiles(display_name)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link href="/" className="text-blue-600 font-medium hover:underline mb-4 inline-block">&larr; Back to Home</Link>
          <h1 className="text-4xl font-extrabold text-slate-900">Explore Itineraries</h1>
          <p className="text-xl text-slate-600 mt-2">Find inspiration for your next trip.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans?.map((plan) => (
            <Link href={`/plan/${plan.slug || plan.id}`} key={plan.id} className="group">
              <div className="bg-white rounded-xl p-5 h-full shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg transition duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">{plan.title}</h3>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded-md mb-2">
                    {plan.location}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{plan.description}</p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400">{plan.profiles?.display_name || 'Traveler'}</span>
                  <span className="text-xs font-bold text-slate-600">{plan.duration_days} Days</span>
                </div>
              </div>
            </Link>
          ))}
          
          {(!plans || plans.length === 0) && (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No plans found. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
