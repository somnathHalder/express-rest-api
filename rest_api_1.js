const mysql = require ('mysql');
var express = require ('express');
var bodyParser = require ('body-parser');
var app = express ();

app.use (bodyParser.json ());
app.use (
  bodyParser.urlencoded ({
    extended: true,
  })
);
var conn = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'express_test',
});

conn.connect ();

// get all student
app.get ('/api/students', (req, res) => {
  conn.query ('SELECT * FROM student', (err, results, fields) => {
    if (err) throw err;
    return res.send ({error: false, data: results, message: 'students list.'});
  });
});

// read single student
app.get ('/api/students/:id', function (req, res) {
  let id = req.params.id;
  if (!id) {
    return res.status (400).send ({error: true, message: 'Please provide id'});
  }

  conn.findById (id, (error, data) => {
    if (error) {
      return next (error);
    } else {
      res.json (data);
    }
  });

  // conn.query ('SELECT * FROM student where id=?', id, function (
  //   error,
  //   results,
  //   fields
  // ) {
  //   if (error) throw error;
  //   return res.send ({
  //     error: false,
  //     data: results[0],
  //     message: 'student list.',
  //   });
  // });
});

// craete student
app.post ('/api/students', function (req, res) {
  let name = req.body.name;
  let age = req.body.age;
  if (!name && !age) {
    return res
      .status (400)
      .send ({error: true, message: 'Please provide student'});
  }
  conn.query (
    'INSERT INTO student(name,age) VALUES (?,?)',
    [name, age],
    function (error, results, fields) {
      if (error) throw error;
      return res.send ({
        error: false,
        data: results,
        message: 'New student has been created successfully.',
      });
    }
  );
});

// update student
app.put ('/api/students', function (req, res) {
  let user_id = req.body.id;
  let name = req.body.name;
  let age = req.body.age;
  if (!user_id || !name || !age) {
    return res.status (400).send ({
      error: name,
      message: 'Please provide name and student_id and age',
    });
  }
  conn.query (
    'UPDATE student SET ? WHERE id = ?',
    [
      {
        name: name,
        age: age,
      },
      user_id,
    ],
    function (error, results, fields) {
      if (error) throw error;
      return res.send ({
        error: false,
        data: results,
        message: 'student has been updated successfully.',
      });
    }
  );
});

//  Delete user
app.delete ('/api/students/', function (req, res) {
  let user_id = req.body.id;
  console.log (user_id);
  if (!user_id) {
    return res
      .status (400)
      .send ({error: true, message: 'Please provide student_id'});
  }
  conn.query ('DELETE FROM student WHERE id = ?', [user_id], function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    return res.send ({
      error: false,
      data: results,
      message: 'student has been delete successfully.',
    });
  });
});

app.listen (9000, function () {
  console.log ('Node app is running on port 9000');
});
module.exports = app;
