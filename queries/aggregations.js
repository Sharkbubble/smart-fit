//get last 14 days of cals
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

db.Nutrition.aggregate([
    { 
        $match: { 
            "userId": ObjectId('692671f89e21211ca1f71d98'), //Tina Anderson
            "date": { $gte: fourteenDaysAgo, $lte: new Date() } // Last 14 days
        } 
    },
    { 
        $group: { 
            _id: null, 
            totalCalories: { $sum: "$calories" } // Sum up the calories that alice had into "totalCalories"
        } 
    },
    {
        $project: { _id: 0, totalCalories: 1 } // Show just the calories
    }
]);

// Get total duration and length grouped by workout type for the last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

db.Workouts.aggregate([
    { 
        $match: { 
            "userId": ObjectId('692671f89e21211ca1f71dbe'), // Jack Anderson
            "date": { $gte: thirtyDaysAgo, $lte: new Date() } 
        } 
    },
    { 
        $group: { 
            _id: "$type", // Group by the workout type 
            totalDuration: { $sum: "$duration" }, // Sum up the duration in time
            totalLength: { $sum: "$length" },     // Sum up the lenght in distance
            count: { $sum: 1 }                    // Count how many workouts of this type were done
        } 
    },
    {
        $project: { 
            _id: 0,
            workoutType: "$_id",
            totalDuration_minutes: "$totalDuration",
            totalLength_units: "$totalLength",
            numberOfWorkouts: "$count"
        }
    }
]);


//Find the avg calories of a meal eaten accross all users
db.Nutrition.aggregate([
    {
        $group: {
            _id: null, // All documents together
            averageMealCalories: { $avg: "$calories" } // Calculate the average cals
        }
    },
    {
        $project: {
            _id: 0,
            averageMealCalories: { $round: ["$averageMealCalories", 0] } // Round to get an whole number
        }
    }
]);