import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "@/src/pages/client/Home";
import { ServiceDetails } from "@/src/pages/client/ServiceDetails";
import { Bookings } from "@/src/pages/client/Bookings";
import { OwnerDashboard } from "@/src/pages/owner/Dashboard";
import { AdminDashboard } from "@/src/pages/admin/Dashboard";

export default function App() {
  // For MVP, we're mocking the role. In a real app, this would come from Auth context.
  // Change this to "owner" or "admin" to see different dashboards.
  const currentRole = "client";

  return (
    <Router>
      <div className="font-sans antialiased text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 min-h-screen relative overflow-hidden">
        {/* Ambient Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/profile" element={<div className="p-8 text-center text-slate-400 mt-20 glass-panel rounded-3xl mx-4">صفحة حسابي ✌️ (قريباً)</div>} />

            {/* Owner Routes */}
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/bookings" element={<div className="p-8 text-center text-slate-400 mt-20 glass-panel rounded-3xl mx-4">إدارة المواعيد 📅 (قريباً)</div>} />
            <Route path="/owner/settings" element={<div className="p-8 text-center text-slate-400 mt-20 glass-panel rounded-3xl mx-4">إعدادات الحساب ⚙️ (قريباً)</div>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<div className="p-8 text-center text-slate-400 mt-20 glass-panel rounded-3xl mx-4">إدارة المستخدمين 👥 (قريباً)</div>} />
            <Route path="/admin/services" element={<div className="p-8 text-center text-slate-400 mt-20 glass-panel rounded-3xl mx-4">إدارة الخدمات 🏢 (قريباً)</div>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
