"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1200", desc: "Kurma Ajwa pilihan terbaik langsung dari Madinah Al-Munawwarah." },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=1200", desc: "Pistachio renyah, gurih, dan berkualitas tinggi." },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1200", desc: "Perpaduan coklat mewah dan kurma dalam kemasan eksklusif." },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=1200", desc: "Almond panggang kaya manfaat dan bernutrisi tinggi." },
  { id: 5, name: "Air Zamzam Asli Makkah (5L)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1200", desc: "Air Zamzam suci murni dari tanah haram Makkah." },
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
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between relative overflow-x-hidden select-none">
      
      {/* 1. BACKGROUND CINEMATIC BLUR (MENGIKUTI ITEM AKTIF) */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-stone-950/80 z-10 backdrop-blur-3xl"></div>
          <img 
            src={activeProduct.image} 
            alt="Studio Background" 
            className="w-full h-full object-cover filter blur-3xl opacity-30 scale-125 transition-all duration-700" 
          />
        </div>
      )}

      {/* 2. TOP HEADER MINIMALIS ALA BUTIK */}
      <header className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-stone-800/60 bg-stone-900/30 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm">🕋</span>
          <h1 className="text-xs font-black tracking-widest text-stone-200">ZADESHAN.STORE</h1>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-stone-400">
          <span className="hover:text-stone-200 cursor-pointer">Showroom</span>
          <span className="text-emerald-400 font-mono">Makkah</span>
          <span className="bg-stone-800 text-stone-200 px-2 py-0.5 rounded-full text-[10px]">
            Bag ({cart.reduce((a,b)=>a+b.qty,0)})
          </span>
        </div>
      </header>

      {/* 3. MAIN INTERACTIVE SHOWCASE (RÁK GANTUNG / DISPLAY UTAMA) */}
      <main className="relative z-20 flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* SISI KIRI: DISPLAY FOTO PRODUK UTAMA (DENGAN EFEK STUDIO RACK) */}
        <div className="w-full lg:w-3/5 flex flex-col items-center">
          {activeProduct && (
            <div className="relative w-full max-w-lg h-[400px] lg:h-[450px] rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 group">
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Featured Showcase</span>
                <h3 className="text-xl font-bold text-white mt-1">{activeProduct.name}</h3>
                <p className="text-sm text-emerald-300 font-black mt-0.5">SAR {activeProduct.price} <span className="text-xs font-normal text-stone-400">/{activeProduct.unit}</span></p>
              </div>
            </div>
          )}

          {/* RAK / THUMBNAIL GANTUNG DI BAWAH (PILIHAN ITEM LAINNYA) */}
          <div className="w-full max-w-lg mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {products.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-16 h-16 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 transition-all border ${
                  currentIndex === idx ? "border-emerald-500 scale-105 shadow-lg shadow-emerald-950" : "border-stone-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* SISI KANAN: PANEL DETAIL PRODUK & TOMBOL ADD TO BAG (PERSIS SEPERTI REFERENSI) */}
        <div className="w-full lg:w-2/5 bg-stone-900/40 backdrop-blur-2xl border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-5">
          {activeProduct && (
            <>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Item Details</span>
                <h2 className="text-2xl font-black text-white mt-1">{activeProduct.name}</h2>
                <p className="text-lg font-black text-emerald-400 mt-2">SAR {activeProduct.price} <span className="text-xs font-normal text-stone-400">/{activeProduct.unit}</span></p>
                <p className="text-xs text-stone-300 leading-relaxed mt-3">{activeProduct.desc}</p>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={() => addToCart(activeProduct)}
                  className="w-full bg-stone-100 hover:bg-white text-stone-950 font-black py-3.5 rounded-2xl transition shadow-xl text-xs uppercase tracking-widest active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>+ Add to Bag (SAR {activeProduct.price})</span>
                </button>
              </div>
            </>
          )}

          {/* RINGKASAN KERANJANG KECIL */}
          {cart.length > 0 && (
            <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-300">Tas Belanja ({cart.reduce((a,b)=>a+b.qty,0)} item)</span>
                <span className="font-black text-emerald-400">SAR {totalPrice}</span>
              </div>
              <div className="space-y-1.5 max-h-28 overflow-y-auto no-scrollbar text-xs">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-stone-400">
                    <span className="truncate pr-2">{item.name} (x{item.qty})</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-stone-200">SAR {item.price * item.qty}</span>
                      <button onClick={() => updateQty(item.id, -1)} className="text-red-400 font-bold px-1">-</button>
                      <button onClick={() => updateQty(item.id, 1)} className="text-emerald-400 font-bold px-1">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* 4. FOOTER: FORM PENGIRIMAN KE KAMAR HOTEL */}
      <footer className="relative z-20 bg-stone-950/90 backdrop-blur-2xl border-t border-stone-800 px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="font-bold text-xs text-stone-300 uppercase tracking-wider text-center flex items-center justify-center gap-2">
            <span>🏨</span> Konfirmasi Pengiriman ke Kamar Hotel Makkah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Nama Pemesan"
              value={customer.name}
              onChange={e => setCustomer({ ...customer, name: e.target.value })}
              className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nama Hotel"
              value={customer.hotel}
              onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
              className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-emerald-500"
            />
            <input
              type="text"
              placeholder="Nomor Kamar"
              value={customer.room}
              onChange={e => setCustomer({ ...customer, room: e.target.value })}
              className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-white placeholder-stone-500 focus:outline-emerald-500"
            />
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3.5 rounded-xl transition shadow-xl shadow-emerald-950 text-xs tracking-wide flex items-center justify-center gap-2"
          >
            <span>💬 Pesan via WhatsApp & Kirim ke Kamar</span>
          </button>
        </div>
      </footer>
    </div>
  );
}