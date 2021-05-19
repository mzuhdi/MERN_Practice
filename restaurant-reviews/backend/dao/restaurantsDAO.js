import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

let restaurants

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    static async getRestaurant({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor

        try {
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        console.log(displayCursor)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList, totalNumRestaurants }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

    }

    static async getRestaurantById(id) {
        let cursor

        try {
            cursor = await restaurants
                .find({ restaurant_id: id })
        } catch (e) {
            console.error(`Unable to issue find restaurant with that ID, ${e}`)
            return { restaurantsList: [] }
        }

        try {
            const restaurantsList = await cursor.toArray()
            return { restaurantsList }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [] }
        }

    }

    static async getRestaurantsByCuisine(){
        let cuisine = []

        try {
            cuisine = await restaurants.distinct("cuisine")
            console.log(cuisine)
            return cuisine
        } catch (e) {
            console.error(
                `Unable to find distinct cuisine, ${e}`
            )
            return cuisine
        }
    }
}