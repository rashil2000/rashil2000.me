import { baseUrl } from "../lib/utils";

export const imageLister = async group => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

    const response = await fetch(`${baseUrl}/api/assets?location=images%2F${group}`, {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
    return await response.json();
}

export const imageUploader = async (directory, folder) => {
    if (!folder) {
        alert("Enter a slug.");
        return null;
    }
    const fileInput = document.getElementById('imageInput');
    if (!fileInput.files.length) {
        alert("Upload an image.");
        return null;
    }

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

    let formdata = new FormData();
    formdata.append("uploadedFile", fileInput.files[0]);

    try {
        const response = await fetch(`${baseUrl}/api/assets?location=images%2F${directory}%2F${folder}`, {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        });
        const result = await response.json();
        document.getElementById('imageSpan').innerHTML = `'${result.filename}' uploaded in '${folder}'.`;
        document.getElementById('imageForm').reset();
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const imageDeleter = async identifier => {
    if (!confirm(`Are you sure you want to remove "${identifier.split('/').slice(3).join('/')}"?`))
        return null;

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `bearer ${localStorage.getItem('token')}`);

    try {
        const response = await fetch(`${baseUrl}/api/assets?location=${identifier.substr(7)}`, {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        });
        const result = await response.json();
        if (result.success)
            document.getElementById(`imageSpan`).innerHTML = `Removed '${result.location.split('/').slice(3).join('/')}'.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}