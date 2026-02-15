"use client";
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Loader2, ShieldAlert, Recycle, Info, Download, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        const fetchResults = async () => {
            try {
                const res = await api.get('/devices');
                setDevices(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [user]);

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-12 w-12 text-green-600" /></div>;
    if (!user) return null;

    const latest = devices[0];

    if (!latest) {
        return (
            <div className="min-h-screen pt-32 text-center px-4">
                <ShieldCheck className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Recent Scans Found</h1>
                <p className="text-gray-600 mb-8">Start by scanning your first electronic device.</p>
                <Link href="/scan" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                    Go to Scan
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/scan" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowRight className="h-4 w-4" /> Back to Scanner
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Result Card */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image & Header */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            {latest.imageUrl && (
                                <div className="relative w-full h-64 bg-gray-100">
                                    <img 
                                        src={latest.imageUrl} 
                                        alt={latest.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop';
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button 
                                            onClick={() => window.print()}
                                            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                                            title="Download/Print"
                                        >
                                            <Download className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <button 
                                            onClick={() => navigator.share?.({ title: `${latest.name} Scan Results`, text: `Scan results for ${latest.name}: ${latest.classificationResults}` })}
                                            className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-900">{latest.name}</h1>
                                        <p className="text-gray-500 text-lg mt-2">{latest.category}</p>
                                    </div>
                                    <div className={cn(
                                        "px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider",
                                        latest.hazardLevel === 'High' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                    )}>
                                        {latest.hazardLevel} Hazard
                                    </div>
                                </div>

                                {/* Hazard Level Indicator */}
                                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-gray-700">Hazard Level</p>
                                        <p className="text-sm font-semibold text-gray-700">{latest.hazardLevel === 'High' ? '80%' : '20%'}</p>
                                    </div>
                                    <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full rounded-full transition-all",
                                                latest.hazardLevel === 'High' ? "bg-gradient-to-r from-red-400 to-red-600 w-4/5" : "bg-gradient-to-r from-green-400 to-green-600 w-1/5"
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-3" />
                                <p className="text-2xl font-bold text-gray-900">2.5 kg</p>
                                <p className="text-xs text-gray-600 mt-1">CO₂ Saved</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                                <Recycle className="h-6 w-6 text-blue-600 mx-auto mb-3" />
                                <p className="text-2xl font-bold text-gray-900">100%</p>
                                <p className="text-xs text-gray-600 mt-1">Recyclable</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                                <ShieldCheck className="h-6 w-6 text-amber-600 mx-auto mb-3" />
                                <p className="text-2xl font-bold text-gray-900">Safe</p>
                                <p className="text-xs text-gray-600 mt-1">To Recycle</p>
                            </div>
                        </div>

                        {/* Hazard Details & Recycling */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                    <ShieldAlert className="h-6 w-6 text-amber-600" /> Hazard Details
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base">{latest.classificationResults}</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                                    <Recycle className="h-6 w-6 text-green-600" /> Recycling & Handling Steps
                                </h3>
                                <ul className="space-y-4">
                                    {latest.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                </div>
                                            </div>
                                            <p className="text-gray-700 font-medium">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Tips */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-green-900 to-green-800 text-white rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Info className="h-6 w-6 text-green-300" /> Environmental Impact
                            </h3>
                            <div className="space-y-6 text-green-100">
                                <div>
                                    <p className="text-sm opacity-90 mb-2">Did you know?</p>
                                    <p className="text-green-50 font-medium leading-relaxed">Recycling one million laptops saves the energy equivalent to power 3,500 homes for a year.</p>
                                </div>
                                <div className="pt-6 border-t border-green-700">
                                    <h4 className="font-bold text-green-50 mb-3">🌿 Sustainable Choice</h4>
                                    <p className="text-sm leading-relaxed">Consider repairing or donating if the device is still functional. Refurbishment extends device lifespan and reduces e-waste.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <Link href="/map" className="block group">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-lg">Find a Center</h3>
                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">Locate verified e-waste recycling centers near you that can safely handle {latest.name}.</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-green-600 font-semibold">View nearby centers →</p>
                                </div>
                            </Link>
                        </div>

                        <Link href="/scan" className="block bg-green-600 text-white rounded-3xl p-6 text-center font-bold hover:bg-green-700 transition-colors shadow-lg">
                            Scan Another Device
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
