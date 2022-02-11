async function errorHandler(context) {
  try {
    return await context.next()
  } catch (error) {
    return new Response(`${error.message}\n${error.stack}`, {status: 500})
  }
}

export const onRequest = errorHandler
