import { useState, useEffect } from "react";
import { TopBar } from "@/src/components/layout/TopBar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Card } from "@/src/components/ui/Card";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Clock3, Sparkles } from "lucide-react";
import type { Booking } from "@/src/types";
import { format, parseISO } from "date-fns";

const statusConfig = {
  pending: { label: "بانتظار التأكيد", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", icon: Clock3 },
  confirmed: { label: "مؤكد", color: "text-green-400", bg: "bg-green-500/20 border-green-500/30", icon: CheckCircle2 },
  cancelled: { label: "ملغي", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30", icon: XCircle },
  completed: { label: "مكتمل", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30", icon: Sparkles },
};

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    fetch("/api/bookings/client/1") // Mock client ID
      .then((res) => res.json())
      .then(setBookings);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const isPast = new Date(b.date) < new Date() && b.status === "completed";
    return activeTab === "upcoming" ? !isPast : isPast;
  });

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="حجوزاتي 🗓️" />
      
      <main className="px-5 pt-6 space-y-6">
        {/* Tabs */}
        <div className="flex p-1.5 glass-panel rounded-2xl">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === "upcoming" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            القادمة
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === "past" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            السابقة
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            
            return (
              <Card key={booking.id} className="p-4 border-white/5 hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-800">
                      {booking.service?.image ? (
                        <img src={booking.service.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1.5 text-base">{booking.service?.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span className="truncate max-w-[150px]">{booking.service?.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">التاريخ</p>
                      <p className="text-sm font-bold text-white">
                        {format(parseISO(booking.date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 mb-0.5">الوقت</p>
                      <p className="text-sm font-bold text-white">{booking.time}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="text-center py-16 glass-panel rounded-3xl border-white/5">
              <div className="text-4xl mb-4">👻</div>
              <p className="text-slate-400 font-medium">ما عندك أي حجوزات {activeTab === "upcoming" ? "قادمة" : "سابقة"}</p>
            </div>
          )}
        </div>
      </main>

      <MobileNav role="client" />
    </div>
  );
}
