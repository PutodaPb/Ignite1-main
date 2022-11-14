const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

///Função de veririfcação de username usada para request.
function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers; ///Requisitada no head

  const user = users.find(user => user.username === username); /// Verificação se o "username" esta dentro da constante user(a Mesma esta listada na list "users").

  if(!user){
    return response.status(400).json({error:"Username Not Existing!!!"})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {

  /// constante de nome e usuario requisitados no body
  const {name, username }= request.body;

  /// constExist = Constante que fara a verificação se o ususrio ja existe.
  const userExist = users.find(user => user.username === username);

  if(userExist){
    return response.status(400).json({error:"Username Existing,repeat account creation!!!"})
  }

  /// Const user = Constante que tera a lista de todas minhas infos.
  const user = { 
    id: uuidv4(),
    name,
    username,
    todos: []
  }


/*id: uuidv4(), = id gerado rand.
name, = nome inserino no body 
username, = user inserido no body e usado para fazer a verificação de username
todos: [] = lista 
*/

  users.push(users)

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.json(user);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
/// FAZENDO REQUERIMENTO DO USER PARA CHECKOUT
  const {user} = request;
/// FAZENDO REQUEST DAS CONST NO BODY:
  const {deadline} = request.body;
  const {title} = request.body;

/// SUBSTITUINDO A LISTA TODOS PARA A ATUAL COM AS INFOS INFORMADAS ENTRE "{}"
const todos = { 
    id: uuidv4(),
    title,
    done:false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }
///COLOCANDO AS INFOS DA CONST TODOS DENTRO DA CONST USER
  user.todos.push(todos);

  return response.status(201).json(todos);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if ( !todo ) {
    return response.status(404).json({ error: 'Use "ID" iguais para consultar!'});
  }

  todo.title = title;
  todo.deadline = new Date

  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } =request.params;

  const todo = user.todos.find(todo => todo.id === id);

  

  todo.done=true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} =request.params;

  const todoIndex = user.todos.findIndex(todos => todos.id === id);

  if(!todoIndex === -1){ 
   return response.status(404).json({error: "lista TODO não encontrada!"})};

  user.todos.splice(todoIndex,1);

return response.status(204).json("'Todo' Deletado")
  
});

module.exports = app;