const multiavatar = require("@multiavatar/multiavatar");

const generateAvatars = async (req, res) => {
  try {
    const avatars = [];
    for (let i = 0; i < 4; i++) {
      const avatarId = Math.random().toString(36).substring(7);
      const avatarSvg = multiavatar(avatarId);
      avatars.push({ id: avatarId, svg: avatarSvg });
    }
    res.status(200).json(avatars);
  } catch (error) {
    console.error("Error generating avatars:", error.message);
    res.status(500).json({ error: "Failed to generate avatars" });
  }
};

module.exports = { generateAvatars };
