const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getDashboardStats
} = require("../controllers/taskController");

router.use(authMiddleware);

router.post("/", createTask);         
router.get("/", getTasks);             
router.get("/stats", getDashboardStats);
router.put("/:id", updateTask);        
router.delete("/:id", deleteTask);    

module.exports = router;