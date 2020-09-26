import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const today = new Date();

  return (
    <div>
      <Head>
        <title>rashil2000 - Rashil Gandhi</title>
        <link rel="icon" href="favicon.ico" />
        <meta name="description" content="Gamer. Editor. Programmer." />
        <meta name="keywords" content="Rashil Gandhi, Rashil gandhi, rashil Gandhi, rashil gandhi, Rashil2000, rashil2000, RashilGandhi2000, rashilgandhi2000" />
      </Head>

      <style jsx global>{`
        #social-icon {
          margin: 0 auto;
          width: 15px;
        }
        #no-border {
          border: 0;
          text-align: center;
        }
    `}</style>

      <header>
        <h2 style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "lighter" }}>rashil2000</h2>
        <br />
        <p className="author">
          Rashil Gandhi
          <br />
          {today.toLocaleString('default', { month: 'long' }) + ' ' + today.getFullYear()}
        </p>
      </header>

      <main>
        <div className="abstract">
          <h2>About</h2>
          <br />
          <p style={{ textAlign: "justify" }}>
            Computers, in general, have been the subject of my interest for as long as I can remember. I'm passionate about software development; the idea of creating something that people can use to make their lives better, deeply moves me. When I'm not learning a programming language or doing coursework, I'm playing video games or updating myself with the newest innovations in the gaming industry. Sometimes I play the guitar or compose electronic music if I'm feeling creative enough. Photography and video editing are some other hobbies worth mentioning.
          </p>
          <br />
        </div>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "25%" }}><a href="resume.pdf"><p className="author"><i>Résumé</i></p></a></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="blogs"><a><p className="author"><i>Blogs</i></p></a></Link></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="projects"><a><p className="author"><i>Projects</i></p></a></Link></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="admin"><a><p className="author"><i>Admin</i></p></a></Link></td>
            </tr>
          </tbody>
        </table>
        <br /><br /><br />
      </main>

      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://github.com/rashil2000"><img id="social-icon" src="images/github.svg" alt="GitHub" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://gitlab.com/rashil2000"><img id="social-icon" src="images/gitlab.svg" alt="GitLab" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://twitter.com/rashil2000"><img id="social-icon" src="images/twitter.svg" alt="Twitter" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://linkedin.com/in/rashil2000"><img id="social-icon" src="images/linkedin.svg" alt="LinkedIn" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://facebook.com/rashil2000"><img id="social-icon" src="images/facebook.svg" alt="Facebook" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://instagram.com/rashil_2000"><img id="social-icon" src="images/instagram.svg" alt="Instagram" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://reddit.com/u/rashil2000"><img id="social-icon" src="images/reddit.svg" alt="Reddit" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://youtube.com/rashilgandhi2000"><img id="social-icon" src="images/youtube.svg" alt="YouTube" /></a></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  )
}
