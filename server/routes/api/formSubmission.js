const express = require("express");
const {MongoClient} = require("mongodb");
const { routerViewLocationKey } = require("vue-router");

const router = express.Router();

async function main(){

    const uri = "mongodb+srv://gump100:GreenDay100@cluster.4yjzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);

    try{
        //Get Entry
        router.get("/", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            
            res.send(await entries.find({name:req.query.name, type:req.query.type, username:req.query.username}).toArray());
        } );
        
        
        //Add Entry
        router.post("/", async (req, res ) =>{
            const entries = await loadEntriesCollection(client);
            await entries.insertOne({
                type: req.body.type,
                name: req.body.name,
                description: req.body.description,
                calories: req.body.calories,
                username: req.body.username,

            })
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("Entry has been created")
        });

        //Update Entry
        router.put("/", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            await entries.updateOne(
                {name:req.body.name,type:req.body.type, username:req.body.username},
                {$set:{name:req.body.newName,type:req.body.newType,description: req.body.newDescription,calories: req.body.newCalories, }
            })
            res.status(201).send();
            console.log('Entry has been updated');


        })


        //Account Creation
        router.post("/user", async (req, res ) =>{
            const users = await loadUserCollection(client);
            await users.insertOne({
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                currentWeight:req.body.currentWeight,
                goalWeight:req.body.goalWeight

            })
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("User has been created")
        });

        router.get("/username", async (req, res) => {
            const users = await loadUserCollection(client);
            res.send(await users.find({username:req.query.username}).toArray());
        } );

        router.get("/email", async (req, res) => {
            const users = await loadUserCollection(client);
            res.send(await users.find({email:req.query.email}).toArray());
        } );

        router.get("/loginEmail", async (req, res) => {
            const users = await loadUserCollection(client);
            res.send(await users.find({email:req.query.email,password:req.query.password}).toArray());
        } );

        router.get("/loginUsername", async (req, res) => {
            const users = await loadUserCollection(client);
            res.send(await users.find({username:req.query.username,password:req.query.password}).toArray());
        } );


    }catch (e) {
        console.error(e)
    } finally{
        await client.close();
    }
}
//function call to run main
main().catch(console.error);

async function loadEntriesCollection(client){
    
    await client.connect();
    return await client.db('Entries').collection(`entries`);
}

async function loadUserCollection(client){
    
    await client.connect();
    return await client.db('User').collection(`users`);
}


module.exports = router;