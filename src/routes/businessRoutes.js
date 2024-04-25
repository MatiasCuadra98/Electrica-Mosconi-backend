const { Router } = require("express");
const {
  getBusinessFromDb,
  postBusiness,
} = require("../controller/controllerBusiness");

const router = Router();

router.get("/", getBusinessFromDb);
// router.get("/:name", getBusinessByNameInDb);
router.post("/createBusiness", postBusiness);

module.exports = router;
