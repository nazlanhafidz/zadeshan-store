"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'products'

  // State Form Produk Baru
  const [newProduct, setNewProduct] = useState({ name: "", price: "", unit: "Pcs", desc: "", image: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Orders
    const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (ordersData) setOrders(ordersData);

    // Fetch Products
    const { data: productsData } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (productsData) setProducts(productsData);

    setLoading(false);
  };

  // Tambah Produk ke Supabase
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return alert("Lengkapi nama dan harga produk!");

    const { error } = await supabase.from("products").insert([{
      name: newProduct.name,
      price: Number(newProduct.price),
      unit: newProduct.unit,
      desc: newProduct.desc,
      image: newProduct.image || "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300"
    }]);

    if (error) alert("Gagal menambah produk: " + error.message);
    else {
      alert("Produk berhasil ditambahkan!");
      setNewProduct({ name: "", price: "", unit: "Pcs", desc: "", image: "" });
      fetchData();
    }
  };

  // Hapus Produk
  const handleDeleteProduct = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini dari toko?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert("Gagal menghapus: " + error.message);
    else fetchData();
  };

  // Kalkulasi Keuangan
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalProfit = Math.round(totalRevenue * 0.35);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 md:p-5 flex flex-col justify-between shadow-md">
        <div>
          <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
            <span className="text-2xl">🕋</span>
            <div>
              <h2 className="font-bold text-white text-sm md:text-base leading-tight">ZADESHAN ADMIN</h2>
              <p className="text-[10px] text-emerald-400 font-mono">SELLER CENTRE MAKKAH</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "orders" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span>📦</span>
              <span>Kelola Pesanan</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "products" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span>🏷️</span>
              <span>Katalog Produk</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
          <Link href="/" className="flex items-center justify-center space-x-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-xs">
            <span>← Lihat Toko Jamaah</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        
        {/* Top Header Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{orders.length} <span className="text-xs font-normal text-slate-500">Masuk</span></h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">🛒</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Omzet</p>
              <h3 className="text-xl font-black text-emerald-700 mt-0.5">SAR {totalRevenue}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">💰</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Profit</p>
              <h3 className="text-xl font-black text-amber-600 mt-0.5">SAR {totalProfit}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">📈</div>
          </div>
        </div>

        {/* TAB 1: KELOLA PESANAN */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">📦 Daftar Pesanan Masuk (Supabase)</h3>
                <p className="text-[11px] text-slate-500">Pantau pengiriman oleh-oleh langsung ke kamar hotel jamaah</p>
              </div>
              <button onClick={fetchData} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5">
                <span>🔄</span> Segarkan Data
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-8 text-center">Memuat data dari cloud database...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Belum ada pesanan masuk.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[9px] tracking-wider border-b">
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Nama Pemesan</th>
                      <th className="p-2.5">Hotel & Kamar</th>
                      <th className="p-2.5">Rincian Barang</th>
                      <th className="p-2.5">Metode Bayar</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-2.5 text-slate-400 text-[11px]">{new Date(o.created_at).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</td>
                        <td className="p-2.5 font-bold text-slate-900">{o.customer_name}</td>
                        <td className="p-2.5">
                          <span className="font-bold text-slate-700">{o.hotel}</span>
                          <div className="text-[10px] text-slate-400">Kmr: {o.room}</div>
                        </td>
                        <td className="p-2.5 text-slate-600 max-w-xs">{o.items}</td>
                        <td className="p-2.5">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {o.payment}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-black text-emerald-700 text-xs">SAR {o.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KATALOG PRODUK (CRUD) */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Form Tambah Produk */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
              <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-3">➕ Tambah Produk Baru ke Toko</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama Produk (ex: Kacang Almond 500g)"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="number"
                  placeholder="Harga dalam SAR (ex: 45)"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Satuan (ex: Pcs / Kg / Box)"
                  value={newProduct.unit}
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="URL Foto Produk (Link Gambar / Unsplash)"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50 sm:col-span-2"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs">
                  Simpan Produk ke Cloud
                </button>
              </form>
            </div>

            {/* List Produk Aktif */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
              <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-3">🏷️ Daftar Produk Aktif</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 bg-slate-50 shadow-2xs">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-white border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-extrabold">SAR {p.price} <span className="text-[9px] font-normal text-slate-400">/{p.unit}</span></p>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-[10px] text-red-600 hover:underline font-semibold mt-0.5"
                      >
                        Hapus Produk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}