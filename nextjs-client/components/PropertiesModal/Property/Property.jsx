import styles from './Property.module.css';

export default function Property({ label, children }) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}
