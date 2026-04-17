import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      job: { include: { service: true } }
    }
  });

  if (!order || (order.userId !== (session.user as any).id && (session.user as any).role !== "ADMIN")) {
    notFound();
  }

  const { amount, discount, total } = order;
  const subtotal = order.job.service.basePrice;
  const priorityFee = Math.max(0, amount - subtotal);

  return (
    <div className="bg-white min-h-screen text-black p-8 sm:p-20 font-sans">
      <div className="max-w-3xl mx-auto border border-gray-200 p-12 shadow-sm rounded-sm relative overflow-hidden">
        {/* Anti-fraud background watermark */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center rotate-[-30deg]" style={{ fontSize: "10rem", fontWeight: 900 }}>
          CERTIFIED
        </div>

        <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
           <div className="flex-col">
              <h1 className="text-3xl font-black tracking-tighter mb-1">INVOICE</h1>
              <div className="text-gray-500 font-mono text-sm">REF: {order.reference || order.id.slice(0, 8).toUpperCase()}</div>
              <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                 <ShieldCheck size={14} /> Legally Verified Payment
              </div>
           </div>
           <div className="text-right">
              <h2 className="font-bold text-lg">AI Computer Centre</h2>
              <div className="text-sm text-gray-500">Fast. Accurate. Intelligent.</div>
              <div className="text-xs text-gray-400 mt-2">receipts@aicomputercentre.com</div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
           <div>
              <div className="text-xs font-bold text-gray-400 uppercase mb-2">Billed To</div>
              <div className="font-bold">{order.user.name}</div>
              <div className="text-sm text-gray-600">{order.user.email}</div>
           </div>
           <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase mb-2">Issue Date</div>
              <div className="font-bold">{new Date(order.createdAt).toLocaleDateString("en-NG", { dateStyle: "long" })}</div>
           </div>
        </div>

        <table className="w-full mb-12 border-collapse">
           <thead>
              <tr className="border-b-2 border-black">
                 <th className="text-left py-4 text-xs font-bold uppercase">Description</th>
                 <th className="text-right py-4 text-xs font-bold uppercase">Processing</th>
                 <th className="text-right py-4 text-xs font-bold uppercase">Amount</th>
              </tr>
           </thead>
           <tbody>
              <tr className="border-b border-gray-100">
                 <td className="py-6">
                    <div className="font-bold">{order.job.service.name}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">{order.job.title}</div>
                 </td>
                 <td className="text-right text-sm">
                    {order.job.priority === "EXPRESS" ? "Express (Priority)" : "Standard"}
                 </td>
                 <td className="text-right font-bold">₦{subtotal?.toLocaleString()}</td>
              </tr>
              {priorityFee > 0 && (
                <tr className="border-b border-gray-500 border-dashed">
                  <td className="py-2 text-sm text-gray-500">Service Priority Surcharge</td>
                  <td></td>
                  <td className="text-right text-sm">+ ₦{priorityFee.toLocaleString()}</td>
                </tr>
              )}
              {discount > 0 && (
                <tr className="border-b border-gray-100">
                  <td className="py-2 text-sm text-green-600">Promotional Discount</td>
                  <td></td>
                  <td className="text-right text-sm text-green-600">- ₦{discount.toLocaleString()}</td>
                </tr>
              )}
           </tbody>
        </table>

        <div className="flex justify-end">
           <div className="w-64">
              <div className="flex justify-between py-2 text-gray-500">
                 <span>Subtotal</span>
                 <span>₦{(subtotal + priorityFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-black font-black text-xl">
                 <span>TOTAL PAID</span>
                 <span>₦{total.toLocaleString()}</span>
              </div>
           </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 text-[10px] text-gray-400 leading-relaxed">
           <p className="mb-2"><strong>Academic Disclosure:</strong> This invoice confirms payment for professional drafting assistance. All work provided by the AI Computer Centre is subject to our Academic Integrity Policy. AI usage has been disclosed where applicable.</p>
           <p>This is a computer-generated document. No physical signature is required for validity. <strong>Thank you for choosing AI excellence.</strong></p>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 print:hidden bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-gray-100">
         <Link href="/dashboard" className="btn btn-ghost border border-gray-200 flex items-center gap-2">
            <ArrowLeft size={16} /> Dashboard
         </Link>
         <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2 shadow-lg">
            <Printer size={16} /> Print Receipt
         </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .max-w-3xl { border: none !important; box-shadow: none !important; width: 100% !important; max-width: none !important; }
        }
      `}} />
    </div>
  );
}
