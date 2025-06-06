import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from "next/router";



export default function Navbar() {

    const { data: session } = useSession();
    const router = useRouter();

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>HandcraftedHaven</div>
            {/* <ul className={styles.navLinks}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/login">Login</Link></li>
            </ul> */}
            <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                <Link href="/">Home</Link>
                <div>
                    {session ? (
                        <>
                            <span>Welcome, {session.user?.name || 'User'}</span>
                            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ border: "none", background: "none", cursor: "pointer" }}>Logout</button>
                        </>
                    ) : (
                        // <Link href="/login">
                        //     <button>Login</button>
                        // </Link>
                        <button onClick={() => router.push("/login")} style={{ border: "none", background: "none", cursor: "pointer" }}>Login</button>
                    )}
                </div>
            </div>
            

        </nav>
    );
}