import mongoose from "mongoose";

// Schema define karo
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // is field ka hona mandatory hai
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        default: "Unknown"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model create karo (collection name = 'students')
const Student = mongoose.model("Student", studentSchema);

export default Student;
