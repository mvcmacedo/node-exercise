const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const findRepositoryIndexById = (repositoryId) => {
  const repositoryIndex = repositories
    .findIndex(repo => repo.id === repositoryId);

  return repositoryIndex;
};

app.get("/repositories", (request, response) => {
  return response
    .status(200)
    .send(repositories);
});

app.post("/repositories", (request, response) => {
  const {
    url,
    title,
    techs,
  } = request.body;

  const newRepository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response
    .status(200)
    .send(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .send({ message: 'Repository not found' });
  }

  const {
    url,
    title,
    techs,
  } = request.body;

  const updatedRepository = {
    ...repositories[repositoryIndex],
    url,
    title,
    techs,
  }

  repositories[repositoryIndex] = updatedRepository;

  return response
    .status(200)
    .send(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .send({ message: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response
    .status(204)
    .send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepositoryIndexById(id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .send({ message: 'Repository not found' });
  }

  const repository = repositories[repositoryIndex];

  const updatedRepository = {
    ...repository,
    likes: repository.likes + 1,
  }

  repositories[repositoryIndex] = updatedRepository;

  return response
    .status(200)
    .send(updatedRepository);
});

module.exports = app;
