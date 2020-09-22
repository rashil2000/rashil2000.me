import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>rashil2000 - Rashil Gandhi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="author">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p>
          Get started by editing{' '}
          <code>pages/index.js</code>
        </p>

        <div>
          <a href="https://nextjs.org/docs">
            <h3>Personal webpage</h3>
            <p>This is work-in-progress</p>
          </a>

        </div>
      </main>

      <footer>
        <img src="/magnecon.png" alt="Vercel Logo" />
      </footer>
    </div>
  )
}
