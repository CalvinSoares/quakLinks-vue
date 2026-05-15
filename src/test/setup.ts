import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "./msw/server";
import { resetMockState } from "./msw/handlers";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      href: "http://localhost/",
      pathname: "/",
      search: "",
      assign(url: string) {
        const parsed = new URL(url, "http://localhost");
        this.href = parsed.toString();
        this.pathname = parsed.pathname;
        this.search = parsed.search;
      },
    },
  });
});

afterEach(() => {
  server.resetHandlers();
  resetMockState();
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => {
  server.close();
});
