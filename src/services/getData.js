const { Firestore } = require('@google-cloud/firestore');
 
async function getData() {
    const db = new Firestore();
    const storedCollection = await db.collection('predictions').get();

    const history = [];
    storedCollection.forEach(data => {
        const dokumen = data.data();
        history.push({
            id: dokumen.id,
            history: {
                result: dokumen.result,
                createdAt: dokumen.createdAt,
                suggestion: dokumen.suggestion,
                id: dokumen.id
            } 
        });
    });
    
    return history;
}
 
module.exports = getData;