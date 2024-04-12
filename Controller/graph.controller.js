import mongoose from "mongoose";

export const LineChartData = async function (req, res, next) {
    try {
        const {id} = req.query;
        const {module} = req.params;
        const filter = {}
        if(id){
            filter["_id.mallId"] = new mongoose.Types.ObjectId(id)
        }
        const collection = await mongoose.connection.db.collection(module);
        const docs = await collection.find(filter).toArray();
        return res.status(200).json({
            status: "success",
            Data: docs
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
};
