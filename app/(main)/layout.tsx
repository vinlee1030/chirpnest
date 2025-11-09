import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import PostComposerModal from '@/components/PostComposerModal';
import NotificationToast from '@/components/NotificationToast';
import Providers from '../providers';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ThemeProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <main className="flex-1 max-w-3xl border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {children}
          </main>
          <RightSidebar />
          <PostComposerModal />
          <NotificationToast />
        </div>
      </ThemeProvider>
    </Providers>
  );
}

