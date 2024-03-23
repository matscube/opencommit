import path from 'path'
import { render } from 'cli-testing-library'
import 'cli-testing-library/extend-expect';
import { prepareEnvironment } from './utils';

it('run cli flow to get the no changes message', async () => {
  const { gitDir, cleanup } = await prepareEnvironment();

  const cli = await render('node', [path.resolve('./out/cli.cjs')], { cwd: gitDir });
  expect(await cli.findByText('No changes detected')).toBeInTheConsole();

  await cleanup();
});
