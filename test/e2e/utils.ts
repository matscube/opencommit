import path from 'path'
import { mkdtemp, rmdir } from 'fs'
import { promisify } from 'util';
import { tmpdir } from 'os';
import { exec } from 'child_process';
const fsMakeTempDir = promisify(mkdtemp);
const fsExec = promisify(exec);
const fsRemoveDir = promisify(rmdir);

/**
 * Prepare the environment for the test
 * Create a temporary git repository in the temp directory
 */
export const prepareEnvironment = async (): Promise<{
  gitDir: string;
  cleanup: () => Promise<void>;
}> => {
  const tempDir = await fsMakeTempDir(path.join(tmpdir(), 'opencommit-test-'));
  // Create a remote git repository int the temp directory. This is necessary to execute the `git push` command
  await fsExec('git init --bare remote.git', { cwd: tempDir }); 
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
