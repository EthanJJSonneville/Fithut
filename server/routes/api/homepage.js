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
            res.send(await entries.find().toArray());
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
    return await client.db('Entries').collection(`homepageEntries`);
}






module.exports = router;