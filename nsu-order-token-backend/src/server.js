import 'dotenv/config'
import { createApp } from './app.js'

const PORT = process.env.PORT || 4001

const app = createApp()

app.listen(PORT, () => {
  console.log(`NSU Companion order-token backend running on http://localhost:${PORT}`)
})
