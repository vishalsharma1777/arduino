-- TABLE 1 BADGES
CREATE TABLE badges
(
    id integer NOT NULL,
    user_id integer,
    name character varying(255),
    date timestamp without time zone,
    class integer,
    tag_based boolean,
);

--TABLE 2 COMMENTS

CREATE TABLE comments
(
    id integer NOT NULL,
    postid integer,
    score integer,
    text text ,
    creationdate timestamp without time zone,
    userdisplayname character varying(255),
    userid integer,
    contentlicense character varying(50)
);

--TABLE 3 POSTHISTORY

CREATE TABLE posthistory
(
    id integer NOT NULL,
    posthistorytypeid integer,
    postid integer,
    revisionguid character varying(255),
    creationdate timestamp without time zone,
    userid integer,
    userdisplayname character varying(255),
    comment text,
    closereasonid integer,
    postnoticeid integer,
    text text,
    contentlicense character varying(50)
);

--TABLE 4 POSTLINKS

CREATE TABLE postlinks
(
    id integer,
    creationdate timestamp without time zone,
    postid integer,
    relatedpostid integer,
    linktypeid integer
);

--TABLE 5 POSTS

CREATE TABLE posts
(
    id integer NOT NULL,
    posttypeid integer,
    acceptedanswerid integer,
    parentid integer,
    creationdate timestamp without time zone,
    deletiondate timestamp without time zone,
    score integer,
    viewcount integer,
    body text,
    owneruserid integer,
    ownerdisplayname character varying(255),
    lasteditoruserid integer,
    lasteditordisplayname character varying(255),
    lasteditdate timestamp without time zone,
    lastactivitydate timestamp without time zone,
    title character varying(255),
    tags character varying(255),
    answercount integer,
    commentcount integer,
    favoritecount integer,
    closeddate timestamp without time zone,
    communityowneddate timestamp without time zone,
    contentlicense character varying(50)
);

--TABLE 6 TAGS

CREATE TABLE tags
(
    id integer,
    tagname character varying(255),
    count integer,
    excerptpostid integer,
    wikipostid integer
);

--TABLE 7 USERS

CREATE TABLE users
(
    id integer,
    reputation integer,
    creationdate timestamp without time zone,
    displayname character varying(255),
    lastaccessdate timestamp without time zone,
    websiteurl character varying(255),
    location character varying(255),
    aboutme text,
    views integer,
    upvotes integer,
    downvotes integer,
    profileimageurl character varying(255),
    accountid integer,
    emailhash "char"
);

--TABLE 8 VOTES

CREATE TABLE votes
(
    id integer,
    postid integer,
    votetypeid integer,
    creationdate timestamp without time zone
);

