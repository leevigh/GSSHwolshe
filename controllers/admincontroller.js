module.exports = {
   
    admin: (req, res) => {
    res.render("admin/dashboard.ejs");
  },

  details: (req, res) => {
    let pageTitle = "details";
    res.render("admin/details.ejs");
  },

  users: (req, res) => {
    let pageTitle = "users";
    res.render("admin/users.ejs");
  }
};

