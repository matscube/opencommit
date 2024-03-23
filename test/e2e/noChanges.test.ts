import { resolve } from 'path'
import { render } from 'cli-testing-library'
import 'cli-testing-library/extend-expect';

const rootPath = resolve(process.cwd());
const testRootPath = resolve(rootPath, 'temp/test');
const testGitPath = resolve(rootPath, 'temp/test/local');
async function setup() {
  return resetTestDir();
}
async function tearDown() {
  return resetTestDir();
}
async function resetTestDir() {
  return render('rm', ['-rf', testRootPath], { cwd: rootPath });
}

it('run cli flow to get the no changes message', async () => {
  await setup();
  await render('mkdir', [testRootPath], { cwd: rootPath });

  const gitInitRemote = await render('git', ['init', '--bare', 'remote.git'], { cwd: testRootPath });
  expect(gitInitRemote.getByText('Initialized empty Git repository')).toBeInTheConsole();

  const gitInitRepository = await render('git' ,['clone remote.git local'], { cwd: testRootPath });
  expect(await gitInitRepository.findByError('done.')).toBeInTheConsole();

  const cli = await render('node', [resolve(rootPath, './out/cli.cjs')], { cwd: testGitPath });
  expect(await cli.findByText('No changes detected')).toBeInTheConsole();
  cli.debug();

  await tearDown();
});
