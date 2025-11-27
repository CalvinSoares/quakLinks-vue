import {
  BrandGithubIcon,
  BrandYoutubeIcon,
  BrandDiscordIcon,
  BrandInstagramIcon,
  BrandTwitterIcon,
  BrandTiktokIcon,
  BrandTwitchIcon,
  BrandSpotifyIcon,
  BrandSnapchatIcon,
  BrandTelegramIcon,
  BrandLinkedinIcon,
  LinkIcon,
} from "vue-tabler-icons";

export interface Social {
  name: string;
  icon: any; // Vue component
  placeholder: string;
}

export const socialProfiles: Social[] = [
  { name: "GitHub", icon: BrandGithubIcon, placeholder: "github.com/username" },
  {
    name: "Discord",
    icon: BrandDiscordIcon,
    placeholder: "discord.gg/invitecode",
  },
  {
    name: "YouTube",
    icon: BrandYoutubeIcon,
    placeholder: "youtube.com/channel/...",
  },
  {
    name: "Instagram",
    icon: BrandInstagramIcon,
    placeholder: "instagram.com/username",
  },
  {
    name: "X (Twitter)",
    icon: BrandTwitterIcon,
    placeholder: "x.com/username",
  },
  {
    name: "TikTok",
    icon: BrandTiktokIcon,
    placeholder: "tiktok.com/@username",
  },
  { name: "Twitch", icon: BrandTwitchIcon, placeholder: "twitch.tv/username" },
  {
    name: "Spotify",
    icon: BrandSpotifyIcon,
    placeholder: "open.spotify.com/user/...",
  },
  { name: "Telegram", icon: BrandTelegramIcon, placeholder: "t.me/username" },
  {
    name: "LinkedIn",
    icon: BrandLinkedinIcon,
    placeholder: "linkedin.com/in/username",
  },
  {
    name: "Snapchat",
    icon: BrandSnapchatIcon,
    placeholder: "snapchat.com/add/username",
  },
];

export const customLinkSocial: Social = {
  name: "URL Customizada",
  icon: LinkIcon,
  placeholder: "seusite.com/link",
};
