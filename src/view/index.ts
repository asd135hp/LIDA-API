import { Router } from "express"
import loginRouter from "./login";
import userIndex from "./user";

const router = Router()
router.use("/user", userIndex)
router.use("/login", loginRouter)

const index = router.get("/", (req, res) => {
  res.send("Hello world")
});

export default index;