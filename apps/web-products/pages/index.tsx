import { FButton } from '@fiap-farms/web-ui';

import styles from '../styles/index.module.css';

export default function Web() {
  return (
    <div className={styles.container}>
      <h1>Web Products</h1>
      <FButton onClick={() => console.log('Pressed!')}>
        Component Products
      </FButton>
    </div>
  );
}
