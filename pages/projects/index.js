import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, dateString, getAllProjects } from '../../lib/utils'

export default function Projects({ projects }) {
  return (
    <div>
      <Head>
        <title>Projects - rashil2000</title>
        <meta name="description" content="Stuff that's (seemingly) cool" />
        <meta name="keywords" content="Rashil Gandhi Project, project rashil gandhi, Rashil2000 Project, project rashil2000, RashilGandhi2000 Project, project rashilgandhi2000" />
        <meta property="og:image" content={`${baseUrl}/images/meta/project.png`} />
      </Head>

      <main>
        <div className="abstract"><h2>Stuff that's (seemingly) cool</h2></div>
        <br />
        {projects.map(project => (
          <React.Fragment key={project._id}>
            <Link href="/projects/[slug]" as={`/projects/${project.slug}`}>
              <a><h5 style={{ margin: "0" }}>{project.title}</h5></a>
            </Link>
            <p id="date-style">{dateString(project.date)}</p>
          </React.Fragment>
        ))}
        <br />
        <div className="abstract">
          <h6 style={{ fontStyle: 'normal' }}>
            Some other projects that didn't make it here can be found on <a target="_blank" rel="noopener" href="https://rashil2000.github.io">rashil2000.github.io</a>.
          </h6>
        </div>
        <br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}

export const getStaticProps = async () => (
  {
    props: { projects: await getAllProjects() },
    revalidate: 1
  }
)
