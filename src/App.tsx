import { Routes, Route, useLocation } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar"
import { AppSidebar } from "./components/sidebar/app-sidebar"
import { AppHeader } from "./components/sidebar/app-header"
import { AppSidebarItem } from "./components/sidebar/sidebar-item"
import { ThemeProvider } from "./components/theme/theme-provider"
import { Toaster } from "sonner"
import HomePage from "./pages/HomePage"

function App() {
  const location = useLocation()
  const path = location.pathname

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider className="h-screen flex overflow-hidden">
        <AppSidebar currentPath={path} variant="inset">
          <AppSidebarItem to="/" title="Home" currentPath={path} />
        </AppSidebar>

        <SidebarInset className="flex flex-col flex-1 h-screen">
          <AppHeader />

          {/* Scrollable content */}
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
            <Toaster />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
