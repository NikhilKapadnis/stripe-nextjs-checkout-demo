"use client";

export default function Home() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong");
      console.error(data);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        fontFamily: "Arial",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <h1>Mini Ecommerce Store</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 24,
          maxWidth: 350,
          borderRadius: 8,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <h2>Demo T-Shirt</h2>
        <p>Simple demo product for Stripe Checkout.</p>
        <h3>€10.00</h3>

        <button
          onClick={handleCheckout}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            backgroundColor: "#f3f4f6",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}