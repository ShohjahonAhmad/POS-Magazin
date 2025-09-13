declare namespace Express {
    export interface Request{
        validatedQuery: any,
        user?: {
            id: number
        }
    }
}