"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  // State Form Tambah / Edit Produk
  const [formProduct, setFormProduct] = useState({ name: "", price: "", unit: "Pcs", image: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("zadeshan_orders") || "[]");
    setOrders(savedOrders);

    const savedProducts = localStorage.getItem("zadeshan_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem("zadeshan_products", JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);

  const saveProductsToStorage = (updatedList) => {
    setProducts(updatedList);
    localStorage.setItem("zadeshan_products", JSON.stringify(updatedList));
  };

  // Simpan Produk Baru atau Hasil Edit
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formProduct.name || !formProduct.price) return alert("Lengkapi nama dan harga produk!");

    const cleanImage = formProduct.image.trim() || "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400";

    if (editingId) {
      // Mode Edit
      const updated = products.map(p => p.id === editingId ? {
        ...p,
        name: formProduct.name,
        price: Number(formProduct.price),
        unit: formProduct.unit,
        image: cleanImage
      } : p);
      saveProductsToStorage(updated);
      setEditingId(null);
      alert("Produk berhasil diperbarui!");
    } else {
      // Mode Tambah Baru
      const newItem = {
        id: Date.now(),
        name: formProduct.name,
        price: Number(formProduct.price),
        unit: formProduct.unit,
        image: cleanImage
      };
      saveProductsToStorage([...products, newItem]);
      alert("Produk baru berhasil ditambahkan!");
    }

    setFormProduct({ name: "", price: "", unit: "Pcs", image: "" });
  };

  // Mulai Edit Produk
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormProduct({
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hapus Produk
  const handleDeleteProduct = (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    const filtered = products.filter(p => p.id !== id);
    saveProductsToStorage(filtered);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 md:p-5 flex flex-col justify-between shadow-md">
        <div>
          <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
            <span className="text-2xl">🕋</span>
            <div>
              <h2 className="font-bold text-white text-sm md:text-base leading-tight">ZADESHAN ADMIN</h2>
              <p className="text-[10px] text-emerald-400 font-mono">MODE LOKAL (TANPA DATABASE)</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "products" ? "bg-emerald-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span>🏷️</span>
              <span>Kelola Produk ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "orders" ? "bg-emerald-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <span>📦</span>
              <span>Riwayat Pesanan ({orders.length})</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0">
          <Link href="/" className="flex items-center justify-center space-x-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-semibold transition">
            <span>← Lihat Toko Jamaah</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        
        {/* TAB 1: KELOLA PRODUK (TAMBAH, EDIT, HAPUS) */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Form Tambah / Edit */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
                  {editingId ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
                </h3>
                {editingId && (
                  <button
                    onClick={() => { setEditingId(null); setFormProduct({ name: "", price: "", unit: "Pcs", image: "" }); }}
                    className="text-xs text-slate-500 underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama Produk (ex: Kurma Ajwa)"
                  value={formProduct.name}
                  onChange={e => setFormProduct({ ...formProduct, name: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="number"
                  placeholder="Harga dalam SAR (ex: 45)"
                  value={formProduct.price}
                  onChange={e => setFormProduct({ ...formProduct, price: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Satuan (ex: Pcs / Kg / Box)"
                  value={formProduct.unit}
                  onChange={e => setFormProduct({ ...formProduct, unit: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="Link Gambar Produk (URL HTTPS)"
                  value={formProduct.image}
                  onChange={e => setFormProduct({ ...formProduct, image: e.target.value })}
                  className="text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-emerald-600 bg-slate-50 sm:col-span-2"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition">
                  {editingId ? "Update Produk" : "Simpan Produk"}
                </button>
              </form>
            </div>

            {/* Daftar Produk */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">🏷️ Daftar Produk Aktif</h3>
                <button
                  onClick={() => { if(confirm("Kembalikan ke 10 produk contoh awal?")) saveProductsToStorage(DEFAULT_PRODUCTS); }}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-600"
                >
                  🔄 Reset Contoh Produk
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map(p => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-2.5 flex items-center space-x-3 bg-slate-50">
                    <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-white border flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-extrabold">SAR {p.price} <span className="text-[9px] font-normal text-slate-400">/{p.unit}</span></p>
                      <div className="flex gap-3 mt-1">
                        <button onClick={() => handleEditClick(p)} className="text-[10px] text-blue-600 hover:underline font-bold">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-[10px] text-red-600 hover:underline font-bold">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RIWAYAT PESANAN */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">📦 Riwayat Pesanan (Lokal Browser)</h3>
                <p className="text-[11px] text-slate-500">Total Omzet Tercatat: <strong className="text-emerald-700">SAR {totalRevenue}</strong></p>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Belum ada pesanan yang tercatat di browser ini.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b">
                      <th className="p-2.5">Waktu</th>
                      <th className="p-2.5">Pemesan</th>
                      <th className="p-2.5">Hotel & Kamar</th>
                      <th className="p-2.5">Barang</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="p-2.5 text-slate-400 text-[10px]">{new Date(o.created_at).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</td>
                        <td className="p-2.5 font-bold">{o.customer_name}</td>
                        <td className="p-2.5">{o.hotel} (Kmr {o.room})</td>
                        <td className="p-2.5 text-slate-600">{o.items}</td>
                        <td className="p-2.5 text-right font-black text-emerald-700">SAR {o.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}