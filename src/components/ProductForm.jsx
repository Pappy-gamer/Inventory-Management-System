// import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useState, useEffect } from "react";

function ProductForm({
  user,
  editingProduct,
  onUpdateComplete,
  onProductAdded,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setQuantity(editingProduct.quantity);
      setPrice(editingProduct.price);
    }
  }, [editingProduct]);

  // async function handleAddProduct() {
  //   if (!name.trim()) {
  //     alert("Product name is required");
  //     return;
  //   }

  //   if (quantity < 0) {
  //     alert("Quantity cannot be negative");
  //     return;
  //   }

  //   if (price < 0) {
  //     alert("Price cannot be negative");
  //     return;
  //   }

  //   const { error } = await supabase.from("products").insert([
  //     {
  //       name,
  //       quantity: Number(quantity),
  //       price: Number(price),
  //       user_id: user.id,
  //     },
  //   ]);

  //   if (error) {
  //     console.log(error);
  //     alert("Failed to add product");
  //     return;
  //   }

  //   // 🔥 LOG TRANSACTION
  //   await supabase.from("transactions").insert([
  //     {
  //       product_name: name,
  //       type: "ADD",
  //       quantity: Number(quantity),
  //       user_id: user.id,
  //     },
  //   ]);

  //   setName("");
  //   setQuantity("");
  //   setPrice("");

  //   onProductAdded();
  // }
  async function handleAddProduct() {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }
    if (quantity < 0) {
      alert("Quantity cannot be negative");
      return;
    }
    if (price < 0) {
      alert("Price cannot be negative");
      return;
    }
    const { error } = await supabase.from("products").insert([
      {
        name,
        quantity: Number(quantity),
        price: Number(price),
        user_id: user.id,
      },
    ]);
    if (error) {
      console.log(error);
      alert("Failed to add product");
      return;
    }
    setName("");
    setQuantity("");
    setPrice("");
    onProductAdded();
  }
  async function handleUpdateProduct() {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }
    if (Number(quantity) < 0) {
      alert("Quantity cannot be negative");
      return;
    }
    if (Number(price) < 0) {
      alert("Price cannot be negative");
      return;
    }
    const { error } = await supabase
      .from("products")
      .update({ name, quantity: Number(quantity), price: Number(price) })
      .eq("id", editingProduct.id);
    if (error) {
      console.log(error);
      alert("Failed to update product");
      return;
    }
    setName("");
    setQuantity("");
    setPrice("");
    onUpdateComplete();
  }

  //   async function handleUpdateProduct() {
  //     if (!name.trim()) {
  //       alert("Product name is required");
  //       return;
  //     }

  //     if (Number(quantity) < 0) {
  //       alert("Quantity cannot be negative");
  //       return;
  //     }

  //     if (Number(price) < 0) {
  //       alert("Price cannot be negative");
  //       return;
  //     }

  //     const { error } = await supabase
  //       .from("products")
  //       .update({
  //         name,
  //         quantity: Number(quantity),
  //         price: Number(price),
  //       })
  //       .eq("id", editingProduct.id);

  //     if (error) {
  //       console.log(error);
  //       alert("Failed to update product");
  //       return;
  //     }

  //     // 🔥 LOG TRANSACTION
  // await supabase.from("transactions").insert([
  //   {
  //     product_name: name,
  //     type: "UPDATE",
  //     quantity: Number(quantity),
  //     user_id: user.id,
  //   },
  // ]);

  //     setName("");
  //     setQuantity("");
  //     setPrice("");

  //     onUpdateComplete();
  //   }

  return (
    <div>
      <h2>Add Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        className="add-btn"
        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
      >
        {editingProduct ? "Save Changes" : "Add Product"}
      </button>
    </div>
  );
}

export default ProductForm;
