import { Router } from "express"

const loginRouter = Router()
  .get("/", (req, res) => {
    // web page here potentially
  })
  .post("/", (req, res) => {
    // authentication here
  })

export default loginRouter;