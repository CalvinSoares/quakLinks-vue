export interface AvatarSource {
  name?: string | null;
  userImage?: string | null;
  pageAvatarUrl?: string | null;
}

export function buildAvatarFallback(name?: string | null) {
  const safeName = encodeURIComponent(name?.trim() || "User");
  return `https://ui-avatars.com/api/?name=${safeName}&background=fbbd24&color=1e293b&bold=true`;
}

export function resolveAvatarUrl(source: AvatarSource) {
  if (source.pageAvatarUrl) {
    return source.pageAvatarUrl;
  }

  if (source.userImage) {
    return source.userImage;
  }

  return buildAvatarFallback(source.name);
}

export function hasCustomAvatar(source: AvatarSource) {
  return Boolean(source.userImage || source.pageAvatarUrl);
}
