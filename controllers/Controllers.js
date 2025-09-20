import Student from "../models/studentModel.js";

const getallrecord = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createallrecord = async (req, res) => {
    try {
        const { name, age, course } = req.body;
        const newStudent = new Student({ name, age, course });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export { getallrecord, createallrecord };
