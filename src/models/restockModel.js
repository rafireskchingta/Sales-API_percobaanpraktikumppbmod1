import { supabase } from "../config/supabaseClient.js";

export const RestockModel = {
  async create(restockData) {
    const { product_id, supplier_name, quantity } = restockData;

    // 1. Ambil data produk saat ini untuk mengetahui jumlah stok sebelumnya
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single();

    if (fetchError) throw new Error("Produk tidak ditemukan atau " + fetchError.message);

    // 2. Tambahkan data riwayat restock ke tabel restocks
    const { data: restock, error: insertError } = await supabase
      .from("restocks")
      .insert([{ product_id, supplier_name, quantity }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3. Perbarui (tambah) stok produk di tabel products
    const newStock = product.stock + quantity;
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", product_id);

    if (updateError) throw updateError;

    return { restock, updatedStock: newStock };
  }
};
