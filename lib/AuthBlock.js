import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const useUser = () => ({ user: null, loading: false })

export default function AuthBlock(props) {
  const { user, loading } = useUser();
  const router = useRouter();

  if ((typeof window !== 'undefined') && (user || loading))
    return <>{props.children}</>;
  else {
    if (typeof window !== 'undefined') router.push('/authenticate');
    return (
      <div>
        <Head>
          <title>Redirecting... - rashil2000</title>
          <link rel="icon" href="favicon.ico" />
          <meta name="description" content="Redirecting to authenticate..." />
        </Head>
        <header>
          <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
          <br />
        </header>
        <main>
          <div className="abstract"><h2>Redirecting to authenticate...</h2></div>
          <br /><br />
        </main>
        <footer>
          <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
        </footer>
      </div>
    );
  }
}