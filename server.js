const exp=require('express')

const app=exp()

app.listen(5000,()=>console.log("server started"))


const mclient=require('mongodb').MongoClient
async function connectToDatabase() {
    try {
      // Connect to MongoDB
      const client = await mclient.connect('mongodb://127.0.0.1:27017');
      const db = client.db("demodb");
  
      // Create collections if they don't exist
      const collections = ['usersCollection', 'productsCollection'];
      
      for (const collectionName of collections) {
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (!exists) {
          await db.createCollection(collectionName);
          console.log(`${collectionName} collection created`);
        }
      }
  
      // Set collections to app
      app.set('usersCollection', db.collection('users'));
      app.set('productsCollection', db.collection('products'));
  
      console.log('Connected to database successfully');
      
    } catch (error) {
      console.log('Database connection error:', error);
    }
  }
  
  // Call the function
  connectToDatabase();
const User_app=require("./API/userApi")
const Product_app=require("./API/productApi")


app.use("/user-api",User_app)
app.use("/product-api",Product_app)


let invalidPathHandlerMiddleWare=(request,response,next)=>{
    console.log("error occured")
    response.send({message:"invalid path error occured"})
}

app.use(invalidPathHandlerMiddleWare)


const err_handler=(error,request,response,next)=>{
    console.log("error handler exicuted")
    response.send({"message":error.message})
}

//here we have to use last only 
//this message is exicuted only when error occured
app.use(err_handler)