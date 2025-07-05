// uploadMeals.js
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const uploadMeals = async () => {
  const filePath = path.join(__dirname, "data", "meals.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const meals = JSON.parse(fileContent);

  for (const meal of meals) {
    const { error } = await supabase.from("foods").insert(meal);
    if (error) {
      console.error(`❌ Failed to insert ${meal.name}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${meal.name}`);
    }
  }

  console.log("🍽️ All meals uploaded.");
};

uploadMeals();
