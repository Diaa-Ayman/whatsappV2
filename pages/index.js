import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>DWhatsapp</title>
      </Head>
      <Sidebar />
    </div>
  );
}
