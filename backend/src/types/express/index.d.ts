import { JWT_PAYLOAD } from '../../controllers/auth.controller';

declare global {
    namespace Express {
        interface Request {
            user?: JWT_PAYLOAD;
        }
    }
} 