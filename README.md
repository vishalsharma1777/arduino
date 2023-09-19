## SQL exercises

### Import the following dataset into a PostgreSQL database and write queries to answer the following questions

Arduino.stackexchange.com dataset: https://drive.google.com/file/d/1AoevWuHTCdw9TYUb2EYC1lbwsMBRhZGb/view?usp=sharing

You can find details about the schema here - https://meta.stackexchange.com/questions/2677/database-schema-documentation-for-the-public-data-dump-and-sede/2678#2678

---

### Questions

1. What is the percentage of posts that have at least one answer?
2. List the top 10 users who have the most reputation
3. Which day of the week has most questions answered within an hour?
4. Find the top 10 posts with the most upvotes in 2015?
5. Find the top 5 tags associated with the most number of posts
6. Find the number of questions asked every year
7. For the questions asked in 2014, find any 3 "rare" questions that are associated with the least used tags
8. When did arduino.stackexchange.com have the most usage? Has it declined in usage now? (somewhat open-ended question. Use your own interpretation of the question)
9. Find the top 5 users who have performed the most number of actions in terms of creating posts, comments, votes. Calculate the score in the following way:
   1. Each post carries 10 points
   2. Each upvote / downvote carries 1 point
   3. Each comment carries 3 points