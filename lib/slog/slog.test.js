const slog = require('./slog');

test('no message by default', () => {
	slog();
  expect(global.console.log).toHaveBeenCalledWith('')
});


test('outputs message', () => {
	slog('message');
  expect(global.console.log).toHaveBeenCalledWith('message')
});

test('outputs nothing when quiet arg exists', () => {
	const mockArgs = {
		quiet: true,
	};

  expect(slog('message', mockArgs)).toMatch('');
});
