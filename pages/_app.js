import 'latex.css'
import 'react-mde/lib/styles/css/react-mde-all.css'

import StyleBlock from '../lib/StyleBlock'

export default function MyApp({ Component, pageProps }) {
  return (
    <StyleBlock>
      <Component {...pageProps} />
    </StyleBlock>
  )
}
