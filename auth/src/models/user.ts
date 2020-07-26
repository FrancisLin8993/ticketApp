/**
 * The model definition of a user in the auth module.
 */
import mongoose from 'mongoose';
import { Password } from '../services/password';

/**
 * An interface that describes the properties
 * required for a new user
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties a user model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): any;
}

/**
 * An interface that describes the properties a user document has
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//User schema definition in mongodb
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    //Convert the mongoose document into a JSON object
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

/**
 * A pre hook for user schema
 * to hash the password before persisting
 */
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

/**
 * A static function of the user schema to build a user for typescript to check
 * Must be added before calling the .model()
 * @param attrs
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//Compile the user model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
