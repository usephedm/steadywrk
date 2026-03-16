import type { WorkOrder, Dispatch, Account } from '../core/types.js';

export interface Invoice {
  id: string;
  workOrderId: string;
  accountId: string;
  technicianId: string;
  amount: number;
  description: string;
  lineItems: InvoiceLineItem[];
  status: 'draft' | 'submitted' | 'paid';
  createdAt: string;
  submittedAt: string | null;
  paidAt: string | null;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function generateInvoice(
  workOrder: WorkOrder,
  dispatch: Dispatch,
  account: Account,
): Invoice {
  const id = `INV-${account.id.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const lineItems: InvoiceLineItem[] = [
    {
      description: `${workOrder.tradeType} service — ${workOrder.title}`,
      quantity: 1,
      unitPrice: dispatch.payAmount,
      total: dispatch.payAmount,
    },
  ];

  return {
    id,
    workOrderId: workOrder.id,
    accountId: account.id,
    technicianId: dispatch.technicianId,
    amount: dispatch.payAmount,
    description: `${workOrder.tradeType} work order at ${workOrder.location.address}`,
    lineItems,
    status: 'draft',
    createdAt: new Date().toISOString(),
    submittedAt: null,
    paidAt: null,
  };
}

export function formatInvoiceForDMGPro(invoice: Invoice, account: Account): string {
  const lines = [
    `Invoice: ${invoice.id}`,
    `Company: ${account.companyName}`,
    `Date: ${invoice.createdAt.split('T')[0]}`,
    ``,
    `Work Performed:`,
    ...invoice.lineItems.map(
      (item) => `  ${item.description} — $${item.total.toFixed(2)}`
    ),
    ``,
    `Total: $${invoice.amount.toFixed(2)}`,
    ``,
    `Payment Terms: NET55`,
  ];
  return lines.join('\n');
}
