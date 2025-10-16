'use client';

import { useEffect, useState } from 'react';
import { type Resolver, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Mail,
    MapPin,
    Save,
    Upload,
    X,
    User,
    Edit2,
} from 'lucide-react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { type UserProfileType } from '@/types/user-profile.type';
import { getUserData } from '@/app/actions/get-user-data.action';

// Form validation schema
const userProfileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    avatar: z.string().optional(),
});

const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Product Manager',
    'UI/UX Designer',
    'QA Engineer',
    'Technical Lead',
    'Architect',
    'Mobile Developer',
    'Game Developer',
    'Cybersecurity Specialist',
    'Cloud Engineer',
    'Database Administrator',
    'System Administrator',
    'Other',
];

export default function EditUserProfilePage() {
    const { user, isAuthenticated } = useKindeBrowserClient();
    const router = useRouter();
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState<UserProfileType | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    const form = useForm<UserProfileType>({
        resolver: zodResolver(
            userProfileSchema,
        ) as unknown as Resolver<UserProfileType>,
        defaultValues: {
            id: '',
            organizations: '',
            is_password_reset_requested: false,
            is_suspended: false,
            user_since: 0,
            last_login: 0,
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            role: '',
            bio: '',
            location: '',
            website: '',
            created_at: 0,
            updated_at: 0,
        },
    });

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated || !user?.id) {
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
                    const formattedData: UserProfileType = {
                        id: userProfile.id || '',
                        organizations: userProfile.organizations || '',
                        is_password_reset_requested:
                            userProfile.is_password_reset_requested || false,
                        is_suspended: userProfile.is_suspended || false,
                        user_since: userProfile.user_since || 0,
                        last_login: userProfile.last_login || 0,
                        created_at: userProfile.created_at || 0,
                        updated_at: userProfile.updated_at || 0,
                        first_name: userProfile.first_name || '',
                        last_name: userProfile.last_name || '',
                        username: userProfile.username || '',
                        email: userProfile.email || '',
                        role: userProfile.role || '',
                        bio: userProfile.bio || '',
                        location: userProfile.location || '',
                        website: userProfile.website || '',
                    };
                    setUserData(formattedData);
                    form.reset(formattedData);
                } else {
                    setUserData(undefined);
                    form.reset(form.getValues());
                }
            } catch (error_) {
                console.error('Error fetching user data:', error_);
                setError('Failed to load user data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [form, isAuthenticated, user?.id]);

    const onSubmit = async (data: UserProfileType) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save user profile');
            }

            // Redirect to the profile page after successful save
            router.push(`/dashboard/user-profile/${data.username}`);
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save user profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push(`/dashboard/user-profile/${userData?.username}`);
    };

    // Show loading state
    if (isLoading) {
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
                                        <div className='h-6 bg-gray-200 animate-pulse rounded w-40'></div>
                                        <div className='h-4 bg-gray-200 animate-pulse rounded w-64'></div>
                                    </div>
                                </div>
                                <div className='flex flex-wrap gap-4 sm:gap-6'>
                                    <div className='h-8 bg-gray-200 animate-pulse rounded-lg w-24'></div>
                                    <div className='h-8 bg-gray-200 animate-pulse rounded-lg w-28'></div>
                                </div>
                            </div>
                            <div className='h-10 bg-gray-200 animate-pulse rounded w-32'></div>
                        </div>

                        {/* Main Content Card */}
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 sm:p-8'>
                            <div className='space-y-6'>
                                <div className='h-6 bg-gray-200 animate-pulse rounded w-48'></div>
                                <div className='h-32 bg-gray-200 animate-pulse rounded-lg'></div>
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
                                            <Edit2 className='size-6 sm:size-8 text-white' />
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                            Edit User Profile
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
                                    <Edit2 className='w-10 h-10 text-red-500' />
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
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-purple-400 via-purple-700 to-purple-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Edit2 className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        Edit User Profile
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        {userData
                                            ? 'Update your personal information and preferences'
                                            : 'Create your user profile'}
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-purple-700'>
                                        {userData ? 'Edit Mode' : 'Create Mode'}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        Profile Management
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleCancel}
                                className='cursor-pointer w-full text-sm sm:w-auto h-9 sm:h-10 sm:px-8 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold sm:text-base group'
                            >
                                <ArrowLeft className='w-5 h-5 sm:w-6 sm:h-6 sm:mr-3 group-hover:scale-110 transition-transform duration-200' />
                                <span className='hidden sm:inline'>
                                    Back to Profile
                                </span>
                                <span className='sm:hidden'>Back</span>
                            </Button>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit as SubmitHandler<UserProfileType>,
                            )}
                            className='space-y-6'
                        >
                            {/* User Information Card */}
                            <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
                                <div className='p-6 sm:p-8'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <div className='size-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
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
                                                <Label className='text-sm font-medium text-gray-600'>
                                                    Profile Picture
                                                </Label>
                                                <div className='relative'>
                                                    <Avatar className='h-20 w-20 border-2 border-gray-200'>
                                                        <AvatarFallback className='text-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
                                                            {form
                                                                .watch(
                                                                    'first_name',
                                                                )
                                                                ?.charAt(0) ||
                                                                'U'}
                                                            {form
                                                                .watch(
                                                                    'last_name',
                                                                )
                                                                ?.charAt(0) ||
                                                                ''}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className='absolute -bottom-1 -right-1'>
                                                        <input
                                                            type='file'
                                                            accept='image/*'
                                                            className='hidden'
                                                            id='avatar-upload'
                                                        />
                                                        <Button
                                                            type='button'
                                                            size='sm'
                                                            className='h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700'
                                                            onClick={() => {
                                                                return (
                                                                    document.querySelector(
                                                                        '#avatar-upload',
                                                                    ) as HTMLInputElement
                                                                )?.click();
                                                            }}
                                                        >
                                                            <Upload className='h-4 w-4' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-1 space-y-4'>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <FormField
                                                        control={form.control}
                                                        name='first_name'
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem>
                                                                    <FormLabel className='text-sm font-medium text-gray-600'>
                                                                        First
                                                                        Name
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder='Enter first name'
                                                                            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name='last_name'
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem>
                                                                    <FormLabel className='text-sm font-medium text-gray-600'>
                                                                        Last
                                                                        Name
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            placeholder='Enter last name'
                                                                            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name='username'
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormLabel className='text-sm font-medium text-gray-600'>
                                                                    Username
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder='Enter username'
                                                                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='email'
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                    <Mail className='h-4 w-4' />
                                                                    Email
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type='email'
                                                                        placeholder='user@example.com'
                                                                        className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Role and Location Row */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='role'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                <Briefcase className='h-4 w-4' />
                                                                Role
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                                                                        <SelectValue placeholder='Select role' />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {roles.map(
                                                                        (
                                                                            role,
                                                                        ) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    key={
                                                                                        role
                                                                                    }
                                                                                    value={
                                                                                        role
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        role
                                                                                    }
                                                                                </SelectItem>
                                                                            );
                                                                        },
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                            <FormField
                                                control={form.control}
                                                name='location'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                <MapPin className='h-4 w-4' />
                                                                Location
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder='Enter location'
                                                                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>

                                        {/* Website Row */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='website'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='text-sm font-medium text-gray-600'>
                                                                Website
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder='https://yourwebsite.com'
                                                                    className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex justify-end gap-3'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                    className='gap-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                                >
                                    <X className='h-4 w-4' />
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                                >
                                    <Save className='h-4 w-4' />
                                    {isSubmitting
                                        ? 'Saving...'
                                        : userData
                                          ? 'Save Changes'
                                          : 'Create Profile'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
