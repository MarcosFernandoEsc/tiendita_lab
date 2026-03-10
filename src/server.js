require("dotenv").config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const pool = require("./db");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, db_time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, price, stock FROM products ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch products" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customer_name, customer_email, items } = req.body;

  if (!customer_name || !customer_email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order payload" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (customer_name, customer_email) VALUES ($1, $2) RETURNING id, created_at",
      [customer_name, customer_email]
    );

    const orderId = orderResult.rows[0].id;
    let total = 0;

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid item data");
      }

      const productResult = await client.query(
        "SELECT id, price, stock FROM products WHERE id = $1",
        [productId]
      );

      if (productResult.rowCount === 0) {
        throw new Error(`Product ${productId} does not exist`);
      }

      const product = productResult.rows[0];

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for product ${productId}`);
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      total += lineTotal;

      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
        [orderId, productId, quantity, unitPrice]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [quantity, productId]
      );
    }

    await client.query("UPDATE orders SET total_amount = $1 WHERE id = $2", [total, orderId]);
    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created",
      order_id: orderId,
      created_at: orderResult.rows[0].created_at,
      total
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(400).json({ error: error.message || "Order creation failed" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
