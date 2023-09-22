## SQL CONCEPTS - TECHNICAL DOCUMENTATION

### Table of Contents

1. [ACID](#acid)
2. [CAP THEOREM](#cap)
3. [Joins](#joins)
4. [Aggregations, Filters in queries](#ANF)
5. [Normalization](#normalisation)
6. [Indexes](#index)
7. [Transactions](#transaction)
8. [Locking mechanism](#locking)
9. [Database Isolation Levels](#isolation)
10. [Triggers](#trigger)

<a id="acid"></a>

### 1. ACID

ACID is a set of properties of relational database transactions. ACID stands for Atomicity, Consistency, Isolation, Durability. These are explained below:

**Atomicity** means that a transaction must be treated as an atomic unit, that is, either all of its operations are executed or none. There must be no state in a database where a transaction is left partially completed. For example, in an application that transfers funds from one account to another, the atomicity property ensures that, if a debit is made successfully from one account, the corresponding credit is made to the other account.

**Consistency** ensures that a transaction can only bring the database from one valid state to another, maintaining database invariants: any data written to the database must be valid according to all defined rules, including constraints, cascades, triggers, and any combination thereof.

**Isolation** ensures that concurrent execution of transactions leaves the database in the same state that would have been obtained if the transactions were executed sequentially. Isolation is the main goal of concurrency control; depending on the method used, the effects of an incomplete transaction might not even be visible to other transactions.

**Durability** ensures that once a transaction has been committed, it will remain so, even in the event of power loss, crashes, or errors. In a relational database, for instance, once a group of SQL statements execute, the results need to be stored permanently (even if the database crashes immediately thereafter). To defend against power loss, transactions (or their effects) must be recorded in a non-volatile memory.

<a id="cap"></a>

### 2. CAP THEOREM

CAP theorem states that it is impossible for a distributed data store to simultaneously provide more than two out of the following three guarantees:

**Consistency** - Every read receives the most recent write or an error
**Availability** - Every request receives a (non-error) response, without the guarantee that it contains the most recent write
**Partition tolerance** - The system continues to operate despite an arbitrary number of messages being dropped (or delayed) by the network between nodes

In the presence of a network partition, one has to choose between consistency and availability. When choosing consistency over availability, the system will return an error or a time out if particular information cannot be guaranteed to be up to date due to network partitioning. When choosing availability over consistency, the system will always process the query and try to return the most recent available version of the information, even if it cannot guarantee it is up to date due to network partitioning.

<a id="joins"></a>

### 3. Joins

**Inner Join** - Inner join returns only those records/rows that match/exists in both the tables. It returns records from both the tables when the condition specified is satisfied. It is the most common type of join. It is also known as simple join. It is the default type of join. It is also the fastest type of join.
```sql
SELECT column_name(s)
FROM table1
INNER JOIN table2 ON table1.column_name = table2.column_name;
```
**Left Join** - Left join returns all the records from the left table (table1), and the matched records from the right table (table2). The result is NULL from the right side, if there is no match.
```sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2 ON table1.column_name = table2.column_name;
```
**Right Join** - Right join returns all the records from the right table (table2), and the matched records from the left table (table1). The result is NULL from the left side, when there is no match.
```sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2 ON table1.column_name = table2.column_name;
```
**Full Join** - Full join returns all the records when there is a match in left (table1) or right (table2) table records. If there are no matches, NULL is returned from both the sides.
```sql
SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2 ON table1.column_name = table2.column_name
WHERE condition;
```
**Self Join** - Self join is used to join a table to itself as if the table were two tables, temporarily renaming at least one table in the SQL statement.
```sql
SELECT column_name(s)
FROM table1 T1, table1 T2
WHERE condition;
```
**Cross Join** - Cross join is a Cartesian join which doesn't necessitate any condition to join. The resultset will be the number of rows in the first table multiplied by the number of rows in the second table if no condition is specified with ON clause.
```sql
SELECT column_name(s)
FROM table1
CROSS JOIN table2;
```

<a id="ANF"></a>

### 4. Aggregations, Filters in queries

**Aggregations** - Aggregations are used to perform calculations on a set of values. For example, calculating sum of sales for each product category. The aggregate functions are: AVG, COUNT, FIRST, LAST, MAX, MIN, SUM.
####
>    1.**Count**: Counts the number of rows that match a specified condition.
>    ```sql
>    SELECT COUNT(*) FROM employees WHERE department = 'Sales';
>    ```
>    2.**SUM**: Calculates the sum of numeric values in a column.
>    ```sql
>    SELECT SUM(salary) FROM employees;
>    ```
>    3.**AVG**:Computes the average of numeric values in a column.
>    ```sql
>    SELECT AVG(age) FROM students;
>    ```
>    4.**MIN**: Finds the minimum value in a column.
>    ```sql
>    SELECT MIN(price) FROM products;
>    ```
>    5.**MAX**: Finds the maximum value in a column.
>    ```sql
>    SELECT MAX(score) FROM exam_results;
>    ```
>    6.**GROUP BY**:Groups rows based on one or more columns and applies aggregation functions to each group.
>    ```sql
>    SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department;
>    ```
>
> ###

**Filters** - Filters are used to restrict the results returned by the query. The WHERE clause is used to filter records. The WHERE clause is used to extract only those records that fulfill a specified condition. The WHERE clause is used with SELECT, UPDATE, DELETE statement.
####
>    1.**WHERE Clause:**: The WHERE clause is used to filter rows based on specific conditions.
>    ```sql
>    SELECT * FROM products WHERE price < 50;
>    ```
>    2.**AND & OR Operators**: You can use AND and OR operators to combine multiple conditions in a WHERE clause.
>    ```sql
>    SELECT * FROM customers WHERE age > 25 AND city = 'New York';
>    ```
>    3.**IN Operator**: Checks if a value matches any value in a list.
>    ```sql
>    SELECT * FROM orders WHERE status IN ('Shipped', 'Delivered');
>    ```
>    4.**BETWEEN Operator**: Filters rows with values within a specified range.
>    ```sql
>    SELECT * FROM sales WHERE sale_date BETWEEN '2023-01-01' AND '2023-12-31';
>    ```
>    5.**LIKE Operator**:Searches for patterns in text data using wildcard characters.
>    ```sql
>    SELECT * FROM products WHERE product_name LIKE 'App%';
>    ```
>    6.**NULL Values**: You can filter rows with NULL or non-NULL values.
>    ```sql
>    SELECT * FROM employees WHERE manager_id IS NULL;
>    ```
>    7.**ORDER BY Clause**: While not a filter per se, you can use ORDER BY to sort the results of your query in ascending or descending order based on one or more columns.
>    ```sql
>    SELECT * FROM students ORDER BY last_name ASC;
>    ```

<a id="normalisation"></a>

### 5. Normalization

Normalization is a process of organizing the data in database to avoid data redundancy, insertion anomaly, update anomaly & deletion anomaly. Let’s discuss about anomalies first then we will discuss normal forms with examples.

**Anomalies in DBMS**

a. Insertion Anomaly

b. Updation Anomaly

c. Deletion Anomaly

>
>**Insertion Anomaly**: Insertion anomaly occurs when we try to insert data in a column (attribute) which is a part of primary key.

>**Updation Anomaly**: Updation anomaly occurs when we try to update data in a column (attribute) which is a part of primary key.

>**Deletion Anomaly**: Deletion anomaly occurs when we try to delete data in a column (attribute) which is a part of primary key.

---
**Normal Forms in DBMS**

a. First Normal Form (1NF)

b. Second Normal Form (2NF)

c. Third Normal Form (3NF)

d. Boyce-Codd Normal Form (BCNF)

e. Fourth Normal Form (4NF)

f. Fifth Normal Form (5NF)

---
**First Normal Form (1NF)**: A relation is said to be in 1NF if it has only single valued attributes, i.e., attributes having single value for a single record.

**Second Normal Form (2NF)**: A relation is said to be in 2NF if it is in 1NF and every non-prime attribute of the table is fully functionally dependent on the primary key.

**Third Normal Form (3NF)**: A relation is said to be in 3NF if it is in 2NF and no transition dependency exists in it.

**Boyce-Codd Normal Form (BCNF)**: A relation is said to be in BCNF if it is in 3NF and for every functional dependency X → Y, X should be a super key.

**Fourth Normal Form (4NF)**: A relation is said to be in 4NF if it is in BCNF and it has no multi-valued dependency.

**Fifth Normal Form (5NF)**: A relation is said to be in 5NF if it is in 4NF and it has no join dependency and no non-trivial multivalued dependencies.

<a id="index"></a>

### 6. Indexes

Indexes are used to retrieve data from the database more quickly than otherwise. The users cannot see the indexes, they are just used to speed up searches/queries. Note: Updating a table with indexes takes more time than updating a table without (because the indexes also need an update). So, only create indexes on columns that will be frequently searched against.

**Types of Indexes**

>a. Clustered Index
>
>b. Non-Clustered Index
>
>c. Unique Index
>
>d. Filtered Index
>
>e. Columnstore Index
>
>f. Spatial Index
>
>g. XML Index
>
>h. Full-Text Index


<a id="transaction"></a>

### 7. Transactions

Transactions are a sequence of database operations that are executed as a single unit of work. This means that either all operations are executed or none are. Transactions are used to ensure data integrity and consistency. Transactions are used in situations where data is transferred from one database to another, or when data is updated in one database.

**Properties of Transactions**

>a. Atomicity
>
>b. Consistency
>
>c. Isolation
>
>d. Durability
>
>e. Serializability


<a id="locking"></a>

### 8. Locking mechanism

Locking is a mechanism used to control access to a database object to prevent simultaneous access to the same database object by multiple users. Locks can be applied on different levels of granularity, such as the entire database, table, or row. Locks can be applied implicitly or explicitly.
> 1.  **Purpose of Locking** :-
>     - Locking ensures that only one transaction can access or modify a piece of data at a time, preventing concurrent transactions from interfering with each other.
>     - It helps maintain data integrity and consistency in a multi-user database system.

> 2.  **Lock Duration** :-
>     - Locks can be categorized as short-term (held for the duration of a single SQL statement) or long-term (held for the duration of a transaction).
>     - Long-term locks can lead to blocking and should be released as soon as possible to minimize contention.

> 3.  **Deadlocks** :-
>     - A deadlock occurs when two or more transactions are waiting for each other to release locks, resulting in a standstill.
>     - DBMSs implement deadlock detection and resolution mechanisms to break deadlocks.

> 4.  **Optimistic Concurrency Control:** :-
>     - DBMSs use optimistic concurrency control, where locks are acquired only when a transaction is ready to commit. Conflicts are detected at that point, and the transaction may need to be rolled back and retried.

 Locking mechanisms are essential for ensuring data consistency and preventing data anomalies in a multi-user database environment. The choice of locking strategy and isolation level depends on the specific requirements and performance considerations of the application.

<a id="isolation"></a>

### 9. Database Isolation Levels

Isolation levels determine how concurrent transactions are allowed to access data in a database. The isolation level can be set at the server level, database level, or even the transaction level. The isolation level can be set using the SET TRANSACTION ISOLATION LEVEL statement.

**Types of Isolation Levels**

a. Read Uncommitted

b. Read Committed

c. Repeatable Read

d. Serializable

>**Read Uncommitted**: In this isolation level, a transaction can read data that has been modified by another transaction but not yet committed. This is the lowest isolation level and offers the highest level of concurrency.
>
>**Read Committed**: In this isolation level, a transaction can only read data that has been committed by another transaction. This is the default isolation level in most DBMSs.
>
>**Repeatable Read**: In this isolation level, a transaction can read the same data multiple times and get the same result each time. This is the default isolation level in Oracle.
>
>**Serializable**: In this isolation level, a transaction can only read data that has been committed by another transaction. This is the highest isolation level and offers the lowest level of concurrency.
>

<a id="trigger"></a>

### 10. Triggers

A trigger is a special type of stored procedure that is executed automatically when a data modification event (INSERT, UPDATE, DELETE) occurs on a specified table. Triggers are used to enforce business rules, perform complex calculations, and maintain referential integrity. Triggers can be created using the CREATE TRIGGER statement.

**Types of Triggers**

a. DML Triggers

b. DDL Triggers

c. Logon Triggers

d. CLR Triggers
>
>**DML Triggers**: DML triggers are fired in response to data modification events (INSERT, UPDATE, DELETE) on a specified table.
>
>**DDL Triggers**: DDL triggers are fired in response to DDL events (CREATE, ALTER, DROP) on a specified database or server.
>
>**Logon Triggers**: Logon triggers are fired in response to LOGON events on a specified server.
>
>**CLR Triggers**: CLR triggers are fired in response to CLR events on a specified database.
>
><a id="sql"></a>
>
#### syntax:
>
> ```sql
>    create trigger [trigger_name]
>
>    [before | after]
>
>    {insert | update | delete}
>
>    on [table_name]
>
>    [for each row]
>
>    [trigger_body]
> ```
>
> ---
