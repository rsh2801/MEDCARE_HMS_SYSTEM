import express from "express";

const router = express.Router();
router.get("/",(req,res)=>{
    res.status(200).json({
        message: 'connected to the server',
        status: 200,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment:  'development'
    })
})

export default router;


