import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "@/styles/UserProductList.module.css";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  createdBy: string;
  createdAt: string;
};

type Profile = {
  name: string;
  bio: string;
  contact: string;
  email: string;
};

export default function UserProductList() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserProducts() {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProducts();
  }, []);

  async function handleArtisanClick(email: string) {
    try {
      const res = await fetch(`/api/profiles/${encodeURIComponent(email)}`);
      const data = await res.json();
      setSelectedProfile(data);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch artisan profile:", error);
    }
  }

  function handleAddToCart(product: Product) {
    console.log("Added to cart:", product);
    alert(`Added "${product.title}" to cart.`);
  }

  return (
    <div className={styles.container}>
      <h2>Handcrafted Items:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={styles.card}>
              <img
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <p>{product.title}</p>
              <p>{product.description}</p>
              <p>
                <strong>${product.price}</strong>
              </p>
              <p>
                Artisan:{" "}
                <span
                  onClick={() => handleArtisanClick(product.createdBy)}
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                  {product.createdBy}
                </span>
              </p>
              <div className={styles.actions}>
                <button className={styles.button} onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedProfile && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ float: "right", fontWeight: "bold" }}
            >
              ×
            </button>
            <h3>{selectedProfile.name}</h3>
            <p>
              <strong>Email:</strong> {selectedProfile.email}
            </p>
            <p>
              <strong>Bio:</strong> {selectedProfile.bio}
            </p>
            {/* <p>
              <strong>Contact:</strong> {selectedProfile.contact}
            </p> */}
            <button
              onClick={() => alert(`You're now following ${selectedProfile.name}`)}
              className={styles.button}
              style={{ marginTop: "1rem" }}
            >
              Follow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
