import { API_BASE_URL } from "./config.js"

const addTagBtn = document.getElementById("add-tag");
const tagContainer = document.getElementById("tagContainer");

const announcement = document.getElementById("announcement");

const tagHtml = (tag) => {
    return `
<div class="col-3" id="${tag._id}">
            <button type="button" class="btn btn-sm btn-primary rounded-pill">${tag.name}</button>
            <button type="button" class="btn btn-sm btn-danger rounded-pill tag-delete-btn"  data-tag-id="${tag._id}" data-bs-toggle="modal" data-bs-target="#deleteTagModal" >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
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
        tagContainer.innerHTML += tagHtml(data);
        document.getElementById("tagName").value = '';
    })
    .catch(error => {
        console.error("save fail: ", error);
        announcement.innerHTML = failPop(error);
        setTimeout(() => {announcement.innerHTML = ''}, 10000);
    })
})

document.querySelectorAll(".tag-delete-btn").forEach(btn => {
    const tagId = btn.getAttribute('data-tag-id');
    
});
