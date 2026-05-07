import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const LoadingModal = ({ text }: { text: string }) => {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogTitle className="opacity-0">Status Loading</DialogTitle>
      <DialogContent className="flex flex-col items-center justify-center sm:max-w-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">{text}</p>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
