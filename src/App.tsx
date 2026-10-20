import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import { InvitationPreviewPage } from './pages/InvitationPreviewPage';
import { OrderPage } from './pages/OrderPage';

import { WeddingDashboardPage } from './pages/WeddingDashboardPage';
import { InvitationEditorPage } from './pages/InvitationEditorPage';
import { AuthProvider } from './lib/authContext';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  // Simple client-side router with window history support
  const navigateTo = (fullPath: string) => {
    const [path, search] = fullPath.split('?');
    setCurrentPath(path || '/');
    setQueryParams(new URLSearchParams(search || ''));
    window.history.pushState({}, '', fullPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial sync with browser URL
    const syncFromUrl = () => {
      const pathname = window.location.pathname || '/';
      const search = window.location.search || '';
      setCurrentPath(pathname);
      setQueryParams(new URLSearchParams(search));
    };

    syncFromUrl();

    const handlePopState = () => {
      syncFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Router dispatcher
  const renderCurrentView = () => {
    if (currentPath.startsWith('/editor/')) {
      const projectId = currentPath.replace('/editor/', '') || 'proj-1';
      const templateParam = queryParams.get('template') as any;
      return (
        <InvitationEditorPage
          projectId={projectId}
          initialTemplateId={templateParam}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath === '/order') {
      const templateParam = queryParams.get('template') || 'editorial-romance';
      return <OrderPage initialTemplateId={templateParam} onNavigate={navigateTo} />;
    }

    if (currentPath === '/dashboard') {
      return <WeddingDashboardPage onNavigate={navigateTo} />;
    }

    if (currentPath.startsWith('/wedding/') || currentPath.startsWith('/invitation/')) {
      const slug = currentPath.startsWith('/wedding/')
        ? currentPath.replace('/wedding/', '')
        : currentPath.replace('/invitation/', '');
      const initialTemplate = queryParams.get('template') || 'editorial-romance';
      const guestName = queryParams.get('to') || queryParams.get('guest') || queryParams.get('name') || undefined;
      return (
        <InvitationPreviewPage
          onNavigate={navigateTo}
          selectedTemplateId={initialTemplate}
          guestNameParam={guestName}
          slug={slug}
        />
      );
    }

    if (currentPath === '/templates') {
      const selectedId = queryParams.get('selected') || 'editorial-romance';
      return (
        <TemplateGalleryPage
          onNavigate={navigateTo}
          initialSelectedId={selectedId}
        />
      );
    }

    // Default to Landing Page
    return <LandingPage onNavigate={navigateTo} />;
  };

  return (
    <AuthProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--color-warm-white)',
        }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar currentPath={currentPath} onNavigate={navigateTo} />
        <main id="main-content" tabIndex={-1} style={{ flex: 1, outline: 'none' }}>
          {renderCurrentView()}
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
    </AuthProvider>
  );
};

export default App;
