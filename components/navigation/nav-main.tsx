'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
                                            ? 'bg-cyan-100/80 text-cyan-700 border-l-2 border-cyan-400 shadow-sm'
                                            : 'hover:bg-gray-100/60'
                                    }`}
                                >
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
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
                                                                            ? 'bg-cyan-50/80 text-cyan-600 border-l-2 border-cyan-300 shadow-sm'
                                                                            : 'hover:bg-gray-50/80'
                                                                    }`}
                                                                >
                                                                    <a
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
                                                                    </a>
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
                                                                                                            ? 'bg-cyan-50/60 text-cyan-500 border-l-2 border-cyan-200 shadow-sm'
                                                                                                            : 'hover:bg-gray-50/60'
                                                                                                    }`}
                                                                                                >
                                                                                                    <a
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
                                                                                                    </a>
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
