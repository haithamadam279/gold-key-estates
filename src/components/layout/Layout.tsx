import { forwardRef, ReactNode } from 'react';
import EnterpriseNavbar from '@/components/navigation/EnterpriseNavbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, showFooter = true }, ref) => {
    return (
      <div ref={ref} className="min-h-screen flex flex-col">
        <EnterpriseNavbar />
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    );
  }
);

Layout.displayName = 'Layout';

export default Layout;
