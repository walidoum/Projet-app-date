// =========================
// COMMENTS SYSTEM JOURNAL
// =========================

// TOGGLE (animation safe)
function toggleComments(id){
  const el = document.getElementById('comments-' + id);

  if(!el) return;

  if(el.classList.contains('open')){
    el.classList.remove('open');
  } else {
    el.classList.add('open');

    if(!el.dataset.loaded){
      loadComments(id);
      el.dataset.loaded = "true";
    }
  }
}

// LOAD COMMENTS
async function loadComments(journalId){
  const container = document.getElementById('comments-list-' + journalId);
  if(!container) return;

  const res = await fetch(`${SURL}/rest/v1/comments?journal_id=eq.${journalId}&order=created_at.asc`, {
    headers: {
      apikey: SKEY,
      Authorization: `Bearer ${SKEY}`
    }
  });

  const data = await res.json();

  container.innerHTML = "";

  data.forEach(c => {
    container.innerHTML += `
      <div class="comment">
        <div>
          <strong>${c.author}</strong> ${c.text}
        </div>
        <div class="comment-like" onclick="likeComment('${c.id}','${journalId}')">
          ❤️ ${c.likes || 0}
        </div>
      </div>
    `;
  });
}

// ADD COMMENT
async function addComment(journalId){
  const input = document.getElementById('input-' + journalId);
  const author = document.getElementById('author-' + journalId);

  if(!input || !author) return;
  if(!input.value.trim()) return;

  await fetch(`${SURL}/rest/v1/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SKEY,
      Authorization: `Bearer ${SKEY}`
    },
    body: JSON.stringify({
      id: uid(),
      journal_id: journalId,
      author: author.value,
      text: input.value,
      likes: 0,
      created_at: new Date().toISOString()
    })
  });

  input.value = "";
  loadComments(journalId);
}

// LIKE
async function likeComment(commentId, journalId){
  const res = await fetch(`${SURL}/rest/v1/comments?id=eq.${commentId}`, {
    headers: {
      apikey: SKEY,
      Authorization: `Bearer ${SKEY}`
    }
  });

  const data = await res.json();
  const currentLikes = data[0]?.likes || 0;

  await fetch(`${SURL}/rest/v1/comments?id=eq.${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SKEY,
      Authorization: `Bearer ${SKEY}`
    },
    body: JSON.stringify({
      likes: currentLikes + 1
    })
  });

  loadComments(journalId);
}
