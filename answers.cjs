const { Client } = require('pg');

const dbConfig = {
  user: 'vishalz',
  host: 'localhost',
  database: 'arduino',
  password: 'vishal',
  port: 5432
};

const client = new Client(dbConfig);

async function executeQueries() {
  try {
    await client.connect();

    // -- 1. What is the percentage of posts that have at least one answer?

    const query1 = `SELECT (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM posts where posttypeid =1)) AS percentage
    FROM posts
    WHERE answercount >= 1;`;

    // -- 2. List the top 10 users who have the most reputation
    const query2 = `SELECT id, displayname, reputation
    FROM users
    ORDER BY reputation DESC
    LIMIT 10;`;

    //-- 3. Which day of the week has most questions answered within an hour?
    const query3 = `select to_char(p2.creationdate,'day') as nameofday, count(*) from posts p1,posts p2
    where p1.posttypeid=2
    and p1.parentid=p2.id
    and extract(year from age(p1.creationdate,p2.creationdate))=0
    and extract(month from age(p1.creationdate,p2.creationdate))=0
    and extract(day from age(p1.creationdate,p2.creationdate))=0
    and extract(hour from age(p1.creationdate,p2.creationdate))=0
    group by nameofday
    order by count desc
    limit 1`;

    //-- 4. Find the top 10 posts with the most upvotes in 2015
    const query4 = `select count(*) as upvotes,p.id,p.creationdate from votes v
    left join posts p on p.id=v.postid
    where extract (year from p.creationdate)=2015
    and v.votetypeid=2
    group by p.id
    order by count(*) desc
    limit 10;`;

    // -- 5. Find the top 5 tags associated with the most number of posts

    const query5 = `select * from tags
    order by count desc
    limit 5;`;

    // 6.Find the number of questions asked every year

    const query6 = `select extract(year from creationdate) as year,count(*) as numberOfQuestions from posts
    where posttypeid = 1
    group by distinct extract(year from creationdate)
    order by extract(year from creationdate)`;

    // 7.For the questions asked in 2014, find any 3 "rare" questions that are associated with the least used tags

    const query7 = `WITH LeastUsedTags AS (
      SELECT tagname
      FROM tags
      ORDER BY COUNT ASC
      limit 10)
      SELECT p.id,p.creationdate,p.tags
      FROM posts p
      JOIN tags t ON p.tags LIKE CONCAT('%', t.tagname, '%')
      WHERE t.tagname IN (SELECT tagname FROM LeastUsedTags) and extract(year from p.creationdate)=2014`;
    
    // 8. When did arduino.stackexchange.com have the most usage? Has it declined in usage now? (somewhat open-ended question. Use your own interpretation of the question)
    const query8 = `select 
    extract(year from creationdate),
    count(*) as numberOfposts,
    cast(case when extract(year from creationdate)!=2023 then 'true' else 'false' end as text)as "decline usage"  from posts
    group by extract(year from creationdate)
    order by numberofposts desc
    limit 1;`;

    //9. Find the top 5 users who have performed the most number of actions
    const query9 = `select id,displayname,upvotes,downvotes,c.comment_count,p.post_count,(c.comment_score+upvotes+downvotes+p.post_score) as total_score from users u
    inner join (select userid,count(*) as comment_count,count(*)*3 as comment_score from comments
    group by userid) c
    on c.userid = u.id
    inner join (select owneruserid, count(*) AS post_count, count(*) * 10 as post_score
        from posts
        group by owneruserid) p
      on p.owneruserid = u.id
    order by total_score desc
    limit  5`;

    const result1 = await client.query(query1);
    const result2 = await client.query(query2);
    const result3 = await client.query(query3);
    const result4 = await client.query(query4);
    const result5 = await client.query(query5);
    const result6 = await client.query(query6);
    const result7 = await client.query(query7);
    const result8 = await client.query(query8);
    const result9 = await client.query(query9);


    const percentage_answered = Number(result1.rows[0]['percentage']).toFixed(
      2
    );

    const top10MostReputedUsers = result2.rows;

    const dayHavingMostAnseredQuestion = result3.rows;

    const top10MostUpvotedPosts = result4.rows;

    const top5TagsWithMostNumberOfPosts = result5.rows;

    const numberOfQuestionsAskedEachYear = result6.rows;

    const rareQuestionsOf2014 = result7.rows;

    const mostUsage = result8.rows;

    const activeUsers = result9.rows;

    // Display the query results
    // task 1
    console.log('Task-1 -> Percentage answered:', percentage_answered);
    // task 2
    console.log('Task-2 -> Answered Posts:', top10MostReputedUsers);
    // task 3
    console.log(
      'Task-3 -> Most answered question of the day in the week : ',
      dayHavingMostAnseredQuestion
    );
    // task 4
    console.log(
      'Task-4 -> Top 10 most voted posts ids: ',
      top10MostUpvotedPosts
    );
    // task 5
    console.log(
      'Task-5 -> Top 5 tags associated with most number of posts: ',
      top5TagsWithMostNumberOfPosts
    );
    // task 6
    console.log(
      'Task-6 -> Find the number of questions asked every year: ',
      numberOfQuestionsAskedEachYear
    );

    // task 7
    console.log(
      'Task-7 -> Rare Questions of 2014:',rareQuestionsOf2014
    );

    // task 8
    console.log(
      'Task-8 -> When did arduino.stackexchange.com have the most usage? Has it declined in usage now?',mostUsage
    );

    // task 9
    console.log(
      'Task-8 -> Top 5 Active Users: ',activeUsers
    );

  } catch (error) {
    console.error('Error executing queries:', error);
  } finally {
    await client.end();
  }
}
executeQueries();
