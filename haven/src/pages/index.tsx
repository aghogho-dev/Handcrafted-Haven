import Navbar from '@/components/Navbar';
import styles from '@/styles/Home.module.css';


export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.heading}>Welcome to Handcraft Haven!</h1>
        <p className={styles.description}>You one-stop shop for amazing handcrafted products.</p>
        <button className={styles.cta}>Start Shopping</button>
      </main>
    </>
  );
}