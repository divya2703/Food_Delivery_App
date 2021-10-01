
exports.getHealth = async (req, res, next) => {
    try{
        res.status(200).send({"status": "UP"});
    }
    catch(error){
        res.status(500).send({"error": error});
    }
}