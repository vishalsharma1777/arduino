 -- 1. What is the percentage of posts that have at least one answer?
SELECT (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM posts where posttypeid =1)) AS percentage
FROM posts
WHERE answercount >= 1;

-- 2. List the top 10 users who have the most reputation
SELECT id, displayname, reputation
FROM users
ORDER BY reputation DESC
LIMIT 10;

-- 3. Which day of the week has most questions answered within an hour?

select to_char(p2.creationdate,'day') as nameofday, count(*) from posts p1,posts p2
where p1.posttypeid=2 
and p1.parentid=p2.id
and extract(year from age(p1.creationdate,p2.creationdate))=0
and extract(month from age(p1.creationdate,p2.creationdate))=0
and extract(day from age(p1.creationdate,p2.creationdate))=0
and extract(hour from age(p1.creationdate,p2.creationdate))=0
group by nameofday
order by count desc;


-- 4.Find the top 10 posts with the most upvotes in 2015?

select count(*) as upvotes,p.* from votes v
left join posts p on p.id=v.postid
where extract (year from p.creationdate)=2015
and v.votetypeid=2
group by p.id
order by count(*) desc
limit 10;

-- select * from posts
-- where extract(year from creationdate)=2015
-- order by score desc
-- limit 10

-- 5.Find the top 5 tags associated with the most number of posts
select * from tags
order by count desc
limit 5;

-- 6.Find the number of questions asked every year
select extract(year from creationdate),count(*) as numberOfQuestions from posts
where posttypeid = 1
group by distinct extract(year from creationdate)
order by extract(year from creationdate)

-- 7.For the questions asked in 2014, find any 3 "rare" questions that are associated with the least used tags

WITH LeastUsedTags AS (
    SELECT tagname
    FROM tags
    ORDER BY COUNT ASC
	limit 10
)

SELECT p.*
FROM posts p
JOIN tags t ON p.tags LIKE CONCAT('%', t.tagname, '%')
WHERE t.tagname IN (SELECT tagname FROM LeastUsedTags) and extract(year from p.creationdate)=2014


-- 8.When did arduino.stackexchange.com have the most usage? Has it declined in usage now? (somewhat open-ended question. Use your own interpretation of the question)

select 
extract(year from creationdate),
count(*) as numberOfposts,
cast(case when extract(year from creationdate)!=2023 then 'true' else 'false' end as text)as "decline usage"  from posts
group by extract(year from creationdate)
order by numberofposts desc
limit 1;


-- 9.Find the top 5 users who have performed the most number of actions in terms of creating posts, comments, votes. Calculate the score in the following way:
--          Each post carries 10 points
--          Each upvote / downvote carries 1 point
--          Each comment carries 3 points

select id,displayname,upvotes,downvotes,c.comment_count,p.post_count,(c.comment_score+upvotes+downvotes+p.post_score) as total_score from users u
inner join (select userid,count(*) as comment_count,count(*)*3 as comment_score from comments
group by userid) c
on c.userid = u.id
inner join (select owneruserid, count(*) AS post_count, count(*) * 10 as post_score
    from posts
    group by owneruserid) p
	on p.owneruserid = u.id
order by total_score desc
limit  5




