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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 50)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        className="h-screen overflow-hidden flex"
      >
        <AppSidebar currentPath={path} variant="inset">
          <AppSidebarItem to="/" title="Home" currentPath={path} />
        </AppSidebar>

        <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden">
          <AppHeader />

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
