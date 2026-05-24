import AdminProfileForm from '@/components/admin/AdminProfileForm';
import StoreSettingsForm from '@/components/admin/StoreSettingsForm';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.user.count({ where: { role: 'user' } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Update your admin profile and track store health.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Products</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalProducts}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Orders</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalOrders}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Customers</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalCustomers}</p>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-amber-200/60 bg-amber-100/40">
          <h2 className="text-xl font-bold text-slate-900">Admin Profile</h2>
        </div>
        <div className="px-8 py-8">
          <AdminProfileForm />
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-amber-200/60 bg-amber-100/40">
          <h2 className="text-xl font-bold text-slate-900">Store Settings</h2>
        </div>
        <div className="px-8 py-8">
          <StoreSettingsForm />
        </div>
      </div>
    </div>
  );
}
