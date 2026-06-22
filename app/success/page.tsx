"use client";

import { useMemo, useState } from "react";

const products = [
  {
    id: "white_shirt",
    name: "White Shirt",
    color: "White",
    price: 1000,
    description: "Clean white cotton demo shirt",
  },
  {
    id: "black_shirt",
    name: "Black Shirt",
    color: "Black",
    price: 1200,
    description: "Classic black demo shirt",
  },
  {
    id: "purple_shirt",
    name: "Purple Shirt",
    color: "Purple",
    price: 1500,
    description: "Premium purple demo shirt",
  },
];

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId)!,
    [selectedProductId]
  );

  const total = selectedProduct.price * quantity;

  async function handleCheckout() {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productDescription: selectedProduct.description,
        color: selectedProduct.color,
        unitAmount: selectedProduct.price,
        quantity,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert("Failed to create checkout session");
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-10">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Stripe Demo Store
          </p>
          <h1 className="mt-2 text-4xl font-bold text-neutral-900">
            Simple Shirt Checkout
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Pick a shirt, choose quantity, and complete a Stripe test payment.
            After payment succeeds, the webhook writes the order to Google
            Sheets.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                selectedProductId === product.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
              }`}
            >
              <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-neutral-100">
                <div
                  className={`h-20 w-20 rounded-full border ${
                    product.color === "White"
                      ? "bg-white"
                      : product.color === "Black"
                      ? "bg-black"
                      : "bg-purple-500"
                  }`}
                />
              </div>

              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p
                className={`mt-1 text-sm ${
                  selectedProductId === product.id
                    ? "text-neutral-300"
                    : "text-neutral-500"
                }`}
              >
                {product.description}
              </p>
              <p className="mt-4 text-xl font-bold">
                €{(product.price / 100).toFixed(2)}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Quantity
              </label>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-10 w-10 rounded-full border border-neutral-300 text-xl"
                >
                  -
                </button>
                <span className="w-10 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  className="h-10 w-10 rounded-full border border-neutral-300 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-5">
              <p className="text-sm text-neutral-500">Selected product</p>
              <h3 className="mt-1 text-xl font-bold text-neutral-900">
                {selectedProduct.name}
              </h3>
              <p className="mt-1 text-neutral-600">
                {quantity} × €{(selectedProduct.price / 100).toFixed(2)}
              </p>
              <p className="mt-4 text-3xl font-bold text-neutral-900">
                Total: €{(total / 100).toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-xl bg-neutral-900 px-6 py-4 text-lg font-semibold text-white transition hover:bg-neutral-700"
          >
            Buy Now
          </button>
        </div>
      </section>
    </main>
  );
}