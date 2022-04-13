import styles from './Footer.module.css';

export default function Header() {
  return (
    <footer className={styles.footer}>
      <label>Copyright © {new Date().getFullYear()} Quillsoft</label>
    </footer>
  );
}
