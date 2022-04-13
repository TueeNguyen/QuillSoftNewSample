import styles from './StyledButton.module.css';

export default function StyledButton({ className, label, onClick }) {

  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      <label className={styles.label}>{label}</label>
    </button>
  );
}
