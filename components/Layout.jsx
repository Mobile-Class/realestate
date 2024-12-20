import Head from 'next/head';
import { Box } from '@chakra-ui/react';

import Footer from './Footer';
import TopNav from './TopNav';


export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Real Estate</title>
      </Head>
      <Box maxWidth='1280px' m='auto'>
        <header>
          <TopNav />
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
      </Box>
    </>
  );
}
