import User from "../models/User.js";

export const getTotalUsers = async (req, res) => {
  try {
    const total = await User.countDocuments();
    res.json({ totalUsers: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
