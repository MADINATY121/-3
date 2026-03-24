import { useState, useEffect } from "react";
import { TopBar } from "@/src/components/layout/TopBar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Users, Building2, CheckCircle2, AlertCircle, TrendingUp, ShieldAlert } from "lucide-react";
import type { Service, User } from "@/src/types";

export function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
    
    // Mock users fetch
    setUsers([
      { id: "1", name: "أحمد العميل", role: "client", phone: "0500000000" },
      { id: "2", name: "صالون الأناقة", role: "owner", phone: "0511111111" },
      { id: "3", name: "المدير العام", role: "admin", phone: "0522222222" },
    ]);
  }, []);

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="الإدارة العامة 👑" />
      
      <main className="px-5 pt-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 border-blue-500/30 bg-blue-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-blue-400">الأعضاء</p>
            </div>
            <p className="text-4xl font-black text-blue-400">{users.length}</p>
          </Card>
          <Card className="p-5 border-purple-500/30 bg-purple-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs font-bold text-purple-400">الخدمات</p>
            </div>
            <p className="text-4xl font-black text-purple-400">{services.length}</p>
          </Card>
        </div>

        {/* Pending Approvals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">طلبات انضمام جديدة 🔔</h2>
          </div>
          
          <div className="space-y-4">
            {/* Mock pending service */}
            <Card className="p-5 border-l-4 border-l-orange-500 border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">عيادة الابتسامة</h3>
                    <p className="text-xs text-slate-400 mt-1">عيادات طبية • الرياض</p>
                  </div>
                </div>
                <div className="bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold">
                  مراجعة
                </div>
              </div>
              
              <div className="flex gap-3 mt-5">
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                  موافقة
                </Button>
                <Button variant="glass" className="flex-1 text-slate-300">
                  <AlertCircle className="w-5 h-5 ml-2" />
                  تفاصيل
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">أحدث الخدمات 🌟</h2>
            <Button variant="glass" size="sm" className="text-purple-400">عرض الكل</Button>
          </div>
          
          <div className="grid gap-4">
            {services.slice(0, 3).map((service) => (
              <Card key={service.id} className="p-4 flex gap-4 items-center border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-1 rounded-md"><TrendingUp className="w-3.5 h-3.5" /> نشط</span>
                  </div>
                </div>
                <Button variant="glass" size="icon" className="rounded-full w-10 h-10">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <MobileNav role="admin" />
    </div>
  );
}
