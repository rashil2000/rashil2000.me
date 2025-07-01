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

export const buildFileTree = files => {
    if (!files || files.length === 0) {
        return {children: []};
    }

    const findCommonPrefix = paths => {
        if (!paths || paths.length === 0) return '';
        let prefix = paths[0];
        for (let i = 1; i < paths.length; i++) {
            while (paths[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        if (prefix.includes('/')) {
            prefix = prefix.substring(0, prefix.lastIndexOf('/') + 1);
        } else if (paths.length > 1 && !paths.every(p => p === prefix)) {
            return '';
        }
        return prefix;
    };

    const pathnames = files.map(f => f.pathname);
    const prefix = findCommonPrefix(pathnames);

    const root = {children: []};

    files.forEach(file => {
        const relativePath = file.pathname.substring(prefix.length);
        const parts = relativePath.split('/');
        let currentLevel = root.children;
        let currentPathParts = [];

        parts.forEach((part, index) => {
            currentPathParts.push(part);
            const isFile = index === parts.length - 1;
            let node = currentLevel.find(n => n.name === part);

            if (!node) {
                if (isFile) {
                    node = {
                        ...file,
                        path: file.pathname,
                        name: part,
                        type: 'file',
                    };
                    currentLevel.push(node);
                } else {
                    const path = prefix + currentPathParts.join('/');
                    node = {
                        path: path,
                        name: part,
                        type: 'directory',
                        children: [],
                        size: 0,
                    };
                    currentLevel.push(node);
                }
            }
            if (!isFile) {
                currentLevel = node.children;
            }
        });
    });

    const calculateSize = node => {
        if (node.type === 'file') {
            return node.size;
        }
        if (node.children) {
            node.size = node.children.reduce((sum, child) => sum + calculateSize(child), 0);
            return node.size;
        }
        return 0;
    };

    // calculateSize(root);

    return root;
};