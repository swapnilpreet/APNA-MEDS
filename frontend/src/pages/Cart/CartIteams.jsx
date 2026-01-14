import { MdDelete } from "react-icons/md";
const CartIteams = ({ cart, handleQtyChange, RemoveFromCart }) => {

  return (
    <div>
      {cart?.map((item) => (
        <div className="cart-item" key={item._id}>
          <img className="item-image" src={item.image.url ? item.image.url:item.image} alt={item.name}/>
          <div className="item-info">
            <h4>{item.name}</h4>
            <p>{item.brand}</p>
            <div className="price-section">
              <span>₹{item.discountedPrice}</span>
              <span className="mrp">₹{item.price}</span>
              <span className="discount">
                {item.discountPercentage}% OFF
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
