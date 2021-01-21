const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');

function generateToken(user) {
    //create a unique token for our user
    //it takes some payload to put in
    //so we encode it with id, email and username
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        //parent: input from last resolver; undefined in this case
        //args: registerInput from typeDefs
        //context:
        //info: meta-data that we almost never need
        //bcrypt is actually an async function hence this needs to be async too
        async register(
            _, 
            { 
                registerInput: { username, email, password, confirmPassword }
            },
            )
            {
            //validating user data
            const { valid, errors } = validateRegisterInput( username, email, password, confirmPassword );
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }

            //check if user exists or username is taken
            const user = await User.findOne({ username });
            if(user) {
                throw new UserInputError('Username is taken', {
                    //passing payload for better frontend when displaying errors
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            
            //no. of rounds 12 is usually a good no.
            //hash the password before storing
            password =  await bcrypt.hash(password, 12);
            
            //create new user with parameter of registerinput and createdAt with the current timestamp
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            //save data to database
            const res = await newUser.save();

            //generate token for new user
            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            };
        },

        //mutation for login
        async login(_, { username, password }) {
            const {errors, valid} = validateLoginInput(username, password);
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({username});
            //check if user exists
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }
            //check if password matches
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials', {errors});
            }

            //if everything's fine generate a token for the user
            const token = generateToken(user);

            return{
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
}