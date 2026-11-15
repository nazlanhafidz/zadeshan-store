"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1000", desc: "Kurma Ajwa asli Madinah pilihan terbaik." },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=1000", desc: "Pistachio renyah gurih kualitas ekspor." },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1000", desc: "Coklat mewah isi kurma khas Makkah." },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=1000", desc: "Almond panggang bernutrisi tinggi." },
  { id: 5, name: "Air Zamzam Asli Makkah (5L)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1000", desc: "Air Zamzam suci langsung dari Makkah." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", hotel: "", room: "", payment: "COD (Bayar di Kamar Hotel)" });

  useEffect(() => {
    const saved = localStorage.getItem("zadeshan_products");
    const list = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    setProducts(list);
  }, []);

  const activeProduct = products[currentIndex] || products[0];

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (!customer.name || !customer.hotel || !customer.room) {
      return alert("Mohon lengkapi Nama Pemesan, Nama Hotel, dan Nomor Kamar!");
    }
    if (cart.length === 0) return alert("Keranjang belanja masih kosong!");

    const newOrder = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      customer_name: customer.name,
      hotel: customer.hotel,
      room: customer.room,
      items: cart.map(i => `${i.name} (${i.qty} ${i.unit})`).join(", "),
      payment: customer.payment,
      total: totalPrice
    };
    const existingOrders = JSON.parse(localStorage.getItem("zadeshan_orders") || "[]");
    localStorage.setItem("zadeshan_orders", JSON.stringify([newOrder, ...existingOrders]));

    const waMessage = `*PESANAN BARU - ZADESHAN STORE*\n\n` +
      `👤 Nama: ${customer.name}\n` +
      `🏨 Hotel: ${customer.hotel}\n` +
      `🚪 Kamar: ${customer.room}\n` +
      `💳 Pembayaran: ${customer.payment}\n\n` +
      `*Rincian Belanja:*\n` +
      cart.map(i => `- ${i.name} x${i.qty} = SAR ${i.price * i.qty}`).join("\n") +
      `\n\n*TOTAL: SAR ${totalPrice}*\n\nMohon segera diproses pengirimannya ke kamar hotel. Terima kasih!`;

    const encodedMessage = encodeURIComponent(waMessage);
    const sellerWhatsApp = "6285765813040"; 
    window.open(`https://wa.me/${sellerWhatsApp}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* 1. BACKGROUND IMAGE DENGAN EFEK BLUR CINEMATIC MENYELURUH */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Cinematic Blur BG" 
            className="w-full h-full object-cover filter blur-3xl opacity-40 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* TOP BAR / HEADER MINIMALIS */}
      <header className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div>
          <h1 className="text-xs font-black tracking-widest flex items-center gap-2">
            <span>🕋</span> ZADESHAN.STORE
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <span className="cursor-pointer hover:text-white">Showcase</span>
          <span className="cursor-pointer hover:text-white">Makkah</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </header>

      {/* MAIN CONTAINER: FOTO PRODUK BESAR DI TENGAH + PANEL KANAN */}
      <main className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-6 max-w-7xl mx-auto w-full gap-8">
        
        {/* SISI KIRI: JUDUL UTAMA & NAVIGASI SLIDE */}
        <div className="w-full lg:w-1/3 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Editorial Look / 2026
          </span>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-none text-white">
            Oleh-Oleh <br />Pilihan Makkah.
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Geser untuk menikmati galeri produk eksklusif jamaah. Sentuh item untuk melihat detail dan memesan langsung ke kamar hotel.
          </p>
          
          {/* Indikator Garis Slider Bawah (Mirip Referensi) */}
          <div className="pt-4 flex items-center gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? "w-10 bg-white" : "w-3 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* TENGAH: MODEL FOTO PRODUK UTAMA BERDIRI BESAR (CINEMATIC CARD) */}
        <div className="w-full lg:w-1/3 flex justify-center">
          {activeProduct && (
            <div className="relative group w-72 lg:w-80 h-[420px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 transition-all duration-500 transform hover:scale-102">
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase">Featured Item</span>
                <h3 className="text-lg font-black text-white leading-tight mt-1">{activeProduct.name}</h3>
                <p className="text-xs text-emerald-300 font-bold mt-1">SAR {activeProduct.price} <span className="text-[10px] font-normal text-slate-400">/{activeProduct.unit}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* SISI KANAN: PANEL DAFTAR PRODUK (IN THIS LOOK) & TOMBOL BELI */}
        <div className="w-full lg:w-1/3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col justify-between max-h-[450px] overflow-y-auto no-scrollbar">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-4 pb-2 border-b border-white/10 flex justify-between items-center">
              <span>Katalog Produk</span>
              <span className="text-emerald-400 text-[10px]">({products.length} Items)</span>
            </h3>

            {/* List Mini Produk (Bisa diklik untuk mengganti slide utama) */}
            <div className="space-y-2.5">
              {products.map((p, idx) => (
                <div 
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    currentIndex === idx 
                      ? "bg-white/15 border-emerald-500/60 shadow-md" 
                      : "bg-black/40 border-white/5 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-white/10" />
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">{p.name}</h4>
                      <p className="text-[10px] text-emerald-400 font-bold">SAR {p.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] px-3 py-2 rounded-xl transition shadow-sm active:scale-95"
                  >
                    + Beli
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Cepat Checkout / Keranjang */}
          {cart.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Keranjang ({cart.reduce((a,b)=>a+b.qty,0)} item)</span>
                <span className="font-black text-sm text-emerald-400">SAR {totalPrice}</span>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-white text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-lg hover:bg-slate-200 transition"
              >
                Isi Data Kamar ↓
              </button>
            </div>
          )}
        </div>

      </main>

      {/* BAWAH: FORM CHECKOUT PENGIRIMAN HOTEL */}
      <footer className="relative z-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="font-extrabold text-xs text-white uppercase tracking-wider text-center flex items-center justify-center gap-2">
            <span>🏨</span> Konfirmasi Pengiriman ke Kamar Hotel Makkah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              type="text"
              placeholder="Nama Pemesan (ex: H. Nazlan)"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nama Hotel (ex: Hilton)"
              value={customer.hotel}
              onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nomor Kamar (ex: 504)"
              value={customer.room}
              onChange={e => setCustomer({ ...customer, room: e.target.value })}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3.5 rounded-xl transition shadow-xl shadow-emerald-900/50 text-xs tracking-wide flex items-center justify-center gap-2"
          >
            <span>💬 Kirim Pesanan Sekarang via WhatsApp</span>
          </button>
        </div>
      </footer>
    </div>
  );
}