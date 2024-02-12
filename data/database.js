import fs from 'node:fs/promises';
const databasePath = new URL('./bd.json', import.meta.url);

export class Database {
  #database = {};

  async #load() {
    try {
      const data = await fs.readFile(databasePath, 'utf-8');
      this.#database = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar o banco de dados:', error.message);
    }
  }

  #persiste() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
      .catch(error => console.error('Erro ao persistir o banco de dados:', error.message));
  }

  constructor() {
    this.#load();
  }

  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  async insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persiste();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persiste();
    }
  }

  async update(table, id, newData) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...newData };
      this.#persiste();
      return { id, ...newData };
    }
    return null;
  }
}
