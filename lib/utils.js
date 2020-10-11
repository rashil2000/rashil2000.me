export const validate = async password => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/users/login`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: "rashil2000", password }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('enc_cred', result.localData.encryptedPassword);
      history.back();
    } else {
      if (result.err)
        alert(result.status + '\n' + result.err);
      else if (result.info && result.info.message == 'Password or username is incorrect')
        alert('Incorrect passphrase.');
      else
        alert(result.status + '\n' + result.info.message);
    }
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

const refresher = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/users/auth-refresh`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ username: "rashil2000", encryptedPassword: localStorage.getItem('enc_cred') }),
      redirect: 'follow'
    });
    const result = await response.json();
    if (result.success) {
      if (result.refreshStatus) localStorage.setItem('token', result.token);
    } else {
      if (result.err)
        alert(result.status + '\n' + result.err);
      else
        alert(result.status + '\n' + result.info.message);
    }
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}

export const itemDeleter = async (group, slug) => {
  if (confirm(`Are you sure you want to delete '${slug}' from ${group}?`)) {
    await refresher();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/${group}/${slug}`, {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        alert(`Deleted ${result.slug} from ${group}.`);
        location.reload();
      } else
        alert(JSON.stringify(result));
    } catch (err) {
      return alert('Error:\n' + JSON.stringify(err));
    }
  } else
    return null;
}

export const createBlog = async (title, description, content, slug) => {
  if (title && description && content && slug) {
    await refresher();

    var date = new Date();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
    myHeaders.append("Content-Type", "application/json");

    try {
      const response = await fetch("https://api.rashil2000.me/blogs", {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ title, description, content, slug, date }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        alert(`Created ${result.slug} in blogs.`);
        location.reload();
      } else
        alert(JSON.stringify(result));
    } catch (error) {
      return console.log('error', error);
    }
  }
  else {
    alert("No field should remain empty!");
    return null;
  }
}

export const createProject = async (title, description, content, slug, github) => {
  if (title && description && content && slug && github) {
    await refresher();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
    myHeaders.append("Content-Type", "application/json");

    try {
      const response = await fetch("https://api.rashil2000.me/projects", {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ title, description, content, slug, github }),
        redirect: 'follow'
      });
      const result = await response.json();
      if (result._id) {
        alert(`Created ${result.slug} in projects.`);
        location.reload();
      } else
        alert(JSON.stringify(result));
    } catch (error) {
      return console.log('error', error);
    }
  }
  else {
    alert("No field should remain empty!");
    return null;
  }
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
  try {
    const res = await fetch(`https://api.github.com/repos/${identifier}/commits`);
    const data = await res.json();
    return data[0].commit.committer.date;
  } catch (err) {
    return console.log(err);
  }
}

export const getSlugPaths = async arrayName => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/${arrayName}`);
  const array = await res.json();
  return array.map(item => { return { params: { slug: item.slug } } });
}

export const getAllBlogs = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/blogs`);
  const blogs = await res.json();
  return sortByDate(blogs);
}

export const getAllProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/projects`);
  var projects = await res.json();
  for (var item of projects)
    item.date = await getLastCommitDate(item.github);
  return sortByDate(projects);
}

export const getBlog = async slug => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/blogs/${slug}`);
  const blog = await res.json();
  return blog;
}

export const getProject = async slug => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/projects/${slug}`);
  const project = await res.json();
  const date = await getLastCommitDate(project.github);
  return { date, ...project };
}
