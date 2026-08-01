// utils/cloudinaryUpload.js

const API_BASE = import.meta.env.VITE_API_URL

const getUploadSignature = async (token, resourceType) => {
    const res = await fetch(`${API_BASE}/api/video/upload-signature?resourceType=${resourceType}`, {
        method: 'GET',
        headers: { 'auth-token': token },
    })
    if (!res.ok) throw new Error('Failed to get upload signature')
    return res.json()
}

export const uploadFileToCloudinary = (file, sig, onProgress) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', sig.apiKey)
        formData.append('timestamp', sig.timestamp)
        formData.append('signature', sig.signature)
        formData.append('folder', sig.folder)
        formData.append('public_id', sig.publicId)

        const xhr = new XMLHttpRequest()
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`)

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded * 100) / event.total)
                onProgress(percent)
            }
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(new Error('Cloudinary upload failed'))
            }
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(formData)
    })
}

export const uploadVideoAndThumbnail = async (videoFile, thumbnailFile, token, onProgress) => {
    const [videoSig, thumbSig] = await Promise.all([
        getUploadSignature(token, 'video'),
        getUploadSignature(token, 'image'),
    ])

    const progressState = { video: 0, thumbnail: 0 }
    const updateOverall = () => {
        if (onProgress) {
            const overall = Math.round(progressState.video * 0.9 + progressState.thumbnail * 0.1)
            onProgress(overall)
        }
    }

    const [videoResult, thumbResult] = await Promise.all([
        uploadFileToCloudinary(videoFile, videoSig, (p) => {
            progressState.video = p
            updateOverall()
        }),
        uploadFileToCloudinary(thumbnailFile, thumbSig, (p) => {
            progressState.thumbnail = p
            updateOverall()
        }),
    ])

    return {
        videoURL: videoResult.secure_url,
        thumbnailURL: thumbResult.secure_url,
    }
}

/**
 * Uploads a single video or image asset to Cloudinary
 * @param {File} file - The file object to upload
 * @param {'video' | 'image'} resourceType - Cloudinary resource type
 * @param {string} token - User auth token
 * @param {function} onProgress - Progress tracking callback
 */
export const uploadSingleAsset = async (file, resourceType, token, onProgress) => {
    const sig = await getUploadSignature(token, resourceType);
    const result = await uploadFileToCloudinary(file, sig, onProgress);
    return {
        url: result.secure_url,
        publicId: result.public_id
    };
}