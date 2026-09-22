const API_BASE = "http://localhost:3000";

// Shared fetch wrapper: absolute URL, JSON parsing, and a thrown Error on failure.
async function request(path, options = {}) {
    const res = await fetch(API_BASE + path, options);

    let data = null;
    if (res.status !== 204) {
        data = await res.json(); // 204 has no body — parsing it would throw
    }

    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`); // API errors look like { error }
    }

    return data;
}

export function postRegistration(reg) {
    return request("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reg),
    });
}

export function startDemoSession() {
    return request("/api/demo/session", {
        method: "POST",
        credentials: "include", // without this the browser ignores the cross-origin Set-Cookie
    });
}

export function readDemoSession() {
    return request("/api/demo/session", {
        credentials: "include", // sends the stored cookie back to the server
    });
}
