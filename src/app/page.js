"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800", desc: "Kurma Ajwa asli Madinah pilihan terbaik." },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=800", desc: "Pistachio renyah gurih kualitas ekspor." },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800", desc: "Coklat mewah isi kurma khas Makkah." },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800", desc: "Almond panggang bernutrisi tinggi." },
  { id: 5, name: "Air Zamzam Asli Makkah (5L)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800", desc: "Air Zamzam suci langsung dari Makkah." }
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
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* 1. BACKGROUND DENGAN EFEK BLUR MENDALAM (DEPTH OF FIELD) */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-neutral-950/75 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Blur Background" 
            className="w-full h-full object-cover filter blur-3xl opacity-40 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* 2. HEADER MINIMALIS MOBILE */}
      <header className="relative z-20 px-4 py-3 flex justify-between items-center border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div>
          <h1 className="text-xs font-black tracking-widest flex items-center gap-1.5">
            <span>🕋</span> ZADESHAN.STORE
          </h1>
          <p className="text-[8px] text-emerald-400 font-mono tracking-wider">MAKKAH SHOWCASE</p>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
          Bag ({cart.reduce((a,b)=>a+b.qty,0)})
        </span>
      </header>

      {/* 3. BAGIAN UTAMA: TRY THE LOOK / 3D MOBILE SLIDER */}
      <main className="relative z-20 flex-1 max-w-md mx-auto w-full px-3 py-4 flex flex-col justify-between">
        
        {/* Judul Atas */}
        <div>
          <h2 className="text-lg font-black tracking-tight text-white">Try the Look.</h2>
          <p className="text-[11px] text-neutral-400 mt-0.5">Geser produk untuk melihat detail dan suasana.</p>
        </div>

        {/* CONTAINER 3D SLIDER (FOTO UTAMA BESAR DI TENGAH DENGAN EFEK GESER) */}
        <div className="relative w-full my-3">
          <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory">
            <div className="flex gap-3 w-max px-2">
              {products.map((p, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`snap-center w-56 h-80 rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-500 transform ${
                      isActive 
                        ? "scale-100 border-2 border-white/40 opacity-100 shadow-emerald-950" 
                        : "scale-90 border border-white/10 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                      <span className="text-[9px] text-emerald-400 font-mono uppercase">Item #{idx+1}</span>
                      <h3 className="font-bold text-xs text-white line-clamp-1">{p.name}</h3>
                      <p className="text-[11px] text-emerald-300 font-black mt-0.5">SAR {p.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indikator Garis Slider Bawah (Pagination Line) */}
          <div className="flex justify-center items-center gap-1.5 mt-1">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PANEL DETAIL AKTIF & TOMBOL BELI */}
        {activeProduct && (
          <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-emerald-400 font-mono uppercase">Selected Item</span>
              <h4 className="font-bold text-xs text-white truncate">{activeProduct.name}</h4>
              <p className="text-[11px] text-emerald-400 font-black mt-0.5">SAR {activeProduct.price} <span className="text-[9px] font-normal text-neutral-400">/{activeProduct.unit}</span></p>
            </div>
            <button
              onClick={() => addToCart(activeProduct)}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950 flex-shrink-0"
            >
              + Beli
            </button>
          </div>
        )}

      </main>

      {/* 4. FOOTER: CHECKOUT HOTEL */}
      <footer className="relative z-20 bg-neutral-950/90 backdrop-blur-2xl border-t border-white/10 px-4 py-4">
        <div className="max-w-md mx-auto space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-white flex items-center gap-1">
              <span>🛒</span> Total Belanja: <strong className="text-emerald-400">SAR {totalPrice}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Nama Pemesan"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              className="p-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nama Hotel"
              value={customer.hotel}
              onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
              className="p-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="No Kamar"
              value={customer.room}
              onChange=^{\\e => setCustomer({ ...customer, room: e.target.value })}
              className="p-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-emerald-500"
            />
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3 rounded-xl transition shadow-xl shadow-emerald-950 text-xs tracking-wide flex items-center justify-center gap-1.5"
          >
            <span>💬 Pesan via WhatsApp & Kirim ke Kamar</span>
          </button>
        </div>
      </footer>
    </div>
  );
}