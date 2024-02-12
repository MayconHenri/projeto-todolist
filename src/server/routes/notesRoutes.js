import express from "express"
import { Database } from "../../../data/database,js"
import { randomUUID } from "node:crypto"

const router = express.Router()
const database = new Database()

// Rota para obter todas as notas
router.get("/api/notes", async (req, res) => {
  try {
    const notes = database.select("notes")
    res.json(notes)
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao obter as notas")
  }
})

// Rota para adicionar uma nova nota
router.post("/api/notes", async (req, res) => {
  try {
    const newNote = {
      id: randomUUID(),
      text: req.body.text,
    }

    const insertedNote = database.insert("notes", newNote) // Substitua 'notes' pelo nome da tabela
    res.json(insertedNote)
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao adicionar a nota")
  }
})

// Rota para excluir uma nota
router.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id
    database.delete("notes", noteId) 
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).send("Erro ao excluir a nota")
  }
})

export { router as notesRoutes }
