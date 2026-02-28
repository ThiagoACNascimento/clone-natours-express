import { exec } from 'node:child_process';

function checkMongodb() {
  const command =
    'docker exec mongo-dev mongosh --quiet --eval "db.adminCommand(\'ping\')"';
  exec(command, handlerReturn);

  function handlerReturn(error, stdout) {
    if (error || stdout.search('{ ok: 1 }') === 1) {
      process.stdout.write('.');

      setTimeout(checkMongodb, 500);
      return;
    }

    console.log('\nConexão com o MongoDB concluída com sucesso!\n');
  }
}

process.stdout.write('Aguardando MongoDB aceitar conexões');
checkMongodb();
