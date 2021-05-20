import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewCtrl from "./reviews.controller.js"

const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestraurants)
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestraurantById)
router.route("review/id/:id").get(RestaurantsCtrl.apiGetRestraurantByIdReview)
router.route("/cuisine").get(RestaurantsCtrl.apiGetRestraurantsCuisines)

router
    .route("/review")
    .post(ReviewCtrl.apiPostReview)
    .put(ReviewCtrl.apiUpdateReview)
    .delete(ReviewCtrl.apiDeleteReview)

export default router