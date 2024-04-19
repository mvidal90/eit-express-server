

export const getEndpointController = (request, response) => {
    console.log("getEndpointController", request.baseUrl)
    response
        .status(200)
        .json({
            ok: true,
            endpoint: request.baseUrl,
            method: request.method,
            date: new Date()
        })
} 