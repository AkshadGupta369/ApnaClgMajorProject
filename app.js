if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express=require('express');
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const MongoStore=require("connect-mongo");

const DbUrl=process.env.ATLASDB_URL;

async function main(){
 await mongoose.connect(DbUrl);
}
main()
.then(()=>{
    console.log("conected to DB")
}).catch((err)=>{
    console.log(err);
})



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store=MongoStore.create({
    mongoUrl:DbUrl,
    crypto:{
         secret:"mysupersecretstring"
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",err);
})
const sessionOptions={
    store,
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*60*60*24*3,
        maxAge:7*60*60*24*3,
        httpOnly:true
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success);
    next();
})



// const DbUrl=process.env.ATLASDB_URL
// async function main(){
//  await mongoose.connect();
// }





// app.get("/testlisting",async(req,res)=>{
//  let samplelisting=new Listing({
//     title:"My New Villa",
//     description:"By the beach",
//     price:1200,
//     location:"goa",
//     country:"India"
//  })
//  await samplelisting.save();
//  console.log(samplelisting);
//  res.send("working");
// })


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"akshad"
//     });
//   let registeredUser=await  User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// })



   app.use("/listings",listingRouter);
   app.use("/listings/:id/reviews",reviewRouter);
   app.use("/",userRouter);




// app.get("/",(req,res)=>{
//     res.send("Welcome to root directory");
// })




app.all("*",(req,res,next)=>{
 next(new ExpressError(404,"Page not Found"));
})



app.use((err,req,res,next)=>{
  let{statusCode=500,message="something went wrong"}=err;
//   res.status(statusCode).send(message);
res.status(statusCode).render("./listings/error.ejs",{err});
})



app.listen(8080,()=>{
    console.log("server is lsitening on port 8080");
});