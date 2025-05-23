import React, { useState } from "react";

function BuyBookSection({ stock, onBuy }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleBuy = () => {
    if (stock > 0 && quantity > 0) {
      onBuy(quantity);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {stock > 0 ? (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                className="px-3 py-1 text-xl font-bold disabled:opacity-30"
                onClick={handleDecrease}
                disabled={quantity === 1}
              >
                −
              </button>
              <span className="px-4 py-1 text-lg">{quantity}</span>
              <button
                className="px-3 py-1 text-xl font-bold disabled:opacity-30"
                onClick={handleIncrease}
                disabled={quantity === stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">(Stock: {stock})</span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
            onClick={handleBuy}
          >
            Comprar
          </button>
        </>
      ) : (
        <p className="text-red-500 font-medium">Producto agotado</p>
      )}
    </div>
  );
}

export default BuyBookSection;
