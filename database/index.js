  // Remove all indexes 
  db.Users.dropIndexes();
  db.Workouts.dropIndexes();
  db.Nutrition.dropIndexes();
  db.Places.dropIndexes();
  
  // Create 2dsphere index for geospatial queries
  db.Places.createIndex({ location: "2dsphere" });
  
  // TTL for nutrition
  db.Nutrition.createIndex({ date: 1 }, { expireAfterSeconds: 15552000 }) // ~6 months

  // Making sure the email is unique (case insensitive)
  db.Users.createIndex(
    { email: 1 },
    { 
      unique: true,
      collation: { locale: "en", strength: 2 }
    }
  );
  
  // Workouts: get all workouts for a user, sorted by date
  db.Workouts.createIndex({ userId: 1, date: -1 });

  // Nutrition: get all meals for a user, sorted by date
  db.Nutrition.createIndex({ userId: 1, date: -1 });

  