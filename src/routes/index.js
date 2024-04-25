const { Router } = require("express");
const businessRoutes = require("./businessRoutes");

const router = Router();

router.use("/business", businessRoutes);

module.exports = router;
