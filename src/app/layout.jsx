import { ThemeProvider } from '@/context/ThemeProvider';
import './globals.css';
import Provider from '@/Provider/Provider';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'EduFlow: A one stop solution for all developers.',
  description:
    'A community where everyone helps each others. Developers seek out for help, suggestions and advice. Eduflow: A one stop solution for all developers',
  icons: {
    icon: '/images/site-logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={''}>
        <ThemeProvider>
          <Provider>{children}</Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
