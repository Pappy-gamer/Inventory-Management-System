import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
// import ProductForm from "../components/ProductForm";
import TransactionList from "../components/TransactionList";

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAmount, setStockAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const totalValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0,
  );

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data);
    console.log("fetching products");
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    console.log("DELETE ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    fetchProducts();
  }

  // async function handleDelete(productId) {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this product?",
  //   );
  //   if (!confirmed) return;
  //   const { error } = await supabase
  //     .from("products")
  //     .delete()
  //     .eq("id", productId);
  //   if (error) {
  //     console.log(error);
  //     alert("Failed to delete product");
  //     return;
  //   }
  //   fetchProducts();
  // }

  // async function handleDelete(productId) {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this product?",
  //   );

  //   if (!confirmed) return;

  //   const { error } = await supabase
  //     .from("products")
  //     .delete()
  //     .eq("id", productId);

  //   if (error) {
  //     console.log(error);
  //     alert("Failed to delete product");
  //     return;
  //   }

  //   // 🔥 LOG TRANSACTION
  //   await supabase.from("transactions").insert([
  //     {
  //       product_name: "Deleted Product",
  //       type: "DELETE",
  //       quantity: 0,
  //       user_id: user.id,
  //     },
  //   ]);

  //   fetchProducts();
  // }

  //   async function handleDelete(product) {
  //   if (!product?.id) {
  //     alert("Invalid product selected");
  //     return;
  //   }

  //   const confirmed = window.confirm(
  //     `Are you sure you want to delete "${product.name}"?`
  //   );

  //   if (!confirmed) return;

  //   // 1. Delete from products table
  //   const { error } = await supabase
  //     .from("products")
  //     .delete()
  //     .eq("id", product.id);

  //   if (error) {
  //     console.error("Delete error:", error.message);
  //     alert("Failed to delete product");
  //     return;
  //   }

  //   // 2. Log transaction with REAL product data
  //   const { error: txnError } = await supabase
  //     .from("transactions")
  //     .insert([
  //       {
  //         product_id: product.id,
  //         product_name: product.name,
  //         type: "DELETE",
  //         quantity: product.quantity,
  //         price: product.price,
  //         user_id: product.user_id, // or user.id if you prefer
  //       },
  //     ]);

  //   if (txnError) {
  //     console.error("Transaction log error:", txnError.message);
  //     // IMPORTANT: don't block UX if logging fails
  //   }

  //   // 3. Update UI
  //   fetchProducts();
  // }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function handleStockIn(product, amount) {
    // const amount = Number(prompt("Enter quantity to add:"));
    // const amount = 10;

    if (!amount || amount <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (!amount || amount <= 0) return;

    const newQuantity = product.quantity + amount;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        quantity: newQuantity,
      })
      .eq("id", product.id);

    if (updateError) {
      console.log(updateError);
      return;
    }

    console.log(product);

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          type: "IN",
          quantity: amount,
        },
      ]);

    if (transactionError) {
      console.log(transactionError);
    }

    fetchProducts();
    fetchTransactions();
    setStockAmount("");
    setSelectedProduct(null);
  }

  async function handleStockOut(product, amount) {
    // const amount = Number(prompt("Enter quantity to remove:"));
    // const amount = 10;

    if (!amount || amount <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    if (!amount || amount <= 0) return;

    if (amount > product.quantity) {
      alert("Cannot remove more than available stock");
      return;
    }

    const newQuantity = product.quantity - amount;

    const { error: updateError } = await supabase
      .from("products")
      .update({
        quantity: newQuantity,
      })
      .eq("id", product.id);

    if (updateError) {
      console.log(updateError);
      return;
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          type: "OUT",
          quantity: amount,
        },
      ]);

    if (transactionError) {
      console.log(transactionError);
    }

    fetchProducts();
    fetchTransactions();
    setStockAmount("");
    setSelectedProduct(null);
  }

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setTransactions(data);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="dashboard-container">
      <h1>Inventory Dashboard</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <p>Logged in as: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="stat-card">
          <h3>Total Stock Units</h3>
          <p>{totalUnits}</p>
        </div>

        <div className="stat-card">
          <h3>Inventory Value</h3>
          <p>₦{totalValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="section">
        <ProductForm
          user={user}
          editingProduct={editingProduct}
          onUpdateComplete={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
          onProductAdded={fetchProducts}
        />
      </div>

      <div className="section">
        <h2>Search Products</h2>

        <input
          className="search-input"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="section">
        <ProductList
          products={filteredProducts}
          onDelete={handleDelete}
          onEdit={setEditingProduct}
          onSelectProduct={setSelectedProduct}
        />
      </div>

      <div className="section">
        <h2>Stock Operations</h2>

        {selectedProduct ? (
          <>
            <p>Selected Product: {selectedProduct.name}</p>

            <input
              type="number"
              placeholder="Enter quantity"
              value={stockAmount}
              onChange={(e) => setStockAmount(e.target.value)}
            />

            <button
              className="stock-in-btn"
              onClick={() =>
                handleStockIn(selectedProduct, Number(stockAmount))
              }
            >
              Stock In
            </button>

            <button
              className="stock-out-btn"
              onClick={() =>
                handleStockOut(selectedProduct, Number(stockAmount))
              }
            >
              Stock Out
            </button>
          </>
        ) : (
          <p>Select a product first.</p>
        )}
      </div>

      <div className="section">
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}

export default Dashboard;
