let env = process.argv[2];
const envs = ['test', 'production'];
if (!envs.includes(env)) {
  env = process.env.NODE_ENV;
}

const path = require('path');
const NodeSsh = require('node-ssh');
const ssh = new NodeSsh();

const config = {
  [envs[0]]: {
    ssh: {
      host: '192.168.0.49',
      port: 22,
      username: 'dev',
      password: 'emakedev123',
    }
  },
  [envs[1]]: {
    ssh: {
      host: 'www.emake.cn',
      port: 22,
      username: 'dev',
      password: 'emakedev123',
    }
  }
};

const fs = require('fs');

function subDirs(path) {
  const dirs = [path];
  if (fs.statSync(path).isFile()) {
    return dirs;
  }
  fs.readdirSync(path).forEach(item => {
    const stat = fs.statSync(`${path}/${item}`);
    if (stat.isDirectory()) {
      dirs.push(...subDirs(`${path}/${item}`))
    }
  });
  return dirs;
}

const necessaryPath = (path) => {
  return subDirs(path)
    .map(it => it.replace(path, ''))
    .filter(it => it)
    .map(it => it.split('/').filter(it => it));
};

ssh.connect(config[env].ssh).then(async () => {
  const cwd = '/home/dev/app';
  const workDir = 'mallcons';
  await ssh.execCommand(`mv ${workDir} /home/dev/app/mallcons-backup/${workDir}-backup-${new Date().toISOString()}`, { cwd });
  await ssh.execCommand(`mkdir ${workDir}`, { cwd });
  const toCreate = necessaryPath('./build');
  for (const name of toCreate) {
    await ssh.execCommand(`mkdir ${workDir}/${name.join('/')}`, { cwd });
  }

  let err;
  await ssh.putDirectory('./build', `/home/dev/app/${workDir}`, {
    concurrency: 10,
    recursive: true,
    validate: itemPath => {
      const baseName = path.basename(itemPath);
      return !baseName.endsWith('.map');
    },
    tick: (localPath, remotePath, error) => {
      console.log(`file ${localPath} to ${remotePath} ${error || 'uploaded'}`);
      err = error;
    },
  });
  ssh.dispose();
  if (err) {
    console.log('uploaded with error!');
    process.exit(1);
  } else {
    console.log('build published!');
  }
}).catch(err => {
  console.error(err);
  ssh.dispose();
  process.exit(1);
});