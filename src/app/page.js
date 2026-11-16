"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "KURMA AJWA PREMIUM (1KG)", price: 80, unit: "Kg", badge: "PALING DICARI", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800", desc: "Kurma Ajwa asli Madinah pilihan terbaik." },
  { id: 2, name: "KACANG PISTACHIO SHALI (500G)", price: 55, unit: "Pack", badge: "FAVORIT", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=800", desc: "Pistachio renyah gurih kualitas ekspor." },
  { id: 3, name: "COKLAT ARAB DATES & GOLD", price: 60, unit: "Box", badge: "BEST SELLER", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800", desc: "Coklat mewah isi kurma khas Makkah." },
  { id: 4, name: "KACANG ALMOND PANGGANG (500G)", price: 45, unit: "Pack", badge: "REKOMENDASI", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800", desc: "Almond panggang bernutrisi tinggi." },
  { id: 5, name: "AIR ZAMZAM ASLI MAKKAH (5L)", price: 35, unit: "Galon", badge: "DIJAMIN ASLI", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800", desc: "Air Zamzam suci langsung dari Makkah." }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [customer, setCustomer] = useState({ name: "", hotel: "Hotel Rombongan Makkah", room: "", payment: "COD (Bayar di Kamar Hotel)" });
  
  const sliderRef = useRef(null);
  const lastVibratedIndex = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem("zadeshan_products");
    const list = saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    setProducts(list);
  }, []);

  const activeProduct = products[currentIndex] || products[0];

  const triggerHaptic = (intensity = 15) => {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(intensity);
      }
    } catch (e) {}
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = 220; 
    const index = Math.round(scrollLeft / cardWidth);
    if (index >= 0 && index < products.length && index !== currentIndex) {
      setCurrentIndex(index);
      if (lastVibratedIndex.current !== index) {
        triggerHaptic(20);
        lastVibratedIndex.current = index;
      }
    }
  };

  const scrollToCard = (index) => {
    setCurrentIndex(index);
    triggerHaptic(25);
    if (sliderRef.current) {
      const cardWidth = 220;
      sliderRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  const addToCart = (product) => {
    triggerHaptic(30);
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    triggerHaptic(15);
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

  const handleInstantBuy = (product) => {
    triggerHaptic(40);
    if (!customer.name || !customer.room) {
      alert("Mohon isi Nama Pemesan dan Nomor Kamar terlebih dahulu!");
      setActiveTab("checkout");
      return;
    }

    const waMessage = `PESANAN ZADESHAN.STORE\n\n` +
      `Nama: ${customer.name}\n` +
      `Hotel: ${customer.hotel}\n` +
      `Kamar: ${customer.room}\n\n` +
      `Pesanan:\n` +
      `- ${product.name} (1 ${product.unit}) = SAR ${product.price}\n\n` +
      `TOTAL: SAR ${product.price}\n\nMohon segera diantar ke kamar hotel. Terima kasih.`;

    const sellerWhatsApp = "6285765813040";
    window.open(`https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  const handleCheckout = () => {
    triggerHaptic(50);
    if (!customer.name || !customer.room) {
      return alert("Mohon lengkapi Nama Pemesan dan Nomor Kamar!");
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

    const waMessage = `PESANAN ZADESHAN.STORE\n\n` +
      `Nama: ${customer.name}\n` +
      `Hotel: ${customer.hotel}\n` +
      `Kamar: ${customer.room}\n\n` +
      `Rincian Belanja:\n` +
      cart.map(i => `- ${i.name} x${i.qty} = SAR ${i.price * i.qty}`).join("\n") +
      `\n\nTOTAL: SAR ${totalPrice}\n\nMohon segera diproses pengirimannya ke kamar hotel. Terima kasih.`;

    const sellerWhatsApp = "6285765813040"; 
    window.open(`https://wa.me/${sellerWhatsApp}?text=${encodeURIComponent(waMessage)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#4A2318] text-[#FFF1D0] font-sans flex flex-col justify-between relative overflow-x-hidden select-none pb-28">
      
      {/* BACKGROUND BLUR CINEMATIC */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[#4A2318]/85 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Blur BG" 
            className="w-full h-full object-cover filter blur-3xl opacity-20 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* HEADER */}
      <header className="relative z-20 px-5 py-4 flex justify-between items-center border-b border-[#F6D86B]/20 bg-[#4A2318]/60 backdrop-blur-md">
        <h1 className="text-sm font-black tracking-widest uppercase text-[#F6D86B]">
          ZADESHAN.STORE
        </h1>
        <div className="text-xs font-mono text-[#F6D86B] bg-[#2C130D] px-3 py-1 rounded-full border border-[#F6D86B]/40">
          BAG: {totalItemsCount}
        </div>
      </header>

      {/* MARQUEE KATEGORI PRODUK */}
      <div className="relative z-20 bg-[#2C130D] border-y border-[#F6D86B]/20 py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-[11px] font-mono tracking-widest text-[#F6D86B] uppercase">
          ✦ KURMA AJWA ASLI MADINAH &nbsp;&nbsp;&nbsp; ✦ KACANG PISTACHIO & ALMOND &nbsp;&nbsp;&nbsp; ✦ COKLAT EKSKLUSIF MAKKAH &nbsp;&nbsp;&nbsp; ✦ AIR ZAMZAM MURNI 
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-20 flex-1 max-w-md mx-auto w-full px-3 py-4 flex flex-col space-y-4">
        
        {/* TAB 1: SHOWCASE 3D */}
        {activeTab === "home" && (
          <>
            <div className="flex justify-between items-end px-1">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#F6D86B]">SOUVENIR & OLEH-OLEH</span>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#FFF1D0]">FEATURED COLLECTION</h2>
              </div>
              <span className="text-[10px] text-[#FFF1D0]/60 font-mono">GESER ⇄</span>
            </div>

            {/* 3D COVER FLOW SLIDER */}
            <div 
              ref={sliderRef}
              onScroll={handleScroll}
              onTouchStart={() => triggerHaptic(8)}
              className="w-full overflow-x-auto py-6 no-scrollbar touch-pan-x scroll-smooth perspective-[1000px]"
            >
              <div className="flex gap-4 w-max px-6 items-center">
                {products.map((p, idx) => {
                  const isActive = currentIndex === idx;
                  const distance = idx - currentIndex;
                  const rotateY = distance === 0 ? 0 : distance < 0 ? 25 : -25;
                  const scale = isActive ? 1 : 0.85;
                  const zIndex = isActive ? 20 : 10 - Math.abs(distance);

                  return (
                    <div 
                      key={p.id}
                      onClick={() => scrollToCard(idx)}
                      style={{
                        transform: `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`,
                        zIndex: zIndex
                      }}
                      className={`w-48 h-72 rounded-3xl overflow-hidden relative transition-all duration-500 cursor-pointer flex-shrink-0 shadow-2xl ${
                        isActive 
                          ? "border-2 border-[#F6D86B] shadow-[0_0_30px_rgba(246,216,107,0.4)] opacity-100" 
                          : "border border-[#FFF1D0]/20 opacity-50 hover:opacity-80 grayscale-[30%]"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
                      <div className="absolute top-2.5 left-2.5 bg-[#2C130D]/80 backdrop-blur-md text-[#F6D86B] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#F6D86B]/30 uppercase">
                        {p.badge}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C130D] via-[#4A2318]/40 to-transparent flex flex-col justify-end p-3.5">
                        <h3 className="font-black text-xs text-[#FFF1D0] tracking-wide uppercase line-clamp-1">{p.name}</h3>
                        <p className="text-xs text-[#F6D86B] font-black mt-0.5">SAR {p.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INDIKATOR TITIK */}
            <div className="flex justify-center items-center gap-1.5 -mt-2">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={`h-1 transition-all duration-300 rounded-full ${
                    currentIndex === idx ? "w-6 bg-[#F6D86B]" : "w-1.5 bg-[#FFF1D0]/30"
                  }`}
                />
              ))}
            </div>

            {/* PANEL DETAIL & BELI CEPAT */}
            {activeProduct && (
              <div className="bg-[#2C130D]/90 backdrop-blur-xl border border-[#F6D86B]/30 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-[#F6D86B] font-mono uppercase tracking-wider">
                      {activeProduct.badge}
                    </span>
                    <h4 className="font-black text-xs text-[#FFF1D0] uppercase tracking-wide truncate">{activeProduct.name}</h4>
                    <p className="text-xs text-[#F6D86B] font-black mt-0.5">SAR {activeProduct.price} <span className="text-[9px] font-normal text-[#FFF1D0]/60">/{activeProduct.unit}</span></p>
                  </div>
                  <button
                    onClick={() => addToCart(activeProduct)}
                    className="bg-[#4A2318] hover:bg-[#5D2C1E] active:scale-95 text-[#FFF1D0] font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1 flex-shrink-0 border border-[#F6D86B]/30"
                  >
                    + TAS
                  </button>
                </div>

                <button
                  onClick={() => handleInstantBuy(activeProduct)}
                  className="w-full bg-[#F6D86B] text-[#4A2318] hover:bg-[#f3d04e] active:scale-98 font-black py-3 rounded-xl transition shadow-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5"
                >
                  BELI CEPAT VIA WHATSAPP (SAR {activeProduct.price})
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: KERANJANG / TAS */}
        {activeTab === "cart" && (
          <div className="bg-[#2C130D]/95 backdrop-blur-xl border border-[#F6D86B]/20 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="font-black text-xs uppercase tracking-widest text-[#F6D86B] pb-2 border-b border-[#F6D86B]/20">
              TAS BELANJA ({totalItemsCount} ITEM)
            </h3>
            {cart.length === 0 ? (
              <p className="text-xs text-[#FFF1D0]/60 text-center py-8">Tas belanja masih kosong. Pilih produk dari showcase.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-[#4A2318] p-2.5 rounded-xl border border-[#F6D86B]/10 text-xs">
                    <div className="pr-2 min-w-0 flex-1">
                      <h4 className="font-black text-[#FFF1D0] truncate text-xs uppercase">{item.name}</h4>
                      <p className="text-[#F6D86B] font-bold text-[11px]">SAR {item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-[#2C130D] rounded-md font-bold text-[#FFF1D0] flex items-center justify-center">-</button>
                      <span className="font-bold text-[#FFF1D0] w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-[#2C130D] rounded-md font-bold text-[#FFF1D0] flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-[#F6D86B]/20 flex justify-between items-center font-black text-sm">
              <span className="text-[#FFF1D0]">TOTAL:</span>
              <span className="text-[#F6D86B]">SAR {totalPrice}</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => { triggerHaptic(30); setActiveTab("checkout"); }}
                className="w-full bg-[#F6D86B] text-[#4A2318] hover:bg-[#f3d04e] font-black py-3 rounded-xl transition text-xs uppercase tracking-wider"
              >
                LANJUT KE PENGIRIMAN KAMAR →
              </button>
            )}
          </div>
        )}

        {/* TAB 3: CHECKOUT / KAMAR */}
        {activeTab === "checkout" && (
          <div className="bg-[#2C130D]/95 backdrop-blur-xl border border-[#F6D86B]/20 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="font-black text-xs uppercase tracking-widest text-[#F6D86B] pb-2 border-b border-[#F6D86B]/20">
              PENGIRIMAN KE KAMAR HOTEL
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#FFF1D0]/70 mb-1 uppercase text-[10px] font-mono">NAMA PEMESAN</label>
                <input
                  type="text"
                  placeholder="Contoh: H. Nazlan Hafidz"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full p-3 bg-[#4A2318] border border-[#F6D86B]/30 rounded-xl text-[#FFF1D0] placeholder-[#FFF1D0]/30 focus:outline-[#F6D86B] text-xs uppercase"
                />
              </div>

              <div>
                <label className="block text-[#FFF1D0]/70 mb-1 uppercase text-[10px] font-mono">NOMOR KAMAR</label>
                <input
                  type="text"
                  placeholder="Contoh: Kamar 504"
                  value={customer.room}
                  onChange={e => setCustomer({ ...customer, room: e.target.value })}
                  className="w-full p-3 bg-[#4A2318] border border-[#F6D86B]/30 rounded-xl text-[#FFF1D0] placeholder-[#FFF1D0]/30 focus:outline-[#F6D86B] text-sm font-bold text-[#F6D86B]"
                />
                <p className="text-[10px] text-[#FFF1D0]/50 mt-1">*(Hotel diset otomatis untuk rombongan Makkah)</p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-2 bg-[#F6D86B] text-[#4A2318] hover:bg-[#f3d04e] active:scale-98 font-black py-3.5 rounded-xl transition text-xs tracking-wider uppercase"
              >
                KIRIM PESANAN VIA WHATSAPP
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FLOATING BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[92%] max-w-sm">
        <div className="bg-[#2C130D]/95 backdrop-blur-2xl border border-[#F6D86B]/40 rounded-full px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex justify-between items-center relative">
          
          <button
            onClick={() => { triggerHaptic(15); setActiveTab("home"); }}
            className={`flex flex-col items-center transition-all ${activeTab === "home" ? "text-[#F6D86B] scale-110" : "text-[#FFF1D0]/60 hover:text-[#FFF1D0]"}`}
          >
            <span className="text-xs font-black uppercase">SHOWCASE</span>
          </button>

          <button
            onClick={() => { triggerHaptic(15); setActiveTab("cart"); }}
            className={`flex flex-col items-center transition-all relative ${activeTab === "cart" ? "text-[#F6D86B] scale-110" : "text-[#FFF1D0]/60 hover:text-[#FFF1D0]"}`}
          >
            <span className="text-xs font-black uppercase">TAS</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F6D86B] text-[#4A2318] text-[9px] font-black rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { triggerHaptic(15); setActiveTab("checkout"); }}
            className={`flex flex-col items-center transition-all ${activeTab === "checkout" ? "text-[#F6D86B] scale-110" : "text-[#FFF1D0]/60 hover:text-[#FFF1D0]"}`}
          >
            <span className="text-xs font-black uppercase">KAMAR</span>
          </button>

          <Link
            href="/admin"
            onClick={() => triggerHaptic(15)}
            className="flex flex-col items-center transition-all text-[#FFF1D0]/60 hover:text-[#FFF1D0]"
          >
            <span className="text-xs font-black uppercase">ADMIN</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}