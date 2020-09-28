const express = require('express');
const cors = require('cors');

const functions = require('firebase-functions');


const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "asd"
});

const db = admin.firestore();

/* exports.getLanguages = functions.https.onRequest( async(request, response) => {

   const languagesRef = db.collection('languages');
   const docsSnap = await languagesRef.get();
   const languages =  docsSnap.docs.map (doc => doc.data());

   response.json( languages );

}); */

const app = express();
app.use( cors({origin: true}) );

app.get('/languages', async(req, res) => {

    const languagesRef = db.collection('languages');
    const docsSnap = await languagesRef.get();
    const languages =  docsSnap.docs.map (doc => doc.data());
 
    res.json( languages );
 

});


app.post('/languages/:id', async(req, res) => {

    const id = req.params.id;
    const languagesRef = db.collection('languages').doc(id);
    const docsSnap = await languagesRef.get();

    if(!docsSnap){
         res.status(404).json({
            ok: false,
            message: 'This language dont exist with that ID ' + id
        });
    }else{
        const before =  docsSnap.data();
        await languagesRef.update({
            votes:  1 + before.votes
       });

       res.json({
           ok:true,
           message: 'Thanks for your vote to ' + before.name
       });
    }


    
});


exports.api = functions.https.onRequest( app );
