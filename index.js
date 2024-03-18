const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const prisma = new PrismaClient();
const cors = require("cors");
const { ObjectId } = require("mongodb");
// handle cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    preflightContinue: true,
  })
);

const port = 5000;
//express json middleware
app.use(express.json());
app.use(express.static("public")); // serve static files from the public directory

// handle requests to /api/greeting with a function that returns a greeting message
app.get("/api/greeting", (req, res) => {
  res.json({ greeting: "Hello API" });
});
app.get("/api/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany();

  res.status(200).send(tasks);
});

app.post("/api/task", async (req, res, next) => {
  try {
    const {
      name,
      assignTo,
      adminId,
      startDate,
      endDate,
      status,
      description,
      priority,
      relatedTo,
    } = req.body;

    // return res.status(201).json({
    //   message: "task created successfully",
    //   data: (req.body.startDate).toISOString,
    // })
    const newTask = await prisma.task.create({
      data: {
        name: name,
        assignTo: assignTo,
        adminId: adminId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status,
        description: description,
        priority: priority,
        relatedTo: relatedTo,
      },
    });
    const tasks = await prisma.task.findMany();
    res.status(201).send({
      message: "successfully",
      payload: tasks,
    });
  } catch (e) {
    res.status(202).send({
      message: "failed",
      error: "your data  is not valid",
    });
  }
});
// handle update request to /api/task/:id with a function that updates a task in the database using Prisma
app.put("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    assignTo,
    adminId,
    startDate,
    endDate,
    status,
    description,
    priority,
    relatedTo,
  } = req.body;
  try {
    if (
      !name ||
      !assignTo ||
      !adminId ||
      !startDate ||
      !endDate ||
      !status ||
      !description ||
      !priority ||
      !relatedTo
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    } else {
      await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          assignTo: assignTo,
          adminId: adminId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: status,
          description: description,
          priority: priority,
          relatedTo: relatedTo,
        },
      });
      // ACCESS ALL AFTER UPDATING TASKS
      const tasks = await prisma.task.findMany();
      // send updated task back as response
      res.status(201).json({
        message: "successfully",
        payload: tasks,
      });
    }
  } catch (e) {
    res.status(400).json({
      message: "failed",
      error: e.message,
    });
  }
});

// handle delete request to /api/task/:id with a function that deletes a task from the database using Prisma
app.delete("/api/task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: {
        id: id,
      },
    });
    const tasks = await prisma.task.findMany();

    res.status(201).json({
      message: "successfully",
      payload: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed",
      error: error.message,
    });
  }

  // send updated task back as response
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/api/greeting`);
});
