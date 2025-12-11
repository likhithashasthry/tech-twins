const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/users/:id/plants", ctrl.addPlant);
router.get("/users/:id/water-recommendation", ctrl.getWaterRecommendation);

module.exports = router;
