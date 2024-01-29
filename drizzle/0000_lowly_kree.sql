CREATE TABLE `guilds` (
	`id` integer PRIMARY KEY NOT NULL,
	`guildId` text NOT NULL,
	`guildOwnerId` text NOT NULL,
	`logChannelId` text,
	`ownerRoleId` text,
	`name` text NOT NULL,
	`disabledCommands` text
);
--> statement-breakpoint
CREATE TABLE `dndEntries` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`enabled` integer NOT NULL,
	`createdOn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guilds_guildId_unique` ON `guilds` (`guildId`);--> statement-breakpoint
CREATE UNIQUE INDEX `dndEntries_userId_unique` ON `dndEntries` (`userId`);