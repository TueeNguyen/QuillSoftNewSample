import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import FileUploader from '../components/FileUpload/FileUploader';
import { useState } from 'react';
/**
 * Class: Home
 * - displays Header, and main body (FileUploader)
 * - has method to reset local storage if need be
 */

export default function Home() {
  /* Uncomment this if you DO NOT want to clear the storage after refresh */
  const _storage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      localStorage.length == 0
        ? console.log('CLEARED')
        : console.log('NOT CLEAR');
    }
  };
  const [file, setFile] = useState(null);
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Quillsoft NLP Client</title>
        </Head>
        <main className={styles.main}>
          {' '}
          <script src='webviewer/lib/core/webviewer-core.min.js' />
          <script src='webviewer/lib/core/pdf/PDFNet.js'></script>
          <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js' />
          <FileUploader setFile={setFile} file={file} />
        </main>
      </div>
      {/*_storage()*/}
    </>
  );
}
