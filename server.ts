import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// Mock Data for MVP
const users = [
  { id: "1", name: "أحمد العميل", role: "client", phone: "0500000000" },
  { id: "2", name: "صالون الأناقة", role: "owner", phone: "0511111111" },
  { id: "3", name: "المدير العام", role: "admin", phone: "0522222222" },
];

const categories = [
  { id: "c1", name: "صالونات حلاقة", icon: "Scissors" },
  { id: "c2", name: "صالونات تجميل", icon: "Sparkles" },
  { id: "c3", name: "عيادات طبية", icon: "Stethoscope" },
  { id: "c4", name: "ملاعب رياضية", icon: "Trophy" },
];

const services = [
  {
    id: "s1",
    ownerId: "2",
    categoryId: "c1",
    name: "صالون الأناقة للرجال",
    description: "أفضل صالون حلاقة في المنطقة مع خدمات العناية بالبشرة.",
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
    workingHours: { open: "10:00", close: "22:00" },
    location: "الرياض، حي الملقا",
    price: "يبدأ من 50 ريال",
  },
  {
    id: "s2",
    ownerId: "2",
    categoryId: "c2",
    name: "مركز الجمال للسيدات",
    description: "خدمات تجميل متكاملة، شعر، مكياج، وعناية بالأظافر.",
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
    workingHours: { open: "09:00", close: "21:00" },
    location: "جدة، حي الشاطئ",
    price: "يبدأ من 150 ريال",
  },
  {
    id: "s3",
    ownerId: "2",
    categoryId: "c4",
    name: "ملاعب الأبطال",
    description: "ملاعب كرة قدم سداسية مجهزة بأفضل الأرضيات.",
    rating: 4.5,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80",
    workingHours: { open: "16:00", close: "02:00" },
    location: "الدمام، حي الفيصلية",
    price: "200 ريال / ساعة",
  }
];

let bookings = [
  {
    id: "b1",
    serviceId: "s1",
    clientId: "1",
    date: "2026-03-25",
    time: "14:00",
    status: "confirmed", // pending, confirmed, cancelled, completed
    createdAt: new Date().toISOString(),
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  app.get("/api/services", (req, res) => {
    const { categoryId } = req.query;
    if (categoryId) {
      res.json(services.filter(s => s.categoryId === categoryId));
    } else {
      res.json(services);
    }
  });

  app.get("/api/services/:id", (req, res) => {
    const service = services.find(s => s.id === req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const { serviceId, clientId, date, time } = req.body;
    const newBooking = {
      id: "b" + Date.now(),
      serviceId,
      clientId,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.get("/api/bookings/client/:clientId", (req, res) => {
    const clientBookings = bookings.filter(b => b.clientId === req.params.clientId);
    // Attach service details
    const populated = clientBookings.map(b => ({
      ...b,
      service: services.find(s => s.id === b.serviceId)
    }));
    res.json(populated);
  });

  app.get("/api/bookings/owner/:ownerId", (req, res) => {
    // Find services owned by this owner
    const ownerServiceIds = services.filter(s => s.ownerId === req.params.ownerId).map(s => s.id);
    const ownerBookings = bookings.filter(b => ownerServiceIds.includes(b.serviceId));
    
    const populated = ownerBookings.map(b => ({
      ...b,
      service: services.find(s => s.id === b.serviceId),
      client: users.find(u => u.id === b.clientId)
    }));
    res.json(populated);
  });

  app.put("/api/bookings/:id/status", (req, res) => {
    const { status } = req.body;
    const booking = bookings.find(b => b.id === req.params.id);
    if (booking) {
      booking.status = status;
      res.json(booking);
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
