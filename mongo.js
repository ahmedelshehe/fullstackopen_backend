const mongoose =require('mongoose');

const password = process.argv[2]
const url =`mongodb+srv://ahmedayman:${password}@cluster0.kn8tpro.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)
const personSchema=new mongoose.Schema({
name :String,
number :Number
})
const Person=mongoose.model('Person',personSchema);

const newPerson=new Person({
    name :process.argv[3],
    number :process.argv[4]
})
if(process.argv.length ==3){
    Person.find({}).then((result)=>{
        console.log("phonebook :");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close()
    })
}else if(process.argv.length ==5){
    newPerson.save().then((result) =>{
    console.log(`added ${result.name} number  ${result.number} to phonebook`)
    console.log(process.argv.length)
    mongoose.connection.close()
})
}

