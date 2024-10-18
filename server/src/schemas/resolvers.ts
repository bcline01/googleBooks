import  { User, Book }  from '../models/index.js'
import { signToken, AuthenticationError } from '../services/auth.js'; 

// Define Interfaces

interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
  }
  
  interface LoginUserArgs {
    email: string;
    password: string;
  }
  

  interface SaveBookArgs {
    input: {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
    }
  }

  interface RemoveBookArgs {
    bookId: string;
  }

  const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('books');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
          },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
          
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
          
            // Return the token and the user
            return { token, user };
          }, 
          login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
          
            // If no user is found, throw an AuthenticationError
            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
          
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }
          
            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);
          
            // Return the token and the user
            return { token, user };
          },
          saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
            if (context.user) {
              try {
                // Create the book
                const book = await Book.create(input);
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book._id } },
                    { new: true, runValidators: true }
                  ).populate('savedBooks');
                  if (!updatedUser) {
                    throw new Error('User not found');
                  }
        
                  // Return the newly created book, not the user
                  return book;
                } catch (error) {
                  console.error('Error in saveBook mutation:', error);
                  throw new Error('Failed to save the book');
                }
              }
              throw new AuthenticationError('You need to be logged in!');
            },
          
          deleteBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
            if (context.user) {
              try {
                // Find the book by bookId, not _id
                const book = await Book.findOneAndDelete({ bookId: bookId });
      
                if (!book) {
                  throw new Error('No book found with this ID.');
                }
      
                // Remove the book from the user's savedBooks
                const updatedUser = await User.findByIdAndUpdate(
                  context.user._id,
                  { $pull: { savedBooks: book._id } },
                  { new: true }
                ).populate('savedBooks');
      
                if (!updatedUser) {
                  throw new Error('User not found');
                }
      
                console.log('Book removed:', book);
                console.log('Updated user:', updatedUser);
      
                return book; // Return the book that was removed
              } catch (error) {
                console.error('Error in removeBook mutation:', error);
                throw new Error('Failed to remove the book');
              }
            }
            throw new AuthenticationError('You need to be logged in!');
          },
        },
      };

  export default resolvers;