"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1000", desc: "Kurma Ajwa asli Madinah pilihan terbaik." },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=1000", desc: "Pistachio renyah gurih kualitas ekspor." },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1000", desc: "Coklat mewah isi kurma khas Makkah." },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=1000", desc: "Almond panggang bernutrisi tinggi." },
  { id: 5, name: "Air Zamzam Asli Makkah (5L)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1000", desc: "Air Zamzam suci langsung dari Makkah." },
  { id: 6, name: "Kacang Arab Mix Spesial", price: 30, unit: "Pack", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=1000", desc: "Aneka kacang Arab gurih pilihan." }
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
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-between relative overflow-x-hidden select-none">
      
      {/* BACKGROUND BLUR CINEMATIC */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Blur BG" 
            className="w-full h-full object-cover filter blur-3xl opacity-30 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* HEADER */}
      <header className="relative z-20 px-5 py-3.5 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md">
        <h1 className="text-xs font-black tracking-widest flex items-center gap-1.5">
          <span>🕋</span> ZADESHAN.STORE
        </h1>
        <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
          Makkah Luxury
        </div>
      </header>

      {/* MAIN CONTAINER: SIDE-BY-SIDE SHOWCASE (MENGATASI TAMPILAN MENUMPUK) */}
      <main className="relative z-20 flex-1 max-w-5xl mx-auto w-full px-4 py-6 flex flex-col md:flex-row items-center gap-6">
        
        {/* SISI KIRI: KARTU PRODUK UTAMA BERDIRI ELEGAN */}
        <div className="w-full md:w-1/2 flex justify-center">
          {activeProduct && (
            <div className="relative w-full max-w-xs h-[380px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 group">
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">Featured Item</span>
                <h3 className="text-base font-black text-white leading-tight mt-0.5">{activeProduct.name}</h3>
                <p className="text-xs text-emerald-300 font-bold mt-1">SAR {activeProduct.price} <span className="text-[9px] font-normal text-slate-400">/{activeProduct.unit}</span></p>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{activeProduct.desc}</p>
              </div>
            </div>
          )}
        </div>

        {/* SISI KANAN: PANEL MINI LIST PRODUK (MIRIP GAYA REFERENSI) */}
        <div className="w-full md:w-1/2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-200">In This Showcase</span>
            <span className="text-[10px] text-emerald-400 font-mono">{products.length} Items</span>
          </div>

          {/* Daftar Produk Sejajar ke Bawah di Sisi Kanan */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
            {products.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all border ${
                  currentIndex === idx 
                    ? "bg-white/15 border-emerald-500/60 shadow-md" 
                    : "bg-black/40 border-white/5 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[11px] text-white truncate">{p.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold">SAR {p.price}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] px-3 py-1.5 rounded-xl transition shadow-sm active:scale-95 flex-shrink-0"
                >
                  + Beli
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER: FORM CHECKOUT HOTEL */}
      <footer className="relative z-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-5 py-5">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <span>🛒</span> Total: <strong className="text-emerald-400">SAR {totalPrice}</strong>
            </span>
            <span className="text-[10px] text-slate-400">({cart.reduce((a,b)=>a+b.qty,0)} item di keranjang)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Nama Pemesan"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nama Hotel"
              value={customer.hotel}
              onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="No Kamar"
              value={customer.room}
              onChange={e => setCustomer({ ...customer, room: e.target.value })}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-emerald-500"
            />
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3 rounded-xl transition shadow-lg shadow-emerald-900/50 text-xs tracking-wide flex items-center justify-center gap-1.5"
          >
            <span>💬 Pesan via WhatsApp & Kirim ke Kamar</span>
          </button>
        </div>
      </footer>
    </div>
  );
}