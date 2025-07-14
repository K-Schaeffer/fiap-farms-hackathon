import { FButton } from '@fiap-farms/web-ui';

import styles from '../styles/index.module.css';
import Link from 'next/link';

export default function Web() {
  return (
    <div className={styles.container}>
      <FButton onClick={() => console.log('Pressed!')}>Component Shell</FButton>
      <Link href="/sales">Sales</Link>
      <Link href="/products">Products</Link>
    </div>
  );
}
