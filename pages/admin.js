import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../lib/CodeBlock'

const useUser = () => ({ user: null, loading: false })

export default function AdminPanel() {
  const [value, setValue] = React.useState("_Start typing..._");
  const [selectedTab, setSelectedTab] = React.useState("write");
  const { user, loading } = useUser();
  const router = useRouter();

  if ((typeof window !== 'undefined') && !(user || loading)) router.push('/authenticate');

  return (
    <div>
      <Head>
        <title>Admin Panel - rashil2000</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Manage content on the site." />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>
        <div className="abstract"><h2>Manage Blogs</h2></div>
        <br />
        {[1, 2, 3, 4].map(key => (
          <React.Fragment key={key}>
            <Link href={`blogs/${key}`}>
              <a><h5 style={{ margin: "0" }}>Hey yo this is a blog</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}>Remove Blog</p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract"><h2>Create Blog</h2></div>
        <br />
        <ReactMde
          value={value}
          onChange={setValue}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)}
          minEditorHeight={300}
        // paste={{ saveImage: save }}
        />
        <div className="abstract">
          <br />
          <button>Post</button>
          <br />
        </div>
        <br /><br />

        <div className="abstract"><h2>Manage Projects</h2></div>
        <br />
        {[1, 2, 3, 4].map(key => (
          <React.Fragment key={key}>
            <Link href={`projects/${key}`}>
              <a><h5 style={{ margin: "0" }}>Hey yo this is a project</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}>Remove Project</p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract"><h2>Add Project</h2></div>
        <br />
        <form>
          <label for="name">Name:</label>{" "}
          <input type="text" id="name" name="name" /><br />
          <label for="github">GitHub:</label>{" "}
          <input type="text" id="github" name="github" /><br /><br />
          <div className="abstract">
            <br />
            <input type="submit" value="Post" />
            <br />
          </div>
        </form>
        <br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}
