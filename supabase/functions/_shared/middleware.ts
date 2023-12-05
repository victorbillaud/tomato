const TOMATO_EDGE_TOKEN = Deno.env.get("TOMATO_EDGE_TOKEN");

export function middleware(
    _request: Request,
) {
    // Verify if the header 'x-tomato-edge-token' is present and valid

    const token = _request.headers.get("x-tomato-edge-token");

    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (token !== TOMATO_EDGE_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
    }

    return new Response("OK", { status: 200 });
}