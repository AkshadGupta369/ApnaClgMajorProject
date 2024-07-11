const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:"pk.eyJ1IjoiYWtzaGFkMzY5IiwiYSI6ImNseWRhZWw0MjA0N2QybHBkMXdmamNoNHAifQ.rGQx6eAVdQQoRrDycKV5lA"});

module.exports.index=(async(req,res)=>{
    let allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
  });

  module.exports.renderNewForm=(req,res)=>{
    // if(!req.isAuthenticated()){
    //     console.log(req.user);
    //     req.flash("error","you must be logged in ");
    //   return  res.redirect("/login");
    // }\
    res.render("./listings/new.ejs");
};

module.exports.showListing=(async(req,res)=>{
    let {id}=req.params;
const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
if(!listing){
    req.flash("error","listing you requested for does not exist");
    res.redirect("/listings");
}
res.render("./listings/show.ejs",{listing});

});

module.exports.create=(async(req,res,next)=>{
    // let{title,description,image,price,country,location}=req.body;   yeh humara basic tareika hai jo sahi hai lekin hume kuch kam code likhna ho toh hum kuch changes karte hai ab hum title ki wagah listings[title] likhenge aur aisa sab mein karenge 
    // let listing=req.body.listing;
    // new Listing(listing);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
     
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1
    })
    .send()
    // console.log(response.body.features[0].geometry);
    // res.send("done!");
    let url=req.file.path;
    let filename=req.file.filename;
   const newListing= new Listing(req.body.listing);
//    if(!newListing.title){
//     throw new ExpressError(400,"title is missing");
//    }
//    if(!newListing.description){
//     throw new ExpressError(400,"description is missing");
//    }
//    if(!newListing.location){
//     throw new ExpressError(400,"locaation is missing");
//    }
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   newListing.geometry=response.body.features[0].geometry;
  let savedListing= await newListing.save();
  console.log(savedListing);
   req.flash("success","new listing created");
   res.redirect("/listings");

});


module.exports.edit=(async(req,res)=>{
    let {id}=req.params;
   const listing=await Listing.findById(id);
   if(!listing){
    req.flash("error","listing you requested for does not exist");
    res.redirect("/listings");
}
let originalImageUrl=listing.image.url;
originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
   res.render("./listings/edit.ejs",{listing,originalImageUrl});
});


module.exports.update=(async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let{id}=req.params;
    // let listing=await Listing.findById(id);
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     req.flash("error","you are not permitted to edit this!");
    //    return  res.redirect(`/listings/${id}`);
    // }
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!="undefined"){
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
   }
   req.flash("success","Listing updated");
   res.redirect(`/listings/${id}`);
})

module.exports.delete=(async (req,res)=>{
    let {id}=req.params;
  let deleteListing= await Listing.findByIdAndDelete(id);
  req.flash("success","Listing deleted");
   res.redirect("/listings");
});