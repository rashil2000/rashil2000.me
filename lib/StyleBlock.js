import Head from 'next/head'
import { useRouter } from 'next/router'

export default function StyleBlock(props) {
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

    const faviconPath = (router.pathname === '/blogs/[id]' || router.pathname === '/projects/[id]')
      ? '../favicon.ico'
      : 'favicon.ico';

    return (
      <>
        <Head>
          <link rel="icon" href={faviconPath} />
        </Head>
        <style jsx global>{`
          html {
            transition: color 300ms, background-color 300ms;
            filter: ${value};
          }
          html img:not(#social-icon){
            filter: ${value};
          }
          #social-icon {
            margin: 0 auto;
            width: 15px;
          }
          #no-border {
            border: 0;
            text-align: center;
          }
        `}</style>
        {props.children}
      </>
    );
  } else
    return <>{props.children}</>;
}
