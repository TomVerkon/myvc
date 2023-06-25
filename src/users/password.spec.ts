import { Password } from './password';

it('encrypts password', async () => {
  const storedPassword = await Password.toHash('password');
  expect(storedPassword.length).toEqual(49);
  const pwdEqual = await Password.compare(storedPassword, 'password');
  expect(pwdEqual).toBeTruthy();
});
