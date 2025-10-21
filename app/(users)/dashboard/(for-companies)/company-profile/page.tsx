'use client';

import { useEffect, useState } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Edit2, Mail, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as print from '@/lib/print-helpers';

// Company profile data type
type CompanyProfile = {
    name: string;
    email: string;
    country: string;
    city: string;
    industry: string;
    description: string;
    website: string;
    logo: string;
};

export default function CompanyProfilePage() {
    const { user, isAuthenticated } = useKindeBrowserClient();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [companyData, setCompanyData] = useState<CompanyProfile | undefined>(
        undefined,
    );
    const [error, setError] = useState<string | undefined>(undefined);

    // Fetch company data on component mount
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (!isAuthenticated || !user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(undefined);

                const response = await fetch('/api/companies/profile/user');
                print.log('response', response);

                if (!response.ok) {
                    if (response.status === 404) {
                        // Company not found - redirect to create/edit page
                        router.push('/dashboard/company-profile/edit');
                        return;
                    }
                    throw new Error('Failed to fetch company data');
                }

                const result = await response.json();
                print.log('result', result);
                if (result.success && result.hasCompany) {
                    const { company } = result;
                    print.log('company', company);
                    const formattedData: CompanyProfile = {
                        name: company.name || '',
                        email: company.email || '',
                        country: company.country || '',
                        city: company.city || '',
                        industry: company.industry || '',
                        description: company.description || '',
                        website: company.website || '',
                        logo: company.logo || '',
                    };
                    setCompanyData(formattedData);
                } else {
                    // No company found - redirect to create/edit page
                    router.push('/dashboard/company-profile/edit');
                }
            } catch (error_) {
                console.error('Error fetching company data:', error_);
                setError('Failed to load company data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, [isAuthenticated, user?.id, router]);

    const handleEdit = () => {
        router.push('/dashboard/company-profile/edit');
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
                                            <Building2 className='size-6 sm:size-8 text-white' />
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                            Company Profile
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
                                    <Building2 className='w-10 h-10 text-red-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                    Failed to Load Company Profile
                                </h3>
                                <p className='text-gray-600 mb-8 leading-relaxed'>
                                    We encountered an error while loading your
                                    company profile. Please try again or contact
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

    // If no company data, this shouldn't render as we redirect to edit page
    if (!companyData) {
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
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-purple-400 via-purple-700 to-purple-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Building2 className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        Company Profile
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        View your company information and
                                        branding
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200'>
                                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-purple-700'>
                                        {companyData.industry || 'Business'}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-emerald-700'>
                                        Active Company
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        Verified Profile
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Button
                                onClick={handleEdit}
                                className='cursor-pointer w-full text-sm sm:w-auto h-9 sm:h-10 sm:px-8 bg-gradient-to-br from-purple-400 via-purple-700 to-purple-900 text-white shadow-xl hover:shadow-2xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 font-semibold sm:text-base group'
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
                                <div className='size-10 sm:size-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                    <Building2 className='size-4 sm:size-5 text-purple-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Company Name
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900 truncate'>
                                        {companyData.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-emerald-100 rounded-lg flex items-center justify-center'>
                                    <Briefcase className='size-4 sm:size-5 text-emerald-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Industry
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {companyData.industry || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='size-10 sm:size-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <MapPin className='size-4 sm:size-5 text-blue-600' />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                        Location
                                    </p>
                                    <p className='text-lg sm:text-xl font-bold text-gray-900'>
                                        {companyData.city && companyData.country
                                            ? `${companyData.city}, ${companyData.country}`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Information Card */}
                    <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
                        <div className='p-6 sm:p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='size-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center'>
                                    <Building2 className='size-4 text-white' />
                                </div>
                                <h2 className='text-lg font-semibold text-gray-900'>
                                    Company Information
                                </h2>
                            </div>

                            <div className='space-y-6'>
                                {/* Logo and Name Row */}
                                <div className='flex items-start gap-6'>
                                    <div className='space-y-2'>
                                        <p className='text-sm font-medium text-gray-600'>
                                            Company Logo
                                        </p>
                                        <Avatar className='h-20 w-20 border-2 border-gray-200'>
                                            <AvatarImage
                                                src={companyData.logo}
                                            />
                                            <AvatarFallback className='text-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white'>
                                                {companyData.name?.charAt(0) ||
                                                    'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className='flex-1 space-y-4'>
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Company Name
                                            </p>
                                            <p className='text-lg font-semibold text-gray-900'>
                                                {companyData.name}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Mail className='h-4 w-4 text-gray-500' />
                                            <p className='text-sm font-medium text-gray-600'>
                                                Email
                                            </p>
                                            <p className='text-sm text-gray-700'>
                                                {companyData.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location and Industry Row */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                                        <MapPin className='h-5 w-5 text-gray-600' />
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Location
                                            </p>
                                            <p className='text-sm font-semibold text-gray-900'>
                                                {companyData.city &&
                                                companyData.country
                                                    ? `${companyData.city}, ${companyData.country}`
                                                    : 'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                                        <Briefcase className='h-5 w-5 text-gray-600' />
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Industry
                                            </p>
                                            <p className='text-sm font-semibold text-gray-900'>
                                                {companyData.industry ||
                                                    'Not specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Website Row */}
                                {companyData.website && (
                                    <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'>
                                        <Globe className='h-5 w-5 text-gray-600' />
                                        <div>
                                            <p className='text-sm font-medium text-gray-600'>
                                                Website
                                            </p>
                                            <a
                                                href={companyData.website}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200'
                                            >
                                                {companyData.website}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <p className='text-sm font-medium text-gray-600 mb-2'>
                                        Company Description
                                    </p>
                                    <div className='p-4 bg-gray-50 rounded-lg'>
                                        <p className='text-sm leading-relaxed text-gray-700'>
                                            {companyData.description ||
                                                'No description provided'}
                                        </p>
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
