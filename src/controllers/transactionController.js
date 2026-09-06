import { TransactionModel } from "../models/transactionModel.js";

export const TransactionController = {
  async getAll(req, res) {
    try {
      const transactions = await TransactionModel.getAll();
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { customer_id, product_id, quantity } = req.body;

      // Validasi input manual
      if (!customer_id || !product_id || quantity === undefined) {
        return res.status(400).json({ error: "Lengkapi data customer_id, product_id, dan quantity." });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: "Jumlah pembelian (quantity) harus lebih dari 0." });
      }

      const result = await TransactionModel.create(req.body);
      res.status(201).json({
        message: "Transaksi berhasil. Stok produk telah dikurangi.",
        data: result
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
