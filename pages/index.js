import Head from 'next/head'
import Link from 'next/link'

import { baseUrl, dateString } from '../lib/utils'

export default function Home() {
  return (
    <div>
      <Head>
        <title>rashil2000 - Rashil Gandhi</title>
        <meta name="description" content="Gamer. Editor. Programmer." />
        <meta name="keywords" content="Rashil Gandhi, Rashil gandhi, rashil Gandhi, rashil gandhi, Rashil2000, rashil2000, RashilGandhi2000, rashilgandhi2000" />
        <meta property="og:image" content={`${baseUrl}/images/meta/main.png`} />
      </Head>
      <header>

        <p className="author">
          Rashil Gandhi
          <br />
          <i>{dateString()}</i>
        </p>
      </header>
      <main>
        <div className="abstract">
          <br />
          <p style={{ textAlign: "justify" }}>
            Computers, in general, have been the subject of my interest for as long as I can remember. I'm passionate about software development; the idea of creating something that people can use to make their lives better, deeply moves me. When I'm not learning a programming language or doing coursework, I'm playing video games or updating myself with the newest innovations in the gaming industry. Sometimes I play the guitar or compose electronic music if I'm feeling creative enough. Photography and video editing are some other hobbies worth mentioning.
          </p>
          <br />
        </div>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://github.com/rashil2000"><img id="social-icon" width='15' height='15' src="images/github.svg" alt="GitHub" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://twitter.com/rashil2000"><img id="social-icon" width='15' height='15' src="images/twitter.svg" alt="Twitter" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://linkedin.com/in/rashil2000"><img id="social-icon" width='15' height='15' src="images/linkedin.svg" alt="LinkedIn" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://facebook.com/rashil2000"><img id="social-icon" width='15' height='15' src="images/facebook.svg" alt="Facebook" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://instagram.com/rashil_2000"><img id="social-icon" width='15' height='15' src="images/instagram.svg" alt="Instagram" /></a></td>
              <td id="no-border"><a target="_blank" rel="noopener" href="https://youtube.com/rashilgandhi2000"><img id="social-icon" width='15' height='15' src="images/youtube.svg" alt="YouTube" /></a></td>
            </tr>
          </tbody>
        </table>
        <br /><br /><br />
      </main>
      <footer>
        <table id="no-border" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td id="no-border" style={{ width: "25%" }}><a href="resume.pdf"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Résumé</p></a></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="blogs"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Blogs</p></Link></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="projects"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Projects</p></Link></td>
              <td id="no-border" style={{ width: "25%" }}><Link href="manage"><p className="author" style={{ fontVariantCaps: "all-small-caps" }}>Manage</p></Link></td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
}
