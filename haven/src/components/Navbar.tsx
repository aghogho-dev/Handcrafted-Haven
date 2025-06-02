import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';


export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>HandcraftedHaven</div>
            <ul className={styles.navLinks}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/login">Login</Link></li>
            </ul>
        </nav>
    );
}