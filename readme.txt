--Readme document for Kazuha Mo, kazuhak@uci.edu--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text search interface

2. How long, in hours, did it take you to complete this assignment?

About 4 hours.

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

- Assignment page and starter code: https://github.com/travislindenreid/a2-tweets
- Google searches for TypeScript syntax (classes, getters, type annotations),
  mainly landing on the TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- Vega-Lite documentation for the charts: https://vega.github.io/vega-lite/docs/
- Generative AI tools: I used them to check my code and to help debug errors.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

No one. I completed the assignment on my own.

5. Is there anything special we need to know in order to run your code?

js/tweet.js is generated from ts/tweet.ts and is not committed (it is listed in
.gitignore), so transpile it first from the repository root:

    tsc -p tsconfig.json

Then open index.html in a browser, or run live-server from the root folder. The
tweets are loaded from js/get_saved_tweets.js, so no server or extra install is
needed beyond the TypeScript compiler. Vega, Vega-Lite and math.js load from a
CDN, so the activities page needs an internet connection to draw its charts.
No bonus features were added.
