# Tweet-with-Hillary-Clinton-and-Donald-Trump-d3-Project-
Data Visualization Course Project with d3.js

The purpose of this project is to explore and create an interactive data visualization dashboard
that can successfully convey the information or message to the audience. The project is
developed by using the JavaScript library, Data-Driven Documents, D3.js. Through several
discussions within the group members, we decided to build an interactive data visualization
dashboard on 2016 US Presidential Election Tweets to analyze the tweet statistics of the two
major-party presidential nominees, Hillary Clinton and Donald Trump. We obtained the data
from https://www.kaggle.com/benhamner/clinton-trump-tweets which consists of
approximately 3000 tweets for both candidates during the US presidential election period.

Due to insufficient information provided, we also crawl the data from Twitter. Twitter has
played an essential role in the 2016 US Presidential Election. Debates have raged and
candidates have risen and fallen based on tweets. The dataset that we used is Hillary Clinton
and Donald Trump Tweets, which are tweets from the major party candidates for the 2016
US Presidential Election. The dataset contains 6445 rows with 28 columns. We focused on
several columns that we are interested in only, and clean the tweets to remove unnecessary
symbols and construct a cleaned version of the dataset. Our cleaned dataset consists of 13
columns which are handle text, cleanText, textLength, textTag, is_retweet, original_author,
datetime, date, time, lang, retweet_count and favorite_count.

The final interactive visualization application tends to display information from different
aspects using different types of charts as stated as below:
1. Text visualization: To display the tweet statistics which are Friends Count, Followers
Count and Total Number of Tweets by using numerics only which tends to convey the
information directly.
2. Drill-down Bar Chart: To display the number of tweets posted during the presidential
election period. From the monthly view, users can further drill down to daily view.
3. Heat Map: To display the trend of tweet posted based on the day and time. The tweet
posting trend can be easily discovered based on the colour gradient of the heatmap.
4. Parallel Set: To analyze the relationship between the tweet’s sentiment analysis
(positive, negative or neutral), retweet and language used. This can show a percentage
for each category.
5. Parallel Coordinates: To analyze the relationship between the tweet length, favourite
count and retweet count.
6. Treemap: To discover the percentage of the source of retweet.
7. Wordcloud: To discover on the frequencies of tweet based on selected keyword and
also display the complete tweet with its posted date and sentiment analysis.

The interactive visualization application developed is enhanced with a filter function to
enable different views of data visualization which is for Hillary Clinton only, Donald Trump
only or both nominees.
