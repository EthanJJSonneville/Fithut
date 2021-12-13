const express = require("express");
const {MongoClient} = require("mongodb");
const { routerViewLocationKey } = require("vue-router");
const BSON = require('bson');

const router = express.Router();

async function main(){
    const uri = "mongodb+srv://gump100:GreenDay100@cluster.4yjzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);

    try{
        //Entry UI Commands

        //Get Entries
        router.get("/", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username}).toArray());
        } );
        //Get Exercise Entries
        router.get("/exercise", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,type:"exercise"}).toArray());
        } );
        //Get Meal Entries
        router.get("/meal", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,$or:[{type:"breakfast"}, {type:"lunch"}, {type:"dinner"}, {type:"snack"} ]}).toArray());
        } );
        //Get Breakfast Entries
        router.get("/breakfast", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,type:"breakfast"}).toArray());
        } );
        //Get Lunch Entries
        router.get("/lunch", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,type:"lunch"}).toArray());
        } );
        //Get Dinner Entries
        router.get("/dinner", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,type:"dinner"}).toArray());
        } );
        //Get Snack Entries
        router.get("/snack", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({username:req.query.username,type:"snack"}).toArray());
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
        //Delete Entry
        router.delete("/", async (req, res ) =>{
            //could put/|\:id in the url part
            const entries = await loadEntriesCollection(client);
            await entries.deleteOne({
                name:req.body.name,
                username:req.body.username
            })
            
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("Entry has been Deleted")
        })

        //Update Entry
        router.put("/", async (req, res) => {
            const entries = await loadEntriesCollection(client);
            await entries.updateOne(
                {name:req.body.name, username:req.body.username},
                {$set:{description: req.body.description,calories: req.body.calories, }
            })
            res.status(201).send();
            console.log('Entry has been updated');


        })


        //Calendar Entry Commands
        
        //Add Calendar Entry
        router.post("/CE", async (req, res ) =>{
            const entries = await loadCalendarEntriesCollection(client);
            await entries.insertOne({
                day:req.body.day,
                date: req.body.date,
                time:req.body.time,
                entryID:req.body.entryID,
                username:req.body.username

            })
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("Calendar Entry has been created")
        });

        //Get Sunday Calendar Entries 
        router.get("/CEsun", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"sunday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Monday Calendar Entries 
        router.get("/CEmon", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"monday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Tuesday Calendar Entries 
        router.get("/CEtues", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"tuesday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Wednesday Calendar Entries 
        router.get("/CEwed", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"wednesday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Thursday Calendar Entries 
        router.get("/CEthurs", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"thursday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Friday Calendar Entries 
        router.get("/CEfri", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"friday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Saturday Calendar Entries 
        router.get("/CEsat", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({day:"saturday",date:req.query.date,username:req.query.username}).toArray());
        } );

        //Get Specific Calendar Entry 
        router.get("/CE", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            res.send(await entries.find({time:req.query.time,date:req.query.date,username:req.query.username}).toArray());
        } );

        router.delete("/CE", async (req, res ) =>{
            //could put/|\:id in the url part
            const entries = await loadCalendarEntriesCollection(client);
            await entries.deleteOne({
                date:req.body.date,
                time:req.body.time,
                username:req.body.username
            })
            
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("Calendar Entry has been Deleted")
        })

        //Update Calendar Entry
        router.put("/CE", async (req, res) => {
            const entries = await loadCalendarEntriesCollection(client);
            await entries.updateOne(
                {date:req.body.date,time:req.body.oldtime, username:req.body.username},
                {$set:{time:req.body.newtime}
            })
            res.status(201).send();
            console.log('Calendar Entry has been updated');


        })

          //Get Specific Entry 
          router.get("/EntryForCE", async (req, res) => {
            
            const entries = await loadEntriesCollection(client);
            res.send(await entries.find({_id:new BSON.ObjectId(req.query._id)}).toArray());
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

async function loadCalendarEntriesCollection(client){
    
    await client.connect();
    return await client.db('Entries').collection(`calendarEntries`);
}




module.exports = router;