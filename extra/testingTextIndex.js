 //insert 5k places with just name
 for (let i = 1; i <= 5000; i++) {
    db.Places.insertOne({
      "name": `Gym ${i}`,
      "type": "Arena",
      "address": { street: `${i} Fitness St`, city: "Vancouver", country: "Canada" },
      "location": { type: "Point", coordinates: [-1, 20] }
    });
  }
  // 5k wwith just type
  for (let i = 1; i <= 5000; i++) {
    db.Places.insertOne({
      "name": `Something ${i}`,
      "type": "Gym",
      "address": { street: `${i} Fitness St`, city: "Vancouver", country: "Canada" },
      "location": { type: "Point", coordinates: [-1, 20] }
    });
  }

  // 5 with both
  for (let i = 1; i <= 10000; i++) {
    db.Places.insertOne({
      "name": `Gym ${i}`,
      "type": "Gym",
      "address": { "street": `${i} Fitness St`, "city": "Vancouver", "country": "Canada" },
      "location": { "type": "Point", "coordinates": [-1, 20] }
    });
  }

  //5k with neither
  for (let i = 1; i <= 10000; i++) {
    db.Places.insertOne({
      "name": `Test ${i}`,
      "type": "Arena",
      "address": { "street": `${i} Fitness St`, "city": "Vancouver", "country": "Canada" },
      "location": { "type": "Point", "coordinates": [-1, 20] }
    });
  }

  // use find - REGEX (no query)
  db.Places.find({
    $or: [
      { "name": /Gym/i },
      { "type": "Gym" }
    ]
  }).explain("executionStats");
  

  //After adding index:
  db.Places.find({ $text: { $search: "Gym" } }).explain("executionStats");