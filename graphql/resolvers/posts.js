const Post = require('../../models/Post');
const checkAuth = require('../../util/check_auth');
const { AuthenticationError, UserInputError } = require('apollo-server');
module.exports = {
    Query: {
        //async function
        async getPosts() {
            //if not using try-catch block then on failure it stops server as well
            try{
                //find() returns all of the posts if you don't give any condition
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            }catch(err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try{
                const post = await Post.findById(postId);
                if(post) {
                    return post;
                }
                else {
                    throw new Error('Post not found');
                }
            }
            catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            //check authentication token for a valid user in check_auth.js
            const user = checkAuth(context);
            console.log(user);
            //allow the above user to create a post
            const newPost = new Post({
                body,
                //to get user of the post later by auto populating
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        },
        
        async deletePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                if(username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                }
                else{
                    throw new AuthenticationError('Action not allowed');
                }
            }
            catch(err){
                throw new Error(err);
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if(post) {
                if(post.likes.find(like => like.username === username)) {
                    //Post already liked, unlike it
                    post.likes = post.likes.filter(like => likes.username !== username);
                }
                else {
                    //not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            }
            else {
                throw new UserInputError('Post not found');
            }
        }
    }
}