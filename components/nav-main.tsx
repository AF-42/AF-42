'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
			icon?: LucideIcon;
			items?: {
				title: string;
				url: string;
				icon?: LucideIcon;
			}[];
		}[];
	}[];
}) {
	const pathname = usePathname();

	// Helper function to check if a URL is active
	const isActive = (url: string) => {
		return pathname === url || pathname.startsWith(url + '/');
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const itemIsActive = isActive(item.url);
					const hasActiveChild = item.items?.some(
						(subItem) =>
							isActive(subItem.url) || subItem.items?.some((subSubItem) => isActive(subSubItem.url)),
					);
					const shouldBeOpen = itemIsActive || hasActiveChild;

					return (
						<Collapsible key={item.title} asChild defaultOpen={shouldBeOpen}>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={itemIsActive}
									className={itemIsActive ? 'bg-sidebar-accent/60 hover:bg-sidebar-accent/80' : ''}
								>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="data-[state=open]:rotate-90">
												<ChevronRight />
												<span className="sr-only">Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem) => {
													const subItemIsActive = isActive(subItem.url);
													const hasActiveSubChild = subItem.items?.some((subSubItem) =>
														isActive(subSubItem.url),
													);
													const shouldBeOpen = subItemIsActive || hasActiveSubChild;

													return (
														<Collapsible
															key={`${item.title}-${subItem.title}`}
															asChild
															defaultOpen={shouldBeOpen}
														>
															<SidebarMenuSubItem>
																<SidebarMenuSubButton
																	asChild
																	isActive={subItemIsActive}
																	className={
																		subItemIsActive
																			? 'bg-sidebar-accent/50 hover:bg-sidebar-accent/70'
																			: ''
																	}
																>
																	<a href={subItem.url}>
																		{subItem.icon && <subItem.icon />}
																		<span>{subItem.title}</span>
																	</a>
																</SidebarMenuSubButton>
																{subItem.items?.length ? (
																	<>
																		<CollapsibleTrigger asChild>
																			<SidebarMenuAction className="data-[state=open]:rotate-90">
																				<ChevronRight />
																				<span className="sr-only">Toggle</span>
																			</SidebarMenuAction>
																		</CollapsibleTrigger>
																		<CollapsibleContent>
																			<SidebarMenuSub>
																				{subItem.items?.map((subSubItem) => {
																					const subSubItemIsActive = isActive(
																						subSubItem.url,
																					);
																					return (
																						<SidebarMenuSubItem
																							key={subSubItem.title}
																						>
																							<SidebarMenuSubButton
																								asChild
																								isActive={
																									subSubItemIsActive
																								}
																								className={
																									subSubItemIsActive
																										? 'bg-sidebar-accent/40 hover:bg-sidebar-accent/60'
																										: ''
																								}
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
																				})}
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
