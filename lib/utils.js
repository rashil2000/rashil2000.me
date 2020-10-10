export const dateString = value => {
  const stringdate = value ? new Date(value) : new Date();
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

const sortByDate = array => array.sort((a, b) => {
  if (a.date < b.date) return 1;
  else return -1;
});

const getLastCommitDate = async identifier => {
  const res = await fetch(`https://api.github.com/repos/${identifier}/commits`);
  const data = await res.json();
  return data[0].commit.committer.date;
}

export const getSlugPaths = async arrayName => {
  const res = await fetch(`${process.env.DB_HOST}/${arrayName}`);
  const array = await res.json();
  return array.map(item => { return { params: { slug: item.slug } } });
}

export const getAllBlogs = async () => {
  const res = await fetch(`${process.env.DB_HOST}/blogs`);
  const blogs = await res.json();
  return sortByDate(blogs);
}

export const getAllProjects = async () => {
  const res = await fetch(`${process.env.DB_HOST}/projects`);
  const projects = await res.json();
  const modifiedProjects = projects.map(item => {
    const date = getLastCommitDate(item.github);
    return { date, ...item };
  })
  return sortByDate(modifiedProjects);
}

export const getBlog = async slug => {
  const res = await fetch(`${process.env.DB_HOST}/blogs/${slug}`);
  const blog = await res.json();
  return blog;
}

export const getProject = async slug => {
  const res = await fetch(`${process.env.DB_HOST}/projects/${slug}`);
  const project = await res.json();
  project.date = getLastCommitDate(project.github);
  return project;
}
