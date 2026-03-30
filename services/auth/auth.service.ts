const MOCK_DELAY_MS = 180

const delay = async (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

export async function signIn(values: { email: string; password: string }) {
  await delay()

  if (!values.email || !values.password) {
    throw new Error("Email and password are required.")
  }

  return { message: "Signed in successfully." }
}

export async function signUp(values: { name: string; email: string; password: string }) {
  await delay()

  if (!values.name || !values.email || !values.password) {
    throw new Error("All signup fields are required.")
  }

  return { message: "Account created successfully. You can sign in now." }
}

export async function requestPasswordReset(values: { email: string }) {
  await delay()

  if (!values.email) {
    throw new Error("Email is required.")
  }

  return { message: "If an account exists with this email, a reset link has been sent." }
}
