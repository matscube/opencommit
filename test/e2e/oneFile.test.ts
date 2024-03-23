import { resolve } from 'path'
import { render, configure } from 'cli-testing-library'
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

it('run basic cli flow to generate commit message for single staged file', async () => {
  await setup();
  await render('mkdir', [testRootPath], { cwd: rootPath });

  const gitInitRemote = await render('git', ['init', '--bare', 'remote.git'], { cwd: testRootPath });
  expect(gitInitRemote.getByText('Initialized empty Git repository')).toBeInTheConsole();

  const gitInitRepository = await render('git' ,['clone remote.git local'], { cwd: testRootPath });
  expect(await gitInitRepository.findByError('done.')).toBeInTheConsole();

  await render('echo' ,[`'console.log("Hellow World");' > index.ts`], { cwd: testGitPath });
  await render('git' ,['add index.ts'], { cwd: testGitPath });

  configure({ asyncUtilTimeout: 5000 });
  const cli = await render('node', [resolve(rootPath, './out/cli.cjs')], { cwd: testGitPath });

  expect(await cli.queryByText('No files are staged')).not.toBeInTheConsole();
  expect(await cli.queryByText('Do you want to stage all files and generate commit message?')).not.toBeInTheConsole();

  expect(await cli.findByText('Generating the commit message')).toBeInTheConsole();
  expect(await cli.findByText('Confirm the commit message?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Do you want to run `git push`?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Successfully pushed all commits to origin')).toBeInTheConsole();

  await tearDown();
});

it('run basic cli flow to generate commit message for 1 changed file (not staged)', async () => {
  await setup();
  await render('mkdir', [testRootPath], { cwd: rootPath });

  const gitInitRemote = await render('git', ['init', '--bare', 'remote.git'], { cwd: testRootPath });
  expect(gitInitRemote.getByText('Initialized empty Git repository')).toBeInTheConsole();

  const gitInitRepository = await render('git' ,['clone remote.git local'], { cwd: testRootPath });
  expect(await gitInitRepository.findByError('done.')).toBeInTheConsole();

  await render('echo' ,[`'console.log("Hellow World");' > index.ts`], { cwd: testGitPath });
  await render('git' ,['add index.ts'], { cwd: testGitPath });
  await render('git' ,[`cm -m 'add new file'`], { cwd: testGitPath });

  await render('echo' ,[`'console.log("Good night World");' >> index.ts`], { cwd: testGitPath });

  configure({ asyncUtilTimeout: 5000 });
  const cli = await render('node', [resolve(rootPath, './out/cli.cjs')], { cwd: testGitPath });

  expect(await cli.findByText('No files are staged')).toBeInTheConsole();
  expect(await cli.findByText('Do you want to stage all files and generate commit message?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Generating the commit message')).toBeInTheConsole();
  expect(await cli.findByText('Confirm the commit message?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Successfully committed')).toBeInTheConsole();

  expect(await cli.findByText('Do you want to run `git push`?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Successfully pushed all commits to origin')).toBeInTheConsole();

  await tearDown();
});
