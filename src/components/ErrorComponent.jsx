import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      <h2 className="h2-bold text-red-500">Oops! Something went wrong.</h2>
      <p className="text-dark500_light700 body-medium">{error.message}</p>

      <div className="flex gap-4">
        <Link href={ROUTES.HOME}>
          <Button className="bg-primary-500/80 hover:bg-primary-500 cursor-pointer">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorComponent;
