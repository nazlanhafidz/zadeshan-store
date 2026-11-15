"use client";
import { useState, useEffect } from "react";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Kurma Ajwa Premium (1kg)", price: 80, unit: "Kg", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Kacang Pistachio Shali (500g)", price: 55, unit: "Pack", image: "https://images.unsplash.com/photo-1515942661991-b0e657d0d018?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Coklat Arab Dates & Gold", price: 60, unit: "Box", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Kacang Almond Panggang (500g)", price: 45, unit: "Pack", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Kismis Yaman Premium (1kg)", price: 40, unit: "Kg", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Air Zamzam Asli Makkah (5 Liter)", price: 35, unit: "Galon", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400" },
  { id: 7, name: "Kacang Arab Mix Spesial", price: 30, unit: "Pack", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400" },
  { id: 8, name: "Minyak Zaitun Extra Virgin (500ml)", price: 50, unit: "Botol", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400" },
  { id: 9, name: "Teh Hitam Arab", price: 25, unit: "Kotak", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400" },
  { id: 10, name: "Kue Ma'amoul Kurma (Isi 16)", price: 35, unit: "Box", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=400" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", hotel: "", room: "", payment: "COD (Bayar di Kamar Hotel)" });

  useEffect(() => {
    const savedProducts = localStorage.getItem("zadeshan_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem("zadeshan_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
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

    // Simpan riwayat pesanan ke localStorage agar bisa dicek di Admin
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

    // Format Pesan WhatsApp
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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-24">
      
      {/* Header Toko */}
      <header className="bg-slate-900 text-white py-3 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black tracking-wide flex items-center gap-1.5">
              <span>🕋</span> ZADESHAN STORE
            </h1>
            <p className="text-[9px] text-emerald-400 font-mono tracking-wider">OLEH-OLEH & KEBUTUHAN JAMAAH</p>
          </div>
          <span className="text-[10px] bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            Makkah
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-3 mt-4 space-y-4">
        
        {/* SECTION: KATALOG PRODUK SLIDING KE SAMPING */}
        <section className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-center mb-2.5 px-1">
            <h2 className="font-black text-xs text-slate-800 flex items-center gap-1">
              <span>🛍️</span> Katalog Pilihan
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Geser 👉</span>
          </div>

          <div className="w-full overflow-x-auto pb-2 pt-1 no-scrollbar cursor-grab active:cursor-grabbing">
            <div className="flex gap-2.5 w-max px-0.5">
              {products.map(p => (
                <div key={p.id} className="w-36 bg-slate-50 rounded-xl border border-slate-200/80 p-2.5 flex flex-col justify-between flex-shrink-0 shadow-xs transition hover:shadow-md">
                  <div>
                    <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-lg bg-white mb-2 shadow-xs" />
                    <h3 className="font-bold text-[11px] text-slate-800 line-clamp-2 leading-snug">{p.name}</h3>
                    <p className="text-[11px] text-emerald-700 font-black mt-1">SAR {p.price} <span className="text-[9px] font-normal text-slate-400">/{p.unit}</span></p>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="mt-2.5 w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[10px] py-1.5 rounded-lg transition shadow-xs"
                  >
                    + Tambah
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: KERANJANG BELANJA */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/60">
          <h3 className="font-black text-xs mb-2.5 text-slate-800 flex items-center gap-1">
            <span>🛒</span> Keranjang Belanja
          </h3>
          {cart.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-4 text-center">Keranjang masih kosong, yuk pilih produk di atas!</p>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                  <div className="pr-2 min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 truncate text-[11px]">{item.name}</h4>
                    <p className="text-emerald-700 font-bold text-[10px]">SAR {item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-white border border-slate-200 rounded-md font-bold text-slate-600 text-xs shadow-xs">-</button>
                    <span className="font-bold text-slate-800 w-4 text-center text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-white border border-slate-200 rounded-md font-bold text-slate-600 text-xs shadow-xs">+</button>
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2.5 mt-2 flex justify-between items-center font-black text-xs text-slate-900">
                <span>Total:</span>
                <span className="text-emerald-700 text-sm">SAR {totalPrice}</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: DATA PENGIRIMAN HOTEL */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/60">
          <h3 className="font-black text-xs mb-3 text-slate-800 flex items-center gap-1">
            <span>🏨</span> Data Pengiriman ke Kamar
          </h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block font-bold text-slate-600 text-[10px] mb-1">Nama Pemesan</label>
              <input
                type="text"
                placeholder="Contoh: H. Nazlan Hafidz"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-600 text-[10px] mb-1">Nama Hotel</label>
                <input
                  type="text"
                  placeholder="Contoh: Hilton"
                  value={customer.hotel}
                  onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 text-[10px] mb-1">Nomor Kamar</label>
                <input
                  type="text"
                  placeholder="Contoh: 504"
                  value={customer.room}
                  onChange={e => setCustomer({ ...customer, room: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-600 text-[10px] mb-1">Metode Pembayaran</label>
              <select
                value={customer.payment}
                onChange={e => setCustomer({ ...customer, payment: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-emerald-600 font-semibold text-emerald-700"
              >
                <option value="COD (Bayar di Kamar Hotel)">COD (Bayar di Kamar Hotel)</option>
                <option value="Transfer Bank / QRIS Indonesia">Transfer Bank / QRIS</option>
              </select>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 text-xs"
            >
              <span>💬 Pesan via WhatsApp</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}