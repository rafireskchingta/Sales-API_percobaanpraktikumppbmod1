import { supabase } from "../config/supabaseClient.js";

export const TransactionModel = {
  // Mendapatkan semua data transaksi beserta detail pelanggan dan produk
  async getAll() {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id, 
        quantity, 
        total_price, 
        created_at,
        customers ( id, name ),
        products ( id, name, price )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Membuat transaksi baru dan mengurangi stok
  async create(transactionData) {
    const { customer_id, product_id, quantity } = transactionData;

    // 1. Ambil data produk untuk cek stok dan harga
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock, price")
      .eq("id", product_id)
      .single();

    if (productError) throw new Error("Produk tidak ditemukan.");
    
    // 2. Cek apakah stok cukup
    if (product.stock < quantity) {
      throw new Error(`Stok tidak mencukupi. Sisa stok saat ini: ${product.stock}`);
    }

    // 3. Hitung total harga
    const total_price = product.price * quantity;

    // 4. Catat transaksi ke tabel transactions
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert([{ customer_id, product_id, quantity, total_price }])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // 5. Kurangi stok produk
    const newStock = product.stock - quantity;
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", product_id);

    if (updateError) throw updateError;

    return { transaction, updatedStock: newStock };
  }
};
