function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Only completed tweets have an activity type and distance
	const completed = tweet_array.filter(tweet => tweet.source == 'completed_event' && tweet.activityType != 'unknown');

	//Count the tweets for each activity type, then sort from most to least common
	const activityCounts = {};
	completed.forEach(tweet => {
		activityCounts[tweet.activityType] = (activityCounts[tweet.activityType] || 0) + 1;
	});
	const activityData = Object.entries(activityCounts)
		.map(([activityType, count]) => ({ activityType: activityType, count: count }))
		.sort((a, b) => b.count - a.count);

	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": { "field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type" },
	    "y": { "field": "count", "type": "quantitative", "title": "Number of Tweets" }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//Distances of the three most-tweeted activities, with the time so Vega-Lite can group by day of the week
	const topThree = activityData.slice(0, 3).map(activity => activity.activityType);
	const distanceData = completed
		//Skip the few time-based logs (e.g. "a bike in 1:00:38"), which have no distance
		.filter(tweet => topThree.includes(tweet.activityType) && tweet.distance > 0)
		.map(tweet => ({ activityType: tweet.activityType, distance: tweet.distance, time: tweet.time.toISOString() }));

	//Both distance plots share everything except how distance is encoded on the y-axis
	const distanceSpec = function(yEncoding, description) {
		return {
		  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		  "description": description,
		  "data": {
		    "values": distanceData
		  },
		  "width": 400,
		  "mark": "point",
		  "encoding": {
		    "x": { "field": "time", "timeUnit": "day", "type": "ordinal", "title": "time (day)" },
		    "y": yEncoding,
		    "color": { "field": "activityType", "type": "nominal", "sort": topThree }
		  }
		};
	};
	vegaEmbed('#distanceVis', distanceSpec(
		{ "field": "distance", "type": "quantitative" },
		"Distances of the three most-tweeted activities by day of the week."
	), {actions:false});
	vegaEmbed('#distanceVisAggregated', distanceSpec(
		{ "field": "distance", "aggregate": "mean", "type": "quantitative" },
		"Mean distances of the three most-tweeted activities by day of the week."
	), {actions:false});

	//Start by showing every activity; the button alternates between the two plots
	const aggregatedVis = document.getElementById('distanceVisAggregated');
	const allVis = document.getElementById('distanceVis');
	const button = document.getElementById('aggregate');
	aggregatedVis.style.display = 'none';
	button.addEventListener('click', function() {
		const showingMeans = aggregatedVis.style.display != 'none';
		aggregatedVis.style.display = showingMeans ? 'none' : 'block';
		allVis.style.display = showingMeans ? 'block' : 'none';
		button.innerText = showingMeans ? 'Show means' : 'Show all activities';
	});

	//Answers read off the aggregated plot: biking is longest, walking is shortest, and all three peak on Saturday and Sunday
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
