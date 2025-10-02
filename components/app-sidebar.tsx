'use client';

import * as React from 'react';
import {
	BookOpen,
	Command,
	LayoutDashboardIcon,
	Send,
	Terminal,
	CodeXml,
	Bug,
	InfoIcon,
	User,
	ScreenShare,
	UserPen,
	Building2,
	ContactRound,
	BadgeCheck,
	Sparkles,
	LaptopMinimalCheck,
	Settings,
	SquareTerminal,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usersTable } from '@/db/schema/users';

const devNavData = {
	navMain: [
		{
			title: 'Challenges',
			url: '/challenge',
			icon: Sparkles,
			items: [
				{
					title: 'All',
					icon: LaptopMinimalCheck,
					url: '/challenge/challenge-board',
				},
				{
					title: 'My Challenges',
					url: '/challenge/my-challenges',
					items: [
						{
							title: 'Ongoing',
							icon: SquareTerminal,
							url: '/challenge/my-challenges/ongoing',
						},
						{
							title: 'Completed',
							icon: BadgeCheck,
							url: '/challenge/my-challenges/completed',
						},
					],
				},
			],
		},
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboardIcon,
			items: [
				{
					title: 'Profile',
					icon: User,
					url: '/dashboard/profile',
				},
				{
					title: 'Settings',
					icon: Settings,
					url: '/dashboard/settings',
				},
			],
		},
		{
			title: 'Documentation',
			url: '#',
			icon: BookOpen,
			items: [
				{
					title: 'Introduction',
					url: '#',
				},
				{
					title: 'Get Started',
					url: '#',
				},
				{
					title: 'Tutorials',
					url: '#',
				},
				{
					title: 'Changelog',
					url: '#',
				},
			],
		},
		{
			// todo: add resources like blog posts, videos, links, etc.??
			title: 'Resources',
			url: '#',
			icon: InfoIcon,
			items: [
				{
					title: 'Introduction',
					url: '#',
				},
				{
					title: 'Get Started',
					url: '#',
				},
				{
					title: 'Tutorials',
					url: '#',
				},
				{
					title: 'Changelog',
					url: '#',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Bug Report',
			url: '#',
			icon: Bug,
		},
		{
			title: 'Feature Request',
			url: '#',
			icon: Send,
		},
	],
};

const companyNavData = {
	navMain: [
		{
			title: 'Challenge',
			url: '/challenge',
			icon: Sparkles,
			items: [
				{
					title: 'Generate',
					icon: CodeXml,
					url: '/challenge/generate',
				},
				{
					title: 'Published',
					icon: ScreenShare,
					url: '/challenge/published',
				},
			],
		},
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboardIcon,
			items: [
				{
					title: 'Profile',
					icon: User,
					url: '/dashboard/user-profile',
				},
				{
					title: 'Company Profile',
					icon: Building2,
					url: '/dashboard/company-profile',
				},
				{
					title: 'Members',
					icon: ContactRound,
					url: '/dashboard/members',
				},
			],
		},
		{
			title: 'Documentation',
			url: '#',
			icon: BookOpen,
			items: [
				{
					title: 'Introduction',
					url: '#',
				},
				{
					title: 'Get Started',
					url: '#',
				},
				{
					title: 'Tutorials',
					url: '#',
				},
				{
					title: 'Changelog',
					url: '#',
				},
			],
		},
		{
			// todo: add resources like blog posts, videos, links, etc.??
			title: 'Resources',
			url: '#',
			icon: InfoIcon,
			items: [
				{
					title: 'Introduction',
					url: '#',
				},
				{
					title: 'Get Started',
					url: '#',
				},
				{
					title: 'Tutorials',
					url: '#',
				},
				{
					title: 'Changelog',
					url: '#',
				},
			],
		},
	],
	navSecondary: [
		{
			title: 'Bug Report',
			url: '#',
			icon: Bug,
		},
		{
			title: 'Feature Request',
			url: '#',
			icon: Send,
		},
	],
};

export function AppSidebar({
	currentUser,
}: React.ComponentProps<typeof Sidebar> & { currentUser: typeof usersTable.$inferSelect }) {
	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{currentUser.username}</span>
									<span className="truncate text-xs">{currentUser.role}</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={currentUser.role === 'engineer' ? devNavData.navMain : companyNavData.navMain} />
				<NavSecondary
					items={currentUser.role === 'engineer' ? devNavData.navSecondary : companyNavData.navSecondary}
					className="mt-auto"
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={currentUser} />
			</SidebarFooter>
		</Sidebar>
	);
}
