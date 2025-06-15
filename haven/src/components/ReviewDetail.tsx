import { useState } from "react";
import styles from "../styles/ReviewDetail.module.css";

type ReviewDetailProps = {
    productTitle: string;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
};

export default function ReviewDetail({ productTitle, onClose, onSubmit}: ReviewDetailProps) {
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await onSubmit(rating, reviewText);
        setReviewText("");
        setRating(5);
        setLoading(false);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Review: {productTitle}</h2>

                <label className={styles.label}>Rating</label>
                <select
                className={styles.select}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                >
                {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
                ))}
                </select>

                <label className={styles.label}>Comment</label>
                <textarea
                className={styles.textarea}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Write your review..."
                />

                <div className={styles.buttonGroup}>
                <button
                    className={`${styles.button} ${styles.cancel}`}
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    className={`${styles.button} ${styles.submit}`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
                </div>
            </div>
            </div>

    )
}