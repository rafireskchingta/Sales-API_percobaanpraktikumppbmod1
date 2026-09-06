import { RestockModel } from "../models/restockModel.js";

export const RestockController = {
  async create(req, res) {
    try {
      const { product_id, supplier_name, quantity } = req.body;

      // Validasi input
      if (!product_id || !supplier_name || quantity === undefined) {
        return res.status(400).json({ error: "Lengkapi data product_id, supplier_name, dan quantity." });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: "Jumlah barang masuk (quantity) harus lebih dari 0." });
      }

      const result = await RestockModel.create(req.body);
      res.status(201).json({
        message: "Restock berhasil dicatat dan stok produk bertambah.",
        data: result
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
