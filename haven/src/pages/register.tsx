import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from "@/styles/Auth.module.css";
import type { UserRole } from '@/types/UserRole';

export default function Register() {

    const [role, setRole] = useState<UserRole>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (!res.ok) {
                const { message } = await res.json();
                setError(message || 'Registration failed');
                return;
            }

            if (role === "user") {
                router.push("/");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create an Account</h1>
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.roleSwitch}>
          <label>
            <input
            className={styles.input}
            type="radio"
            name="role"
            value="user"
            checked={role === "user"}
            onChange={() => setRole("user")}
            />
            User
          </label>
          <label>
            <input
            className={styles.input}
            type="radio"
            name="role"
            value="artisan"
            checked={role === "artisan"}
            onChange={() => setRole("artisan")}
            />
            Artisan
          </label>
        </div>
        <input
        className={styles.input}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        />
        <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className={styles.button} type="submit">Register as {role.toLocaleUpperCase()}</button>
      </form>
    </div>
  );
}