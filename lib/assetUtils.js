import { upload } from '@vercel/blob/client';

export const imageLister = async group => {
    const response = await fetch(`/api/assets?location=images%2F${group}`);
    return await response.json();
}

export const imageUploader = async (directory, folder) => {
    if (!folder) {
        alert("Enter a slug.");
        return null;
    }
    const fileInput = document.getElementById('imageInput').files[0];
    if (!fileInput) {
        alert("Upload an image.");
        return null;
    }

    const location = `images/${directory}/${folder}`;
    const pathname = `${location}/${fileInput.name}`;

    try {
        const result = await upload(pathname, fileInput, {
            access: 'public',
            handleUploadUrl: `/api/assets?location=${location}`,
        });
        document.getElementById('imageSpan').innerHTML = `'${result.pathname.split('/').pop()}' uploaded in '${folder}'.`;
        document.getElementById('imageForm').reset();
        return result;
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const imageDeleter = async identifier => {
    if (!confirm(`Are you sure you want to remove "${identifier.split('/').pop()}"?`))
        return null;

    // The identifier could be a URL from vercel blob, or a path-like string
    const isVercelUrl = identifier.startsWith('https://');

    try {
        const searchParams = new URLSearchParams();
        if (isVercelUrl) {
            searchParams.set('url', identifier);
        } else {
            searchParams.set('location', identifier);
        }

        const response = await fetch(`/api/assets?${searchParams.toString()}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success)
            document.getElementById(`imageSpan`).innerHTML = `Removed '${isVercelUrl ? identifier.split('/').pop() : result.location.split('/').pop()}'.`;
        else
            alert(JSON.stringify(result));
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}