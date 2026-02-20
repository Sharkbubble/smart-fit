//  DROP EXISTING COLLECTIONS 
db.Users.drop();
db.Workouts.drop();
db.Nutrition.drop();
db.Places.drop();

// USERS COLLECTION
db.createCollection("Users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "joinedDate", "dailyCalorieGoal"],
      properties: {
        "name": { bsonType: "string", description: "User's full name" },
        "email": {
          bsonType: "string",
          pattern: "^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$",
          description: "Valid email format"
        },
        "age": { bsonType: "int", minimum: 0, maximum: 150 },
        "gender": { bsonType: "string" },
        "height": { bsonType: ["int", "double"], minimum: 0, maximum: 300 },
        "weight": { bsonType: ["int", "double"], minimum: 0, maximum: 700 },
        "goals": { bsonType: "string" },
        "dailyCalorieGoal": { bsonType: "int", minimum: 0 },
        "joinedDate": { bsonType: "date" },
        "recentWorkouts": {
          bsonType: "array",
          maxItems: 3,
          description: "Last 3 Workouts",
          items: {
            bsonType: "object",
            required: ["_id", "type", "date"],
            properties: {
              "_id": { bsonType: "objectId" },
              "type": { bsonType: "string" },
              "date": { bsonType: "date" },
              "duration": { bsonType: ["int", "double"] },
              "length": { bsonType: ["int", "double"] }
            }
          }
        },
        "recentNutrition": {
          bsonType: "array",
          maxItems: 3,
          description: "Last 3 Meals",
          items: {
            bsonType: "object",
            required: ["_id", "type", "date", "calories"],
            properties: {
              "_id": { bsonType: "objectId" },
              "type": { bsonType: "string" },
              "date": { bsonType: "date" },
              "calories": { bsonType: "int" }
            }
          }
        }
      }
    }
  }
});


//  WORKOUTS COLLECTION
db.createCollection("Workouts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "date"],
      properties: {
        "userId": { bsonType: "objectId", description: "Refers to user" },
        "type": { bsonType: "string", enum: ["Weights", "Cardio", "Sport", "Other"] },
        "duration": { bsonType: ["int", "double"], description: "Time Based", minimum: 0 },
        "length": { bsonType: ["int", "double"], description: "Distance Based", minimum: 0 },
        "date": { bsonType: "date" },
        "locationId": { bsonType: "objectId" },
        "locationSummary": {
          bsonType: "object",
          required: ["name", "address"],
          properties: {
            "name": { bsonType: "string", description: "Name of the place" },
            "address": {
              bsonType: "object",
              required: ["street", "city", "country"],
              properties: {
                "street": { bsonType: "string" },
                "city": { bsonType: "string" },
                "country": { bsonType: "string" }
              }
            }
          }
        },
        "notes": { bsonType: "string" }
      },
      // to allow for other sports or metrics
      additionalProperties: true
    }
  }
});

//  NUTRITION COLLECTION
db.createCollection("Nutrition", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "calories", "date"],
      properties: {
        "userId": { bsonType: "objectId", description: "References which user ate" },
        "type": { bsonType: "string", enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
        "calories": { bsonType: "int", minimum: 0 },
        "macros": {
          bsonType: "object",
          required: ["carbs", "protein", "fats"],
          properties: {
            "carbs": { bsonType: "int", minimum: 0 },
            "protein": { bsonType: "int", minimum: 0 },
            "fats": { bsonType: "int", minimum: 0 }
          }
        },
        "date": { bsonType: "date" },
        "notes": { bsonType: "string" },
        "picture": { bsonType: "objectId", description: "Reference to GridFS meal picture" }
      }
    }
  }
});

//  PLACES COLLECTION
db.createCollection("Places", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "address", "location"],
      properties: {
        "name": { bsonType: "string" },
        "type": { bsonType: "string", enum: ["Arena", "Track", "Gym", "Park", "Facility", "Stadium", "Other"] },
        "address": {
          bsonType: "object",
          required: ["street", "city", "country"],
          properties: {
            "street": { bsonType: "string" },
            "city": { bsonType: "string" },
            "country": { bsonType: "string" }
          }
        },
        "location": {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            "type": { enum: ["Point"], description: "Must be 'Point' for geoJSON queries" },
            "coordinates": {
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: { bsonType: "double" },
              description: "[longitude, latitude]"
            }
          }
        }
      }
    }
  }
});