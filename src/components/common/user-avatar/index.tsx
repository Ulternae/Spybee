import type { ComponentProps } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface UserAvatarProps extends Omit<ComponentProps<typeof Avatar>, "children"> {
  name: string;
  image?: string | null;
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.at(0)?.toUpperCase())
    .join("");
};

const UserAvatar = ({ name, image, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export { UserAvatar, getUserInitials };
export type { UserAvatarProps };
