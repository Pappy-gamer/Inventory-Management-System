function ProductList({ products, onDelete, onEdit, onSelectProduct }) {
  return (
    <div>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>₦{Number(product.price).toLocaleString()}</td>

                <td>
                  <button className="edit-btn" onClick={() => onEdit(product)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(product.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="stock-btn"
                    onClick={() => onSelectProduct(product)}
                  >
                    Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
