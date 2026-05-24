import prisma from '@/lib/prisma';
import CustomersTableClient from '@/components/admin/CustomersTableClient';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'user' },
    include: {
      orders: {
        select: {
          totalAmount: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
        <p className="text-slate-500 mt-1">Know your highest value buyers and their recent activity.</p>
      </div>
      <CustomersTableClient customers={customers} />
    </div>
  );
}
