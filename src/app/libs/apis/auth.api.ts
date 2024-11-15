export const signingIn = async ({ input: { credential } }: any) => {
  const result = await fetch('http://10.147.17.139:3000/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credential)
  });
  console.log('credential', credential);
};

export const signingOut = async () => {};
