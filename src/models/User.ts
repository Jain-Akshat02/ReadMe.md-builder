import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  login: { type: String, required: true },
  name: { type: String },
  avatarUrl: { type: String },
  accessToken: { type: String, required: true }, // 🔑 stored safely in DB
}, { timestamps: true });

const User = models.User || model("User", UserSchema);

export default User;
