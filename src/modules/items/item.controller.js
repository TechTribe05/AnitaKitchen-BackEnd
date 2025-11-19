const itemschema = require("./item.schema");


// Create a new menuItem Controller
const createItem =async(req, res) => {
    try{
        const image = req.file.filename;
        console.log("🔑>>", image);
        const{
            itemName,
            itemDescription,
            vendor,
            unit,
            imageCover,
           price } = req.body;
        if(!itemName || !itemDescription || !vendor || !unit || !price){
            return res.status(400).json({message: "All field are required"});
        }
       // Create a new item instance
       const newItem = new itemschema({
            itemName,
            itemDescription,
            vendor,
            unit,
            price,
            imageCover,
           ...req.body,
       });
       await newItem.save();
       return res.status(201).json({
        success: true,  message: "Menu item created successfully",
        item: newItem,
       });
    } catch(error) {
        return res.status(500).json({
            success: false, message: "Failed to create menu item" ,
            error: error.message
        });
    }
};


const getItemByVendor =async (req, res) => {
    try{
        const vendorId = req.params.vendorId;

        const menuItem = await itemschema.find({vendor: vendorId});
        if(!menuItem.length){
            return res.status(400).json
            ({success: false, message: "no menu item for this vendor"});
        }
        res.status(200).json({
            count: menuItem.length, 
            success: true, 
            menuItem, 
        });
    } catch (error) {
        res.status(500).json({success: true, message: "Failed to retrive menu item for this vendor"});
    }
};


const getItemById =async (req, res) => {
    try{
        const Item = await itemschema.findById(req.params.itemId);
        if(!item) {
            return res.status(400).json
            ({success: false, message: "Item not found"});
        }
        res.status(200).json({
            success: true, 
            data: item, 
        });
    } catch (error) {
        res.status(500).json({success: true, message: "Failed to retrive item"});
    }
};

const  getAllitems =async (req, res) => {
    try{
        const item = await itemschema.find();
        if (!item) {
            return res.status(400).json
            ({success: false, message: "No item found"});
        }
        return res.status(200).json({
            success: true, 
            data: item, 
        });
    } catch (error) {
       return res.status(500).json({success: true, message: "Failed to retrive item",});
    }
};

module.exports = { createItem, getItemByVendor, getItemById, getAllitems };