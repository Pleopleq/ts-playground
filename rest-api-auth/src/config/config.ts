export default {
  db: {
    URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
  },
};
