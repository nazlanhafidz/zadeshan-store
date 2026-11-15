"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  const [activeTab, setActiveTab] = useState("home");
  const [customer, setCustomer] = useState({ name: "", hotel: "", room: "", payment: "COD (Bayar di Kamar Hotel)" });
  
  const sliderRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("zadeshan_products");
    const list = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    setProducts(list);
  }, []);

  const activeProduct = products[currentIndex] || products[0];

  // Fungsi saat slider digeser untuk mendeteksi posisi produk aktif secara akurat
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = 240; // perkiraan lebar card (w-56 / 224px + gap 16px)
    const index = Math.round(scrollLeft / cardWidth);
    if (index >= 0 && index < products.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const scrollToCard = (index) => {
    setCurrentIndex(index);
    if (sliderRef.current) {
      const cardWidth = 240;
      sliderRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

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
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col justify-between relative overflow-x-hidden select-none pb-28">
      
      {/* BACKGROUND BLUR CINEMATIC */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-neutral-950/80 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Blur BG" 
            className="w-full h-full object-cover filter blur-3xl opacity-30 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* HEADER */}
      <header className="relative z-20 px-4 py-3 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md">
        <h1 className="text-xs font-black tracking-widest flex items-center gap-1.5">
          <span>🕋</span> ZADESHAN.STORE
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
          <span>🛍️ Bag:</span>
          <span className="font-bold text-white">{totalItemsCount}</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-20 flex-1 max-w-md mx-auto w-full px-3 py-4 flex flex-col space-y-4">
        
        {/* TAB 1: HOME / SHOWCASE */}
        {activeTab === "home" && (
          <>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-400">Showroom Makkah</span>
                <h2 className="text-base font-black tracking-tight text-white">Featured Showcase</h2>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Geser Mulus ⇄</span>
            </div>

            {/* 3D CAROUSEL SLIDER DENGAN SCROLL LISTENER */}
            <div 
              ref={sliderRef}
              onScroll={handleScroll}
              className="w-full overflow-x-auto pb-3 pt-1 no-scrollbar touch-pan-x scroll-smooth"
            >
              <div className="flex gap-4 w-max px-2">
                {products.map((p, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => scrollToCard(idx)}
                      className={`w-56 h-64 rounded-2xl overflow-hidden relative transition-all duration-300 cursor-pointer flex-shrink-0 ${
                        isActive 
                          ? "border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-100 opacity-100" 
                          : "border border-white/10 scale-95 opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                        <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider">✨ Item #{idx+1}</span>
                        <h3 className="font-bold text-xs text-white line-clamp-1">{p.name}</h3>
                        <p className="text-[11px] text-emerald-300 font-black mt-0.5">SAR {p.price} <span className="text-[9px] font-normal text-neutral-400">/{p.unit}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INDIKATOR GARIS DOTS OTOMATIS */}
            <div className="flex justify-center items-center gap-1.5 -mt-2">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    currentIndex === idx ? "w-6 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* PANEL DETAIL & BELI (LANGSUNG MENYESUAIKAN PRODUK AKTIF) */}
            {activeProduct && (
              <div className="bg-neutral-900/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <span>🏷️</span> Selected Item
                  </span>
                  <h4 className="font-bold text-xs text-white truncate">{activeProduct.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-black mt-0.5">SAR {activeProduct.price} <span className="text-[9px] font-normal text-neutral-400">/{activeProduct.unit}</span></p>
                </div>
                <button
                  onClick={() => addToCart(activeProduct)}
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs px-4 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>🛒</span> + Beli
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: KERANJANG */}
        {activeTab === "cart" && (
          <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <span>🛒</span> Rincian Tas Belanja ({totalItemsCount} item)
            </h3>
            {cart.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">Tas belanja masih kosong. Yuk pilih produk di showcase!</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
                    <div className="pr-2 min-w-0 flex-1">
                      <h4 className="font-bold text-white truncate text-xs">{item.name}</h4>
                      <p className="text-emerald-400 font-bold text-[11px]">SAR {item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-neutral-800 rounded-md font-bold text-neutral-300 flex items-center justify-center">-</button>
                      <span className="font-bold text-white w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-neutral-800 rounded-md font-bold text-neutral-300 flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center font-black text-sm">
              <span>Total:</span>
              <span className="text-emerald-400">SAR {totalPrice}</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setActiveTab("checkout")}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                Lanjut ke Pengiriman Hotel →
              </button>
            )}
          </div>
        )}

        {/* TAB 3: CHECKOUT / HOTEL */}
        {activeTab === "checkout" && (
          <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <span>🏨</span> Konfirmasi Kamar Hotel Makkah
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Nama Pemesan</label>
                <input
                  type="text"
                  placeholder="Contoh: H. Nazlan"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Nama Hotel</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hilton"
                    value={customer.hotel}
                    onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Nomor Kamar</label>
                  <input
                    type="text"
                    placeholder="Contoh: 504"
                    value={customer.room}
                    onChange={e => setCustomer({ ...customer, room: e.target.value })}
                    className="w-full p-2.5 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(16,185,129,0.5)] text-xs tracking-wide flex items-center justify-center gap-1.5"
              >
                <span>💬 Pesan via WhatsApp & Kirim ke Kamar</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FLOATING BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-sm">
        <div className="bg-neutral-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-full px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex justify-between items-center relative">
          
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center transition-all ${activeTab === "home" ? "text-emerald-400 scale-110" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="text-base">✨</span>
            <span className="text-[9px] font-bold mt-0.5">Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`flex flex-col items-center transition-all relative ${activeTab === "cart" ? "text-emerald-400 scale-110" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="text-base">🛒</span>
            <span className="text-[9px] font-bold mt-0.5">Tas</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("checkout")}
            className={`flex flex-col items-center transition-all ${activeTab === "checkout" ? "text-emerald-400 scale-110" : "text-neutral-400 hover:text-white"}`}
          >
            <span className="text-base">🏨</span>
            <span className="text-[9px] font-bold mt-0.5">Kamar</span>
          </button>

          <Link
            href="/admin"
            className="flex flex-col items-center transition-all text-neutral-400 hover:text-white"
          >
            <span className="text-base">⚙️</span>
            <span className="text-[9px] font-bold mt-0.5">Admin</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}