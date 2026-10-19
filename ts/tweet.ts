class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //Live events: "Watch my run right now with @Runkeeper Live ..."
        if (this.text.startsWith("Watch my") || this.text.includes("#RKLive")) {
            return "live_event";
        }
        //Achievements: personal records and goals
        if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement";
        }
        //Completed events: "Just completed a ..." / "Just posted a ..."
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        //Strip out the links and the #Runkeeper hashtag
        let stripped = this.text.replace(/https?:\/\/\S+/g, "").replace(/#Runkeeper/gi, "").trim();
        //The default RunKeeper text is "with @Runkeeper. Check it out!"; user-written text follows " - "
        let dashIndex = stripped.indexOf(" - ");
        if (dashIndex == -1) {
            return "";
        }
        return stripped.substring(dashIndex + 3).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}