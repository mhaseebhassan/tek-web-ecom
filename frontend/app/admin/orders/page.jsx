import prisma from '@/lib/prisma';
import OrdersTableClient from '@/components/admin/OrdersTableClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const processingCount = orders.filter((order) => order.status === 'processing').length;
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
        <p className="text-slate-500 mt-1">Track, update, and manage every purchase.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Revenue</p>
          <p className="mt-3 text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{pendingCount}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Processing</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{processingCount}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Delivered</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{deliveredCount}</p>
        </div>
      </div>

      <OrdersTableClient orders={orders} />
    </div>
  );
}
