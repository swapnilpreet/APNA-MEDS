import React from "react";
import { MdDelete } from "react-icons/md";

const CartIteams = ({ cart, handleQtyChange, RemoveFromCart }) => {
  return (
    <div>
      {cart?.map((item) => (
        <div className="cart-item" key={item._id}>
          <img className="item-image" src={item.image.url ? item.image.url:item.image} alt={item.name} />
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <div className="price-section">
              <span>₹{item.price}</span>
              <span className="mrp">₹{item.price + 88}</span>
              <span className="discount">
                {item.price > 0
                  ? `${(
                      ((item.price + 88 - item.price) / (item.price + 88)) *
                      100
                    ).toFixed()}% OFF`
                  : "No Discount"}
              </span>
            </div>
          </div>

          <div className="actions">
            <MdDelete
              size={28}
              onClick={() => RemoveFromCart({ medicineId: item?._id })}
            />
            <select
              className="qty-select"
              value={item.qty}
              onChange={(e) =>
                handleQtyChange(item._id, Number(e.target.value))
              }
            >
              {/* {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))} */}
              {Array.from(
                { length: Math.min(item.countInStock, 5) },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartIteams;
