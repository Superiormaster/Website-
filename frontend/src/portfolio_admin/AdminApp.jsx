import { Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Projects from "../pages/Projects"
import Messages from "../pages/Messages"
import ProtectedRoute from "./ProtectedRoute"
import Apps from "../pages/Apps"
import Settings from "../pages/Settings"
import { UserProvider } from "./UserContext"

export default function AdminApp() {
  return (
    <UserProvider>
        <div className='bg-gray-900 w-full overflow-hidden transition-opacity duration-700 min-h-screen text-gray-500'>
          <div className='bg-gray-900 text-white'>
            <div className="w-full xl:max-w-[1280px]">
              <Routes>
                {/* PUBLIC */}
                <Route path="/login" element={<Login />} />
  
                {/* PROTECTED */}
                <Route
                  path=""
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/apps"
                  element={
                    <ProtectedRoute>
                      <Apps />
                    </ProtectedRoute>
                  }
                />
        
              <Route
                path="/settings"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
        
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
        
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </div>
        </div>
    </UserProvider>
  );
}