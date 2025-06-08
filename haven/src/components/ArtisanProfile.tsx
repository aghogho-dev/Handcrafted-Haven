import { useState } from  "react";
import { getSession } from "next-auth/react";
import stylesB from '@/styles/Artisan.module.css';
import stylesA from '@/styles/ArtEditProduct.module.css';

export default function ArtisanProfile({ onSuccess }: { onSuccess: () => void}) {
    const [form, setForm] = useState({
        name: "",
        bio: "",
        contact: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const session = await getSession();
        const res = await fetch("/api/profile", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ ...form, email: session?.user?.email })
        });

        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            setMessage("Profile saved successfully");
            onSuccess();
        } else {
            setMessage(result.error || "Failed to save profile.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={stylesA.modalContent}>
            <h2 className={stylesB.heading}>Create Your Profile</h2>
            <input 
                type="text" 
                name="name" 
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className={stylesB.input}
                required
            />
            <textarea 
                name="bio"
                placeholder="Bio"
                value={form.bio}
                onChange={handleChange}
                className={stylesB.textarea}
                required
            />
            <input 
                type="text" 
                name="contact" 
                placeholder="Contact Info"
                value={form.contact}
                onChange={handleChange}
                className={stylesB.input}
                required
            />
            <button type="submit" disabled={loading} className={stylesB.button}>
                {loading ? "Saving..." : "Save Profile"}
            </button>
            {message && <p>{message}</p>}
           
        </form>
    );
}