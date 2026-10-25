//Tweets containing user-written text; filled once the tweets load
let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//Filter to just the written tweets
	written_tweets = runkeeper_tweets
		.map(tweet => new Tweet(tweet.text, tweet.created_at))
		.filter(tweet => tweet.written);

	//Re-run the search in case someone typed before the tweets finished loading
	updateSearch(document.getElementById('textFilter').value);
}

//Show the written tweets whose text contains searchText (ignoring case), or clear the table for an empty search
function updateSearch(searchText) {
	const table = document.getElementById('tweetTable');
	document.getElementById('searchText').innerText = searchText;

	if (searchText == '') {
		document.getElementById('searchCount').innerText = 0;
		table.innerHTML = '';
		return;
	}

	const query = searchText.toLowerCase();
	const matches = written_tweets.filter(tweet => tweet.writtenText.toLowerCase().includes(query));
	document.getElementById('searchCount').innerText = matches.length;
	table.innerHTML = matches.map((tweet, index) => tweet.getHTMLTableRow(index + 1)).join('');
}

function addEventHandlerForSearch() {
	//Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById('textFilter');
	searchBox.addEventListener('input', () => updateSearch(searchBox.value));
	updateSearch('');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
