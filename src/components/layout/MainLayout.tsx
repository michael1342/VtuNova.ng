import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./topbar";
import BottomNav from "./bottomNav";

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="main-layout flex h-dvh min-h-dvh flex-col bg-bg-dark-secondary overflow-hidden transition-colors duration-200 lg:flex-row">
      {/* Sidebar Overlay Backdrop for Mobile (stops at top of bottom nav, overlaps page content) */}
      {mobileMenuOpen && (
        <div
          className="fixed top-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer (stops height at top of bottom nav, z-50 overlaps coming soon) */}
      <aside className={`main-layout__sidebar shrink-0 md:text-[16px] sm:scrollbar-thin sm:scrollbar-track-transparent sm:scrollbar-thumb-gray-400
        fixed top-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 z-50 w-56 lg:static lg:h-full lg:bottom-auto transition-transform duration-300 ease-in-out bg-bg-dark-secondary 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setMobileMenuOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20 lg:pb-0">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
