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

// User auth

const refresher = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/users/auth-refresh`, {
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

export const validate = async password => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${baseUrl}/users/login`, {
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
