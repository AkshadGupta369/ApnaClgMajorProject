const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js")
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});



// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
//        if(error){
//            let errMsg=error.details.map((el)=> el.message).join(",");
//            throw new ExpressError(400,errMsg);
//        }else{
//            next();
//        }
//    }

   
//Index Route 


// router.get("/",wrapAsync(async(req,res)=>{
//   let allListings= await Listing.find({});
//   res.render("./listings/index.ejs",{allListings});
// }))

// router.get("/",wrapAsync(listingController.index));
  
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.create));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

//Create new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));

//Show Route 
// router.get("/:id",wrapAsync(listingController.showListing));


//Create Route
// router.post("/",validateListing,isLoggedIn,wrapAsync(listingController.create));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

//Update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update));


//Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete)); ,

module.exports=router;