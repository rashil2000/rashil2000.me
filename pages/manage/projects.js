import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import CodeBlock from '../../lib/CodeBlock'
import AuthBlock from '../../lib/AuthBlock'

export default function ManageProjects() {
  const [value, setValue] = React.useState("_Start typing..._");
  const [selectedTab, setSelectedTab] = React.useState("write");

  return (
    <AuthBlock>
      <Head>
        <title>Manage Projects - rashil2000</title>
        <meta name="description" content="Add, edit or remove projects on the site." />
      </Head>

      <main>
        <div className="abstract"><h2>Manage Projects</h2></div>
        <br />
        {[1, 2, 3, 4].map(key => (
          <React.Fragment key={key}>
            <Link href={`projects/${key}`}>
              <a><h5 style={{ margin: "0" }}>Hey yo this is a project</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}><span>Edit</span> | <span>Remove</span></p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract"><h2>Create Project</h2></div>
        <br />
        <label htmlFor="name" style={{ float: "left" }}>Name:</label>
        <input type="text" id="name" name="name" style={{ float: "right" }} /><br /><br />
        <div style={{ clear: "both" }}></div>
        <label htmlFor="description" style={{ float: "left" }}>Description:</label>
        <input type="text" id="description" name="description" style={{ float: "right" }} /><br /><br />
        <div style={{ clear: "both" }}></div>
        <label htmlFor="github" style={{ float: "left" }}>GitHub:</label>
        <input type="text" id="github" name="github" style={{ float: "right" }} /><br /><br />
        <div style={{ clear: "both" }}></div>
        <label htmlFor="slug" style={{ float: "left" }}>Slug:</label>
        <input type="text" id="slug" name="slug" style={{ float: "right" }} /><br />
        <div style={{ clear: "both" }}></div>
        <small>Once set, the slug is immutable.</small>
        <br /><br />
        <ReactMde
          value={value}
          onChange={setValue}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)}
          minEditorHeight={300}
        />
        <div className="abstract">
          <br /><button>Post</button><br /><br />
          <h2>Images</h2>
          <small>(this requires the <code>slug</code> field to be set above)</small><br /><br />
          <input type="file" id="imageFile" name="imageFile" style={{ float: "left" }} />
          <button style={{ float: "right" }}>Upload</button>
          <div style={{ clear: "both" }}></div>
          <br /><br /><br />
        </div>
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "50%" }}><Link href="/manage"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></a></Link></td>
              <td id="no-border" style={{ width: "50%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </AuthBlock>
  )
}
