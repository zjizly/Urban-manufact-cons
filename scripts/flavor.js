const envs = [
  'development',
  'test',
  'production',
  'rollback',
];
const env = process.argv[2];
if (!envs.includes(env)) {
  console.log('Please specific env');
  process.exit(1);
}

const replace = require('replace');
replace({
  regex: 'baseUrl = this\\.hostname\\..*',
  replacement: 'rollback' === env ? 'baseUrl = this.hostname.development;' : `baseUrl = this.hostname.${env};`,
  paths: [ './src/utils/app/index.ts' ],
});
