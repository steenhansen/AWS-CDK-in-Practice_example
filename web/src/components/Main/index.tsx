import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Interfaces } from '../../../@types/interfaces';

import { CreateTodo } from '../CreateTodo';
import { Todo } from '../Todo';

import { MainContainer } from './styles';

//import config from '@web/outside-config/config.json';

import browser_config from '../../config.json';
const domain_name = browser_config.domain_name;
let backend_subdomain = browser_config.backend_subdomain;
let backend_dev_subdomain = browser_config.backend_dev_subdomain;


/* ----------
 * Add backend URL provided by the cdk deploy here!
 * ---------- */
// const backend_url = `https://${process.env.REACT_APP_ENV === 'Production' ? config.backend_subdomain : config.backend_dev_subdomain}.${config.domain_name}`;

let backend_url: string;
if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
  backend_url = `http://localhost:3001`;      //${PORT_SERVER}`;
} else {
  let domain_sub_backend;
  if (process.env.REACT_ENV === 'Prod') {
    domain_sub_backend = backend_subdomain;
  } else {
    domain_sub_backend = backend_dev_subdomain;
  }
  backend_url = `https://${domain_sub_backend}.${domain_name}`;
}


const sw = browser_config.SLACK_WEBHOOK;
export const Main: React.FC = () => {
  /* ----------
   * States
   * ---------- */
  const [todos, setTodos] = useState<Interfaces.Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(backend_url);

      setTodos(response.data.todos);
    };

    fetchTodos();
  }, []);

  const handleTodoSubmit = async ({
    new_todo,
  }: {
    new_todo: Interfaces.Todo;
  }) => {
    const response = await axios.post(backend_url, {
      todo: new_todo,
    });

    setTodos(current_todos => [...current_todos, response.data.todo]);
  };

  const to_complete = todos.filter(todo => !todo.todo_completed).length;
  const completed = todos.filter(todo => todo.todo_completed).length;

  return (
    <MainContainer>
      <h1>Today</h1>
      cc <h2>{sw}</h2> dddxxx


      <CreateTodo handleTodoSubmit={handleTodoSubmit} />

      <p>{completed}/{to_complete} completed</p>


      {todos.map(t => (
        <Todo todo={t} />
      ))}

    </MainContainer>
  );
};
