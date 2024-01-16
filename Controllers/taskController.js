const Task = require('../models/Task')

async function createTask(req, res) {
    // console.log(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    await task.save();
    res.status(201).json({ task, message: "Task Created Successfully" });
}

async function getTasks(req, res) {
    try {
        const tasks = await Task.find({
            owner: req.user._id
        })
        res.status(200).json({ tasks, count: tasks.length, message: "Tasks Fetched Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
}

async function getTaskById(req, res) {
    // res.send(req.params)
    const taskid = req.params.id;

    try {
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, message: "Task Fetched Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
}

const updateTask = async(req, res) => {
    const taskid = req.params.id;
    const updates = Object.keys(req.body);
    // {
    //     description : "new description",
    //     completed: true,
    //     owner : "asfasfasfasfasf"
    // }
    const allowedUpdates = ['title', 'description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid Updates" });
    }

    try {
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json({
            message: "Task Updated Successfully",
        })
    } catch (err) {
        res.status(500).send({ error: err });
    }
}

const deleteTaskById = async(req, res) => {
    const taskid = req.params.id;

    try {
        const task = await Task.findOneAndDelete({
            _id: taskid,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task, message: "Task Deleted Successfully" });
    } catch (err) {
        res.status(500).send({ error: err });
    }
}

module.exports = { createTask, getTasks, getTaskById, deleteTaskById, updateTask }