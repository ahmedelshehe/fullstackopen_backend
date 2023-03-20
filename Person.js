const mongoose=require('mongoose');

const url =process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)
const personSchema=new mongoose.Schema({
name :{
    type :String,
    required :[true,'Person Name required']
},
number: {
    type: String,
    minLength:8,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})
const Person=mongoose.model('Person',personSchema);
module.exports = Person;