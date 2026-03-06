import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';

export function Account() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            setUser(user);

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // Fetch orders
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setOrders(ordersData || []);
            setLoading(false);
        };

        getProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[var(--color-rojo)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--color-rojo)] mb-2">My Account</h1>
                    <p className="text-[var(--color-rojo)]/60">Welcome back, {profile?.full_name || user?.email}</p>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="rounded-xl border-[var(--color-rojo)]/20 text-[var(--color-rojo)] hover:bg-[var(--color-rojo)]/5 flex items-center gap-2"
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white/50 p-6 rounded-3xl border border-[var(--color-rojo)]/10">
                        <div className="flex items-center gap-3 mb-6 text-[var(--color-rojo)]">
                            <User size={24} />
                            <h2 className="text-xl font-bold">Profile Details</h2>
                        </div>
                        <div className="space-y-4 text-[var(--color-rojo)]/80">
                            <div>
                                <label className="text-xs uppercase font-bold opacity-40 block mb-1">Full Name</label>
                                <p className="font-medium text-lg">{profile?.full_name || 'Not set'}</p>
                            </div>
                            <div>
                                <label className="text-xs uppercase font-bold opacity-40 block mb-1">Email</label>
                                <p className="font-medium text-lg">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3 text-[var(--color-rojo)]">
                        <Package size={24} />
                        <h2 className="text-2xl font-bold">Order History</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white/50 p-12 rounded-3xl border border-dashed border-[var(--color-rojo)]/20 text-center">
                            <p className="text-[var(--color-rojo)]/60 text-lg mb-6">You haven't placed any orders yet.</p>
                            <Button
                                onClick={() => navigate('/shop')}
                                className="bg-[var(--color-rojo)] text-white hover:bg-[var(--color-rojo)]/90 px-8 rounded-xl h-12"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white/50 p-6 rounded-3xl border border-[var(--color-rojo)]/10 hover:border-[var(--color-rojo)]/30 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-[var(--color-rojo)]/5">
                                        <div>
                                            <p className="text-xs uppercase font-bold opacity-40 mb-1">Order Date</p>
                                            <p className="text-[var(--color-rojo)] font-medium">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold opacity-40 mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'pending_cod' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status === 'pending_cod' ? 'Cash on Delivery' : order.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase font-bold opacity-40 mb-1">
                                                {order.status === 'pending_cod' ? 'Total to Pay' : 'Total Paid'}
                                            </p>
                                            <p className="text-[var(--color-rojo)] font-bold text-lg">{order.total_amount} INR</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="text-[var(--color-rojo)]/80">
                                                    {item.product.title} <span className="opacity-50 mx-1">×</span> {item.quantity}
                                                </span>
                                                <span className="font-medium text-[var(--color-rojo)]">{item.product.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
