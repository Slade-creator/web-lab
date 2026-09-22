const API_BASE = "http://localhost:3000";

async function request(path, options = {}) {
    const res = await fetch(API_BASE + path, options);

    let data = null;
    if (res.status !== 204) {
        data = await res.json();
    }

    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
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
        credentials: "include",
    });
}

export function readDemoSession() {
    return request("/api/demo/session", {
        credentials: "include",
    });
}
