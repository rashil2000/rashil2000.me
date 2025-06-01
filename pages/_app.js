import React from "react"
import 'latex.css'
import 'react-mde/lib/styles/css/react-mde-all.css'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  if (typeof window !== 'undefined') {
    const lightValue = ['none', 'none', 'none', 'none'];
    const darkValue = ['hsl(210, 20%, 98%)', 'hsl(0, 5%, 10%)', '#aff', 'invert(1) hue-rotate(180deg)'];
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
          body, .mde-header, input[type="text"], input[type="password"], input[type="datetime-local"], textarea, button {
            transition: color 500ms ease-in, background-color 500ms ease-in;
            color: ${value[0]};
            background-color: ${value[1]};
          }
          a,a:visited {
            transition: color 500ms ease-in, background-color 500ms ease-in;
            color: ${value[2]};
          }
          #social-icon, .svg-icon, pre, kbd {
            transition: color 500ms ease-in, background-color 500ms ease-in;
            filter: ${value[3]};
          }
          ::-webkit-file-upload-button {
            transition: color 500ms ease-in, background-color 500ms ease-in;
            color: ${value[0]};
            background-color: ${value[1]};
            padding-top: 4px;
            padding-bottom: 4px;
            font-family: inherit;
          }
          .markdown-box a {
            text-decoration: none;
            color: #08c;
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
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
