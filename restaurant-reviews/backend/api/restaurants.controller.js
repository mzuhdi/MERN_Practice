import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    static async apiGetRestraurants(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 10

        let filters = {}
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurant({
            filters,
            page,
            restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }

    static async apiGetRestraurantById(req, res, next) {

        try {
            let id = req.params.id || {}
            let restaurantsList = await RestaurantsDAO.getRestaurantById(id)

            if (!restaurantsList) {
                res.status(404).json({ error: "Unable to find restaurant by that ID" })
                return
            }
            res.json(restaurantsList)
        } catch (e) {
            console.log(`apiGetRestaurantById, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetRestraurantByIdReview(req, res, next) {

        try {
            let id = req.params.id || {}
            let restaurantsList = await RestaurantsDAO.getRestaurantByIdReview(id)

            if (!restaurantsList) {
                res.status(404).json({ error: "Unable to find restaurant by that ID" })
                return
            }
            res.json(restaurantsList)
        } catch (e) {
            console.log(`apiGetRestaurantById, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetRestraurantsCuisines(req, res, next) {

        try {
            let cuisineList = await RestaurantsDAO.getRestaurantsByCuisine()
            res.json(cuisineList)
        } catch (e) {
            console.log(`apiGetRestaurantsCuisines, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}