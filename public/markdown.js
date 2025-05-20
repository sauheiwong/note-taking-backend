const note = document.querySelector("#note");
const content = document.getElementById('markdown');

note.addEventListener("input", () => {
    console.log(note.value);
  content.innerHTML = marked.parse(note.value);
});

setTimeout(() => {
  content.innerHTML = marked.parse(note.value)
}, 0);
