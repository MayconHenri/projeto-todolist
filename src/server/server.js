// server.mjs
import express from "express"
import { notesRoutes } from "./routes/notesRoutes.js"
import cors from "cors"

const app = express()
const port = 3333

app.use(express.json())
app.use(cors())

// Use as rotas do arquivo notesRoutes
app.use("/", notesRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
