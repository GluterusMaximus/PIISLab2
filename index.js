import express from 'express'
import path from 'path'

const app = express()
const __dirname = path.resolve()

app.use(
  '/',
  express.static(path.join(__dirname, 'frontend'))
)

const port = 3000

app.listen(port, () => {
  console.log(`App started at port ${port}`)
})
