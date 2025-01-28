import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import { ChakraProvider } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';
import { Flex, Box, Text, Button } from '@chakra-ui/react';
import useMouseTracker from '../components/useMouseTracker'; // Import the custom hook

import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const { saveMouseData } = useMouseTracker(); // Use the custom hook
  NProgress.configure({ showSpinner: false });

  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });

  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });

  return (
    <>
      {/* <Head>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
      </Head> */}
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Button onClick={saveMouseData} mt="5" colorScheme="teal">
          Save Mouse Click Data
        </Button>

      </ChakraProvider>
    </>
  );
}

export default MyApp;
