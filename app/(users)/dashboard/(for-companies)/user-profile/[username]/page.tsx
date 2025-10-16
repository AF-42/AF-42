'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import {
    Briefcase,
    Building2,
    Edit2,
    Mail,
    User,
    Calendar,
    Shield,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserData } from '@/app/actions/get-user-data.action';
import * as print from '@/lib/print-helpers';
import { type UserProfileType } from '@/types/user-profile.type';

// User profile data type
type UserProfile = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: string;
    organizations: string;
    is_password_reset_requested: boolean;
    is_suspended: boolean;
    user_since: number;
    last_login: number;
    created_at: number;
    updated_at: number;
};

export default function UserProfilePage() {
    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
    } = useKindeBrowserClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    // Wait for authentication to load
    useEffect(() => {
        if (authLoading) {
            print.message('Authentication is still loading...');
            return;
        }

        if (!isAuthenticated) {
            print.message('User is not authenticated, redirecting to home');
            router.push('/home');
            return;
        }

        print.message('User is authenticated, proceeding with data fetch');
    }, [authLoading, isAuthenticated, router]);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            // Wait for auth to finish loading
            if (authLoading) {
                return;
            }

            if (!isAuthenticated || !user?.id) {
                print.message(
                    'Not authenticated or no user ID, skipping data fetch',
                );
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(undefined);

                const result = (await getUserData()) as {
                    success: boolean;
                    user: UserProfileType;
                };
                if (result.success && result.user) {
                    const userProfile = result.user;
                    const formattedData: UserProfile = {
                        id: userProfile.id || '',
                        first_name: userProfile.first_name || '',
                        last_name: userProfile.last_name || '',
                        username: userProfile.username || '',
                        email: userProfile.email || '',
                        role: userProfile.role || '',
                        organizations: userProfile.organizations || '',
                        is_password_reset_requested:
                            userProfile.is_password_reset_requested || false,
                        is_suspended: userProfile.is_suspended || false,
                        user_since: userProfile.user_since || 0,
                        last_login: userProfile.last_login || 0,
                        created_at: userProfile.created_at || 0,
                        updated_at: userProfile.updated_at || 0,
                    };
                    setUserData(formattedData);
                } else {
                    // No user found - redirect to create/edit page
                    router.push('/dashboard/user-profile/edit/');
                }
            } catch (error_) {
                print.error('Error fetching user data:', error_);
                setError('Failed to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [authLoading, isAuthenticated, user?.id, router]);

    const handleEdit = () => {
        router.push('/dashboard/user-profile/edit/');
    };

    // Show loading state while auth is loading or data is loading
    if (authLoading || isLoading) {
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
                            <div className='h-10 bg-gray-200 animate-pulse rounded w-32'></div>
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

    // Show error state
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
                                            <User className='size-6 sm:size-8 text-white' />
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                            User Profile
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
                                    <User className='w-10 h-10 text-red-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                    Failed to Load User Data
                                </h3>
                                <p className='text-gray-600 mb-8 leading-relaxed'>
                                    We encountered an error while loading your
                                    profile information. Please try again or
                                    contact support if the problem persists.
                                </p>
                                <Button
                                    onClick={() => {
                                        globalThis.location.reload();
                                    }}
                                    className='bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If no user data, this shouldn't render as we redirect to edit page
    if (!userData) {
        return null;
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
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-cyan-400 via-cyan-700 to-cyan-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <User className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        User Profile
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        View and manage your personal
                                        information and account preferences
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-cyan-50 rounded-lg border border-cyan-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        Active Account
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-emerald-700'>
                                        Verified User
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-purple-700'>
                                        {userData.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Button
                                onClick={handleEdit}
                                className='cursor-pointer w-full text-sm sm:w-auto h-9 sm:h-10 sm:px-8 bg-gradient-to-br from-cyan-400 via-cyan-700 to-cyan-900 text-white shadow-xl hover:shadow-2xl hover:from-cyan-500 hover:to-cyan-600 transition-all duration-300 font-semibold sm:text-base group'
                            >
                                <Edit2 className='w-5 h-5 sm:w-6 sm:h-6 sm:mr-3 group-hover:scale-110 transition-transform duration-200' />
                                <span className='hidden sm:inline'>
                                    Edit Profile
                                </span>
                                <span className='sm:hidden'>Edit</span>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6'>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-cyan-100 rounded-lg flex items-center justify-center'>
                                    <User className='size-4 sm:size-5 text-cyan-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Member Since
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {userData.user_since
                                            ? new Date(
                                                  userData.user_since * 1000,
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                    <Clock className='size-4 sm:size-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Last Login
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {userData.last_login
                                            ? new Date(
                                                  userData.last_login * 1000,
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <Shield className='size-4 sm:size-5 text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Account Status
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {userData.is_suspended
                                            ? 'Suspended'
                                            : 'Active'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Information Card */}
                    <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
                        <div className='p-6 sm:p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='size-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center'>
                                    <Building2 className='size-4 text-white' />
                                </div>
                                <h2 className='text-lg font-semibold text-gray-900'>
                                    Personal Information
                                </h2>
                            </div>

                            <div className='space-y-6'>
                                {/* Avatar and Name Row */}
                                <div className='flex items-start gap-6'>
                                    <div className='space-y-2'>
                                        <p className='text-sm font-medium text-gray-600'>
                                            Profile Picture
                                        </p>
                                        <Avatar className='h-20 w-20 border-2 border-gray-200'>
                                            <AvatarFallback className='text-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white'>
                                                {userData.first_name?.charAt(
                                                    0,
                                                ) || 'U'}
                                                {userData.last_name?.charAt(
                                                    0,
                                                ) || ''}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className='flex-1 space-y-4'>
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Full Name
                                            </p>
                                            <p className='text-lg font-semibold text-gray-900'>
                                                {userData.first_name}{' '}
                                                {userData.last_name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Username
                                            </p>
                                            <p className='text-sm text-gray-700 font-medium'>
                                                @{userData.username}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Mail className='h-4 w-4 text-gray-500' />
                                            <p className='text-sm font-medium text-gray-600'>
                                                Email
                                            </p>
                                            <p className='text-sm text-gray-700'>
                                                {userData.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Role and Additional Info */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                                        <Briefcase className='h-5 w-5 text-gray-600' />
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Role
                                            </p>
                                            <p className='text-sm font-semibold text-gray-900'>
                                                {userData.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                                        <Calendar className='h-5 w-5 text-gray-600' />
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Account Created
                                            </p>
                                            <p className='text-sm font-semibold text-gray-900'>
                                                {userData.created_at
                                                    ? new Date(
                                                          userData.created_at *
                                                              1000,
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
