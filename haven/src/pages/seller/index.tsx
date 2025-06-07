import { useState } from "react";
import ProductUpload from "./upload";
import styles from "@/styles/ArtDashboard.module.css";
import modalStyles from "@/styles/ArtModal.module.css";
import ArtisanProducts from "@/components/ArtisanProducts";

export default function ArtisanDashboard() {
    const [activeTab, setActiveTab] = useState<"upload" | "profile" | null>(null);
    const closeModal = () => setActiveTab(null);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Artisan Dashboard</h1>

            <div className={styles.nav}>
                <button className={styles.tab} onClick={() => setActiveTab('upload')}>Upload Product</button>
                <button className={styles.tab} onClick={() => setActiveTab('profile')}>Create Profile</button>
            </div>
        

            { activeTab && (
                <div className={modalStyles.modalOverlay}>
                    <div className={modalStyles.modalContent}>
                        <button onClick={closeModal} className={modalStyles.closeButton}>&times;</button>
                        {activeTab === "upload" && <ProductUpload />}
                        {activeTab === "profile" && <div>Create Profile Form</div>}
                    </div>
                </div>
            )}

            {!activeTab && <ArtisanProducts />}
        </div>
    );
}