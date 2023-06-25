import { Password } from './password';

it('encrypts password', async () => {
  const storedPassword = await Password.toHash('password');
  console.log(storedPassword);
  expect(storedPassword.length).toEqual(49);
  const [hashedPassword, salt] = storedPassword.split('.');

  const pwdEqual = await Password.compare(storedPassword, 'password');
  expect(pwdEqual).toBeTruthy();
});
