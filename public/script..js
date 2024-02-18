var porta = 3333

// Função para atualizar a contagem de caracteres
function atualizarContagem() {
  const newNoteText = document.getElementById("new-nota").value
  const charCountSpan = document.getElementById("char-count")
  const currentCharCount = newNoteText.length
  const remainingChars = 200 - currentCharCount
  charCountSpan.textContent = `${currentCharCount}/200`
}

// Função para carregar as notas
async function carregarNotas() {
  try {
    const response = await fetch(`http://localhost:${porta}/api/notes`)
    const notas = await response.json()

    const cardContainer = document.querySelector('main')
    cardContainer.innerHTML = ""

    notas.forEach((nota) => {
      const newNoteDiv = document.createElement("div")
      newNoteDiv.className = "card"

      const newNoteContent = document.createElement("p")
      newNoteContent.innerHTML = `<p>${nota.text}</p>`

      const buttonsDiv = document.createElement("div")
      buttonsDiv.className = "button"

      const editarButton = document.createElement("button")
      editarButton.className = "buton_editar"
      editarButton.textContent = "Editar"
      editarButton.addEventListener("click", async () => {
        const text = await getNoteById(nota.id)
        // const newText = prompt("Digite o novo texto:")
        // if (newText !== null) {
        //   editar(nota.id, newText)}
        let textlength = text.text.length
        let editdialog = xdialog.create({
          title: "Edite sua nota",
          body: `<textarea id="nota-editada" maxlength="200">${text.text}</textarea>`,
          onok: function () {
            const text_new_editada =
              document.getElementById("nota-editada").value
            console.log(text_new_editada)
            editar(nota.id, text_new_editada)
            editdialog.hide()
          },
          oncancel: function () {
            editdialog.hide()
          },
        })
        editdialog.show()
      })

      const excluirButton = document.createElement("button")
      excluirButton.className = "buton_excluir"
      excluirButton.textContent = "Excluir"
      excluirButton.addEventListener("click", () => {
        // if (confirm("Tem certeza que deseja excluir esta nota?")) {
        //   excluir(nota.id)
        // }
        let excluirdialog = xdialog.create({
          title: "Exclusão de notas",
          body: `Deseja excluir sua nota?`,
          onok: function () {
            excluir(nota.id)
            excluirdialog.hide()
          },
          oncancel: function () {
            excluirdialog.hide()
          },
        })
        excluirdialog.show()
      })

      buttonsDiv.appendChild(editarButton)
      buttonsDiv.appendChild(excluirButton)

      newNoteDiv.appendChild(newNoteContent)
      newNoteDiv.appendChild(buttonsDiv)

      cardContainer.appendChild(newNoteDiv)
    })
  } catch (error) {
    console.error("Erro ao carregar as notas:", error)
  }
}

// async function count() {
//   const text = await document.getElementById("nota-editada")
//   text.addEventListener("input", function () {
//     const tam = this.value.length
//     if(tam){
//       return tam
//     }
//     return 1
//   })
// }

async function getNoteById(id) {
  const response = await fetch(`http://localhost:${porta}/api/notes/${id}`)
  const nota = await response.json()

  return nota
}

// Função para adicionar uma nova nota
async function adicionar() {
  const newNoteTextarea = document.getElementById("new-nota")
  const newNoteText = newNoteTextarea.value

  if (newNoteText.trim() === "") {
    alert("Digite o texto da nota antes de adicionar.")
    return
  }

  const currentCharCount = newNoteText.length

  if (currentCharCount > 200) {
    alert("A nota não pode ter mais de 200 caracteres.")
    return
  }

  try {
    const response = await fetch(`http://localhost:${porta}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newNoteText }),
    })

    const insertedNote = await response.json()
    console.log("Nota adicionada:", insertedNote)

    // Limpar o campo de entrada
    newNoteTextarea.value = ""

    // Atualizar a contagem de caracteres após adicionar
    atualizarContagem()
  } catch (error) {
    console.error("Erro ao adicionar a nota:", error)
  }
}

// Função para editar uma nota
async function editar(id, newText) {
  try {
    console.log(newText)
    console.log(newText.length)
    if (newText.length <= 200) {
      const response = await fetch(
        `http://localhost:${porta}/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newText }),
        }
      )
      const updatedNote = await response.json()
      console.log("Nota editada:", updatedNote)
    } else {
      window.alert("[ERRO] A quantidade de caracter é maior que 200!")
    }
  } catch (error) {
    console.error("Erro ao editar a nota:", error)
  }
}

// Função para excluir uma nota
async function excluir(id) {
  try {
    const response = await fetch(`http://localhost:${porta}/api/notes/${id}`, {
      method: "DELETE",
    })

    const result = await response.json()
    if (result.success) {
      console.log("Nota excluída com sucesso.")
      // Adicione o código para remover a nota da interface do usuário conforme necessário
    } else {
      console.error("Erro ao excluir a nota.")
    }
  } catch (error) {
    console.error("Erro ao excluir a nota:", error)
  }
}

// Adicionar evento de input para atualizar a contagem em tempo real
document.getElementById("new-nota").addEventListener("input", atualizarContagem)

// Chame esta função para carregar as notas ao carregar a página
carregarNotas()
