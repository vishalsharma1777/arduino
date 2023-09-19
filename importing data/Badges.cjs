const fs = require('fs');
const { Pool } = require('pg');
const parseString = require('xml2js').parseString;

// PostgreSQL database configuration
const pool = new Pool({
  user: 'vishalz',
  host: 'localhost', // Change to your PostgreSQL host
  database: 'arduino',
  password: 'vishal',
  port: 5432 // Change to your PostgreSQL port
});

// Read the XML file
fs.readFile('./arduino.stackexchange.com/Badges.xml', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading XML file:', err);
    return;
  }

  // Parse the XML data
  parseString(data, async (parseErr, result) => {
    if (parseErr) {
      console.error('Error parsing XML:', parseErr);
      return;
    }
    console.log(result.badges.row);

    try {
      // Extract the rows from the XML
      const rows = Array.isArray(result.badges.row) ? result.badges.row : [result.badges.row];

      console.log(rows);

      // Insert data into PostgreSQL
      const client = await pool.connect();

      for (const row of rows) {
        console.log(rows);
        const { Id, UserId, Name, Date, Class, TagBased } = row.$;

        // Customize this query based on your table structure
        const query = {
          text: 'INSERT INTO badges(id, user_id, name, date, class, tag_based) VALUES($1, $2, $3, $4, $5, $6)',
          values: [
            Id,
            UserId,
            Name,
            Date,
            Class,
            TagBased === 'True' ? true : false
          ]
        };

        await client.query(query);
      }

      console.log('Data inserted successfully.');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      pool.end(); // Close the PostgreSQL pool
    }
  });
});
