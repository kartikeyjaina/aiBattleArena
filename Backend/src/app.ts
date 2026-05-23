import express from 'express';
import runGraph from "./ai/graph.ai.js"
import cors from "cors"

const app = express();
const allowedOrigins = process.env.FRONTEND_URL
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json())
app.use(cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    methods: ["GET", "POST"],
    credentials: true,
}))


app.get('/', async (req, res) => {

    const result = await runGraph("Write an code for Factorial function in js")

    res.json(result)
})

app.post("/invoke", async (req, res) => {

    try {
        const { input } = req.body

        if (!input || typeof input !== "string") {
            return res.status(400).json({
                message: "Input is required",
                success: false,
            })
        }

        const result = await runGraph(input)

        return res.status(200).json({
            message: "Graph executed successfully",
            success: true,
            result
        })
    } catch (error) {
        console.error("Graph execution failed:", error)

        return res.status(500).json({
            message: error instanceof Error ? error.message : "Graph execution failed",
            success: false,
        })
    }

})



export default app;
