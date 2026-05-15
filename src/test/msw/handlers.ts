import { http, HttpResponse } from "msw";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const defaultLinkedAccounts = [
  { id: "identity-google", provider: "google" },
  { id: "identity-discord", provider: "discord" },
];
let linkedAccounts = [...defaultLinkedAccounts];

export function resetMockState() {
  linkedAccounts = [...defaultLinkedAccounts];
}

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, async () =>
    HttpResponse.json({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresAt: "2030-01-01T00:00:00Z",
    }),
  ),
  http.post(`${API_BASE_URL}/auth/register`, async () =>
    HttpResponse.json({
      accessToken: "registered-access-token",
      refreshToken: "registered-refresh-token",
      tokenType: "Bearer",
      expiresAt: "2030-01-01T00:00:00Z",
    }),
  ),
  http.post(`${API_BASE_URL}/auth/refresh`, async () =>
    HttpResponse.json({
      accessToken: "rotated-access-token",
      refreshToken: "rotated-refresh-token",
      tokenType: "Bearer",
      expiresAt: "2030-01-01T00:00:00Z",
    }),
  ),
  http.post(
    `${API_BASE_URL}/auth/logout`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${API_BASE_URL}/auth/me`, async () =>
    HttpResponse.json({
      id: "user-1",
      name: "Quack User",
      email: "quack@example.com",
      roles: ["USER"],
      createdAt: "2026-01-01T00:00:00Z",
      accounts: linkedAccounts,
      spotifyConnection: null,
    }),
  ),
  http.put(
    `${API_BASE_URL}/auth/email`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.put(
    `${API_BASE_URL}/auth/password`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    `${API_BASE_URL}/auth/connections/:provider`,
    async ({ params }) => {
      linkedAccounts = linkedAccounts.filter(
        (account) => account.provider !== String(params.provider),
      );
      return new HttpResponse(null, { status: 204 });
    },
  ),
  http.get(
    `${API_BASE_URL}/auth/oauth/:provider/authorize`,
    async ({ params }) =>
      HttpResponse.json({
        provider: params.provider,
        state: `${params.provider}-oauth-state`,
        authorizationUrl: `https://accounts.example.com/${params.provider}/authorize`,
      }),
  ),
  http.get(`${API_BASE_URL}/auth/oauth/:provider/callback`, async () =>
    HttpResponse.json({
      accessToken: "social-access-token",
      refreshToken: "social-refresh-token",
      tokenType: "Bearer",
      expiresAt: "2030-01-01T00:00:00Z",
    }),
  ),
  http.get(`${API_BASE_URL}/auth/sessions`, async () =>
    HttpResponse.json({
      sessions: [
        {
          id: "session-1",
          userId: "user-1",
          createdAt: "2026-01-01T00:00:00Z",
          expiresAt: "2030-01-01T00:00:00Z",
          revoked: false,
          active: true,
        },
        {
          id: "session-2",
          userId: "user-1",
          createdAt: "2025-12-01T00:00:00Z",
          expiresAt: "2026-01-10T00:00:00Z",
          revoked: true,
          active: false,
        },
      ],
    }),
  ),
  http.post(
    `${API_BASE_URL}/auth/logout-all`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${API_BASE_URL}/pages`, async () =>
    HttpResponse.json([
      {
        id: "page-1",
        ownerId: "user-1",
        slug: "duck",
        title: "Duck Links",
        bio: "Bio",
        avatarUrl: null,
        theme: "dark",
        backgroundType: "COLOR",
        backgroundColor: "#111827",
        backgroundUrl: null,
        textColor: "#ffffff",
        iconColor: "#ffffff",
        buttonColor: "#f59e0b",
        layoutType: "stack",
        pageLayout: "standard",
        linkStyle: "solid",
        layoutLinkStyle: "column",
        showProfileCard: true,
        profileCardColor: "#111827",
        profileCardOpacity: 1,
        useStandardIconColors: false,
        glowEffect: "none",
        showViewCount: false,
        gradientDirection: null,
        gradientColorA: null,
        gradientColorB: null,
        backgroundVideoUrl: null,
        cursorUrl: null,
        titleEffect: "none",
        customCss: null,
        published: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ]),
  ),
  http.get(`${API_BASE_URL}/pages/me`, async () =>
    HttpResponse.json({
      id: "page-1",
      ownerId: "user-1",
      slug: "duck",
      title: "Duck Links",
      bio: "Bio",
      avatarUrl: null,
      theme: "dark",
      backgroundType: "COLOR",
      backgroundColor: "#111827",
      backgroundUrl: null,
      textColor: "#ffffff",
      iconColor: "#ffffff",
      buttonColor: "#f59e0b",
      layoutType: "stack",
      pageLayout: "standard",
      linkStyle: "solid",
      layoutLinkStyle: "column",
      showProfileCard: true,
      profileCardColor: "#111827",
      profileCardOpacity: 1,
      useStandardIconColors: false,
      glowEffect: "none",
      showViewCount: false,
      gradientDirection: null,
      gradientColorA: null,
      gradientColorB: null,
      backgroundVideoUrl: null,
      cursorUrl: null,
      titleEffect: "none",
      customCss: null,
      published: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    }),
  ),
  http.get(`${API_BASE_URL}/pages/:pageId`, async ({ params }) =>
    HttpResponse.json({
      id: params.pageId,
      ownerId: "user-1",
      slug: "duck",
      title: "Duck Links",
      bio: "Bio",
      avatarUrl: null,
      theme: "dark",
      backgroundType: "COLOR",
      backgroundColor: "#111827",
      backgroundUrl: null,
      textColor: "#ffffff",
      iconColor: "#ffffff",
      buttonColor: "#f59e0b",
      layoutType: "stack",
      pageLayout: "standard",
      linkStyle: "solid",
      layoutLinkStyle: "column",
      showProfileCard: true,
      profileCardColor: "#111827",
      profileCardOpacity: 1,
      useStandardIconColors: false,
      glowEffect: "none",
      showViewCount: false,
      gradientDirection: null,
      gradientColorA: null,
      gradientColorB: null,
      backgroundVideoUrl: null,
      cursorUrl: null,
      titleEffect: "none",
      customCss: null,
      published: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    }),
  ),
  http.get(`${API_BASE_URL}/pages/:pageId/blocks`, async ({ params }) =>
    HttpResponse.json([
      {
        id: "block-1",
        pageId: params.pageId,
        type: "LINK",
        title: "Meu site",
        textContent: null,
        url: "https://example.com",
        content: {
          title: "Meu site",
          url: "https://example.com",
        },
        displayOrder: 0,
        visible: true,
      },
    ]),
  ),
  http.get(`${API_BASE_URL}/pages/:pageId/audios`, async ({ params }) =>
    HttpResponse.json([
      {
        id: "audio-1",
        pageId: params.pageId,
        title: "Track",
        url: "https://audio.example.com/track.mp3",
        type: "DIRECT",
        coverUrl: null,
        active: true,
        displayOrder: 0,
      },
    ]),
  ),
  http.get(`${API_BASE_URL}/public/pages/:slug`, async ({ params }) =>
    HttpResponse.json({
      page: {
        id: "public-page-1",
        ownerId: "user-2",
        slug: params.slug,
        title: "Public Duck",
        bio: "Public bio",
        avatarUrl: null,
        theme: "dark",
        backgroundType: "COLOR",
        backgroundColor: "#111827",
        backgroundUrl: null,
        textColor: "#ffffff",
        iconColor: "#ffffff",
        buttonColor: "#f59e0b",
        layoutType: "stack",
        pageLayout: "standard",
        linkStyle: "solid",
        layoutLinkStyle: "column",
        showProfileCard: true,
        profileCardColor: "#111827",
        profileCardOpacity: 1,
        useStandardIconColors: false,
        glowEffect: "none",
        showViewCount: false,
        gradientDirection: null,
        gradientColorA: null,
        gradientColorB: null,
        backgroundVideoUrl: null,
        cursorUrl: null,
        titleEffect: "none",
        customCss: null,
        published: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      blocks: [
        {
          id: "public-block-1",
          pageId: "public-page-1",
          type: "LINK",
          title: "Portfolio",
          textContent: null,
          url: "https://portfolio.example.com",
          content: {
            title: "Portfolio",
            url: "https://portfolio.example.com",
          },
          displayOrder: 0,
          visible: true,
        },
      ],
      audios: [],
    }),
  ),
  http.get(`${API_BASE_URL}/public/templates`, async () =>
    HttpResponse.json({
      templates: [
        {
          id: "template-1",
          creatorId: "user-1",
          creatorName: "Quack User",
          name: "Dark Duck",
          previewImageUrl: "https://cdn.example.com/template-dark-duck.png",
          tags: ["dark", "creator"],
          visibility: "PUBLIC",
          blockCount: 3,
          favoriteCount: 12,
          favorited: false,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      ],
      total: 1,
      page: 1,
      limit: 12,
    }),
  ),
  http.get(`${API_BASE_URL}/public/templates/recent`, async () =>
    HttpResponse.json([
      {
        id: "template-1",
        creatorId: "user-1",
        creatorName: "Quack User",
        name: "Dark Duck",
        previewImageUrl: "https://cdn.example.com/template-dark-duck.png",
        tags: ["dark", "creator"],
        visibility: "PUBLIC",
        blockCount: 3,
        favoriteCount: 12,
        favorited: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-02T00:00:00Z",
      },
    ]),
  ),
  http.get(`${API_BASE_URL}/public/templates/tags/popular`, async () =>
    HttpResponse.json([
      { name: "dark", usageCount: 5 },
      { name: "creator", usageCount: 3 },
    ]),
  ),
  http.get(`${API_BASE_URL}/public/templates/:templateId`, async ({ params }) =>
    HttpResponse.json({
      id: params.templateId,
      creatorId: "user-1",
      creatorName: "Quack User",
      name: "Dark Duck",
      previewImageUrl: "https://cdn.example.com/template-dark-duck.png",
      tags: ["dark", "creator"],
      visibility: "PUBLIC",
      pageSnapshot: {
        title: "Duck Links",
        bio: "Bio",
      },
      blockSnapshots: [],
      audioSnapshots: [],
      favoriteCount: 12,
      favorited: false,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    }),
  ),
  http.get(`${API_BASE_URL}/templates/mine`, async () =>
    HttpResponse.json([
      {
        id: "template-1",
        creatorId: "user-1",
        creatorName: "Quack User",
        name: "Dark Duck",
        previewImageUrl: "https://cdn.example.com/template-dark-duck.png",
        tags: ["dark", "creator"],
        visibility: "PUBLIC",
        blockCount: 3,
        favoriteCount: 12,
        favorited: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-02T00:00:00Z",
      },
    ]),
  ),
  http.get(`${API_BASE_URL}/templates/favorites`, async () =>
    HttpResponse.json([
      {
        id: "template-2",
        creatorId: "user-2",
        creatorName: "Creator Two",
        name: "Bright Duck",
        previewImageUrl: "https://cdn.example.com/template-bright-duck.png",
        tags: ["bright"],
        visibility: "PUBLIC",
        blockCount: 2,
        favoriteCount: 8,
        favorited: true,
        createdAt: "2026-01-03T00:00:00Z",
        updatedAt: "2026-01-04T00:00:00Z",
      },
    ]),
  ),
  http.post(`${API_BASE_URL}/templates/:templateId/apply`, async () =>
    HttpResponse.json({
      pageId: "page-1",
      appliedBlockCount: 3,
      appliedAudioCount: 0,
    }),
  ),
  http.post(`${API_BASE_URL}/templates`, async ({ request }) => {
    const body = (await request.json()) as {
      pageId: string;
      name: string;
      previewImageUrl: string;
      tags: string[];
      visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
    };

    return HttpResponse.json(
      {
        id: "template-created",
        creatorId: "user-1",
        creatorName: "Quack User",
        name: body.name,
        previewImageUrl: body.previewImageUrl,
        tags: body.tags,
        visibility: body.visibility,
        pageSnapshot: {
          title: "Duck Links",
        },
        blockSnapshots: [],
        audioSnapshots: [],
        favoriteCount: 0,
        favorited: false,
        createdAt: "2026-01-05T00:00:00Z",
        updatedAt: "2026-01-05T00:00:00Z",
      },
      { status: 201 },
    );
  }),
  http.put(
    `${API_BASE_URL}/templates/:templateId`,
    async ({ params, request }) => {
      const body = (await request.json()) as {
        name: string;
        previewImageUrl: string;
        tags: string[];
        visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
      };

      return HttpResponse.json({
        id: params.templateId,
        creatorId: "user-1",
        creatorName: "Quack User",
        name: body.name,
        previewImageUrl: body.previewImageUrl,
        tags: body.tags,
        visibility: body.visibility,
        pageSnapshot: {
          title: "Duck Links",
        },
        blockSnapshots: [],
        audioSnapshots: [],
        favoriteCount: 12,
        favorited: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-06T00:00:00Z",
      });
    },
  ),
  http.delete(
    `${API_BASE_URL}/templates/:templateId`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.post(
    `${API_BASE_URL}/templates/:templateId/favorite`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    `${API_BASE_URL}/templates/:templateId/favorite`,
    async () => new HttpResponse(null, { status: 204 }),
  ),
  http.get(`${API_BASE_URL}/analytics/me`, async () =>
    HttpResponse.json({
      pageId: "page-1",
      slug: "duck",
      totalViews: 120,
      totalClicks: 45,
      clickThroughRate: 37.5,
      topBlocks: [
        { blockId: "block-1", title: "Meu site", clicks: 30 },
        { blockId: "block-2", title: "Canal", clicks: 15 },
      ],
      topReferrers: [
        { source: "direct", views: 70 },
        { source: "instagram.com", views: 25 },
      ],
    }),
  ),
  http.post(`${API_BASE_URL}/uploads/signed-url`, async () =>
    HttpResponse.json({
      assetId: "asset-1",
      assetStatus: "PENDING",
      signedUrl: "https://upload.example.com/signed-put",
      finalFileUrl: "https://cdn.example.com/file.png",
    }),
  ),
  http.post(
    `${API_BASE_URL}/uploads/assets/:assetId/complete`,
    async ({ params }) =>
      HttpResponse.json({
        id: params.assetId,
        fileUrl: "https://cdn.example.com/file.png",
        status: "READY",
      }),
  ),
  http.get(`${API_BASE_URL}/spotify/connection`, async () =>
    HttpResponse.json({
      status: "CONNECTED",
      spotifyUserId: "spotify-user-1",
      spotifyUserName: "Duck Listener",
      spotifyUserEmail: "duck@spotify.example",
      avatarUrl: "https://images.example.com/spotify-avatar.png",
      profileUrl: "https://open.spotify.com/user/duck",
      country: "BR",
      product: "premium",
      followersTotal: 123,
      lastSyncedAt: "2026-01-01T00:00:00Z",
    }),
  ),
  http.get(`${API_BASE_URL}/spotify/authorize`, async () =>
    HttpResponse.json({
      authorizationUrl: "https://accounts.spotify.com/authorize?client_id=test",
    }),
  ),
  http.get(`${API_BASE_URL}/spotify/callback`, async () =>
    HttpResponse.json({
      status: "CONNECTED",
      spotifyUserId: "spotify-user-1",
      spotifyUserName: "Duck Listener",
      spotifyUserEmail: "duck@spotify.example",
      avatarUrl: "https://images.example.com/spotify-avatar.png",
      profileUrl: "https://open.spotify.com/user/duck",
      country: "BR",
      product: "premium",
      followersTotal: 123,
      lastSyncedAt: "2026-01-01T00:00:00Z",
    }),
  ),
  http.post(`${API_BASE_URL}/spotify/sync`, async () =>
    HttpResponse.json({
      status: "CONNECTED",
      spotifyUserId: "spotify-user-1",
      spotifyUserName: "Duck Listener",
      spotifyUserEmail: "duck@spotify.example",
      avatarUrl: "https://images.example.com/spotify-avatar.png",
      profileUrl: "https://open.spotify.com/user/duck",
      country: "BR",
      product: "premium",
      followersTotal: 123,
      lastSyncedAt: "2026-01-01T00:00:00Z",
    }),
  ),
];
