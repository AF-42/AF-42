'use client';

import * as React from 'react';
import {
    BadgeCheck,
    BookOpen,
    Bug,
    Building2,
    CodeXml,
    Command,
    ContactRound,
    FolderCode,
    LaptopMinimalCheck,
    LayoutDashboardIcon,
    Send,
    Settings,
    Sparkles,
    SquareTerminal,
    User,
    ChevronRight,
    Crown,
    Zap,
} from 'lucide-react';
import { NavMain, NavSecondary, NavUser } from '@/components/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { type usersTable } from '@/db/schema/users';
// Import * as print from '@/lib/print-helpers';

export function AppSidebar({
    currentUser,
}: React.ComponentProps<typeof Sidebar> & {
    currentUser: typeof usersTable.$inferSelect;
}) {
    const { username } = currentUser;
    const devNavData = {
        navMain: [
            {
                title: 'Challenges',
                url: '/challenge',
                icon: Sparkles,
                badge: 'New',
                items: [
                    {
                        title: 'All Challenges',
                        icon: LaptopMinimalCheck,
                        url: '/challenge/challenge-board',
                        description: 'Browse all available challenges',
                    },
                    {
                        title: 'My Challenges',
                        url: '/challenge/my-challenges',
                        icon: User,
                        items: [
                            {
                                title: 'Ongoing',
                                icon: SquareTerminal,
                                url: '/challenge/my-challenges/ongoing',
                                badge: '3',
                            },
                            {
                                title: 'Completed',
                                icon: BadgeCheck,
                                url: '/challenge/my-challenges/completed',
                                badge: '12',
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
                title: 'Resources',
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
                url: '/challenge/all',
                icon: Crown,
                badge: 'Pro',
                items: [
                    {
                        title: 'Generate Challenge',
                        icon: CodeXml,
                        url: '/challenge/generate',
                        description: 'Create new challenges',
                    },
                    {
                        title: 'All Challenges',
                        icon: FolderCode,
                        url: '/challenge/all',
                        badge: '24',
                    },
                ],
            },
            {
                title: 'Dashboard',
                url: `/dashboard/user-profile/${username}`,
                icon: LayoutDashboardIcon,
                items: [
                    {
                        title: 'Profile',
                        icon: User,
                        url: `/dashboard/user-profile/${username}`,
                    },
                    {
                        title: 'Company Profile',
                        icon: Building2,
                        url: '/dashboard/company-profile',
                    },
                    {
                        title: 'Team Members',
                        icon: ContactRound,
                        url: '/dashboard/members',
                        badge: '8',
                    },
                ],
            },
            {
                title: 'Resources',
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
    return (
        <Sidebar
            variant='inset'
            className='border-r border-gray-200/60 bg-white shadow-sm'
        >
            <SidebarHeader className='border-b border-gray-200/60 bg-gradient-to-br from-white via-gray-50/80 to-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.04),transparent_50%)]'></div>
                <SidebarMenu className='relative z-10'>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size='lg'
                            asChild
                            className='hover:bg-gray-100/60 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]'
                        >
                            <a href='#' className='group'>
                                <div className='bg-gradient-to-br from-cyan-400 to-cyan-600 text-black flex aspect-square size-10 items-center justify-center rounded-xl shadow-lg group-hover:shadow-cyan-400/30 group-hover:shadow-xl group-hover:scale-105 transition-all duration-200'>
                                    <Command className='size-5 group-hover:rotate-12 transition-transform duration-200' />
                                </div>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold text-gray-900 font-source-code-pro'>
                                        {currentUser.username}
                                    </span>
                                    <div className='flex items-center gap-2'>
                                        <Badge
                                            variant='outline'
                                            className='text-xs px-2 py-0.5 h-5 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400/70 hover:shadow-sm transition-all duration-200 hover:scale-105'
                                        >
                                            {currentUser.role === 'engineer' ? (
                                                <>
                                                    <Zap className='size-3 mr-1' />
                                                    Engineer
                                                </>
                                            ) : (
                                                <>
                                                    <Crown className='size-3 mr-1' />
                                                    Company
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className='px-2 py-4 bg-white/95 backdrop-blur-sm flex flex-col'>
                <div className='flex-1'>
                    <NavMain
                        items={
                            currentUser.role === 'engineer'
                                ? devNavData.navMain
                                : companyNavData.navMain
                        }
                    />
                </div>
                <div className='mt-auto'>
                    <NavSecondary
                        items={
                            currentUser.role === 'engineer'
                                ? devNavData.navSecondary
                                : companyNavData.navSecondary
                        }
                    />
                </div>
            </SidebarContent>
            <SidebarFooter className='border-t border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/95 backdrop-blur-sm p-2 shadow-sm'>
                <NavUser user={currentUser} />
            </SidebarFooter>
        </Sidebar>
    );
}
