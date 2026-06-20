import { Spinner } from "../ui/spinner";

export function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}
