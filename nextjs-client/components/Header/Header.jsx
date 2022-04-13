import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import Logo from '../icons/Logo';
import PropertiesIcon from '../icons/Properties';
import PropertiesModal from '../PropertiesModal';

import SettingsIcon from '@material-ui/icons/Settings';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <header className={styles.header}>
      <Link href='https://www.quillsoft.ca/' passHref>
        <a>
          <Logo height={39} width={112} />
        </a>
      </Link>
      <h1 className={styles.h1}><a href="/">NLP Client</a></h1>
      <div className="buttons">
        {/* Configurations Modal */}
        <div className={styles.buttonsContainer}>
          <label className={styles.span}>Configurations</label>
          <button
            className={styles.propertiesButton}
            onClick={() => setShowModal(true)}>
          <SettingsIcon width={20} height={20} />
        </button>
        <PropertiesModal showModal={showModal} handleCloseModal={handleCloseModal}/>
        
      </div>
      {/* FileHistory Modal */}
        <div className={styles.buttonsContainer}>
          <label className={styles.span}>File History</label>
          <button className={styles.propertiesButton}>
            <a href="/history" target="_blank">
              <FolderOpenIcon width={20} height={20} />
            </a>
        </button>
      </div>
      </div>
      
    </header>
  );
}
