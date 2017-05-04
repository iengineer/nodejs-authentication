const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const userSchema = new Schema(
  // 1st arg -> field of documents
  {
    username: { type: String },
    encryptedPassword: { type: String }
  },

  // 2nd arg -> additional options
  {
    // Adds createdAt & updatedAt
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
