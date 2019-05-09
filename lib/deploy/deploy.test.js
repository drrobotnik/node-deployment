const deploy = require('./deploy');

test('exit if no parameters passed', () => {
	const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
	deploy();

	expect(mockExit).toHaveBeenCalledWith(0);
	mockExit.mockRestore();
});

test('warn and exit if app_path is the current working directory', () => {
	const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
	deploy({},process.cwd());
	expect(mockExit).toHaveBeenCalledWith(0);
	mockExit.mockRestore();
});


