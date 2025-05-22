import { API_BASE_URL } from "./config.js"

const addTagBtn = document.getElementById("add-tag");
const tagContainer = document.getElementById("tagContainer");

const announcement = document.getElementById("announcement");

const tagHtml = (tagName) => {
    return `
<div class="col-2">
    <button type="button" class="btn btn-sm btn-primary rounded-pill">${tagName}</button>
</div>
`
} 

const failPop = (message) => {
    return `
            <div class="alert alert-dismissible alert-danger">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <strong>Auto Save Fail</strong> ${message}
            </div>
            `
}

addTagBtn.addEventListener("click", () => {
    const tagName = document.getElementById("tagName").value;
    const noteId = document.getElementById("noteId").value;
    fetch(`${API_BASE_URL}/api/protected/tag/addToNote/${noteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagName })
    })
    .then(response => {
        if (!response.ok){
            return response.json().then(errorData => {
                throw new Error(`HTTP Error. status: ${response.status}, message: ${errorData.message || "unknown error"}`)
            })
        }
        return response.json();
    })
    .then(data => {
        tagContainer.innerHTML += tagHtml(tagName)
    })
    .catch(error => {
        console.error("save fail: ", error);
        announcement.innerHTML = failPop(error);
        setTimeout(() => {announcement.innerHTML = ''}, 10000);
    })
})
