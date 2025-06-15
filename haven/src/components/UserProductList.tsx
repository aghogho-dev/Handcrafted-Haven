import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "@/styles/UserProductList.module.css";
import ReviewDetail from "@/components/ReviewDetail";
import StarRating from "@/components/StarRating";


type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  createdBy: string;
  createdAt: string;
  reviews?: { rating: number }[];
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedProducts, setFollowedProducts] = useState<Product[]>([]);

  const [followedArtisanEmails, setFollowedArtisanEmails] = useState<string[]>([]);
  const [selectedArtisanEmail, setSelectedArtisanEmail] = useState<string | null>(null);
  const [selectedArtisanProducts, setSelectedArtisanProducts] = useState<Product[]>([]);
  const [showArtisanProductsModal, setShowArtisanProductsModal] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [reviewingProductId, setReviewingProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchUserProducts() {
      try {
        const res = await fetch(`/api/products`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(p =>
        p.category?.toLowerCase().trim() === category.toLowerCase().trim());
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [category, minPrice, maxPrice, products]);

  
  useEffect(() => {
    async function fetchFollowed() {
        if (!session?.user?.email) return;
        const res = await fetch(`/api/followed?userEmail=${session.user.email}`);
        const data: Product[] = await res.json(); // Explicitly type as Product[]
        const uniqueEmails: string[] = [...new Set(data.map((product) => product.createdBy))];
        setFollowedArtisanEmails(uniqueEmails);
    }

    fetchFollowed();
    }, [session?.user?.email]);


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
    setReviewingProductId(product._id);
    setSelectedProduct(product);
  }

  async function handleFollow() {

        if (!session?.user?.email || !selectedProfile) return;

        try {
            await fetch('/api/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    followerEmail: session.user.email,
                    followingEmail: selectedProfile.email,}),
                });
            alert(`You're now following ${selectedProfile.name}`);
            } catch (err) {
                    console.error("Failed to follow artisan:", err);
            }
        }

        async function handleFollowedArtisanClick(email: string) {
    try {
        const res = await fetch(`/api/products?createdBy=${encodeURIComponent(email)}`);
        const data: Product[] = await res.json();
        setSelectedArtisanProducts(data);
        setSelectedArtisanEmail(email);
        setShowArtisanProductsModal(true);
    } catch (err) {
        console.error("Failed to load artisan products:", err);
    }
  }

  function getAverageRating(reviews: { rating: number }[] = []) {
      if (!reviews.length) return "5";
      const total = reviews.reduce((acc, r) => acc + r.rating, 0);
      return (total / reviews.length).toFixed(2);
  }




  return (
    <div className={styles.container}>
      <h2>Handcrafted Items:</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
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
              <p><strong>${product.price}</strong></p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <StarRating rating={parseFloat(getAverageRating(product.reviews))} />
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  ({product.reviews?.length ?? 0})
                </span>
              </div>

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
              &times;
            </button>
            <h3>{selectedProfile.name}</h3>
            <p><strong>Email:</strong> {selectedProfile.email}</p>
            <p><strong>Bio:</strong> {selectedProfile.bio}</p>
            <p><strong>Contact:</strong> {selectedProfile.contact}</p>
            <button onClick={handleFollow} className={styles.button} style={{ marginTop: "1rem" }}>
                Follow
            </button>

          </div>
        </div>
      )}

       <div>
  <h2>Artisans You Follow</h2>
  {followedArtisanEmails.length === 0 ? (
    <p>You are not following any artisans yet.</p>
  ) : (
    <ul>
      {followedArtisanEmails.map((email) => (
        <li key={email}>
          <span
            onClick={() => handleFollowedArtisanClick(email)}
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          >
            {email}
          </span>
        </li>
      ))}
    </ul>
  )}

  {showArtisanProductsModal && (
        <div className={styles.modalPop}>
        <div className={styles.modalContent}>
            <div>
            <button
                onClick={() => setShowArtisanProductsModal(false)}
                style={{ float: "right", fontWeight: "bold" }}
                className={styles.modalClose}
                >
                &times;
            </button>
            <h3>Products by {selectedArtisanEmail}</h3>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", }}>
                {selectedArtisanProducts.length === 0 ? (
                <p>No products found.</p>
                ) : (
                selectedArtisanProducts.map((product) => (
                    <div key={product._id} className={styles.card}>
                        <img src={product.image} alt={product.title} width={150} />
                        <p>{product.title}</p>
                        <p>${product.price}</p>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <StarRating rating={parseFloat(getAverageRating(product.reviews))} />
                          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                            ({product.reviews?.length ?? 0})
                          </span>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.button} onClick={() => handleAddToCart(product)}>
                            Add to Cart
                            </button>
                        </div>
                        
                    </div>
                    ))
                )}
            </div>
        </div>
    </div>
    )}
    </div>

    {reviewingProductId && selectedProduct && (
        <ReviewDetail
          productTitle={selectedProduct.title}
          onClose={() => {
            setReviewingProductId(null);
            setSelectedProduct(null);
          }}
          onSubmit={async (rating, comment) => {
            const res = await fetch("/api/review", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: reviewingProductId,
                rating,
                comment
              })
            });

            const data = await res.json();
            alert(data.message);
            setReviewingProductId(null);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
