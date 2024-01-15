export async function getNewPasskey(): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/passkey`);
    const data = await response.json();
    const passkey = (data as { passkey: string }).passkey;

    if (!passkey) {
      return null;
    }

    return passkey;
  } catch (error) {
    console.error('Error fetching new passkey:', error);
    return null;
  }
}
