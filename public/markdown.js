const note = document.querySelector("#note");
const content = document.getElementById('markdown');

const conventMarkdown = () => {
  const markdownContent = note.value;
  const rawHtml = marked.parse(markdownContent);

  const safeHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROJILES: {html: true}
  });
  content.innerHTML = safeHtml
}

note.addEventListener("input", () => {
  conventMarkdown();
});

setTimeout(() => {
  conventMarkdown()
}, 0);
