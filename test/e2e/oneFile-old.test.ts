// import { prepareEnvironment } from 'cli-testing-library';

it('run basic cli flow to generate commit message for single staged file', async () => {
  // const { execute, spawn, writeFile, cleanup, ls, path } = await prepareEnvironment();

  // console.log(path);
  // console.log(await ls('./'));
  // console.log(await ls('./'));

//   console.log('start');


  /**
   * 1. gitのremote用のbare repositoryを作成
   * 2. gitのlocal repositoryを作成
   * 3. gitのlocal repositoryにremote repositoryを追加
   */
  // await execute('git' ,'init --bare remote.git');
  // const git = await spawn('git' ,'clone remote.git local');
  // git.debug();
  // await git.waitForText('done.');
  // console.log(await ls('./'));
  // expect(await ls('./')).toMatchInlineSnapshot(`
  //   [
  //     "local",
  //     "remote.git",
  //   ]
  // `);
  // await execute('cd' ,'local');
  // console.log(await ls('./'));

  // await writeFile('./index.ts', 'console.log("hello world")');
  // await execute('git' ,'add .');

  // const { waitForText, pressKey, getExitCode, debug } = await spawn(
  //   'node',
  //   './out/cli.cjs'
  // );
  // debug();
  // await waitForText('Confirm the commit message?');
  // await pressKey('enter');

  // await waitForText('Do you want to run `git push`?');
  // await pressKey('enter');

  // await waitForText('Successfully pushed all commits');
  // expect(getExitCode()).toBe(0);

  // await cleanup();
}, 5000);

// it('run basic cli flow to generate commit message for 1 changed file (not staged)', async () => {
//   const { spawn, writeFile, cleanup } = await prepareEnvironment();

//   await writeFile('src/test-index.ts', 'console.log("hello world")');

//   const { waitForText, pressKey, getExitCode } = await spawn(
//     'node',
//     './out/cli.cjs --test'
//   );

//   await waitForText('Do you want to stage all files and generate commit message?');
//   await pressKey('enter');

//   await waitForText('Confirm the commit message?');
//   await pressKey('enter');

//   await waitForText('Successfully committed');

//   await waitForText('Do you want to run `git push`?');
//   await pressKey('enter');

//   await waitForText('Successfully pushed all commits');

//   expect(getExitCode()).toBe(0);

//   await cleanup();
// }, 100000);
