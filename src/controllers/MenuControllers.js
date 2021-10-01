const MenuItem = require('../models/MenuItem')
const data = require('../models/constants/Menu.json');

exports.createMenu = async(req, res) => {
	try{
        await data.map(async(d)=>{

            const item = await MenuItem.findOne({itemName: d.name});
            if(item!=null){
                console.log(item);
                await MenuItem.findByIdAndUpdate(item._id, {price: d.price});
    
            }else{
                const newItem = new MenuItem({
                    itemName: d.name,
                    price: d.price
                })
               await newItem.save();
            }
          
       })
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
        res.status(200).send({"msg":"Successfully cleared all items on menu"});
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
