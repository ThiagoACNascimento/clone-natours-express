process.on('uncaughtException', (error) => {
  console.log(error.name, error.message);
  console.log('UNCAUGHT EXCEPTION... SHUTTING DOWN');
  process.exit(1);
});
