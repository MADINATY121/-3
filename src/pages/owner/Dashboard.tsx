import { useState, useEffect } from "react";
import { TopBar } from "@/src/components/layout/TopBar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { CheckCircle2, XCircle, Clock, Calendar, TrendingUp, Users } from "lucide-react";
import type { Booking, Service } from "@/src/types";

export function OwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Mock owner ID = 2
    fetch("/api/bookings/owner/2")
      .then((res) => res.json())
      .then(setBookings);
    
    fetch("/api/services")
      .then((res) => res.json())
      .then((all) => setServices(all.filter((s: Service) => s.ownerId === "2")));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
  };

  const pendingBookings = bookings.filter(b => b.status === "pending");
  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="لوحة التحكم 🚀" />
      
      <main className="px-5 pt-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 bg-gradient-brand border-none shadow-lg shadow-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white/90">حجوزات اليوم</p>
            </div>
            <p className="text-4xl font-black text-white">{todayBookings.length}</p>
          </Card>
          <Card className="p-5 border-orange-500/30 bg-orange-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-orange-400">بانتظار التأكيد</p>
            </div>
            <p className="text-4xl font-black text-orange-400">{pendingBookings.length}</p>
          </Card>
        </div>

        {/* Pending Approvals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">طلبات جديدة 🔥</h2>
          </div>
          
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <Card key={booking.id} className="p-5 border-l-4 border-l-orange-500 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{booking.client?.name || "عميل جديد"}</h3>
                    <p className="text-sm text-slate-400 mt-1">{booking.service?.name}</p>
                  </div>
                  <div className="text-left bg-slate-800/50 px-3 py-2 rounded-xl">
                    <p className="text-base font-bold text-orange-400">{booking.time}</p>
                    <p className="text-xs text-slate-400">{booking.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-5">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20" 
                    onClick={() => updateStatus(booking.id, "confirmed")}
                  >
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                    تأكيد
                  </Button>
                  <Button 
                    variant="glass" 
                    className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => updateStatus(booking.id, "cancelled")}
                  >
                    <XCircle className="w-5 h-5 ml-2" />
                    رفض
                  </Button>
                </div>
              </Card>
            ))}

            {pendingBookings.length === 0 && (
              <div className="text-center py-12 glass-panel rounded-3xl border-white/5">
                <div className="text-4xl mb-3">😴</div>
                <p className="text-slate-400 font-medium">مافي طلبات جديدة حالياً</p>
              </div>
            )}
          </div>
        </section>

        {/* My Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">خدماتي 🏢</h2>
            <Button variant="glass" size="sm" className="text-purple-400">+ إضافة</Button>
          </div>
          
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="p-4 flex gap-4 items-center border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">{service.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg"><TrendingUp className="w-3.5 h-3.5 text-green-400" /> {service.rating}</span>
                    <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg"><Users className="w-3.5 h-3.5 text-blue-400" /> {service.reviewsCount} تقييم</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <MobileNav role="owner" />
    </div>
  );
}
