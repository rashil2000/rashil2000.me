# Personal Website

## [rashil2000.me](https://rashil2000.me/)

### A complete content management system for personal blogs and projects

### Key features

- Implemented using [Next.js](https://nextjs.org/) - *The* React Framework for production.
- Uses [LaTeX.css](https://latex.now.sh/), a purely-CSS class-less library for minimalistic design.
- Blazing-fast performance with Server Side Rendering and Incremental Static Regeneration.
- [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) handle protected operations and server side logic.

### Functionality

- Authentication for allowing write access - using [NextAuth.js](https://next-auth.js.org/).
- Add new blogs and projects, writing them in a Markdown editor - using [React Markdown Editor](https://www.npmjs.com/package/react-mde).
- Edit, delete or draft (to publish later) blogs and projects - stored in MongoDB using [Mongoose](https://mongoosejs.com/).
- List, upload or delete images for link previews and Markdown content - stored in [Vercel Blob](https://vercel.com/docs/vercel-blob).
- Embed discussion threads in blogs and projects using [Giscus](https://giscus.app/).
