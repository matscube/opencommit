import { resolve } from 'path'
import { render, configure } from 'cli-testing-library'
import 'cli-testing-library/extend-expect';
import { prepareEnvironment } from './utils';

it('run basic cli flow to generate commit message for single staged file', async () => {
  const { gitDir, cleanup } = await prepareEnvironment();

  await render('echo' ,[`'console.log("Hello World");' > index.ts`], { cwd: gitDir });
  await render('git' ,['add index.ts'], { cwd: gitDir });

  configure({ asyncUtilTimeout: 5000 });
  const cli = await render('node', [resolve('./out/cli.cjs')], { cwd: gitDir });

  expect(await cli.queryByText('No files are staged')).not.toBeInTheConsole();
  expect(await cli.queryByText('Do you want to stage all files and generate commit message?')).not.toBeInTheConsole();

  expect(await cli.findByText('Generating the commit message')).toBeInTheConsole();
  expect(await cli.findByText('Confirm the commit message?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Do you want to run `git push`?')).toBeInTheConsole();
  cli.userEvent.keyboard('[Enter]');

  expect(await cli.findByText('Successfully pushed all commits to origin')).toBeInTheConsole();

  await cleanup();
});

it('run basic cli flow to generate commit message for 1 changed file (not staged)', async () => {
  const { gitDir, cleanup } = await prepareEnvironment();

  await render('echo' ,[`'console.log("Hello World");' > index.ts`], { cwd: gitDir });
  await render('git' ,['add index.ts'], { cwd: gitDir });
  await render('git' ,[`cm -m 'add new file'`], { cwd: gitDir });

  await render('echo' ,[`'console.log("Good night World");' >> index.ts`], { cwd: gitDir });

  configure({ asyncUtilTimeout: 5000 });
  const cli = await render('node', [resolve('./out/cli.cjs')], { cwd: gitDir });

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

  await cleanup();
});
