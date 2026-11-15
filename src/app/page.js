"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", hotel: "", room: "", payment: "Cash on Delivery" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (data) setProducts(data);
    setLoading(false);
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

  const handleCheckout = async () => {
    if (!customer.name || !customer.hotel || !customer.room) {
      return alert("Mohon lengkapi Nama Pemesan, Nama Hotel, dan Nomor Kamar!");
    }
    if (cart.length === 0) return alert("Keranjang belanja masih kosong!");

    const itemsSummary = cart.map(i => `${i.name} (${i.qty} ${i.unit})`).join(", ");

    // Simpan ke Supabase (Kolom phone diisi '-' karena input WA dihapus)
    const { error } = await supabase.from("orders").insert([{
      customer_name: customer.name,
      phone: "-",
      hotel: customer.hotel,
      room: customer.room,
      items: itemsSummary,
      payment: customer.payment,
      total: totalPrice
    }]);

    if (error) {
      alert("Gagal memproses pesanan: " + error.message);
      return;
    }

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
    const sellerWhatsApp = "6285765813040"; // Nomor WA Admin
    window.open(`https://wa.me/${sellerWhatsApp}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* Header Toko (Tanpa Tombol Admin Login) */}
      <header className="bg-slate-900 text-white py-6 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black tracking-wider flex items-center gap-2">
              <span>🕋</span> ZADESHAN STORE
            </h1>
            <p className="text-[11px] text-emerald-400 font-mono">OLEH-OLEH & KEBUTUHAN JAMAAH DI MAKKAH</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6 space-y-8">
        
        {/* SECTION: KATALOG PRODUK SLIDING KE SAMPING */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-extrabold text-base text-slate-900">🛍️ Katalog Oleh-Oleh Pilihan</h2>
            <span className="text-xs text-slate-400">Geser ke samping 👉</span>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-10">Memuat produk dari toko...</p>
          ) : products.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">Belum ada produk tersedia.</p>
          ) : (
            <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-thin">
              <div className="flex gap-4 w-max px-1">
                {products.map(p => (
                  <div key={p.id} className="w-56 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 flex flex-col justify-between flex-shrink-0 transition hover:shadow-md">
                    <div>
                      <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-xl bg-slate-100 mb-3" />
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-2">{p.name}</h3>
                      <p className="text-xs text-emerald-700 font-black mt-1">SAR {p.price} <span className="text-[10px] font-normal text-slate-400">/{p.unit}</span></p>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition shadow-sm"
                    >
                      + Tambah ke Keranjang
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION: KERANJANG & CHECKOUT FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Daftar Keranjang */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-sm mb-4 text-slate-900">🛒 Keranjang Belanja Anda</h3>
            {cart.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Keranjang masih kosong. Yuk pilih produk di atas!</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-emerald-700 font-semibold">SAR {item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 bg-white border rounded-lg font-bold text-slate-600 shadow-sm">-</button>
                      <span className="font-bold text-slate-800 w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 bg-white border rounded-lg font-bold text-slate-600 shadow-sm">+</button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center font-black text-sm text-slate-900">
                  <span>Total Pembayaran:</span>
                  <span className="text-emerald-700">SAR {totalPrice}</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Data Pengiriman Hotel (Tanpa Input No WhatsApp) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="font-extrabold text-sm mb-4 text-slate-900">🏨 Data Pengiriman ke Kamar Hotel</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nama Pemesan</label>
                <input
                  type="text"
                  placeholder="Contoh: H. Nazlan Hafidz"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nama Hotel di Makkah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hilton Suites"
                    value={customer.hotel}
                    onChange={e => setCustomer({ ...customer, hotel: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Nomor Kamar</label>
                  <input
                    type="text"
                    placeholder="Contoh: 504"
                    value={customer.room}
                    onChange={e => setCustomer({ ...customer, room: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Metode Pembayaran</label>
                <select
                  value={customer.payment}
                  onChange={e => setCustomer({ ...customer, payment: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-emerald-600 font-semibold text-emerald-700"
                >
                  <option value="Cash on Delivery (COD di Kamar Hotel)">Cash on Delivery (Bayar di Kamar Hotel)</option>
                  <option value="Transfer Bank / QRIS Indonesia">Transfer Bank / QRIS</option>
                </select>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>💬 Pesan via WhatsApp & Simpan Order</span>
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}