import 'latex.css'
import 'react-mde/lib/styles/css/react-mde-all.css'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  if (typeof window !== 'undefined') {
    const lightValue = 'none';
    const darkValue = 'invert(1) hue-rotate(180deg)';
    const router = useRouter();

    const [value, setValue] = React.useState(
      (window.matchMedia('(prefers-color-scheme)').media !== 'not all' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? darkValue
        : lightValue
    );

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e =>
      setValue(e.matches ? lightValue : darkValue)
    );

    const pathTwoArray = ['/manage/blogs/[slug]', '/manage/projects/[slug]'];
    const pathOneArray = ['/blogs/[slug]', '/projects/[slug]', '/manage/blogs', '/manage/projects'];
    let faviconPath;
    if (pathTwoArray.includes(router.pathname))
      faviconPath = '../../favicon.ico';
    else if (pathOneArray.includes(router.pathname))
      faviconPath = '../favicon.ico';
    else
      faviconPath = 'favicon.ico';

    return (
      <>
        <Head>
          <link rel="icon" href={faviconPath} />
        </Head>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
        <style jsx global>{`
          html {
            transition: color 300ms, background-color 300ms;
            filter: ${value};
          }
          html img:not(#social-icon){
            filter: ${value};
          }
        `}</style>
        <Component {...pageProps} />
      </>
    );
  }
  return (
    <>
      <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
      <br />
      <style jsx global>{`
        #social-icon {
          margin: 0 auto;
        }
        #no-border {
          border: 0;
          text-align: center;
        }
        #date-style {
          text-align: right;
          font-style: italic;
          text-decoration: none;
          margin-bottom: 10px;
        }
        .markdown-box a {
          text-decoration: none;
          color: #4078c0;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
