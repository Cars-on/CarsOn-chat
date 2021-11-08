import { server } from './http';

import './websocket/ChatService';

server.listen(9999, () => {
  console.log('\x1b[32m', 'Servidor rodando!!', '\x1b[0m');
});
