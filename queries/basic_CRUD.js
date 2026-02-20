// USER QUERIES

//Create alice for testing
const insertAlice = db.Users.insertOne({
    "name": "Alice",
    "email": "alice@example.com",
    "joinedDate": new Date(),
    "dailyCalorieGoal": 2200,
    "age": 28,
    "gender": "Female",
    "height": 165,
    "weight": 60,
    "goals": "Lose 5 kg"
});
// to use alice later
const aliceId = insertAlice.insertedId;

// Update Alices calorie goal
db.Users.updateOne(
    { "name": "Alice" },
    { $set: { "dailyCalorieGoal": 2300 } }
);

// Find user using email or name 
db.Users.findOne({ $or: [{ "email": "alice@example.com" }, {"name": "alice"} ]} );

// Get all users whos calorie goal > 2500
db.Users.find({ "dailyCalorieGoal": { $gt: 2500 } });

// Count users with atleast 1 workout
db.Users.find({ "recentWorkouts": { $exists: true, $not: { $size: 0 } } }).count();

// Find the 5 most recently joined users
db.Users.find().sort({ "joinedDate": -1 }).limit(5);

// Add 1 cm to users height 
db.Users.updateOne(
    { "email": "alice@example.com" },
    { $inc: { "height": 1 } }
);

// Remove 1 kg from users weight 
db.Users.updateOne(
    { "name": "alice@example.com" },
    { $inc: { "weight": -1 } }
);

//Remove the last workout from recents array
db.Users.updateOne(
    { "email": "alice@example.com" },
    { $pop: { "recentWorkouts": -1 } } 
);


// make a new field and store first workout there (if none already there - make first workout be today)
db.Users.updateOne(
    { "email": "someones email" }, // insert actual email
    { $min: { "firstWorkoutDate": new Date() } },
    { collation: { locale: "en", strength: 2 } }
);

// delete all who are under 22 and are not female
db.Users.deleteMany({
    $and: [
        { "age": { $lt: 22 } }, 
        { "gender": { $ne: "Female" } }
    ]
});




// WORKOUT QUERIES

//create a workout for alice
const insertWorkout = db.Workouts.insertOne({
    "userId": ObjectId(aliceId),
    "type": "Cardio",
    "date": new Date(),
    "duration": 45,
    "length": 10,
    "notes": "Felt strong"
});

//use this workout later
const workoutId = insertWorkout.insertedId;

// change note on alices workout
db.Workouts.updateOne(
    { "_id": workoutId },
    { $set: { "notes": "Ran faster today!" } }
);

// Find a specific users last 10 workouts
db.Workouts.find({ "userId": ObjectId('692671f89e21211ca1f71daa') }).sort({ "date": -1 }).limit(10); //Eve Martin

//delete 1 year old or older workouts
db.Workouts.deleteMany({
    "date": { $lt: new Date(Date.now() - 31536000000) }
});

//find the second longest workout for a user 
db.Workouts.find({ "userId": ObjectId('692671f89e21211ca1f71dab') }).sort({ duration: -1 }).skip(1).limit(1); //Mia Martinez

  




//NUTRITION QUERIES

//give alice a meal
const nutritionId = db.Nutrition.insertOne({
    "userId": aliceId,
    "type": "Lunch",
    "calories": 600,
    "macros": { "carbs": 80, "protein": 25, "fats": 20 },
    date: new Date(),
    "notes": "Healthy meal",
}).insertedId;

//meal was actually 100 calories more
db.Nutrition.updateOne(
    { "_id": nutritionId },
    { $inc: { "calories": 100 } }
);

// Query to test TTL
db.Nutrition.insertOne({
    "userId": aliceId, // used with alice 
    "type": "Lunch",
    "calories": 500,
    "macros": { "carbs": 50, "protein": 20, "fats": 15 },
    "date": new Date(Date.now() - 15778800 * 1000), // ~6 months ago
    "notes": "Old meal for TTL test"
});

//delete any entries that don't have any of the macros
db.Nutrition.deleteMany({
    $or: [
      { "macros": { $exists: false } },
      { "macros.carbs": { $exists: false } },
      { "macros.protein": { $exists: false } },
      { "macros.fats": { $exists: false } }
    ]
});

// Find a specific users last 10 workouts
db.Nutrition.find({ "userId": ObjectId('692671f89e21211ca1f71df3') }).sort({ "date": -1 }).limit(10); //Eve Anderson

//Find the last 10 meals that were lunch or dinner and gt 500 cals
db.Nutrition.find({
    "type": { $in: ["Lunch", "Dinner"] },
    "calories": { $gt: 500 }
}).sort({"date": -1}).limit(10);
  



//PLACES QUERIES

//add a place
const placeId = db.Places.insertOne({
    "name": "Central Gym",
    "type": "Gym",
    "address": { "street": "123 Main St", "city": "Vancouver", "country": "Canada" },
    "location": { "type": "Point", "coordinates": [-123.115, 49.28] }
  }).insertedId;
  
// name change
db.Places.updateOne(
    { "_id": placeId },
    { $set: { "name": "Central Fitness Center" } }
);

//find gyms within 5k radius (3 limit)
db.Places.find({
    "type": "Gym",
    "location": {
      $near: {
        $geometry: { "type": "Point", "coordinates": [-123.0990, 49.2825] },
        $maxDistance: 5000
      }
    }
}).limit(3);

//delete all the gyms in delta
db.Places.deleteMany({
    "type": "Gym",
    "address.city": "Delta"
});
  