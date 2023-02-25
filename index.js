const express = require('express')
const app = express()
const cors =require('cors')
const port = process.env.PORT || 5000

require('dotenv').config()

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s8zy7dw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const bikesCollections = client.db('bikes-portal').collection('products')
const bookingsCollection =client.db('bikes-portal').collection('bookings')
const reviewsCollection =client.db('bikes-portal').collection('reviews')
const usersCollections = client.db('bikes-portal').collection('users')




async function run() {
    try { 
      app.post('/products',async(req,res)=>{
        const added= req.body;
        const result = await bikesCollections.insertOne(added)
        res.send(result)
      })
     app.get('/products',async(req,res)=>{
        const query={}
        const curser= bikesCollections.find(query)
        const result= await curser.toArray()
        res.send(result)
     })
      
     app.get('/products/:id',async(req,res)=>{
        const id=req.params.id
        const query= {_id:new ObjectId(id)}
        const result = await bikesCollections.findOne(query)
        res.send(result)
     })

     app.delete('/products/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id:new ObjectId(id)}
      const result= await bikesCollections.deleteOne(query)
      res.send(result)
     })

     app.post('/bookings',async(req,res)=>{
       const bookings = req.body
       const result = await bookingsCollection.insertOne(bookings)
       res.send(result)
     })

     app.get('/bookings', async(req,res)=>{
       const email = req.query.email;
       if(email){
        const query = {email:email}
        const curser=  bookingsCollection.find(query)
        const result = await curser.toArray()
        res.send(result)
       }else{
        const queries={}
          const result =  bookingsCollection.find(queries)
          const final = await result.toArray()
          res.send(final)
       }    
     })
     app.delete('/bookings/:id', async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result = await bookingsCollection.deleteOne(query)
      res.send(result)
     })

     app.put('/bookings/:id', async(req,res)=>{
      const id=req.params.id;
      const status=req.body.status
      const filter={_id: new ObjectId(id)}
      const options={upsert:true}
      const updatedStatus={
        $set:{
          status:status
        }
      }
      const result = await bookingsCollection.updateOne(filter,updatedStatus,options)
      res.send(result)
     })
   
    // review section 
    app.post('/reviews',async(req,res)=>{
     const query=req.body
     const result = await reviewsCollection.insertOne(query)
     res.send(result)

    }) 
    app.get('/reviews',async(req,res)=>{
      const query={}
      const curser=  reviewsCollection.find(query)
      const result = await curser.toArray()
      res.send(result)
    })

    // users info
    

    app.post('/users',async(req,res)=>{
      const user=req.body;
      const result =await usersCollections.insertOne(user)
      res.send(result)
    })
    app.get('/users',async(req,res)=>{
      const query={}
      const users= await usersCollections.find(query).toArray()
      res.send(users)
    })

    // particular admin user

    app.get('/users/admin/:email',async(req,res)=>{
        const email =req.params.email;
        const query = {email:email}
        const user = await usersCollections.findOne(query)
        res.send({isAdmin:user?.role === 'admin'})
    })

    // update user Info
    app.put('/users/admin/:id',async(req,res)=>{
      const id= req.params.id;
      const filter={_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDocs={
        $set:{
          role:'admin'
        }
      }
      const result = await usersCollections.updateOne(filter,updateDocs,options)
      res.send(result)

    })
        
        



 
          


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('bike database connected')
})

app.listen(port, () => {
  console.log(`database connected on port ${port}`)
})