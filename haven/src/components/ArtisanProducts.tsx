import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import styles from "@/styles/ArtProducts.module.css";

type Product = {
    _id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    category: string;
};


export default function ArtisanProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const session = await getSession();
            if (!session?.user?.email) return;

            const res = await fetch(`/api/products?createdBy=${session.user.email}`);
            
            if (!res.ok) {
                console.error("Failed to fetch products");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });

        setProducts(prev => prev.filter(p => p._id !== id));
    };

    return (
        <div className={styles.container}>
            <h2>Your Products</h2>
            {loading ? (
                <p>Loading...</p>
            ): products.length === 0 ? (
                <p>No products uploaded yet.</p>
            ): (
                <div className={styles.grid}>
                    {products.map(product => (
                        <div key={product._id} className={styles.card}>
                            <img src={product.image} alt={product.title} width={200} height={200} style={{ objectFit: "cover", borderRadius: "8px" }} />
                            <p>{product.title}</p>
                            <p>{product.description}</p>
                            <p><strong>${product.price}</strong></p>
                            <p>Category: {product.category}</p>
                            <div className={styles.actions}>
                                <button className={styles.button}>Edit</button>
                                <button className={styles.button} onClick={() => handleDelete(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}