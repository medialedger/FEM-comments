
const commentList = document.getElementById('comment-list');

// initialize data
let commentData = {};

function showComments() {
	fetch('data.json')
	.then((response) => response.json())
	.then((data) => {
		commentData = data;
		if(commentData.comments.length > 0) {
			appendComments();
		}
	});
}
function appendComments() {
	sortedComments = commentData.comments.sort((a,b) => a.score > b.score);
	sortedComments.forEach(comment => {
		const commentItem = document.createElement('li');
		let commentHTML = `<div class="comment">
			<div class="comment-header">
				<div class="avatar">
					<img src="${comment.user.image.webp}" alt="${comment.user.username}’s avatar">
				</div>
				<span class="username">${comment.user.username}</span>
				<span class="post-date">${new Intl.DateTimeFormat('en-US',{dateStyle: 'short'}).format(comment.createdAt)}</span>
			</div>
			<main>
				<p>${comment.content}</p>
			</main>
			<div class="comment-footer">
				<div class="vote">
					<button>+</button>
					<span class="vote-count">${comment.score}</span>
					<button>-</button>
				</div>
				<div class="actions">
					${comment.user.username === commentData.currentUser.username ? '<button class="btn-delete">Delete</button><button class="btn-edit">Edit</button>' : '<button class="btn-reply">Reply</button>'}
				</div>
			</div>
		</div>`;
		commentItem.innerHTML = commentHTML;
		commentList.insertAdjacentElement('afterbegin', commentItem);
		if(comment.replies.length > 0) {
			const sortedReplies = comment.replies.sort((a,b) => a.createdAt < b.createdAt)
			const replyList = document.createElement('ol');
			replyList.classList.add('reply-list');
			sortedReplies.forEach(reply => {
				replyList.innerHTML += appendReplies(reply);
			})
			commentItem.insertAdjacentElement('beforeend', replyList);
		}
	})
}
function appendReplies(reply) {
	let replyHTML = `<div class="comment reply">
		<div class="comment-header">
			<div class="avatar">
				<img src="${reply.user.image.webp}" alt="${reply.user.username}’s avatar">
			</div>
			<span class="username">${reply.user.username}</span>
			<span class="post-date">${new Intl.DateTimeFormat('en-US',{dateStyle: 'short'}).format(reply.createdAt)}</span>
		</div>
		<main>
			<p><b>${reply.replyingTo}</b> ${reply.content}</p>
		</main>
		<div class="comment-footer">
			<div class="vote">
				<button>+</button>
				<span class="vote-count">${reply.score}</span>
				<button>-</button>
			</div>
			<div class="actions">
				${reply.user.username === commentData.currentUser.username ? '<button class="btn-delete">Delete</button><button class="btn-edit">Edit</button>' : '<button class="btn-reply">Reply</button>'}
			</div>
		</div>
	</div>`;
	return replyHTML;
}

showComments();