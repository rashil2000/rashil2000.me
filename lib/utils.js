/* Utility functions, including API calls */

// Common constants

export const baseUrl = process.env.NEXT_PUBLIC_DB_HOST;

export const sortByDate = array => array.sort((a, b) => {
  if (a.date < b.date) return 1;
  else return -1;
});

export const dateString = value => {
  const stringdate = value ? new Date(value) : new Date();
  return (stringdate.getDate() + ' ' + stringdate.toLocaleString('default', { month: 'long' }) + ' ' + stringdate.getFullYear());
}

export const getLastCommitDate = async identifier => {
  try {
    const res = await fetch(`https://api.github.com/repos/${identifier}/commits`);
    const data = await res.json();
    if (data.message && data.message.includes('Not Found')) {
      console.log(`'${identifier}' is not a (public) GitHub respository.`);
      return 'null';
    } else if (data.message && data.message.includes('rate limit exceeded')) {
      console.log(`GitHub API rate limit exceeded for '${identifier}'. Please wait for a while.`);
      return 'null';
    }
    return data[0].commit.committer.date;
  } catch (err) {
    return alert('Error:\n' + JSON.stringify(err));
  }
}
