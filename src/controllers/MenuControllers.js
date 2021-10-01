const MenuItem = require('../models/MenuItem')
const data = require('../models/constants/Menu.json');

exports.createMenu = async(req, res) => {
	try{

        for(let i=0; i<data.length; i++){
            const temp = data[i];
            const itemName = temp.itemName;
            const price = temp.price;

            const item = await MenuItem.findOne({itemName: itemName});
            if(item!=null){
                await MenuItem.findByIdAndUpdate(item._id, {price: price});
    
            }else{
                const newItem = new MenuItem({
                    itemName: itemName,
                    price: price
                })
               await newItem.save();
            }
        }
	}
	catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
    finally{
        const menu = await MenuItem.find({});
        res.status(200).send(menu);
    }
}

exports.clearMenu = async(req, res) => {
	try{
        MenuItem.collection.drop();
        res.status(200).send({"msg": "Successfully cleared all items on menu"});
	}
	catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}


exports.getMenu = async(req, res) => {
	try{
       const menu = await MenuItem.find({});
       res.status(200).send(menu);
	}
	catch (error) {
        res.status(500).json(error.message || "Internal Server Error");
    }
}
