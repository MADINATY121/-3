import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "@/src/components/layout/TopBar";
import { MobileNav } from "@/src/components/layout/MobileNav";
import { Card } from "@/src/components/ui/Card";
import { Star, MapPin, Clock, Flame } from "lucide-react";
import type { Category, Service } from "@/src/types";

// Emojis for categories to make it youthful
const categoryEmojis: Record<string, string> = {
  "1": "✂️", // Salon
  "2": "🩺", // Clinic
  "3": "⚽", // Sports
  "4": "💆‍♂️", // Spa
};

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
    
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  const filteredServices = activeCategory 
    ? services.filter(s => s.categoryId === activeCategory)
    : services;

  return (
    <div className="min-h-screen pb-32">
      <TopBar title="هلا بك 👋" showSearch />
      
      <main className="px-5 pt-6 space-y-8">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100">وش تدور عليه؟</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar -mx-5 px-5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const emoji = categoryEmojis[cat.id] || "✨";
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className={`flex flex-col items-center gap-2 min-w-[85px] snap-center transition-all ${
                    isActive ? "scale-105" : "hover:scale-105"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl transition-all shadow-lg ${
                    isActive 
                      ? "bg-gradient-brand shadow-purple-500/25" 
                      : "bg-slate-800/80 border border-white/5"
                  }`}>
                    {emoji}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-400"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Popular Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {activeCategory ? "نتائج البحث" : "تريند اليوم 🔥"}
            </h2>
          </div>
          <div className="grid gap-5">
            {filteredServices.map((service) => (
              <Link key={service.id} to={`/service/${service.id}`} className="group block">
                <Card className="p-3 hover:bg-slate-800/50 transition-colors border-white/5">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">{service.rating}</span>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-white">{service.name}</h3>
                      <span className="font-black text-purple-400">{service.price}</span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-1 mb-3">{service.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{service.workingHours.open} - {service.workingHours.close}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            
            {filteredServices.length === 0 && (
              <div className="text-center py-16 glass-panel rounded-3xl">
                <div className="text-4xl mb-3">🥺</div>
                <p className="text-slate-400 font-medium">مالقينا شي يناسب طلبك</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <MobileNav role="client" />
    </div>
  );
}
