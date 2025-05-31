import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()

export const getConfigEnv = (env_name: string): string => {

    const env: any = {
        "PORT": process.env.PORT,
        "DB_NAME": process.env.DB_NAME,
        "DB_URI": process.env.DB_URI,
        "JWT_ACCESS_SECRET": process.env.JWT_ACCESS_SECRET,
        "JWT_REFRESH_SECRET": process.env.JWT_REFRESH_SECRET
    }
    
    return env[env_name]
}

export const startDBConnection = async () => {
    try {
        const conn = await mongoose.connect(`${getConfigEnv('DB_URI')}/${getConfigEnv('DB_NAME')}`)
        if (conn.STATES.connected) {
            console.log("Database connection established!")
            return
        }
    } catch (error: any) {
        console.log(error?.message)
    }
}