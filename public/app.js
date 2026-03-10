const productsEl = document.getElementById("products");
const productSelect = document.getElementById("product_id");
const form = document.getElementById("order-form");
const resultEl = document.getElementById("result");

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  productsEl.innerHTML = "";
  productSelect.innerHTML = "";

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>$${Number(product.price).toFixed(2)}</strong>
      <p>Stock: ${product.stock}</p>
    `;
    productsEl.appendChild(card);

    const option = document.createElement("option");
    option.value = String(product.id);
    option.textContent = `${product.name} ($${Number(product.price).toFixed(2)})`;
    productSelect.appendChild(option);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    customer_name: document.getElementById("customer_name").value,
    customer_email: document.getElementById("customer_email").value,
    items: [
      {
        product_id: Number(document.getElementById("product_id").value),
        quantity: Number(document.getElementById("quantity").value)
      }
    ]
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  resultEl.textContent = JSON.stringify(data, null, 2);
  await loadProducts();
});

loadProducts().catch((error) => {
  resultEl.textContent = `Error loading products: ${error.message}`;
});
