'use client';

import { useEffect, useState } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    UserPlus,
    Shield,
    Mail,
    Calendar,
    Building2,
    Crown,
    UserCheck,
} from 'lucide-react';

type CompanyMember = {
    member: {
        id: string;
        company_id: string;
        user_id: string;
        is_admin: boolean;
        created_at: Date;
        updated_at: Date;
    };
    user: {
        id: string;
        kinde_id: string;
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        role: string;
        created_at: Date;
        last_login: Date;
    };
};

type ApiResponse = {
    success: boolean;
    members: CompanyMember[];
    company: {
        id: string;
        name: string;
        email: string;
        industry: string;
        description: string;
    };
};

export default function MembersPage() {
    const [members, setMembers] = useState<CompanyMember[]>([]);
    const [company, setCompany] = useState<ApiResponse['company'] | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('/api/companies/members');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch members');
                }

                if (data.success) {
                    setMembers(data.members);
                    setCompany(data.company);
                } else {
                    throw new Error('Failed to fetch members');
                }
            } catch (error_) {
                console.error('Error fetching members:', error_);
                setError(
                    error_ instanceof Error
                        ? error_.message
                        : 'An error occurred',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen relative'>
                <div className='w-full space-y-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                    <div className='w-full max-w-7xl mx-auto space-y-8'>
                        {/* Header Section */}
                        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between'>
                            <div className='flex-1 min-w-0 space-y-6'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                                    <div className='size-10 sm:size-12 bg-gray-200 animate-pulse rounded-xl'></div>
                                    <div className='flex-1 min-w-0 space-y-2'>
                                        <div className='h-6 bg-gray-200 animate-pulse rounded w-32'></div>
                                        <div className='h-4 bg-gray-200 animate-pulse rounded w-64'></div>
                                    </div>
                                </div>
                                <div className='flex flex-wrap gap-4 sm:gap-6'>
                                    <div className='h-8 bg-gray-200 animate-pulse rounded-lg w-24'></div>
                                    <div className='h-8 bg-gray-200 animate-pulse rounded-lg w-28'></div>
                                    <div className='h-8 bg-gray-200 animate-pulse rounded-lg w-20'></div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6'>
                            <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6'>
                                <div className='flex items-center gap-2 sm:gap-3'>
                                    <div className='size-10 sm:size-12 bg-gray-200 animate-pulse rounded-lg'></div>
                                    <div className='space-y-2'>
                                        <div className='h-4 bg-gray-200 animate-pulse rounded w-20'></div>
                                        <div className='h-6 bg-gray-200 animate-pulse rounded w-16'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6'>
                                <div className='flex items-center gap-2 sm:gap-3'>
                                    <div className='size-10 sm:size-12 bg-gray-200 animate-pulse rounded-lg'></div>
                                    <div className='space-y-2'>
                                        <div className='h-4 bg-gray-200 animate-pulse rounded w-20'></div>
                                        <div className='h-6 bg-gray-200 animate-pulse rounded w-16'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6'>
                                <div className='flex items-center gap-2 sm:gap-3'>
                                    <div className='size-10 sm:size-12 bg-gray-200 animate-pulse rounded-lg'></div>
                                    <div className='space-y-2'>
                                        <div className='h-4 bg-gray-200 animate-pulse rounded w-20'></div>
                                        <div className='h-6 bg-gray-200 animate-pulse rounded w-16'></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Card */}
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 sm:p-8'>
                            <div className='space-y-6'>
                                <div className='h-6 bg-gray-200 animate-pulse rounded w-48'></div>
                                <div className='h-32 bg-gray-200 animate-pulse rounded-lg'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen relative'>
                <div className='w-full space-y-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                    <div className='w-full max-w-7xl mx-auto space-y-8'>
                        {/* Header Section */}
                        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between'>
                            <div className='flex-1 min-w-0 space-y-6'>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                                    <div className='relative group'>
                                        <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-red-400 via-red-700 to-red-900 rounded-xl shadow-lg'>
                                            <Users className='size-6 sm:size-8 text-white' />
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                            Company Members
                                        </h1>
                                        <p className='text-xs sm:text-sm lg:text-base text-red-600 leading-relaxed max-w-2xl'>
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Card */}
                        <div className='bg-white/80 backdrop-blur-sm border border-red-200/60 rounded-xl shadow-sm'>
                            <div className='p-6 sm:p-8 text-center'>
                                <div className='w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                                    <Users className='w-10 h-10 text-red-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                    Failed to Load Members
                                </h3>
                                <p className='text-gray-600 mb-8 leading-relaxed'>
                                    We encountered an error while loading your
                                    team members. Please try again or contact
                                    support if the problem persists.
                                </p>
                                <button
                                    onClick={() => {
                                        globalThis.location.reload();
                                    }}
                                    className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg'
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen relative'>
            {/* Main content */}
            <div className='w-full space-y-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                <div className='w-full max-w-7xl mx-auto space-y-8'>
                    {/* Header Section */}
                    <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between'>
                        {/* Main content section */}
                        <div className='flex-1 min-w-0 space-y-6'>
                            {/* Icon and title section */}
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                                <div className='relative group'>
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-blue-400 via-blue-700 to-blue-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Users className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        Company Members
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        Manage your team members for{' '}
                                        {company?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        {members.length} Members
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-emerald-700'>
                                        {
                                            members.filter(
                                                (m) => m.member.is_admin,
                                            ).length
                                        }{' '}
                                        Admins
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-purple-700'>
                                        Active Team
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6'>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <Users className='size-4 sm:size-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Total Members
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {members.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                    <Crown className='size-4 sm:size-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Administrators
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {
                                            members.filter(
                                                (m) => m.member.is_admin,
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <UserCheck className='size-4 sm:size-5 text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Regular Members
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {
                                            members.filter(
                                                (m) => !m.member.is_admin,
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members Table Card */}
                    <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
                        <div className='p-6 sm:p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='size-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                                    <Building2 className='size-4 text-white' />
                                </div>
                                <h2 className='text-lg font-semibold text-gray-900'>
                                    Team Members ({members.length})
                                </h2>
                            </div>

                            {members.length === 0 ? (
                                <div className='text-center py-12'>
                                    <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                                        <UserPlus className='w-10 h-10 text-gray-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                        No Members Found
                                    </h3>
                                    <p className='text-gray-600 mb-8 leading-relaxed'>
                                        Your company doesn't have any members
                                        yet. Invite team members to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className='border-gray-200'>
                                                <TableHead className='font-semibold text-gray-700'>
                                                    Member
                                                </TableHead>
                                                <TableHead className='font-semibold text-gray-700'>
                                                    Email
                                                </TableHead>
                                                <TableHead className='font-semibold text-gray-700'>
                                                    Role
                                                </TableHead>
                                                <TableHead className='font-semibold text-gray-700'>
                                                    Status
                                                </TableHead>
                                                <TableHead className='font-semibold text-gray-700'>
                                                    Joined
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map((member) => {
                                                return (
                                                    <TableRow
                                                        key={member.member.id}
                                                        className='hover:bg-gray-50/50 transition-colors duration-200'
                                                    >
                                                        <TableCell>
                                                            <div className='flex items-center space-x-3'>
                                                                <Avatar className='h-10 w-10 border-2 border-gray-200'>
                                                                    <AvatarFallback className='text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
                                                                        {member.user.first_name?.charAt(
                                                                            0,
                                                                        ) ||
                                                                            'U'}
                                                                        {member.user.last_name?.charAt(
                                                                            0,
                                                                        ) || ''}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className='font-medium text-gray-900'>
                                                                        {
                                                                            member
                                                                                .user
                                                                                .first_name
                                                                        }{' '}
                                                                        {
                                                                            member
                                                                                .user
                                                                                .last_name
                                                                        }
                                                                    </div>
                                                                    <div className='text-sm text-gray-500 flex items-center gap-1'>
                                                                        <Mail className='h-3 w-3' />
                                                                        @
                                                                        {
                                                                            member
                                                                                .user
                                                                                .username
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='text-gray-700'>
                                                            {member.user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    member.user
                                                                        .role
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                className={
                                                                    member.user
                                                                        .role
                                                                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }
                                                            >
                                                                {member.user
                                                                    .role ||
                                                                    'No role assigned'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    member
                                                                        .member
                                                                        .is_admin
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className={
                                                                    member
                                                                        .member
                                                                        .is_admin
                                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                                        : 'border-gray-300 text-gray-700'
                                                                }
                                                            >
                                                                {member.member
                                                                    .is_admin ? (
                                                                    <div className='flex items-center gap-1'>
                                                                        <Crown className='h-3 w-3' />
                                                                        Admin
                                                                    </div>
                                                                ) : (
                                                                    <div className='flex items-center gap-1'>
                                                                        <UserCheck className='h-3 w-3' />
                                                                        Member
                                                                    </div>
                                                                )}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className='text-gray-700 flex items-center gap-1'>
                                                            <Calendar className='h-3 w-3' />
                                                            {new Date(
                                                                member.member.created_at,
                                                            ).toLocaleDateString()}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
