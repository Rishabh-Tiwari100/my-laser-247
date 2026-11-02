import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PaymentGatewayOption } from '@/types/account';

interface PaymentGatewayModalProps {
  open: boolean;
  gateways: PaymentGatewayOption[];
  title: string;
  onSelect: (gateway: PaymentGatewayOption) => void;
  onClose: () => void;
}

function PaymentGatewayModal({
  open,
  gateways,
  title,
  onSelect,
  onClose,
}: PaymentGatewayModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-[360px] gap-3 rounded-[6px] bg-white p-4 text-black">
        <DialogHeader>
          <DialogTitle className="text-left text-[16px]">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {gateways.map((gateway) => (
            <button
              key={gateway.id}
              type="button"
              onClick={() => onSelect(gateway)}
              className="flex min-h-[44px] items-center justify-between rounded-[5px] border border-[#999] px-3 text-left text-[13px] hover:border-[#243a48] hover:bg-[#f4f7f9]"
            >
              <span className="font-semibold">{gateway.name}</span>
              <span className="rounded-[3px] bg-[#243a48] px-2 py-1 text-[10px] font-bold uppercase text-white">
                {gateway.type}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentGatewayModal;
