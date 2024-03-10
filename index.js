const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();

const port = 5000;
//express json middleware
app.use(express.json());
app.use(express.static("public")); // serve static files from the public directory

// handle requests to /api/greeting with a function that returns a greeting message
app.get("/api/greeting", (req, res) => {
  res.json({ greeting: "Hello API" });
});
app.get("/api/tasks", async (req, res) => {

 const tasks = await prisma.task.findMany()
    res.status(200).send(tasks)
  
});

app.post("/api/task", async (req, res, next) => {
  try {
    const { name, assignTo,adminId } = req.body
    const newTask = await prisma.task
      .create({
        data: {
          name: name,
          assignTo:assignTo,
          adminId:adminId
        },
      })
      res.status(201).send(newTask)
      
  } catch (e) {
    console.log(e);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/api/greeting`);
});
