var db = require("../models");
var bcrypt = require("bcrypt");

module.exports = function(app) {
  app.post("/login", function(req, res) {
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      if (!user) {
        return res.json({
          success: false,
          message: "User not found!"
        });
      }

      bcrypt.compare(req.body.password, user.password, function(err, success) {
        if (success) {
          req.session.userId = user.id;

          return res.json({
            success: true,
            message: "User Found!"
          });
        } else {
          return res.json({
            success: false,
            message: "Invalid Password!"
          });
        }
      });
    });
  });

  app.post("/signup", function(req, res) {
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      if (user) {
        return res.json({
          success: false,
          message: "Email already used!"
        });
      }

      bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.User.create({
          email: req.body.email,
          password: hash
        }).then(function(user) {
          req.session.userId = user.id;

          return res.json({
            success: true,
            message: "User created!"
          });
        });
      });
    });
  });

  // app.post('http://localhost:3000/result', function (req, res) {
  //     // let input = JSON.stringify(req.body.items)
  //     // input.isbn = (req.body.items[0].volumeInfo.industryIdentifiers[0].identifier);
  //     // input.title = (req.body.items[0].volumeInfo.title);
  //   console.log(req.body)

  app.post("/api/newbook", function (req,res){
    console.log("on server");
    console.log(req.body);
    
    db.Book.create({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.authors,
      purchase_link: req.body.link,
      price: req.body.price,
      average_rating: req.body.rating, 
      description: req.body.description,
      image_link: req.body.image
    }).then(function(added){
        console.log(req.body.title + ' added to books');
      }).then(function(show){
        res.json("book saved");
    }).catch(function(err){
        console.log(err);
        res.json(err); 
    })
  });


  app.get("/api/books", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Book.findAll({}).then(function(dbBook) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbBook);
    });
  });

  app.delete("/api/books/:id", function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Book.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbBooks) {
      res.json(dbBooks);
    });
  });
}