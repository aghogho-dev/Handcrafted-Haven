import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import styles from "@/styles/ArtProducts.module.css";
import stylesA from '@/styles/ArtEditProduct.module.css';
import stylesB from '@/styles/Artisan.module.css';
import modalStyles from "@/styles/ArtModal.module.css";

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
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<Product | null>(null);

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

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        if (!editForm) return;

        const res = await fetch(`/api/products/${editProduct?._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editForm)
        });

        if (res.ok) {
            setProducts(prev =>
                prev.map(p => (p._id === editForm._id ? editForm: p))
            );

            setEditProduct(null);
            setEditForm(null);
        } else {
            alert("Failed to update product");
        }
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
                                <button className={styles.button} onClick={() => {
                                    setEditProduct(product);
                                    setEditForm(product);
                                }}>Edit</button>
                                <button className={styles.button} onClick={() => handleDelete(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editProduct && editForm && (
                <div className={stylesA.modalOverlay}>
                    <div className={stylesA.modalContent}>
                        <h3 className={stylesB.heading}>Edit Product</h3>
                        <input
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            placeholder="Title"
                            className={stylesB.input}
                        />
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            placeholder="Description"
                            className={stylesB.textarea}
                        />
                        <input
                            type="number"
                            name="price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            placeholder="Price"
                            className={stylesB.input}
                        />
                        <input
                            name="image"
                            value={editForm.image}
                            onChange={handleEditChange}
                            placeholder="Image URL"
                            className={stylesB.input}
                        />
                        <input
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                            placeholder="Category"
                            className={stylesB.input}
                        />
                        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                            <button className={stylesB.button} onClick={handleUpdate}>Update</button>
                            <button className={stylesB.button} onClick={() => {
                                setEditProduct(null);
                                setEditForm(null);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        
    );
}