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
import { usersTable } from '@/db/schema';

const devNavData = {
	user: {
		name: 'Engineer',
		email: 'engineer@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Challenges',
			url: '#',
			isActive: true,
			icon: Terminal,
			items: [
				{
					title: 'All',
					url: '#',
				},
				{
					title: 'My Challenges',
					url: '#',
					items: [
						{
							title: 'Ongoing',
							url: '#',
						},
						{
							title: 'Completed',
							url: '#',
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
					url: '#',
				},
				{
					title: 'Settings',
					url: '#',
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
	user: {
		name: 'Company Admin',
		email: 'company_admin@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Challenge',
			url: '#',
			isActive: true,
			icon: CodeXml,
			items: [
				{
					title: 'Generate',
					icon: Terminal,
					url: '#',
				},
				{
					title: 'Published',
					icon: ScreenShare,
					url: '#',
				},
				{
					title: 'Candidates',
					icon: UserPen,
					url: '#',
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
					url: '#',
				},
				{
					title: 'Company Profile',
					icon: Building2,
					url: '#',
				},
				{
					title: 'Members',
					icon: ContactRound,
					url: '#',
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
	console.log('currentUser', currentUser.role);
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
				<NavUser user={currentUser.role === 'engineer' ? devNavData.user : companyNavData.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
