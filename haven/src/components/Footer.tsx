import styles from  "@/styles/Footer.module.css";
import stylesNav from "@/styles/Navbar.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
                <p>&copy; {new Date().getFullYear()}</p> 
                <p className={stylesNav.logo}>Handcrafted Haven.</p> 
                <p>All rights reserved.</p>
            </div>
        </footer>
    );
}