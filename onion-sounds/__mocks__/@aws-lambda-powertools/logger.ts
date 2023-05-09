export const Logger = jest.fn().mockImplementation(() => {
  return {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };
});

export const injectLambdaContext = jest.fn().mockImplementation(() => {
  return { before: jest.fn(), after: jest.fn(), onError: jest.fn() };
});
