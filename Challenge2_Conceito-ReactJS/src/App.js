import React, { useState, useEffect } from "react";

import "./styles.css";
import api from "services/api";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("/repositories").then((response) => {
      setRepositories(response.data);
    })
  }, [])

  async function handleAddRepository() {
    const response = await api.post("/repositories", {
      "title": "GoStack-12",
	    "url": "https://github.com/GuiSelair/GoStack-12",
	    "techs": ["NodeJS"]
    });
    const repository = response.data;
    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`);
    let dataTemp = [...repositories];

    const index = dataTemp.findIndex(repository => repository.id === id);
    if (index >= 0){
      dataTemp.splice(index, 1);
      setRepositories(dataTemp);
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
      {
        repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))
      }
      </ul>

      <button onClick={() => handleAddRepository()}>Adicionar</button>
    </div>
  );
}

export default App;
