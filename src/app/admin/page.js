"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'products'
  const [statusFilter, setStatusFilter] = useState("Semua");

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
      
      {/* Sidebar Navigation (Shopee Seller Style) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-8 border-b border-slate-800 pb-4">
            <span className="text-2xl">🕋</span>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">ZADESHAN ADMIN</h2>
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

        <div className="pt-6 border-t border-slate-800">
          <Link href="/" className="flex items-center justify-center space-x-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-semibold transition">
            <span>← Lihat Toko Jamaah</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Top Header Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{orders.length} <span className="text-xs font-normal text-slate-500">Masuk</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">🛒</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">SAR {totalRevenue}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">💰</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimasi Profit</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">SAR {totalProfit}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">📈</div>
          </div>
        </div>

        {/* TAB 1: KELOLA PESANAN */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">📦 Daftar Pesanan Masuk (Supabase Cloud)</h3>
                <p className="text-xs text-slate-500">Pantau pengiriman oleh-oleh langsung ke kamar hotel jamaah</p>
              </div>
              <button onClick={fetchData} className="text-xs bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5">
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
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b">
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Jamaah / WA</th>
                      <th className="p-3">Hotel & Kamar</th>
                      <th className="p-3">Rincian Barang</th>
                      <th className="p-3">Metode Bayar</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 text-slate-400">{new Date(o.created_at).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</td>
                        <td className="p-3 font-semibold text-slate-900">
                          {o.customer_name}
                          <div className="text-[10px] text-slate-400 font-normal">{o.phone}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-700">{o.hotel}</span>
                          <div className="text-[10px] text-slate-400">Kmr: {o.room}</div>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs">{o.items}</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {o.payment}
                          </span>
                        </td>
                        <td className="p-3 text-right font-black text-emerald-700 text-sm">SAR {o.total}</td>
                        <td className="p-3 text-center">
                          <a
                            href={`https://wa.me/${o.phone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1"
                          >
                            <span>💬 Chat WA</span>
                          </a>
                        </td>
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
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">➕ Tambah Produk Baru ke Toko</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama Produk (ex: Kacang Almond 500g)"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
                <input
                  type="number"
                  placeholder="Harga dalam SAR (ex: 45)"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
                <input
                  type="text"
                  placeholder="Satuan (ex: Kg / Galon / Kotak)"
                  value={newProduct.unit}
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600"
                />
                <input
                  type="text"
                  placeholder="URL Foto Produk (Gambar Unsplash/Link)"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 sm:col-span-2"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm">
                  Simpan Produk ke Cloud
                </button>
              </form>
            </div>

            {/* List Produk Aktif */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">🏷️ Daftar Produk Aktif</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-3 flex items-center space-x-3 bg-slate-50">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-white border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-extrabold">SAR {p.price} <span className="text-[9px] font-normal text-slate-400">/{p.unit}</span></p>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-[10px] text-red-600 hover:underline font-semibold mt-1"
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