const vendorschema = require("./vendor.schema");
const getVendor = async (id) =>{
    try {
        if (!id) return false;
        const foundVendor = await vendorschema.find({ businessOwner: id });
        if (!foundVendor) {
            return false;
        }
        return foundVendor;
    }catch (error) {
        throw new Error(" error fecthing vendor");
    }
};

const getAllVendor =async (req, res) => {
    try{
        const { userId } = req.userData;
        const vendors = await getAllVendor (userId);
        if (!vendors) {
            return res.status(400).json({success: false,  message: "No vendor",});
        }
        return res.status(200).json({success: true,  message: "vendor successfully", data: vendors,});
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const searchVendors = async (req, res) => {
    try{
        const { query } = req.query;
        
        if(!query) {
            const vendors = await Vendor.find();
            return res.json(vendors);
        }
        const vendors = await Vendors.find({
         $or :[
            {name: { $regex: query, $option: "i" }},
            {email: { $regex: query, $option: "i" }},
            ]
        });
        res.json(vendors)
    }catch(err) {
      res.status(500).json({ error: error.message });
    }
};

const createVendor = async(req, res) => {
    try{
        const {
             businessName,
             businessAddress,
             businessPhone, 
             openHour, 
             closeHour, 
             type} = req.body;
        const  businessOwner = req.userData.userId

        const newVendor = new vendorschema({
            businessName, 
            businessAddress, 
            businessPhone, 
            openHour, 
            closeHour, 
            type,
             businessOwner
        });
        await newVendor.save();
        return res.status(201).json({success: true, 
            message: "vendor created successfully", 
            data: await getVendor(businessOwner),
        });
    } catch(error){
        return res.status(500).json({sucess: false, message: error.message});
    }
};

const getAllVendors = async(req, res) => {
    try{
        const vendors = await vendorschema.find();
        if(!vendors.length) {
            return res.status(400).json({
                success: false, 
                 message: "Could not load vendors at the moment",});
        }
        return res.status(200).json(
            {success: true, 
             message: "Vendor loaded", data: vendors,
        });
    }catch (error) {
        return res.status(500).json({
            success: false, message: "Cannot get vendors at the moment",});
    }
};

const updateVendor = async (req, res) => {
    try{
        const update = req.body;
        const id = req.params;
        await  vendorschema.findByIdAndUpdate(id, update);

        return res.status(200).json({success: true,  message: "Vendors updated",});
    }catch (error) {
        return res.status(500).json({
            success: false, message: "Cannot upate vendors at the moment, unauthorized",});
    }
};

const pauseVendor = async (req, res) => {
    try{
        const id = req.params;
        await  vendorschema.findByIdAndUpdate(id, {isPaused: true});

        return res.status(200).json({success: true,  message: "Vendors deactivated",});
    }catch (error) {
        return res.status(500).json({
            success: false, message: "Cannot upate vendors at the moment, unauthorized",});
    }
};

const  getAVendorDetail = async ( req, res) => {
    try {
        const { id} = req.params
        if(!id) return res.status(404).json({
            success: false, 
            message: "Vendor id is required",
        });
        const vendor = await vendorschema.findOne({ _id: id });
        return res.status(200).json({
            success: true,
            message: "Vendor Available", 
            data: vendor,
        });
    }catch (error) {
        return res.status(500).json({
            success: false, 
            message: "Cannot retreive vendor at the moment, unauthorized",
        });
    }
}


module.exports = { getAllVendor, searchVendors, createVendor, getAllVendors, updateVendor, pauseVendor, getAVendorDetail };