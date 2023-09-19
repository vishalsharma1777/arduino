const fs = require('fs');
const { Pool } = require('pg');
const parseString = require('xml2js').parseString;

const pool = new Pool({
  user: 'vishalz',
  host: 'localhost',
  database: 'arduino',
  password: 'vishal',
  port: 5432
});

fs.readFile(
  './arduino.stackexchange.com/6.xml',
  'utf-8',
  (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return;
    }
    parseString(data, async (parseErr, result) => {
      if (parseErr) {
        console.error('Error parsing XML:', parseErr);
        return;
      }
      try {
        const rows = Array.isArray(result.posthistory.row)
          ? result.posthistory.row
          : [result.posthistory.row];

        const client = await pool.connect();

        for (const row of rows) {
          const {
            Id,
            PostHistoryTypeId,
            PostId,
            RevisionGUID,
            CreationDate,
            UserId,
            UserDisplayName,
            Comment,
            CloseReasonId,
            PostNoticeId,
            Text,
            ContentLicense
          } = row.$;
          const query = {
            text: 'INSERT INTO posthistory(id,postHistoryTypeId, postId, revisionGUID, creationDate, userId, userDisplayName, comment, closeReasonId, postNoticeId, text, contentLicense) VALUES($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12)',
            values: [
              Id,
              PostHistoryTypeId,
              PostId,
              RevisionGUID,
              CreationDate,
              UserId,
              UserDisplayName,
              Comment,
              CloseReasonId,
              PostNoticeId,
              Text,
              ContentLicense
            ]
          };

          await client.query(query);
        }

        console.log('Data inserted successfully.');
      } catch (error) {
        console.error('Error inserting data:', error);
      } finally {
        pool.end();
      }
    });
  }
);
