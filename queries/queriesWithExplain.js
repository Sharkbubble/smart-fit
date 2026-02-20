// USER Q'S

// Create Alice
db.Users.insertOne({
    "name": "Alice",
    "email": "alice@example.com",
    "joinedDate": new Date(),
    "dailyCalorieGoal": 2200,
    "age": 28,
    "gender": "Female",
    "height": 165,
    "weight": 60,
    "goals": "Lose 5 kg"
}).explain("executionStats");

// Update Alice’s calorie goal
db.Users.updateOne(
    { "name": "Alice" },
    { $set: { "dailyCalorieGoal": 2300 } }
).explain("executionStats");

// Find user using email or name
db.Users.findOne({
    $or: [{ "email": "alice@example.com" }, { "name": "alice" }]
}).explain("executionStats");

// Get all users whose calorie goal > 2500
db.Users.find({ "dailyCalorieGoal": { $gt: 2500 } })
    .explain("executionStats");

// Count users with at least 1 workout
db.Users.find({
    "recentWorkouts": { $exists: true, $not: { $size: 0 } }
}).count().explain("executionStats");

// Find the 5 most recently joined users
db.Users.find().sort({ "joinedDate": -1 }).limit(5)
    .explain("executionStats");

// Add 1 cm to users height
db.Users.updateOne(
    { "email": "alice@example.com" },
    { $inc: { "height": 1 } }
).explain("executionStats");

// Remove 1 kg from users weight
db.Users.updateOne(
    { "name": "alice@example.com" },
    { $inc: { "weight": -1 } }
).explain("executionStats");

// Remove the last workout from recents array
db.Users.updateOne(
    { "email": "alice@example.com" },
    { $pop: { "recentWorkouts": -1 } } 
).explain("executionStats");

// Create new firstWorkoutDate if missing
db.Users.updateOne(
    { "email": "someones email" },
    { $min: { "firstWorkoutDate": new Date() } },
    { collation: { locale: "en", strength: 2 } }
).explain("executionStats");

// Delete all users under 22 and not female
db.Users.deleteMany({
    $and: [
        { "age": { $lt: 22 } },
        { "gender": { $ne: "Female" } }
    ]
}).explain("executionStats");


// WORKOUT Q'S

// Create workout for Alice
db.Workouts.insertOne({
    "userId": ObjectId(aliceId),
    "type": "Cardio",
    "date": new Date(),
    "duration": 45,
    "length": 10,
    "notes": "Felt strong"
}).explain("executionStats");

// Update workout notes
db.Workouts.updateOne(
    { "_id": workoutId },
    { $set: { "notes": "Ran faster today!" } }
).explain("executionStats");

// Find user’s last 10 workouts
db.Workouts.find({ "userId": ObjectId("FILL IN ID HERE") })
    .sort({ "date": -1 })
    .limit(10)
    .explain("executionStats");

// Delete workouts older than 1 year
db.Workouts.deleteMany({
    "date": { $lt: new Date(Date.now() - 31536000000) }
}).explain("executionStats");

// Find 2nd longest workout
db.Workouts.find({ userId: ObjectId("FILL IN HERE") })
    .sort({ duration: -1 })
    .skip(1)
    .limit(1)
    .explain("executionStats");


// NUTRITION Q'S

// Insert a meal for Alice
db.Nutrition.insertOne({
    "userId": aliceId,
    "type": "Lunch",
    "calories": 600,
    "macros": { "carbs": 80, "protein": 25, "fats": 20 },
    "date": new Date(),
    "notes": "Healthy meal"
}).explain("executionStats");

// Increase calories by 100
db.Nutrition.updateOne(
    { "_id": nutritionId },
    { $inc: { "calories": 100 } }
).explain("executionStats");

// TTL test entry
db.Nutrition.insertOne({
    "userId": aliceId,
    "type": "Lunch",
    "calories": 500,
    "macros": { "carbs": 50, "protein": 20, "fats": 15 },
    "date": new Date(Date.now() - 15778800 * 1000),
    "notes": "Old meal for TTL test"
}).explain("executionStats");

// Delete meals missing macros
db.Nutrition.deleteMany({
    $or: [
        { "macros": { $exists: false } },
        { "macros.carbs": { $exists: false } },
        { "macros.protein": { $exists: false } },
        { "macros.fats": { $exists: false } }
    ]
}).explain("executionStats");

// Find last 10 meals for user
db.Nutrition.find({ "userId": ObjectId("FILL IN ID HERE") })
    .sort({ "date": -1 })
    .limit(10)
    .explain("executionStats");

// Find last 10 lunches/dinners above 500 calories
db.Nutrition.find({
    "type": { $in: ["Lunch", "Dinner"] },
    "calories": { $gt: 500 }
})
.sort({ "date": -1 })
.limit(10)
.explain("executionStats");


// PLACES Q'S

// Add a place
db.Places.insertOne({
    "name": "Central Gym",
    "type": "Gym",
    "address": { "street": "123 Main St", "city": "Vancouver", "country": "Canada" },
    "location": { "type": "Point", "coordinates": [-123.115, 49.28] }
}).explain("executionStats");

// Update gym name
db.Places.updateOne(
    { "_id": placeId },
    { $set: { "name": "Central Fitness Center" } }
).explain("executionStats");

// Find gyms within 5km, limit 3
db.Places.find({
    "type": "Gym",
    "location": {
        $near: {
            $geometry: { "type": "Point", "coordinates": [-123.0990, 49.2825] },
            $maxDistance: 5000
        }
    }
})
.limit(3)
.explain("executionStats");

// Delete all gyms in Delta
db.Places.deleteMany({
    "type": "Gym",
    "address.city": "Delta"
}).explain("executionStats");
