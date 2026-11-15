"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800", desc: "Kurma Ajwa asli Madinah, empuk, manis pas, dan kaya manfaat." },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=800", desc: "Pistachio gurih pilihan kualitas ekspor untuk oleh-oleh." },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800", desc: "Perpaduan coklat premium dan kurma pilihan dalam kemasan eksklusif." },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800", desc: "Almond panggang renyah, gurih, dan bernutrisi tinggi." },
  { id: 5, name: "Kismis Yaman Premium (1kg)", price: 40, unit: "Kg", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800", desc: "Kismis manis alami ukuran jumbo khas Timur Tengah." },
  { id: 6, name: "Air Zamzam Asli Makkah (5 Liter)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800", desc: "Air Zamzam murni langsung dari sumbernya di Makkah Al-Mukarramah." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", hotel: "", room: "", payment: "COD (Bayar di Kamar Hotel)" });

  useEffect(() => {
    const savedProducts = localStorage.getItem("zadeshan_products");
    const list = savedProducts ? JSON.parse(savedProducts) : DEFAULT_PRODUCTS;
    setProducts(list);
    if (list.length > 0) setSelectedProduct(list[0]); // Set produk pertama yang aktif
  }, []);

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
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-28 relative overflow-x-hidden">
      
      {/* BACKGROUND BLUR CINEMATIC (Efek blur modern di belakang) */}
      {selectedProduct && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-3xl"></div>
          <img 
            src={selectedProduct.image} 
            alt="Background Blur" 
            className="w-full h-full object-cover filter blur-2xl opacity-40 scale-125 transform transition-all duration-700" 
          />
        </div>
      )}

      {/* Header Toko */}
      <header className="relative z-20 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 py-3.5 px-4 sticky top-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black tracking-wider flex items-center gap-1.5 text-white">
              <span>🕋</span> ZADESHAN STORE
            </h1>
            <p className="text-[9px] text-emerald-400 font-mono tracking-widest">MAKKAH LUXURY OLEH-OLEH</p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
            Live Showcase
          </span>
        </div>
      </header>

      <main className="relative z-20 max-w-md mx-auto px-3 mt-4 space-y-5">
        
        {/* SECTION: CINEMATIC SHOWCASE (Gaya Geser Seperti Referensi Anda) */}
        <section className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Editorial Look</span>
              <h2 className="font-extrabold text-sm text-white">✨ Katalog Eksklusif</h2>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg">Geser 👉</span>
          </div>

          {/* Slider Produk Utama */}
          <div className="w-full overflow-x-auto pb-3 pt-2 no-scrollbar cursor-grab active:cursor-grabbing">
            <div className="flex gap-3.5 w-max px-1">
              {products.map(p => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedProduct(p)}
                    className={`w-36 bg-slate-900/80 rounded-2xl p-2.5 flex flex-col justify-between flex-shrink-0 transition-all duration-300 cursor-pointer border ${
                      isSelected 
                        ? "border-emerald-400 shadow-lg shadow-emerald-900/50 scale-105 bg-slate-800/90" 
                        : "border-slate-700/60 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-xl bg-slate-950 mb-2 shadow-inner" />
                      <h3 className="font-bold text-[11px] text-slate-200 line-clamp-1">{p.name}</h3>
                      <p className="text-[11px] text-emerald-400 font-black mt-0.5">SAR {p.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAIL PRODUK TERPILIH DI BAWAH SLIDER (Gaya Panel Samping) */}
          {selectedProduct && (
            <div className="mt-3 bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-emerald-400 font-mono uppercase">Dipilih</span>
                <h4 className="font-black text-xs text-white truncate">{selectedProduct.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{selectedProduct.desc || "Oleh-oleh pilihan berkualitas tinggi."}</p>
                <p className="text-xs font-black text-emerald-400 mt-1">SAR {selectedProduct.price} <span className="text-[9px] font-normal text-slate-400">/{selectedProduct.unit}</span></p>
              </div>
              <button
                onClick={() => addToCart(selectedProduct)}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-[11px] px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-900/50 flex-shrink-0"
              >
                + Beli
              </button>
            </div>
          )}
        </section>

        {/* SECTION: KERANJANG BELANJA */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-xl">
          <h3 className="font-black text-xs mb-3 text-white flex items-center gap-1.5">
            <span>🛒</span> Keranjang Pesanan Anda
          </h3>
          {cart.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-4 text-center">Belum ada barang di keranjang. Klik "+ Beli" pada produk pilihan Anda!</p>
          ) : (
            <div className="space-y-2.5">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div className="pr-2 min-w-0 flex-1">
                    <h4 className="font-bold text-slate-200 truncate text-[11px]">{item.name}</h4>
                    <p className="text-emerald-400 font-bold text-[10px]">SAR {item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-md font-bold text-slate-300 text-xs">-</button>
                    <span className="font-bold text-white w-4 text-center text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-slate-800 border border-slate-700 rounded-md font-bold text-slate-300 text-xs">+</button>
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-3 mt-2 flex justify-between items-center font-black text-xs text-white">
                <span>Total Pembayaran:</span>
                <span className="text-emerald-400 text-sm">SAR {totalPrice}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: DATA PENGIRIMAN HOTEL */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-4 border border-slate-800 shadow-xl">
          <h3 className="font-black text-xs mb-3 text-white flex items-center gap-1.5">
            <span>🏨</span> Data Pengiriman ke Kamar Hotel
          </h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block font-bold text-slate-400 text-[10px] mb-1">Nama Pemesan</label>
              <input
                type="text"
                placeholder="Contoh: H. Nazlan Hafidz"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-700 rounded-xl focus:outline-emerald-500 bg-slate-950 text-white placeholder-slate-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-400 text-[10px] mb-1">Nama Hotel di Makkah</label>
                <input
                  type="text"
                  placeholder="Contoh: Hilton"
                  value={customer.hotel}
                  onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-700 rounded-xl focus:outline-emerald-500 bg-slate-950 text-white placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-400 text-[10px] mb-1">Nomor Kamar</label>
                <input
                  type="text"
                  placeholder="Contoh: 504"
                  value={customer.room}
                  onChange={e => setCustomer({ ...customer, room: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-700 rounded-xl focus:outline-emerald-500 bg-slate-950 text-white placeholder-slate-600"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-400 text-[10px] mb-1">Metode Pembayaran</label>
              <select
                value={customer.payment}
                onChange={e => setCustomer({ ...customer, payment: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-700 rounded-xl bg-slate-950 focus:outline-emerald-500 font-semibold text-emerald-400"
              >
                <option value="COD (Bayar di Kamar Hotel)">COD (Bayar di Kamar Hotel)</option>
                <option value="Transfer Bank / QRIS Indonesia">Transfer Bank / QRIS</option>
              </select>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black py-3.5 rounded-xl transition shadow-xl shadow-emerald-900/60 flex items-center justify-center gap-1.5 text-xs tracking-wide"
            >
              <span>💬 Pesan via WhatsApp & Kirim ke Kamar</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}