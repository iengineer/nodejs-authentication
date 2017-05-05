const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const userSchema = new Schema(
  // 1st arg -> field of documents
  {
    name: { type: String },
    username: { type: String },
    encryptedPassword: { type: String }
  },

  // 2nd arg -> additional options
  {
    // Adds createdAt & updatedAt to documents
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
