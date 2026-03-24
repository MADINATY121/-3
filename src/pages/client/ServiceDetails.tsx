import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Star, MapPin, Clock, CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import type { Service } from "@/src/types";
import { format, addDays } from "date-fns";

export function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then(setService);
  }, [id]);

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Generate next 7 days
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  
  // Generate time slots (mock)
  const timeSlots = ["10:00", "11:00", "13:00", "14:30", "16:00", "18:00", "20:00"];

  const handleBook = async () => {
    if (!selectedTime) return;
    
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: service.id,
        clientId: "1", // Mock client ID
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
      }),
    });
    
    setBookingSuccess(true);
    setTimeout(() => {
      navigate("/bookings");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-32 bg-[#0B0F19]">
      {/* Header Image & Nav */}
      <div className="relative h-[40vh] w-full">
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />
        
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-30">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors border border-white/10"
          >
            <Heart className={`w-6 h-6 transition-colors ${isLiked ? "fill-pink-500 text-pink-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-10 px-6 space-y-8">
        <div>
          <div className="flex justify-between items-end mb-3">
            <h1 className="text-3xl font-black text-white">{service.name}</h1>
            <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold border border-yellow-500/30">
              <Star className="w-4 h-4 fill-yellow-400" />
              {service.rating}
            </div>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">{service.description}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4 glass-panel px-5 py-4 rounded-3xl flex-1 min-w-[160px]">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">الموقع</p>
              <p className="font-bold text-white text-sm">{service.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 glass-panel px-5 py-4 rounded-3xl flex-1 min-w-[160px]">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">أوقات العمل</p>
              <p className="font-bold text-white text-sm">{service.workingHours.open} - {service.workingHours.close}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 p-5 pb-safe z-40 rounded-t-3xl">
        <div className="flex justify-between items-center gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">السعر</p>
            <p className="text-2xl font-black text-white">{service.price}</p>
          </div>
          <Button size="lg" className="flex-1" onClick={() => setIsBooking(true)}>
            احجز موعدك الآن 🚀
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      {isBooking && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBooking(false)} />
          <div className="relative w-full max-w-md bg-[#0f172a] rounded-t-[2.5rem] sm:rounded-3xl p-8 pb-safe animate-in slide-in-from-bottom-full duration-300 border border-white/10 shadow-2xl shadow-purple-900/50">
            
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8 sm:hidden"></div>

            {bookingSuccess ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">تم الحجز بنجاح! 🎉</h3>
                <p className="text-slate-400 text-sm">جاري تحويلك لقائمة حجوزاتك...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-white">اختر موعدك 📅</h3>
                  <button onClick={() => setIsBooking(false)} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">أي يوم يناسبك؟</h4>
                  <div className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar -mx-8 px-8">
                    {dates.map((date, i) => {
                      const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={`flex flex-col items-center justify-center min-w-[72px] h-24 rounded-2xl transition-all snap-center ${
                            isSelected 
                              ? "bg-gradient-brand text-white shadow-lg shadow-purple-500/25 scale-105" 
                              : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/5"
                          }`}
                        >
                          <span className="text-xs font-medium mb-2">{format(date, "EEE")}</span>
                          <span className="text-2xl font-black">{format(date, "d")}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">متى فاضي؟ ⏰</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 text-sm font-bold rounded-xl transition-all ${
                          selectedTime === time
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={!selectedTime}
                  onClick={handleBook}
                >
                  أكد الحجز
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
