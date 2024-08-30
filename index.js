import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Initialize the tweets data from local storage
const storedTweetsData = JSON.parse(localStorage.getItem('tweetsData'));
if (storedTweetsData) {
    tweetsData.length = 0; // Clear the original array
    tweetsData.push(...storedTweetsData); // Populate it with the data from local storage
} else {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

document.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default action for all clicks
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like);
    } else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet);
    } else if (e.target.dataset.reply) {
        handleReplyClick(e.target.dataset.reply);
    } else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick();
    } else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete);
    } else if (e.target.dataset.replyBtn) {
        handleReplyBtnClick(e.target.dataset.replyBtn);
    }
});

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--;
    } else {
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    saveToLocalStorage();
    render();
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--;
    } else {
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    saveToLocalStorage();
    render();
}

function handleReplyClick(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}


function handleTweetBtnClick() {
    const tweetInput = document.getElementById('tweet-input');

    if (tweetInput.value) {
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
        saveToLocalStorage();
        render();
        tweetInput.value = '';
    }
}

function handleReplyBtnClick(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const replyText = replyInput.value;

    if (replyText) {
        const targetTweetObj = tweetsData.find(tweet => tweet.uuid === tweetId);

        targetTweetObj.replies.push({
            handle: `@ScrimbaUser`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyText
        });

        saveToLocalStorage();
        render();
    }
}

function handleDeleteClick(tweetId) {
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1);
        saveToLocalStorage();
        render();
    }
}

function getFeedHtml() {
    let feedHtml = ``;

    tweetsData.forEach(function(tweet) {
        let likeIconClass = tweet.isLiked ? 'liked' : '';
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : '';

        let repliesHtml = '';
        if (tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText}</p>
        </div>
    </div>
</div>`;
            });
        }

        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
                </span>
            </div>
           <div class="reply-input-container hidden" id="reply-input-container-${tweet.uuid}">
    <input type="text" placeholder="Type your reply..." id="reply-input-${tweet.uuid}">
    <button type="button" data-reply-btn="${tweet.uuid}">Reply</button>
</div>

        </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
</div>`;
    });
    return feedHtml;
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml();
}

function saveToLocalStorage() {
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

render();
