const express = require("express");
const router = express.Router();

router.route("/enroll").get((req, res) => {
    res.render("enroll");
});

router
    .route("/apply")
    .get((req, res) => {
        res.render("apply");
    })
    .post((req, res, err) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const nameOfInstitution = req.body.nameOfInstitution;
        const phone = req.body.phone;
        const email = req.body.email;
        const fileToUpload4 = req.files.admissionLetter[0].path;

        if (err) {

            console.log(err);
        }

        // ==================Saving user to database================
        const newUser = new User(result.value);
        newUser.save();
        console.log(`user created and saved successfully.`);
    });

module.exports = router;
