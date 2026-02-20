// Clear All Collections
db.Users.deleteMany({});
db.Workouts.deleteMany({});
db.Nutrition.deleteMany({});
db.Places.deleteMany({});

// ------------------- USERS -------------------
const firstNames = ["Alice","Bob","Charlie","Dana","Eve","Frank","Grace","Hannah","Ian","Jack","Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rachel","Steve","Tina"];
const lastNames = ["Smith","Johnson","Brown","Williams","Jones","Miller","Davis","Garcia","Rodriguez","Wilson","Martinez","Anderson","Taylor","Thomas","Hernandez","Moore","Martin","Lee","Perez","Thompson"];

const users = [];
for (let i = 0; i < 50; i++) 
{
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  users.push({
    "name": `${first} ${last}`,
    "email": `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    "age": Math.floor(Math.random() * 40) + 18,
    "gender": Math.random() > 0.5 ? "Male" : "Female",
    "height": Math.floor(Math.random() * 50) + 150,
    "weight": Math.floor(Math.random() * 50) + 50,
    "dailyCalorieGoal": Math.floor(Math.random() * 1000) + 1800,
    "goals": ["Lose weight","Gain muscle","Improve endurance","Run a marathon","Get Stronger"][Math.floor(Math.random()*5)],
    "joinedDate": new Date()
  });
} // users with all fields

const result = db.Users.insertMany(users);
const insertedUsers = Object.values(result.insertedIds);

const requiredUsers = [];
for (let i = 50; i < 100; i++) 
{
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  requiredUsers.push({
    "name": `${first} ${last}`,
    "email": `${first.toLowerCase()}.${last.toLowerCase()}_req${i}@example.com`,
    "joinedDate": new Date(),
    "dailyCalorieGoal": Math.floor(Math.random() * 1000) + 1800
  });
} // users with only required fields

const resultRequired = db.Users.insertMany(requiredUsers);
const insertedRequiredUsers = Object.values(resultRequired.insertedIds);

// ------------------- WORKOUTS -------------------
const workoutTypes = ["Weights","Cardio","Sport","Other"];
const feelings = ["Felt strong","Exhausted","Energetic","Relaxed","Motivated"];
const actions = ["lifting weights","running","playing hockey","cycling","doing yoga"];
const locations = ["at the gym","in the park","at home","on the track","with friends"];

const workoutBatchSize = 150;
let workoutBatch = [];

// ~100 workouts per user, random dates across past year
insertedUsers.forEach(userId => {
  const numWorkouts = Math.floor(Math.random() * 100) + 50; // 50-150 workouts per user
  for (let i = 0; i < numWorkouts; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    workoutBatch.push({
      userId,
      "type": workoutTypes[Math.floor(Math.random()*workoutTypes.length)],
      "date": new Date(Date.now() - daysAgo*86400000),
      "duration": Math.floor(Math.random()*90)+30,
      "length": Math.floor(Math.random()*10)+1,
      "notes": `${feelings[Math.floor(Math.random()*feelings.length)]} ${actions[Math.floor(Math.random()*actions.length)]} ${locations[Math.floor(Math.random()*locations.length)]}`
    });

    if(workoutBatch.length >= workoutBatchSize){
      db.Workouts.insertMany(workoutBatch);
      workoutBatch = [];
    }
  }
});

if(workoutBatch.length > 0) db.Workouts.insertMany(workoutBatch);

// ------------------- NUTRITION -------------------
const mealTypes = ["Breakfast","Lunch","Dinner","Snack"];
const notesOptions = ["Healthy meal","Fast food","Protein shake","Light snack"];
const allUserIds = insertedUsers.concat(insertedRequiredUsers);
const nutritionBatchSize = 150;
let nutritionBatch = [];

// ~100 nutrition entries per user, random dates across past year
allUserIds.forEach(userId => {
  const numMeals = Math.floor(Math.random() * 100) + 50; // 50-150 entries
  for (let i = 0; i < numMeals; i++) {
    const daysAgo = Math.floor(Math.random()*365);
    const calories = Math.floor(Math.random()*600)+200;
    const meal = mealTypes[Math.floor(Math.random()*mealTypes.length)];

    if(Math.random() > 0.5){ // 50% chance full fields
      const protein = Math.floor(calories*(Math.random()*0.3+0.15)/4);
      const carbs = Math.floor(calories*(Math.random()*0.5+0.4)/4);
      const fats = Math.floor(calories*(Math.random()*0.3+0.2)/9);

      nutritionBatch.push({
        userId,
        "type": meal,
        calories,
        "macros": { carbs, protein, fats },
        "date": new Date(Date.now() - daysAgo*86400000),
        "notes": notesOptions[Math.floor(Math.random()*notesOptions.length)]
      });
    } 
    else //required only fields
    {
      nutritionBatch.push({
        userId,
        calories,
        "date": new Date(Date.now() - daysAgo*86400000)
      });
    }

    if(nutritionBatch.length >= nutritionBatchSize)
    {
      db.Nutrition.insertMany(nutritionBatch);
      nutritionBatch = [];
    }
  }
});
if(nutritionBatch.length > 0) db.Nutrition.insertMany(nutritionBatch);

// ------------------- PLACES -------------------
const places = [
    { name: "IronWorks Gym", type: "Gym", street: "12 Powell St", city: "Vancouver", coords: [-123.0990,49.2825] },
    { name: "Kitsilano Fitness Club", type: "Gym", street: "1805 Cornwall Ave", city: "Vancouver", coords: [-123.1570,49.2740] },
    { name: "Burnaby Fitness World", type: "Gym", street: "6200 McKay Ave", city: "Burnaby", coords: [-123.0030,49.2270] },
    { name: "Surrey Sport & Fitness Center", type: "Gym", street: "14988 20 Ave", city: "Surrey", coords: [-122.7990,49.0380] },
    { name: "Richmond Iron Temple", type: "Gym", street: "11000 Cambie Rd", city: "Richmond", coords: [-123.1170,49.1780] },
    { name: "North Van Powerhouse", type: "Gym", street: "123 Bewicke Ave", city: "North Vancouver", coords: [-123.0840,49.3160] },
    { name: "Coquitlam Peak Fitness", type: "Gym", street: "1116 Falcon Dr", city: "Coquitlam", coords: [-122.8160,49.2950] },
    { name: "Langley Barbell Club", type: "Gym", street: "20165 91A Ave", city: "Langley", coords: [-122.6560,49.1630] },
    { name: "Maple Ridge Fitness Hub", type: "Gym", street: "22470 Dewdney Trunk Rd", city: "Maple Ridge", coords: [-122.6080,49.2180] },
    { name: "Delta Athletic Centre", type: "Gym", street: "7515 120 St", city: "Delta", coords: [-122.8890,49.1450] },
    { name: "Stanley Park Seawall", type: "Park", street: "845 Avison Way", city: "Vancouver", coords: [-123.1417,49.3010] },
    { name: "Queen Elizabeth Park", type: "Park", street: "4600 Cambie St", city: "Vancouver", coords: [-123.1120,49.2410] },
    { name: "Trout Lake Park", type: "Park", street: "3300 Victoria Dr", city: "Vancouver", coords: [-123.0560,49.2490] },
    { name: "Jericho Beach Park", type: "Park", street: "3941 Point Grey Rd", city: "Vancouver", coords: [-123.2050,49.2760] },
    { name: "Burnaby Central Park", type: "Park", street: "3883 Imperial St", city: "Burnaby", coords: [-123.0140,49.2280] },
    { name: "Richmond Olympic Oval Track", type: "Facility", street: "6111 River Rd", city: "Richmond", coords: [-123.1380,49.1740] },
    { name: "Lynn Canyon Park", type: "Park", street: "3663 Park Rd", city: "North Vancouver", coords: [-123.0190,49.3430] },
    { name: "Coquitlam River Trail", type: "Park", street: "1299 River Dr", city: "Coquitlam", coords: [-122.7780,49.3070] },
    { name: "Port Moody Rocky Point Park", type: "Park", street: "2800 Murray St", city: "Port Moody", coords: [-122.8520,49.2810] },
    { name: "Surrey Green Timbers Park", type: "Park", street: "14600 100 Ave", city: "Surrey", coords: [-122.8130,49.1780] },
    { name: "Rogers Arena", type: "Facility", street: "800 Griffiths Way", city: "Vancouver", coords: [-123.1090,49.2770] },
    { name: "UBC Thunderbird Stadium", type: "Facility", street: "6288 Stadium Rd", city: "Vancouver", coords: [-123.2500,49.2600] },
    { name: "Burnaby Lake Sports Complex", type: "Facility", street: "3677 Kensington Ave", city: "Burnaby", coords: [-122.9620,49.2500] },
    { name: "Langley Events Centre", type: "Facility", street: "7888 200 St", city: "Langley", coords: [-122.6610,49.1520] },
    { name: "North Surrey Sport Complex", type: "Facility", street: "12780 110 Ave", city: "Surrey", coords: [-122.8600,49.2060] },
    { name: "Richmond Ice Centre", type: "Facility", street: "14140 Triangle Rd", city: "Richmond", coords: [-123.1135,49.1802] },
    { name: "Delta Planet Ice", type: "Facility", street: "10388 Nordel Crt", city: "Delta", coords: [-122.9120,49.1640] },
    { name: "Port Coquitlam Rec Centre", type: "Facility", street: "2150 Wilson Ave", city: "Port Coquitlam", coords: [-122.7630,49.2620] },
    { name: "Maple Ridge Planet Ice", type: "Facility", street: "23588 Jim Robson Way", city: "Maple Ridge", coords: [-122.6030,49.2120] },
    { name: "West Vancouver Ice Arena", type: "Facility", street: "786 22nd St", city: "West Vancouver", coords: [-123.1510,49.3280] },
    { name: "Hillcrest Aquatic Centre", type: "Facility", street: "4575 Clancy Loranger Way", city: "Vancouver", coords: [-123.1060,49.2410] },
    { name: "Kitsilano Pool", type: "Facility", street: "2305 Cornwall Ave", city: "Vancouver", coords: [-123.1580,49.2730] },
    { name: "Guildford Aquatic Centre", type: "Facility", street: "15105 105 Ave", city: "Surrey", coords: [-122.8070,49.1960] },
    { name: "Richmond Watermania", type: "Facility", street: "14300 Entertainment Blvd", city: "Richmond", coords: [-123.0675,49.1795] },
    { name: "Edmonds Community Centre Pool", type: "Facility", street: "7433 Edmonds St", city: "Burnaby", coords: [-122.9630,49.2190] },
    { name: "Belcarra Regional Park", type: "Park", street: "2375 Bedwell Bay Rd", city: "Belcarra", coords: [-122.8810,49.3100] },
    { name: "Buntzen Lake Trail", type: "Park", street: "5000 Sunnyside Rd", city: "Anmore", coords: [-122.8550,49.3420] },
    { name: "Golden Ears Provincial Park", type: "Park", street: "24480 Fern Crescent", city: "Maple Ridge", coords: [-122.4590,49.3270] },
    { name: "White Rock Beach Promenade", type: "Park", street: "14935 Marine Dr", city: "White Rock", coords: [-122.8050,49.0260] },
    { name: "Barnet Marine Park", type: "Park", street: "8181 Barnet Rd", city: "Burnaby", coords: [-122.9490,49.2960] },
    { name: "Lighthouse Park Trails", type: "Park", street: "4902 Beacon Ln", city: "West Vancouver", coords: [-123.2630,49.3300] },
    { name: "Cypress Mountain Nordic Centre", type: "Facility", street: "6000 Cypress Bowl Rd", city: "West Vancouver", coords: [-123.2030,49.3960] },
    { name: "Grouse Mountain Trailhead", type: "Park", street: "6400 Nancy Greene Way", city: "North Vancouver", coords: [-123.0810,49.3800] },
    { name: "SFU Burnaby Mountain Trails", type: "Park", street: "8888 University Dr", city: "Burnaby", coords: [-122.9150,49.2780] },
    { name: "Deas Island Park", type: "Park", street: "6090 Deas Island Rd", city: "Delta", coords: [-123.0430,49.1050] },
    ];

const placesBatch = places.map(p => ({
  "name": p.name,
  "type": p.type,
  "address": { "street": p.street, "city": p.city, "country": "Canada" },
  "location": { "type": "Point", "coordinates": p.coords }
}));

db.Places.insertMany(placesBatch);

print("Database populated");
