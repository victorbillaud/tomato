const TOMATO_EDGE_TOKEN = Deno.env.get("TOMATO_EDGE_TOKEN");

export function middleware(
    _request: Request,
    handler: (request: Request) => Promise<Response>,
) {
    const token = _request.headers.get("x-tomato-edge-token");

    if (!token) {
        console.log("Missing token for request", _request);
        return new Response("Unauthorized", { status: 401 });
    }

    if (token !== TOMATO_EDGE_TOKEN) {
        console.log("Invalid token for request", _request);
        return new Response("Unauthorized", { status: 401 });
    }

    return handler(_request);
}