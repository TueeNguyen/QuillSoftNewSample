import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";
import "../styles/xray.css";
import "../pages/SearchContainer.module.css";
import React from "react";
import { DataProvider } from "../components/context/DataContext";

export default function Home({ Component, pageProps }) {
  return (
    <DataProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </DataProvider>
  );
}
