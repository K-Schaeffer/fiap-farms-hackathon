import styles from '../styles/index.module.css';
import Link from 'next/link';

export default function Web() {
  return (
    <div className={styles.container}>
      <Link href="/sales">Sales</Link>
      <Link href="/products">Products</Link>
    </div>
  );
}
