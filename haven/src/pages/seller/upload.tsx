import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '@/styles/Artisan.module.css';

export default function ProductUpload() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: 0,
        image: "",
        category: "",
    });

    const [message, setMessage] = useState("");

    if (status === "loading") return <p>Loading...</p>;

    if (!session || session.user.role !== "artisan") {
        return <p>Access denied. Artisans only.</p>;
    }

    const handleChange  = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form, [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    createdBy: session.user.email,
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Product added successfully!");
                setForm({
                    title: "",
                    description: "",
                    price: 0,
                    image: "",
                    category: "",
                });
            } else {
                setMessage(data.error || "Failed to add product.");
            }

        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("An error occurred while adding the product.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Upload Product</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input className={styles.input} name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <textarea className={styles.textarea} name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <input className={styles.input} name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
                <input className={styles.input} name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
                <input className={styles.input} name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
                <button className={styles.button} type="submit">Upload Product</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}