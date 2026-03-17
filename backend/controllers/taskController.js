const Task = require("../models/Task");
const mongoose = require("mongoose");

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, search } = req.query;

    let query = { userId: req.userId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.status === "completed" && status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot change completed task back to pending",
      });
    }

    if (status && !["pending", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalTasks = await Task.countDocuments({ userId });

    const completedTasks = await Task.countDocuments({
      userId,
      status: "completed",
    });

    const pendingTasks = await Task.countDocuments({
      userId,
      status: "pending",
    });

    const completionRatio =
      totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(1);

    const today = new Date();
    const last7DaysDate = new Date();
    last7DaysDate.setDate(today.getDate() - 6);

    const last7Days = await Task.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          createdAt: {
            $gte: last7DaysDate,
            $lte: today,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRatio,
        last7Days,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
