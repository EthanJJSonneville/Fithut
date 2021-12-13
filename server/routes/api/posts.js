const express = require("express");
const {MongoClient} = require("mongodb");

const router = express.Router();

async function main(){

    const uri = "mongodb+srv://gump100:GreenDay100@cluster.4yjzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);

    try{
        //Get users
        router.get("/", async (req, res) => {
            const posts = await loadUsersCollection(client);
            res.send(await posts.find({}).toArray());
        } );
        //Add user
        router.post("/", async (req, res ) =>{
            const posts = await loadUsersCollection(client);
            await posts.insertOne({
                _id: req.body._id,
                username: req.body.username,
                password: req.body.password,
                lastlogin: req.body.lastlogin
            })
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("User has been created")
        });
        //Delete user
        router.delete("/", async (req, res ) =>{
            //could put/|\:id in the url part
            const posts = await loadUsersCollection(client);
            await posts.deleteOne({
                _id: req.body._id,
                password: req.body.password
            })
            
            //201:everything went okay and something was created
            res.status(201).send();
            console.log("User has been Deleted")
        })

        //Update username
        router.put("/", async (req, res) => {
            const posts = await loadUsersCollection(client);
            await posts.updateOne(
                {_id: req.body._id, password: req.body.password},
                {$set:{username: req.body.username}
            })
            res.status(201).send();
            console.log('Username has been changed');


        })
    }catch (e) {
        console.error(e)
    } finally{
        await client.close();
    }
}
//function call to run main
main().catch(console.error);

async function loadUsersCollection(client){
    
    await client.connect();
    return await client.db('User').collection(`users`);
}


module.exports = router;