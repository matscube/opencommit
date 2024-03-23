import path from 'path'
import { mkdtemp, rmdir } from 'fs'
import { promisify } from 'util';
import { tmpdir } from 'os';
import { exec } from 'child_process';
const fsMakeTempDir = promisify(mkdtemp);
const fsExec = promisify(exec);
const fsRemoveDir = promisify(rmdir);

export const prepareEnvironment = async (): Promise<{
  gitDir: string;
  cleanup: () => Promise<void>;
}> => {
  const tempDir = await fsMakeTempDir(path.join(tmpdir(), 'opencommit-test-'));
  await fsExec('git init --bare remote.git', { cwd: tempDir }); // for git push
  await fsExec('git clone remote.git test', { cwd: tempDir });
  const gitDir = path.resolve(tempDir, 'test');

  const cleanup = async () => {
    return fsRemoveDir(tempDir, { recursive: true });
  }
  return {
    gitDir,
    cleanup,
  }
}
