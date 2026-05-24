import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function AnalyticsPage() {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 29);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      totalAmount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const items = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: startDate } },
    },
    include: {
      product: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  });

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const statusCounts = STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, {});

  const dailyTotalsMap = new Map();
  orders.forEach((order) => {
    const dayKey = new Date(order.createdAt).toISOString().slice(0, 10);
    const current = dailyTotalsMap.get(dayKey) || 0;
    dailyTotalsMap.set(dayKey, current + order.totalAmount);
  });

  const dailyTotals = Array.from(dailyTotalsMap.entries()).map(([date, total]) => ({ date, total }));
  const maxDailyTotal = dailyTotals.reduce((max, entry) => Math.max(max, entry.total), 0);
  const chartPoints = dailyTotals
    .map((entry, index) => {
      const x = dailyTotals.length === 1 ? 0 : (index / (dailyTotals.length - 1)) * 100;
      const y = maxDailyTotal ? 100 - (entry.total / maxDailyTotal) * 100 : 100;
      return `${x},${y}`;
    })
    .join(' ');

  const productMap = new Map();
  items.forEach((item) => {
    const existing = productMap.get(item.productId) || {
      name: item.product?.name || 'Unknown',
      category: item.product?.category || 'Uncategorized',
      quantity: 0,
      revenue: 0,
    };

    existing.quantity += item.quantity;
    existing.revenue += item.price * item.quantity;
    productMap.set(item.productId, existing);
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 mt-1">Insights for the last 30 days.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Revenue</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{currency.format(totalRevenue)}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Orders</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{totalOrders}</p>
        </div>
        <div className="rounded-[2rem] glass-panel p-6 shadow-xl shadow-teal-500/10 border border-amber-200/60">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Avg Order</p>
          <p className="mt-3 text-2xl font-black text-slate-900">{currency.format(averageOrder)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
          <div className="px-8 py-6 border-b border-amber-200/60 bg-amber-100/40">
            <h2 className="text-xl font-bold text-slate-900">Daily Revenue</h2>
          </div>
          <div className="px-8 py-6 space-y-6">
            {dailyTotals.length === 0 ? (
              <p className="text-sm text-slate-400">No data in the last 30 days.</p>
            ) : (
              <>
                <div className="w-full h-48">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="revenueStroke" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                      <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#revenueStroke)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartPoints}
                    />
                    <polygon
                      fill="url(#revenueFill)"
                      points={`0,100 ${chartPoints} 100,100`}
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  {dailyTotals.map((entry) => (
                    <div key={entry.date} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>{entry.date}</span>
                        <span>{currency.format(entry.total)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-amber-100/60">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${maxDailyTotal ? (entry.total / maxDailyTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
          <div className="px-8 py-6 border-b border-amber-200/60 bg-amber-100/40">
            <h2 className="text-xl font-bold text-slate-900">Top Products</h2>
          </div>
          <div className="px-8 py-6 space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-400">No product data yet.</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{currency.format(product.revenue)}</p>
                    <p className="text-xs text-slate-400">{product.quantity} sold</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {STATUSES.map((status) => {
          const maxStatusCount = Math.max(...Object.values(statusCounts));
          const percent = maxStatusCount ? (statusCounts[status] / maxStatusCount) * 100 : 0;
          return (
            <div key={status} className="rounded-[2rem] glass-panel p-5 shadow-xl shadow-teal-500/10 border border-amber-200/60 space-y-3">
              <div className={`label ${status === 'delivered'
                ? 'label-emerald'
                : status === 'processing' || status === 'shipped'
                  ? 'label-teal'
                  : status === 'pending'
                    ? 'label-amber'
                    : 'label-rose'
                }`}>{status}</div>
              <p className="text-xl font-black text-slate-900">{statusCounts[status]}</p>
              <div className="h-2 w-full rounded-full bg-amber-100/60">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
