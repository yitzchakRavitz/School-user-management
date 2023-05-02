

import { createServer } from "./api/mainRouter"

createServer().then(() => {
    console.log("Exiting...")
})
