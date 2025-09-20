import mongoose from "mongoose";
const connectdb = async (DATABASE_URL) => {

    try {
        const DB_OPTION = {
            dbName: 'mohallabazaardb',
        }
        const data = await mongoose.connect(DATABASE_URL, DB_OPTION);
        if (data) {
            console.log('connection successfully')

        } else {
            console.log('connection faild')
        }
    } catch (error) {
        console.log(error.message)
    }
}
export default connectdb; // <-- yeh add karo