import { useState } from 'react';
import styles from "@/styles/Auth.module.css";
import { useRouter } from 'next/router';
import type { UserRole } from '@/types/UserRole';
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";


export default function Login() {
    const [role, setRole] = useState<UserRole>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/"
        });

        if (res?.error) {
            setError("Invalid email or password");
        } else {

           const session = await getSession();

           if (session?.user?.role === "user") {
                router.push("/userdashboard");
           } else if (session?.user?.role === "artisan") {
                router.push("/seller");
           } else {
                setError("Unknown role. Please contact support.");
           } 
        }
    };

        // if (email && password) {
        //     role === "user" ? router.push("/") : router.push("/dashboard")
        // }


    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} className={styles.form}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {/* <div className={styles.roleSwitch}>
                    <label>
                        <input 
                        type="radio" 
                        name="role"
                        value="user"
                        checked={role === 'user'}
                        onChange={() => setRole('user')}
                        />
                        User
                    </label>

                    <label>
                        <input 
                        type="radio" 
                        name="role"
                        value="artisan"
                        checked={role === 'artisan'}
                        onChange={() => setRole('artisan')}
                        />
                        Artisan
                    </label>
                </div> */}

                <input 
                type="email" 
                placeholder="info@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                />

                <input 
                type="password"
                placeholder="***********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                />

                <button className={styles.button} type="submit">Login as {role.toLocaleUpperCase()}</button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" style={{ color: "#0070f3", fontWeight: "bold" }}>
                Register
                </Link>
            </p>
        </div>
    );
}