const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            userId: req.userId,
            title,
            description
        });

        res.status(201).json({
            success: true,
            data: task
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 5, status, search } = req.query;

        let query = { userId: req.userId };

        if (status) query.status = status;

        if (search) {
            query.title = { $regex: search, $options: "i" };
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
            tasks
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateTask = async (req, res) => {
    try {
        const { status } = req.body;

        if (status && !["pending", "completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: task
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            message: "Task deleted"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};