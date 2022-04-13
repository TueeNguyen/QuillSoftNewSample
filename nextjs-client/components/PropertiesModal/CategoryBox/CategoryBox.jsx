import styles from './CategoryBox.module.css';

export default function CategoryBox({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
