'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
    items,
}: {
    items: Array<{
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: Array<{
            title: string;
            url: string;
            icon?: LucideIcon;
            items?: Array<{
                title: string;
                url: string;
                icon?: LucideIcon;
            }>;
        }>;
    }>;
}) {
    const pathname = usePathname();

    // Helper function to check if a URL is active
    const isActive = (url: string) => {
        if (url === '#') return false; // Don't mark placeholder URLs as active
        return pathname === url || pathname.startsWith(url + '/');
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const itemIsActive = isActive(item.url);
                    const hasActiveChild = item.items?.some((subItem) => {
                        return (
                            isActive(subItem.url) ||
                            subItem.items?.some((subSubItem) => {
                                return isActive(subSubItem.url);
                            })
                        );
                    });
                    const shouldBeOpen = itemIsActive || hasActiveChild;

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={shouldBeOpen}
                        >
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={itemIsActive}
                                    className={`sidebar-menu-button ${
                                        itemIsActive
                                            ? 'bg-[color-mix(in_oklab,var(--color-primary)_20%,var(--color-surface))] text-black border-l-2 border-[var(--color-primary)] shadow-sm'
                                            : 'hover:bg-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-surface))] hover:text-[var(--color-text)]'
                                    }`}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className='data-[state=open]:rotate-90'>
                                                <ChevronRight />
                                                <span className='sr-only'>
                                                    Toggle
                                                </span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => {
                                                    const subItemIsActive =
                                                        isActive(subItem.url);
                                                    const hasActiveSubChild =
                                                        subItem.items?.some(
                                                            (subSubItem) => {
                                                                return isActive(
                                                                    subSubItem.url,
                                                                );
                                                            },
                                                        );
                                                    const shouldBeOpen =
                                                        subItemIsActive ||
                                                        hasActiveSubChild;

                                                    return (
                                                        <Collapsible
                                                            key={`${item.title}-${subItem.title}`}
                                                            asChild
                                                            defaultOpen={
                                                                shouldBeOpen
                                                            }
                                                        >
                                                            <SidebarMenuSubItem>
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={
                                                                        subItemIsActive
                                                                    }
                                                                    className={`sidebar-sub-menu-button ${
                                                                        subItemIsActive
                                                                            ? 'bg-[color-mix(in_oklab,var(--color-primary)_15%,var(--color-surface))] text-black border-l-2 border-[var(--color-primary)] shadow-sm'
                                                                            : 'hover:bg-[color-mix(in_oklab,var(--color-primary)_8%,var(--color-surface))] hover:text-[var(--color-text)]'
                                                                    }`}
                                                                >
                                                                    <Link
                                                                        href={
                                                                            subItem.url
                                                                        }
                                                                    >
                                                                        {subItem.icon && (
                                                                            <subItem.icon />
                                                                        )}
                                                                        <span>
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                                {subItem.items
                                                                    ?.length ? (
                                                                    <>
                                                                        <CollapsibleTrigger
                                                                            asChild
                                                                        >
                                                                            <SidebarMenuAction className='data-[state=open]:rotate-90'>
                                                                                <ChevronRight />
                                                                                <span className='sr-only'>
                                                                                    Toggle
                                                                                </span>
                                                                            </SidebarMenuAction>
                                                                        </CollapsibleTrigger>
                                                                        <CollapsibleContent>
                                                                            <SidebarMenuSub>
                                                                                {subItem.items?.map(
                                                                                    (
                                                                                        subSubItem,
                                                                                    ) => {
                                                                                        const subSubItemIsActive =
                                                                                            isActive(
                                                                                                subSubItem.url,
                                                                                            );
                                                                                        return (
                                                                                            <SidebarMenuSubItem
                                                                                                key={
                                                                                                    subSubItem.title
                                                                                                }
                                                                                            >
                                                                                                <SidebarMenuSubButton
                                                                                                    asChild
                                                                                                    isActive={
                                                                                                        subSubItemIsActive
                                                                                                    }
                                                                                                    className={`sidebar-sub-menu-button ${
                                                                                                        subSubItemIsActive
                                                                                                            ? 'bg-[color-mix(in_oklab,var(--color-primary)_12%,var(--color-surface))] text-black border-l-2 border-[var(--color-primary)] shadow-sm'
                                                                                                            : 'hover:bg-[color-mix(in_oklab,var(--color-primary)_6%,var(--color-surface))] hover:text-[var(--color-text)]'
                                                                                                    }`}
                                                                                                >
                                                                                                    <Link
                                                                                                        href={
                                                                                                            subSubItem.url
                                                                                                        }
                                                                                                    >
                                                                                                        {subSubItem.icon && (
                                                                                                            <subSubItem.icon />
                                                                                                        )}
                                                                                                        <span>
                                                                                                            {
                                                                                                                subSubItem.title
                                                                                                            }
                                                                                                        </span>
                                                                                                    </Link>
                                                                                                </SidebarMenuSubButton>
                                                                                            </SidebarMenuSubItem>
                                                                                        );
                                                                                    },
                                                                                )}
                                                                            </SidebarMenuSub>
                                                                        </CollapsibleContent>
                                                                    </>
                                                                ) : null}
                                                            </SidebarMenuSubItem>
                                                        </Collapsible>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
