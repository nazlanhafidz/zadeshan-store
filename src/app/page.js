"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", hotel: "", room: "", payment: "QRIS / Transfer (IDR)" });

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => {
      if (data?.length) setProducts(data);
      else setProducts([
        { id: 1, name: "Kurma Ajwa Al-Aliyah (1kg)", price: 65, unit: "Kg", desc: "Kurma nabi asli Madinah kualitas super premium.", image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=500", rating: "4.9", sold: "1.2k" },
        { id: 2, name: "Air Zam-Zam Asli (5 Liter)", price: 15, unit: "Galon", desc: "Zam-zam resmi segel kedap udara Bandara Jeddah.", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=500", rating: "5.0", sold: "3.5k" },
        { id: 3, name: "Cokelat Kerikil & Susu Badam", price: 35, unit: "Kotak", desc: "Oleh-oleh favorit jamaah haji & umroh.", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=500", rating: "4.8", sold: "850" },
        { id: 4, name: "Kacang Pistachio Premium (500g)", price: 45, unit: "Pouch", desc: "Gurih, renyah, dan diproses higienis.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500", rating: "4.9", sold: "620" }
      ]);
    });
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === p.id);
      return exist ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return alert("Keranjang belanja masih kosong!");

    const { error } = await supabase.from("orders").insert([{
      customer_name: form.name, phone: form.phone, hotel: form.hotel, 
      room: form.room, payment: form.payment, 
      items: cart.map(i => `${i.name} (${i.qty}x)`).join(", "), total
    }]);

    if (error) return alert("Gagal menyimpan ke database: " + error.message);

    const msg = `*PESANAN BARU - ZADESHAN STORE MAKKAH*%0A%0A` +
                `*Jamaah:* ${form.name}%0A` +
                `*No. WA:* ${form.phone}%0A` +
                `*Antar Ke:* Hotel ${form.hotel} (Kmr ${form.room})%0A` +
                `*Metode Bayar:* ${form.payment}%0A%0A` +
                `*Detail Rincian:*%0A` +
                cart.map(i => `• ${i.name} (${i.qty}x) = SAR ${i.price * i.qty}`).join("%0A") +
                `%0A%0A*TOTAL: SAR ${total}*%0A%0AMohon konfirmasi dan antar ke hotel ya Admin!`;

    // Mengarah ke nomor WhatsApp Admin baru: 085765813040
    window.open(`https://wa.me/6285765813040?text=${msg}`, "_blank");
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🕋</span>
            <div>
              <h1 className="font-black text-lg tracking-wide leading-none">ZADESHAN</h1>
              <p className="text-[10px] text-emerald-200">Express Delivery Hotel Makkah</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <input
              type="text"
              placeholder="Cari kurma, zam-zam, cokelat..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-1.5 rounded-full text-slate-800 text-sm focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-3">
            <a href="/admin" className="text-xs bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-400/30 text-emerald-100 px-3 py-1.5 rounded-full font-medium transition">
              ⚙️ Dashboard Admin
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner Promo */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
          <div className="z-10 max-w-md">
            <span className="bg-white/20 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">🚚 Free Delivery Makkah</span>
            <h2 className="text-2xl font-black mt-2">Oleh-Oleh Haji & Umroh Langsung Antar Ke Kamar Hotel</h2>
            <p className="text-xs text-amber-100 mt-1">Bayar via QRIS (Rupiah) atau Cash (SAR) saat barang diterima.</p>
          </div>
          <span className="text-7xl opacity-20 hidden sm:block">🌴</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Katalog Produk (Shopee Grid) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              🔥 Produk Terpopuler
            </h3>
            <span className="text-xs text-slate-500">{filteredProducts.length} Produk Tersedia</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200/80 overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      STOK READY
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.desc}</p>
                    
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-500 font-semibold">
                      ⭐ {p.rating || "4.9"} <span className="text-slate-400 font-normal">({p.sold || "100+"} terjual)</span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-emerald-700 font-bold">SAR </span>
                        <span className="text-lg font-black text-emerald-700">{p.price}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">/{p.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs py-2 rounded-lg border border-emerald-600/30 transition duration-200"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Keranjang Belanja & Checkout Drawer */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-20">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                🛒 Keranjang Belanja
              </h3>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
                {totalItems} item
              </span>
            </div>

            {!cart.length ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <p className="text-3xl mb-1">🛍️</p>
                Keranjang Anda masih kosong. Silakan pilih produk di samping!
              </div>
            ) : (
              <div className="space-y-4">
                {/* List Items */}
                <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <div className="flex-1 pr-2">
                        <p className="font-semibold text-slate-800 line-clamp-1">{i.name}</p>
                        <p className="text-[11px] text-emerald-700 font-bold">SAR {i.price * i.qty}</p>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                        <button onClick={() => updateQty(i.id, -1)} className="font-bold text-slate-600 px-1">-</button>
                        <span className="font-bold px-1">{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)} className="font-bold text-slate-600 px-1">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ringkasan Subtotal */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Pengiriman Hotel:</span>
                    <span className="text-emerald-700 font-semibold">GRATIS</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t">
                    <span>Total Tagihan:</span>
                    <span className="text-emerald-700 font-black text-base">SAR {total}</span>
                  </div>
                </div>

                {/* Form Checkout Jamaah */}
                <form onSubmit={handleCheckout} className="space-y-2.5 pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">📍 Lokasi Antar Hotel Makkah</p>

                  <input 
                    type="text" 
                    placeholder="Nama Lengkap Jamaah" 
                    required 
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-600"
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    placeholder="No. WhatsApp Aktif (+62...)" 
                    required 
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-600"
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Nama Hotel" 
                      required 
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-600"
                      onChange={e => setForm({ ...form, hotel: e.target.value })} 
                    />
                    <input 
                      type="text" 
                      placeholder="No. Kamar" 
                      required 
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-emerald-600"
                      onChange={e => setForm({ ...form, room: e.target.value })} 
                    />
                  </div>

                  <select 
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white font-medium"
                    onChange={e => setForm({ ...form, payment: e.target.value })}
                  >
                    <option value="QRIS / Transfer (IDR)">QRIS / Transfer Bank (Rupiah)</option>
                    <option value="Cash saat Terima (SAR)">Cash SAR (Saat Terima di Hotel)</option>
                  </select>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Pesan via WhatsApp</span>
                    <span>➔</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}