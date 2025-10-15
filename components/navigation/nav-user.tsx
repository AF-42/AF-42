'use client';

// ! todo : make sure to link menu items to the kinde api to process upgrades and billing and etc.

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { type usersTable } from '@/db/schema/users';

export function NavUser({ user }: { user: typeof usersTable.$inferSelect }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-[color-mix(in_oklab,var(--color-primary)_15%,var(--color-surface))] data-[state=open]:text-white hover:bg-[color-mix(in_oklab,var(--color-primary)_10%,var(--color-surface))] hover:text-[var(--color-text)] transition-all duration-200'
                        >
                            <Avatar className='h-8 w-8 rounded-lg'>
                                {/* todo: add avatar image */}
                                {/* <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} /> */}
                                <AvatarFallback className='rounded-lg'>
                                    {user.first_name.charAt(0) +
                                        user.last_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-medium'>
                                    {user.first_name + ' ' + user.last_name}
                                </span>
                                <span className='truncate text-xs'>
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        side={isMobile ? 'bottom' : 'right'}
                        align='end'
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='p-0 font-normal'>
                            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    {/* <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} /> */}
                                    <AvatarFallback className='rounded-lg'>
                                        {user.first_name.charAt(0) +
                                            user.last_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-medium'>
                                        {user.first_name + ' ' + user.last_name}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogoutLink postLogoutRedirectURL='/home'>
                                <Button className='hover:text-amber-900 hover:cursor-pointer transition-all duration-300'>
                                    <LogOut />
                                    Sign Out
                                </Button>
                            </LogoutLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
