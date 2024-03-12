export default defineEventHandler(async (event) => {
  throw createError({ statusMessage: 'Not found', statusCode: 404 })
})
