
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

function parseNaturalDate(input ) {
    const format = "YYYY-MM-DD"
    const now = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let targetDate = new Date(now);
  
    input = input.toLowerCase().trim();
  
    if (input.includes("next")) {
      const dayOfWeek = input.split("next ")[1].trim();
      const targetDayIndex = daysOfWeek.findIndex(
        day => day.toLowerCase() === dayOfWeek
      );
      if (targetDayIndex === -1) {
        throw new Error("Invalid day of week");
      }
      const currentDayIndex = targetDate.getDay();
      const daysToAdd = (targetDayIndex + 7 - currentDayIndex) % 7 || 7;
      targetDate.setDate(targetDate.getDate() + daysToAdd);
    } else if (input.includes("last")) {
      const dayOfWeek = input.split("last ")[1].trim();
      const targetDayIndex = daysOfWeek.findIndex(
        day => day.toLowerCase() === dayOfWeek
      );
      if (targetDayIndex === -1) {
        throw new Error("Invalid day of week");
      }
      const currentDayIndex = targetDate.getDay();
      const daysToSubtract = (currentDayIndex + 7 - targetDayIndex) % 7 || 7;
      targetDate.setDate(targetDate.getDate() - daysToSubtract);
    } else {
      throw new Error("Unsupported date format");
    }
  
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
  
    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      default:
        return targetDate.toISOString().split('T')[0]; // Default to YYYY-MM-DD
    }
  }

  

// Function handler
app.post("/functions/parseNaturalDate", async (req, res) => {
  const { input } = req.body;
  try {
    const output = parseNaturalDate(input);
    res.send({ output });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Documentation handler
app.get("/functions/parseNaturalDate", (req, res) => {
  const docs = {
    name: "parseNaturalDate",
    description:
      "Parse a natural language date input and return a formatted date string.",
    input: {
      type: "string",
      description: "Natural language date input",
      example: "next Friday",
    },
    output: {
      type: "string",
      description: "Formatted date string",
      example: "2024-07-12",
    },
  };
  res.send(docs);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
