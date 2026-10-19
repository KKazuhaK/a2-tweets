function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	//Earliest and latest tweet dates
	const times = tweet_array.map(tweet => tweet.time.getTime());
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = new Date(Math.min(...times)).toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = new Date(Math.max(...times)).toLocaleDateString('en-US', dateOptions);

	//Count the tweets in each category
	const counts = { completed_event: 0, live_event: 0, achievement: 0, miscellaneous: 0 };
	tweet_array.forEach(tweet => counts[tweet.source]++);

	//Some spans appear more than once on the page, so update every element with the class
	setClassText('completedEvents', counts.completed_event);
	setClassText('completedEventsPct', formatPct(counts.completed_event, tweet_array.length));
	setClassText('liveEvents', counts.live_event);
	setClassText('liveEventsPct', formatPct(counts.live_event, tweet_array.length));
	setClassText('achievements', counts.achievement);
	setClassText('achievementsPct', formatPct(counts.achievement, tweet_array.length));
	setClassText('miscellaneous', counts.miscellaneous);
	setClassText('miscellaneousPct', formatPct(counts.miscellaneous, tweet_array.length));

	//Completed tweets which contain user-written text
	const writtenCount = tweet_array.filter(tweet => tweet.source == 'completed_event' && tweet.written).length;
	setClassText('written', writtenCount);
	setClassText('writtenPct', formatPct(writtenCount, counts.completed_event));
}

//Set the text of every element with the given class
function setClassText(className, text) {
	Array.from(document.getElementsByClassName(className)).forEach(element => element.innerText = text);
}

//Format a ratio as a percentage with exactly two decimal places
function formatPct(count, total) {
	return math.format(count / total * 100, {notation: 'fixed', precision: 2}) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
