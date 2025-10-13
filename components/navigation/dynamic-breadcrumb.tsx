'use client';

import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbItem = {
    label: string;
    href?: string;
};

const pathToBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    '/dashboard': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
    ],
    '/dashboard/profile': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        { label: 'Profile' },
    ],
    '/dashboard/settings': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        { label: 'Settings' },
    ],
    '/dashboard/company-profile': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        { label: 'Company Profile' },
    ],
    '/dashboard/members': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        { label: 'Members' },
    ],
    '/dashboard/user-profile': [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        { label: 'User Profile' },
    ],
    '/challenge': [
        {
            label: 'Challenges',
            href: '/challenge/all',
        },
    ],
    '/challenge/challenge-board': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        { label: 'Challenge Board' },
    ],
    '/challenge/my-challenges': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        { label: 'My Challenges' },
    ],
    '/challenge/my-challenges/ongoing': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        {
            label: 'My Challenges',
            href: '/challenge/my-challenges',
        },
        { label: 'Ongoing' },
    ],
    '/challenge/my-challenges/completed': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        {
            label: 'My Challenges',
            href: '/challenge/my-challenges',
        },
        { label: 'Completed' },
    ],

    '/challenge/generate': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        { label: 'Generate Challenge' },
    ],
    '/challenge/published': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        { label: 'Published Challenges' },
    ],
    '/challenge/candidates': [
        {
            label: 'Challenges',
            href: '/challenge',
        },
        { label: 'Candidates' },
    ],
};

// Helper function to generate breadcrumbs dynamically for unknown paths
function generateDynamicBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Build breadcrumbs from path segments
    for (let i = 0; i < segments.length; i++) {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const segment = segments[i];

        // Convert segment to readable label
        const label = segment
            .split('-')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');

        // Only add href if it's not the last segment
        const href = i < segments.length - 1 ? path : undefined;

        breadcrumbs.push({
            label,
            href,
        });
    }

    return breadcrumbs;
}

export function DynamicBreadcrumb() {
    const pathname = usePathname();

    // Try to get predefined breadcrumbs first
    let breadcrumbs = pathToBreadcrumbs[pathname];

    // If no predefined breadcrumbs, generate them dynamically
    breadcrumbs ||= generateDynamicBreadcrumbs(pathname);

    // Fallback to dashboard if no breadcrumbs can be generated
    if (!breadcrumbs || breadcrumbs.length === 0) {
        breadcrumbs = [
            {
                label: 'Dashboard',
                href: '/dashboard',
            },
        ];
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => {
                    return (
                        <div key={index} className='flex items-center'>
                            <BreadcrumbItem
                                className={index === 0 ? 'hidden md:block' : ''}
                            >
                                {item.href ? (
                                    <BreadcrumbLink href={item.href}>
                                        {item.label}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>
                                        {item.label}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator className='hidden md:block' />
                            )}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
