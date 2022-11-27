import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import userRoutes from './routes/users'
import authRoutes from './routes/auth';

//config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.contentSecurityPolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/// Routes with files 

app.post('/auth/register', upload.single('picture', register));

//Routes 

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

//database mongoDB
const PORT = process.env.PORT || 6000
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((err) => console.log(`${err} did not save the data`));


