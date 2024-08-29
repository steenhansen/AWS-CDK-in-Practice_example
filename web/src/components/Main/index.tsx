
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Interfaces } from '../../../@types/interfaces';
import { CreateTodo } from '../CreateTodo';
import { Todo } from '../Todo';
import { MainContainer } from './styles';

import program_config from '../../../../program.config.json';
const domain_name = program_config.DOMAIN_NAME;
let backend_subdomain = program_config.DOMAIN_SUB_BACKEND;
let backend_dev_subdomain = program_config.DOMAIN_SUB_BACKEND_DEV;

let backend_url: string;
let SECRET_SLACK_WEBHOOK;

if (process.env["REACT_APP__LOCAL_MODE"] === 'yes') {
  console.log("PPP", process.env);
  import('../../../../../local.secrets.json').then((module) => {  // hidden outside GitHub directory
    SECRET_SLACK_WEBHOOK = module.SECRET_LOCAL_SLACK_WEBHOOK;
  });
  const local_server_port = process.env["REACT_APP__LOC_SERV_PORT"];
  backend_url = `http://localhost:${local_server_port}`;
  console.log("sssssssssssssssssssssssssssssssssss", backend_url);
} else {
  import('../../pipeline.secrets.json').then((module) => {           // re-written during AWS pipeline
    SECRET_SLACK_WEBHOOK = module.SECRET_PIPELINE_SLACK_WEBHOOK;
  });
  if (process.env.REACT_ENV === 'Prod') {
    backend_url = backend_subdomain;
  } else {
    backend_url = backend_dev_subdomain;
  }
  backend_url = `https://${backend_url}.${domain_name}`;
}


const sw = SECRET_SLACK_WEBHOOK;
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
      cc <h2>{sw}</h2> ddd


      <CreateTodo handleTodoSubmit={handleTodoSubmit} />

      <p>{completed}/{to_complete} completed</p>


      {todos.map(t => (
        <Todo todo={t} />
      ))}

    </MainContainer>
  );
};
