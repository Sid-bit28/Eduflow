import TextAnimationHeading from '@/components/TextAnimationHeading';

export default function AuthLayout({ children }) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen max-h-screen h-full">
      <div className="hidden lg:flex flex-col p-10 bg-primary-100/10">
        <div className="flex items-center"></div>
        <div className="h-full flex flex-col justify-center">
          <TextAnimationHeading className="flex-row mx-0 lg:gap-2" />
        </div>
      </div>

      <div className="h-full flex flex-col mt-14 lg:mt-0 lg:justify-center px-4 lg:p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
