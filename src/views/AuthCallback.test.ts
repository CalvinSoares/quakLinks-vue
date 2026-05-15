import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import AuthCallback from "./AuthCallback.vue";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  completeSocialLogin: vi.fn().mockResolvedValue(undefined),
  fetchMyPage: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("vue-router", async () => {
  const actual =
    await vi.importActual<typeof import("vue-router")>("vue-router");
  return {
    ...actual,
    useRoute: () => ({
      query: {
        code: "oauth-code",
        state: "oauth-state",
        provider: "google",
      },
      params: {},
    }),
    useRouter: () => ({
      push: mocks.push,
    }),
  };
});

vi.mock("@/store/auth", () => ({
  useAuthStore: () => ({
    completeSocialLogin: mocks.completeSocialLogin,
  }),
}));

vi.mock("@/store/page", () => ({
  usePageStore: () => ({
    fetchMyPage: mocks.fetchMyPage,
  }),
}));

describe("AuthCallback.vue", () => {
  it("conclui o callback social e redireciona para o dashboard", async () => {
    mocks.push.mockReset();
    mocks.completeSocialLogin.mockClear();
    mocks.fetchMyPage.mockClear();

    mount(AuthCallback);

    await nextTick();
    await Promise.resolve();
    await Promise.resolve();

    expect(mocks.completeSocialLogin).toHaveBeenCalledWith({
      provider: "google",
      code: "oauth-code",
      state: "oauth-state",
    });
    expect(mocks.fetchMyPage).toHaveBeenCalled();
    expect(mocks.push).toHaveBeenCalledWith("/dashboard/overview");
  });
});
