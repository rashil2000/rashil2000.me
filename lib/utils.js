const DB_HOST = 'https://api.rashil2000.me';

export const validate = password => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  fetch(`${DB_HOST}/users/login`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ username: "rashil2000", password }),
    redirect: 'follow'
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('enc_cred', res.localData.encryptedPassword);
        history.back();
      } else {
        if (res.err) alert(res.status + '\n' + res.err);
        else if (res.info && res.info.message == 'Password or username is incorrect') alert('Incorrect passphrase.');
        else alert(res.status + '\n' + res.info.message);
      }
    })
    .catch(err => alert('Error:\n' + JSON.stringify(err)));
}

const refresher = () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  fetch(`${DB_HOST}/users/auth-refresh`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ username: "rashil2000", encryptedPassword: localStorage.getItem('enc_cred') }),
    redirect: 'follow'
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        if (res.refreshStatus) localStorage.setItem('token', res.token);
      } else {
        if (res.err) alert(res.status + '\n' + res.err);
        else alert(res.status + '\n' + res.info.message);
      }
    })
    .catch(err => alert('Error:\n' + JSON.stringify(err)));
}

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
  const res = await fetch(`${DB_HOST}/${arrayName}`);
  const array = await res.json();
  return array.map(item => { return { params: { slug: item.slug } } });
}

export const getAllBlogs = async () => {
  const res = await fetch(`${DB_HOST}/blogs`);
  const blogs = await res.json();
  return sortByDate(blogs);
}

export const getAllProjects = async () => {
  const res = await fetch(`${DB_HOST}/projects`);
  const projects = await res.json();
  const modifiedProjects = projects.map(item => {
    const date = getLastCommitDate(item.github);
    return { date, ...item };
  })
  return sortByDate(modifiedProjects);
}

export const getBlog = async slug => {
  const res = await fetch(`${DB_HOST}/blogs/${slug}`);
  const blog = await res.json();
  return blog;
}

export const getProject = async slug => {
  const res = await fetch(`${DB_HOST}/projects/${slug}`);
  const project = await res.json();
  project.date = getLastCommitDate(project.github);
  return project;
}
