import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="grid h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner />
        <h3 className="text-lg font-medium">Loading Saved Questions...</h3>
      </div>
    </div>
  );
}
