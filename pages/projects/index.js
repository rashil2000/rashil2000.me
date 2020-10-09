import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'

function getLastCommit(identifier) {
  const { data, error } = useSWR(`https://api.github.com/repos/${identifier}/commits`)
  if (error) return 'failed to load';
  if (!data) return 'loading...';
  return data[0].commit.committer.date;
}

function getDateString(value) {
  const stringdate = new Date(value);
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export default function Projects({ projects }) {
  const sortedProjects = projects.map(item => {
    const commitDate = getLastCommit(item.github);
    return { commitDate, ...item };
  }).sort((a, b) => {
    if (a.commitDate < b.commitDate) return 1;
    else return -1;
  });

  return (
    <div>
      <Head>
        <title>Projects - rashil2000</title>
        <meta name="description" content="Stuff that's (seemingly) cool" />
        <meta name="keywords" content="Rashil Gandhi Project, project rashil gandhi, Rashil2000 Project, project rashil2000, RashilGandhi2000 Project, project rashilgandhi2000" />
      </Head>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
      </header>

      <main>

        <div className="abstract"><h2>Stuff that's (seemingly) cool</h2></div>
        <br />
        {sortedProjects.map(project => (
          <React.Fragment key={project._id}>
            <Link href="/projects/[slug]" as={`/projects/${project.slug}`}>
              <a><h5 style={{ margin: "0" }}>{project.title}</h5></a>
            </Link>
            <p style={{ textAlign: "right", fontStyle: "italic", textDecoration: "none", marginBottom: "10px" }}>{getDateString(project.commitDate)}</p>
          </React.Fragment>
        ))}
        <br /><br /><br />
      </main>

      <footer>
        <Link href="/"><a><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Home</p></a></Link>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.DB_HOST}/projects`);
  const projects = await res.json();

  return {
    props: { projects },
    revalidate: 1
  }
}