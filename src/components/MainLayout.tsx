import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./topbar";

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="main-layout flex h-dvh min-h-dvh flex-col bg-bg-dark-secondary overflow-hidden transition-colors duration-200 lg:flex-row">
      {/* Sidebar Overlay Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`main-layout__sidebar shrink-0 md:text-[16px] sm:scrollbar-thin sm:scrollbar-track-transparent sm:scrollbar-thumb-gray-400
        fixed inset-y-0 left-0 z-30 w-56 lg:static transition-transform duration-300 ease-in-out bg-bg-dark-secondary 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
