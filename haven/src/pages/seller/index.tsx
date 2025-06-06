import { useState } from "react";
import ProductUpload from "./upload";
import styles from "@/styles/ArtDashboard.module.css";

export default function ArtisanDashboard() {
    const [activeTab, setActiveTab] = useState<"upload" | "profile" | null>(null);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Seller Dashboard</h1>

            <div className={styles.nav}>
                <button className={styles.tab} onClick={() => setActiveTab('upload')}>Upload Product</button>
                <button className={styles.tab} onClick={() => setActiveTab('profile')}>Create Profile</button>
            </div>
        

            <div className={styles.panel}>
                { activeTab === "upload" && <ProductUpload /> }
                { activeTab === "profile" && <div>Profile Section</div> }
                {!activeTab && <p>Please select an option above.</p>}
            </div>
        </div>
    );
}