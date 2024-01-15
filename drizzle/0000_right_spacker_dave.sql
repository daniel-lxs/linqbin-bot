CREATE TABLE `guilds` (
	`id` integer PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`guildOwnerId` text NOT NULL,
	`logChannelId` text,
	`ownerRoleId` text,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_guildId_unique` ON `guilds` (`guildId`);