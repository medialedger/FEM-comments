// state management
const App = {
	state: {

	},
	showComments() {
		fetch('data.json')
		.then((response) => response.json())
		.then((data) => {
			localStorage.setItem('currentUserName', data.currentUser.username);
			localStorage.setItem('currentUserImg', data.currentUser.image.webp);
			if(data.comments.length > 0) {
				appendComments(data);
			}
		});
	}
}


// comments append target
const commentList = document.getElementById('comment-list');


// relative date
function getRelativeDate(date) {
	const rtf = new Intl.RelativeTimeFormat('en');
	const dateDiffSeconds = Math.round((date - Date.now()) / (1000));
	if (dateDiffSeconds > -60) {
		return rtf.format(dateDiffSeconds, 'second');
	}
	const dateDiffMinutes = Math.round((date - Date.now()) / (1000*60));
	if (dateDiffMinutes > -60) {
		return rtf.format(dateDiffMinutes, 'minute');
	}
	const dateDiffHours = Math.round((date - Date.now()) / (1000*60*60));
	if (dateDiffHours > -24) {
		return rtf.format(dateDiffHours, 'hour');
	}
	const dateDiffDays = Math.round((date - Date.now()) / (1000*60*60*24));
	if (dateDiffDays > -7) {
		return rtf.format(dateDiffDays, 'day');
	}
	const dateDiffWeeks = Math.round((date - Date.now()) / (1000*60*60*24*7));
	if (dateDiffDays <= -7) {
		return rtf.format(dateDiffWeeks, 'week');
	}
}


// show comments
function showComments() {
	fetch('data.json')
	.then((response) => response.json())
	.then((data) => {
		localStorage.setItem('currentUserName', data.currentUser.username);
		localStorage.setItem('currentUserImg', data.currentUser.image.webp);
		if(data.comments.length > 0) {
			appendComments(data);
		}
	});
}
function buildCommentHTML(comment) {
	let commentHTML = `<div class="comment" data-id="${comment.id}">
		<div class="user">
			<div class="avatar">
				<img src="${comment.user.image.webp}" alt="${comment.user.username}’s avatar">
			</div>
			<span class="username">${comment.user.username} ${comment.user.username === localStorage.getItem('currentUserName') ? '<b>you</b>' : ''}</span>
		</div>
		<span class="post-date">${getRelativeDate(comment.createdAt)}</span>
		<div class="content">
			<p>${comment.replyingTo ? '<b>@' + comment.replyingTo + '</b>' : ''} ${comment.content}</p>
		</div>
		<div class="vote">
			<button class="btn-vote-up"><svg width="11" height="11"><use href="#icon-plus"></use></svg></button>
			<span class="vote-count">${comment.score}</span>
			<button class="btn-vote-dn"><svg width="11" height="3"><use href="#icon-minus"></use></svg></button>
		</div>
		<div class="actions">
			${comment.user.username === localStorage.getItem('currentUserName') ? '<button class="btn-delete"><svg width="12" height="14"><use href="#icon-delete"></use></svg> Delete</button><button class="btn-edit"><svg width="14" height="14"><use href="#icon-edit"></use></svg> Edit</button>' : '<button class="btn-reply"><svg width="14" height="13"><use href="#icon-reply"></use></svg> Reply</button>'}
		</div>
	</div>`;
	return commentHTML;
}
function appendComments(data) {
	sortedComments = data.comments.sort((a,b) => a.score > b.score);
	sortedComments.forEach(comment => {
		const commentItem = document.createElement('li');
		commentItem.innerHTML = buildCommentHTML(comment);
		commentList.insertAdjacentElement('afterbegin', commentItem);
		if(comment.replies.length > 0) {
			const sortedReplies = comment.replies.sort((a,b) => a.createdAt < b.createdAt)
			const replyList = document.createElement('ol');
			replyList.classList.add('reply-list');
			sortedReplies.forEach(reply => replyList.innerHTML +=  buildCommentHTML(reply));
			commentItem.insertAdjacentElement('beforeend', replyList);
		}
		hookupCommentButtons(commentItem);
	})
}
function hookupCommentButtons(commentItem) {
	const upVoteBtns = commentItem.querySelectorAll('.btn-vote-up');
	upVoteBtns.forEach(btn => btn.addEventListener('click', doUpVote));
	const dnVoteBtns = commentItem.querySelectorAll('.btn-vote-dn');
	dnVoteBtns.forEach(btn => btn.addEventListener('click', doDnVote));
	const replyBtns = commentItem.querySelectorAll('.btn-reply');
	replyBtns.forEach(btn => btn.addEventListener('click', doReply));
	const editBtns = commentItem.querySelectorAll('.btn-edit');
	editBtns.forEach(btn => btn.addEventListener('click', doEdit));
	const deleteBtns = commentItem.querySelectorAll('.btn-delete');
	deleteBtns.forEach(btn => btn.addEventListener('click', doDelete));
}
function doUpVote() {
	console.log(`up vote comment ID #${this.closest('.comment').dataset.id}`);
}
function doDnVote() {
	console.log(`down vote comment ID #${this.closest('.comment').dataset.id}`);
}
function doReply() {
	console.log(`reply to comment ID #${this.closest('.comment').dataset.id}`);
}
function doEdit() {
	console.log(`edit comment ID #${this.closest('.comment').dataset.id}`);
}
function doDelete() {
	console.log(`delete comment ID #${this.closest('.comment').dataset.id}`);
}

// build comments on page load
App.showComments();