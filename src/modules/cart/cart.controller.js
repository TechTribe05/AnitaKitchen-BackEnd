const cartschema = require ("./cart.schema");
const itemschema = require("../items/item.schema");
const paystack = require("paystack-api")(process.env.PAYSTACKTEST_SECRET);

//ADD ITEM TO CART ✅✅

const addItemToCart = async (req, res) => {
    try{
        const owner = req.userData.userId;
        const { cartedItems } = req.body;

        const allItems =cartedItems.map((item) => item.itemId); 
          const allItemsandQty = cartedItems.map((item )=> ({
            _id: item.itemId, 
            quantity: item.quantity
         }))
         console.log(allItemsandQty);
        const fullItems = await itemschema.find({
            _id: {
                $in: allItems,
            },
        });
        const calcItemPrice =allItemsandQty.map((item) =>{
            const priceAndQty = fullItems.find((priced) =>priced._id.toString() === item._id);
            if(priceAndQty) {
                return {
                    ...item, ...priceAndQty.toObject(), totalItemPrice: priceAndQty.price *
                    item.quantity, itemId: priceAndQty._id, };
            }
            return null;
        });

        //Memoization..
        const totalPrice = calcItemPrice.reduce((acc, currentItem) => {
            return acc + currentItem.totalItemPrice;
        }, 0);

        //Create the cart in DB
        const userCart = new cartschema({
            owner, 
            cartedItems: calcItemPrice,
            totalPrice,
        });
        //await userCart.save();
        const userCartDb = await userCart.save();
        console.log("user cart", userCart);
        // console.log("total cart price", totalPrice)
        // console.log(">>>", calcItemPrice);
        // console.log("fullItems", fullItems);
        return res.status(200).json({ success: true, data: userCartDb });
    } catch (error) {
        console.error("Error in addItemToCart:", error); // full error in server logs
          return res.status(500).json({ sucess: false, 
            message: error.message, name: error.name, 
            stack: error.stack,  //// useful while developing
            error: error }); // will still show {}, but above fields give you details
   }
};

//remove item from cart --get itembyid --calc itemtotal. --total
//update carted item
//retrieve user cart 
const getLogginUserCart = async (req, res) => {
    try{
        const owner =req.userData.userId;
        const userCart = await cartschema.find({ owner });
        if(!userCart) {
            return res.status(404).json({
                success: false, 
                message: "No cart for user", data: {} });
        }
        return res.status(200).json({
            success: true, message: "Cart for user", data: userCart });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, 
            message: "Internal sever error", data: [] });
    }
};

const initializePayment = async(req, res) =>{
    try{
        const owner = req.userData.userId;
        const email = req.userData.email;
        const {deliveryAddress, deliveryPhone} =req.body;
        console.log("from initialize payment", owner ,email,  deliveryAddress, deliveryPhone);

        if(!owner || !email || !deliveryAddress || !deliveryPhone) {
           return res.status(400).json({success: false, message: "All fields are required"});
        }
        ///GET USER CART....
        const userCart = await cartschema.findOne({ owner });
        if(!userCart) {
            return res.status(404).json({success: false, message: "Cart not found"});
        }
        if(!userCart.cartedItems || userCart.cartedItems.length === 0 ){
            return res.status(400).json({success: false, message: "Cart is empty"});
        }

        /// Update delivery Address and Phone....
        userCart.deliveryAddress = deliveryAddress;
        userCart.deliveryPhone = deliveryPhone;

        const reference =`foodorder_${userCart.owner}_${Date.now()}`;

        //PAYSTACK payload...
        const paymentData ={
            email: email, 
            amount: Math.round(userCart.totalPrice * 100),
            currency: 'NGN', 
            reference: reference, 
            metadata: {
                owner: userCart.owner.toString()
            }
        };

        ///PAYSTACK payload  API...
        const paystackResponse = await paystack.transaction.initialize(paymentData);


        if(paystackResponse.status) {
            //Update CART
            userCart.paymentReference = reference;
            userCart.paystackAccessCode = paystackResponse.data.access_code
            await userCart.save();

             return res.status(201).json({success: true, 
                message: "Payment initialization successful",
                data: {
                    authorization_url: paystackResponse.data.authorization_url, 
                    access_code: paystackResponse.data.access_code,
                    reference: reference, 
                    amount: userCart.totalPrice,
                },
            });
        } else {
            return res.status(400).json({ success: false, 
                message: "Payment initialization failed",
                error: paystackResponse.message, })
        }

    } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: error});
        }
};

// const verifyPayment = async (req, res) => {
//     try{
//         const { reference} = req.params;

//         if(!reference) {
//             return res.status(400).json({ success: false, message: "Payment reference is required"});
//         }
//         const paystackResponse = await paystack.transaction.verify({ reference} );
//         const cart = await cartschema.findOne({ paymentReference: reference });


//         if(paystackResponse.status && paystackResponse.data.status === 'success') {
            
//             if(!cart) {
//               return res.status(404).json({ success: false, message: "Order not found for this payment reference"});
//             }

//             if(cart.isPaid) {
//                 return res.status(200).json({ sucess: true, message: "Payment already verified", 
//                     data:{
//                         cart, 
//                         status: "already_paid",
//                         transaction: paystackResponse.data,
//                   }
//                 });
//             }
            
//             if(!cart.isPaid) {
//                 cart.isPaid = true;
//             cart.paidAt = paystackResponse.data.paid_at;
//             await cart.save();
//             return res.status(200).json({
//                  sucess: true, message: "Payment is sucessfull", 
//                     data:{
//                         cart, 
//                         status: "paid",
//                         transaction: paystackResponse.data,
//                   }
//             });
//            }
        
//         }
//         } catch (error) { 
//             console.log(error.message);
//             return res.status(500).json({ success: false, message: error.message });
//         }
// };

const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ success: false, message: "Payment reference is required" });
        }

        const paystackResponse = await paystack.transaction.verify({ reference });
        const cart = await cartschema.findOne({ paymentReference: reference });

        if (paystackResponse.status && paystackResponse.data.status === 'success') {

            if (!cart) {
                return res.status(404).json({ success: false, message: "Order not found for this payment reference" });
            }

            if (cart.isPaid) {
                cart.isPaid = true;
                cart.paidAt =paystackResponse.data_at
                await cart.save();
                return res.status(200).json({
                    success: true,
                    message: "Payment already verified",
                    data: {
                        cart,
                        status: "already_paid",
                        transaction: paystackResponse.data,
                    }
                });
            }

            if (!cart.isPaid) {
                cart.isPaid = true;   // fixed: semicolon instead of comma
                cart.paidAt = paystackResponse.data.paid_at                                   //|| new Date(); // fallback if null
                await cart.save();

                return res.status(200).json({
                    success: true,
                    message: "Payment is successful",  // fixed spelling
                    data: {
                        cart,
                        status: "paid",   // fixed: don’t return already_paid here
                        transaction: paystackResponse.data,
                    }
                });
            }

        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { addItemToCart, getLogginUserCart, initializePayment, verifyPayment };