import { configDotenv } from 'dotenv';
import { expand } from 'dotenv-expand';

const myEnv = configDotenv({ path: './.env.development' });

expand(myEnv);
