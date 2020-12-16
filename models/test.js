const Joi = require('joi');
const t1=async()=>{
    try {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
        
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required(),
        })
        let password;
        const user={
            username:"abc",
            password
        }
        const value = await schema.validateAsync(user);
        console.log(value);
    }
    catch (err) {
        console.log("HEre***");
        console.log(err);
     }
}
t1()




// -> { value: {}, error: '"username" is required' }

// Also -

