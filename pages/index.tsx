import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import Link from 'next/link';
import Account from '../components/Account';
import BooksLibrary from '../components/BooksLibrary';
import { BOOK_LIBRARY_ADDRESS } from '../constants';
import useEagerConnect from '../hooks/useEagerConnect';

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === 'string' && !!library;

  return (
    <div className="container py-4">
      <Head>
        <title>LimeAcademy-boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>LimeAcademy-boilerplate</a>
          </Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <h1>
          Welcome to{' '}
          <a href="https://github.com/LimeChain/next-web3-boilerplate">LimeAcademy-boilerplate</a>
        </h1>

        {isConnected && (
          <section>
            <BooksLibrary contractAddress={BOOK_LIBRARY_ADDRESS} />
          </section>
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

export default Home;
