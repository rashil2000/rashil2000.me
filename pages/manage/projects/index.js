import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import { getAllProjects, itemDeleter, createProject, imageUploader } from '../../../lib/utils'
import CodeBlock from '../../../lib/CodeBlock'
import AuthBlock from '../../../lib/AuthBlock'

export default function ManageProjects() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [github, setGithub] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  const [currentProjects, setCurrentProjects] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    (async () => setCurrentProjects(await getAllProjects(abortController.signal)))();
    return () => abortController.abort(); // cancel pending fetch request on component unmount
  });

  return (
    <AuthBlock>
      <Head>
        <title>Manage Projects - rashil2000</title>
        <meta name="description" content="Add or remove projects on the site." />
      </Head>

      <main>
        <div className="abstract"><h2>Manage Projects</h2></div>
        <br />
        {currentProjects.map(project => (
          <React.Fragment key={project._id}>
            <Link href="/projects/[slug]" as={`/projects/${project.slug}`}>
              <a><h5 style={{ margin: "0" }}>{project.title}</h5></a>
            </Link>
            <p id="date-style"><span style={{ cursor: 'pointer' }} onClick={() => itemDeleter('projects', project.slug, project.title)}>Remove</span></p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract">
          <span id='projectsDeleteSpan'></span>
          <h2>Create Project</h2>
        </div>
        <br />
        <form onSubmit={e => { e.preventDefault(); createProject(title.trim(), description.trim(), content.trim(), slug.trim(), github.trim()); }} autoComplete='off' id='projectForm'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} required onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} required onChange={e => setDescription(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="github" style={{ float: "left" }}>GitHub:&nbsp;</label><label htmlFor="sn-github" className="sidenote-toggle">⋆</label>
          <input type="text" id="github" name="github" style={{ float: "right" }} required onChange={e => setGithub(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-github" className="sidenote-toggle" />
          <span className="sidenote">Format: username/repository</span><br />

          <label htmlFor="slug" style={{ float: "left" }}>Slug:&nbsp;</label><label htmlFor="sn-slug" className="sidenote-toggle">⋆</label>
          <input type="text" id="slug" name="slug" style={{ float: "right" }} required onChange={e => setSlug(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-slug" className="sidenote-toggle" />
          <span className="sidenote">Once set, this is immutable</span>

          <br /><br />
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)}
            minEditorHeight={300}
          />

          <div className="abstract">
            <br /><button>Post</button><br /><br />
            <span id='projectCreateSpan'></span><br />
          </div>

        </form>
        <form className="abstract" onSubmit={e => { e.preventDefault(); imageUploader('projects', slug.trim()) }} id='imageForm'>
          <h2>Images&nbsp;<label htmlFor="sn-image" className="sidenote-toggle">⋆</label></h2>
          <input type="checkbox" id="sn-image" className="sidenote-toggle" />
          <span className="sidenote">This requires the <code>slug</code> field to be set above</span><br /><br />
          <input type="file" id="imageInput" name="imageFile" style={{ float: "left" }} />
          <button style={{ float: "right" }}>Upload</button>
          <div style={{ clear: "both" }}></div>
          <br />
          <span id='imageSpan'></span>
          <br /><br />
        </form>
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
