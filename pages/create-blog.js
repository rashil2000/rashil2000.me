import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../lib/CodeBlock'

export default function CreateBlog() {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const [selectedTab, setSelectedTab] = React.useState("write");

  return (
    <div>
      <Head>
        <title>Create Blog - rashil2000</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Write that down" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>
        <div className="abstract">
          <h2>Create Blog</h2>
          <br /><br />
        </div>
        <ReactMde
          value={value}
          onChange={setValue}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)
          }
          minEditorHeight={300}
          // paste={{ saveImage: save }}
        />
        <div className="abstract">
          <br />
          <button>Post</button>
          <br />
        </div>
        <br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}
