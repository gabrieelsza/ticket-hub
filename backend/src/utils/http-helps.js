export const ok = async () => {
    return {
        statusCode: 200, 
        body: data
    }
} 

export const created = async () => {
    return {
        statusCode: 201, 
        body: {
            message: "sucessful",
        }, 
    }
}
export const noContent = async () => {
    return {
        statusCode: 204, 
        body: null, 
    }
}

export const badRequest = async () => {
    return {
        statusCode: 400, 
        body: null, 
    }
}