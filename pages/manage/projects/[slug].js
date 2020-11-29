import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'

import { updateProject, getSlugPaths, getProject } from '../../../lib/utils'
import CodeBlock from '../../../lib/CodeBlock'
import AuthBlock from '../../../lib/AuthBlock'

export default function EditProject({ project }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed initially until static props are fetched
  if (router.isFallback) {
    return (
      <AuthBlock>
        <Head>
          <title>Loading... - rashil2000</title>
          <meta name="description" content="Building page..." />
        </Head>

        <main>
          <div className="abstract">
            <h2>Loading...</h2>
            <br /><br />
            <p>This page is getting built, please wait for a while. It'll reload itself.</p>
            <br />
          </div>
          <br /><br />
        </main>

        <footer>
          <table id="no-border" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td id="no-border" style={{ width: "34%" }}><Link href="/manage/projects"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Projects</p></a></Link></td>
                <td id="no-border" style={{ width: "33%" }}><Link href="/manage"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></a></Link></td>
                <td id="no-border" style={{ width: "33%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
              </tr>
            </tbody>
          </table>
        </footer>
      </AuthBlock>
    )
  }

  const [content, setContent] = useState(project.content);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [github, setGithub] = useState(project.github);
  const [preview, setPreview] = useState(project.preview);
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <AuthBlock>
      <Head>
        <title>{`Edit project '${project.title}' - rashil2000`}</title>
        <meta name="description" content={`Edit project '${project.title}'`} />
      </Head>

      <main>
        <div className="abstract"><h2>Edit Project</h2></div>
        <br />
        <form onSubmit={e => { e.preventDefault(); updateProject(title.trim(), description.trim(), content.trim(), project.slug, github.trim(), preview.trim()); }} autoComplete='off'>

          <label htmlFor="title" style={{ float: "left" }}>Title:</label>
          <input type="text" id="title" name="title" style={{ float: "right" }} value={title} required onChange={e => setTitle(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="description" style={{ float: "left" }}>Description:</label>
          <input type="text" id="description" name="description" style={{ float: "right" }} value={description} required onChange={e => setDescription(e.target.value)} /><br /><br />
          <div style={{ clear: "both" }}></div>

          <label htmlFor="github" style={{ float: "left" }}>GitHub:&nbsp;</label><label htmlFor="sn-github" className="sidenote-toggle">⋆</label>
          <input type="text" id="github" name="github" style={{ float: "right" }} required value={github} onChange={e => setGithub(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-github" className="sidenote-toggle" />
          <span className="sidenote">Format: username/repository</span><br />

          <label htmlFor="preview" style={{ float: "left" }}>Preview Image:&nbsp;</label><label htmlFor="sn-preview" className="sidenote-toggle">⋆</label>
          <input type="text" id="preview" name="preview" style={{ float: "right" }} value={preview} onChange={e => setPreview(e.target.value)} /><br />
          <div style={{ clear: "both" }}></div>
          <input type="checkbox" id="sn-preview" className="sidenote-toggle" />
          <span className="sidenote">URL for link preview. Optional</span><br />

          <br />
          <ReactMde
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown source={markdown} renderers={{ code: CodeBlock }} />)}
            minEditorHeight={300}
          />

          <div className="abstract">
            <br /><button>Update</button><br /><br /><br />
          </div>

        </form>
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "34%" }}><Link href="/manage/projects"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage Projects</p></a></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/manage"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></a></Link></td>
              <td id="no-border" style={{ width: "33%" }}><Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </AuthBlock>
  )
}

export async function getStaticPaths() {
  const paths = await getSlugPaths('projects');

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
  const project = await getProject(context.params.slug);

  return {
    props: { project },
    revalidate: 1
  }
}
