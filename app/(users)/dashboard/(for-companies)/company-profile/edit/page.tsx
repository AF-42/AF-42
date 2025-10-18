'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    Globe,
    Phone,
    FileText,
    Edit2,
} from 'lucide-react';
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

// Form validation schema
const companyProfileSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    industry: z.string().min(1, 'Industry is required'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters'),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    phone: z.string().optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
});

type CompanyProfileForm = z.infer<typeof companyProfileSchema>;

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Consulting',
    'Media & Entertainment',
    'Transportation',
    'Energy',
    'Government',
    'Non-profit',
    'Other',
];

const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Japan',
    'Australia',
    'India',
    'Brazil',
    'Mexico',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Switzerland',
    'Austria',
    'Belgium',
];

export default function EditCompanyProfilePage() {
    const { user, isAuthenticated } = useKindeBrowserClient();
    const router = useRouter();
    const [logoPreview, setLogoPreview] = useState<string | undefined>(
        undefined,
    );
    const [bannerPreview, setBannerPreview] = useState<string | undefined>(
        undefined,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyData, setCompanyData] = useState<
        CompanyProfileForm | undefined
    >(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const form = useForm<CompanyProfileForm>({
        resolver: zodResolver(companyProfileSchema),
        defaultValues: {
            name: '',
            email: '',
            country: '',
            city: '',
            industry: '',
            description: '',
            website: '',
            logo: '',
        },
    });

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

                if (!response.ok) {
                    if (response.status === 404) {
                        // Company not found - use initial data for new company
                        setCompanyData(undefined);
                        form.reset(form.getValues());
                        return;
                    }
                    throw new Error('Failed to fetch company data');
                }

                const result = await response.json();
                if (result.success && result.hasCompany) {
                    const { company } = result;
                    const formattedData: CompanyProfileForm = {
                        name: company.name || '',
                        email: company.email || '',
                        country: company.country || '',
                        city: company.city || '',
                        industry: company.industry || '',
                        description: company.description || '',
                        website: company.website || '',
                        phone: company.phone || '',
                        logo: company.logo || '',
                        banner: company.banner || '',
                    };
                    setCompanyData(formattedData);
                    form.reset(formattedData);
                } else {
                    setCompanyData(undefined);
                    form.reset(form.getValues());
                }
            } catch (error_) {
                console.error('Error fetching company data:', error_);
                setError('Failed to load company data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, [form, isAuthenticated, user?.id]);

    const onSubmit = async (data: CompanyProfileForm) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/companies/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save company profile');
            }

            // Redirect to the profile page after successful save
            router.push('/dashboard/company-profile');
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save company profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', (e) => {
                setLogoPreview(e.target?.result as string);
                form.setValue('logo', e.target?.result as string);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        router.push('/dashboard/company-profile');
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

                        {/* Main Content Card */}
                        <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 sm:p-8'>
                            <div className='space-y-6'>
                                <div className='h-6 bg-gray-200 animate-pulse rounded w-48'></div>
                                <div className='h-32 bg-gray-200 animate-pulse rounded-lg'></div>
                                <div className='h-32 bg-gray-200 animate-pulse rounded-lg'></div>
                                <div className='h-32 bg-gray-200 animate-pulse rounded-lg'></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex justify-end gap-3'>
                            <div className='h-10 bg-gray-200 animate-pulse rounded w-20'></div>
                            <div className='h-10 bg-gray-200 animate-pulse rounded w-24'></div>
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
                                            Edit Company Profile
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
                                    Failed to Load Company Data
                                </h3>
                                <p className='text-gray-600 mb-8 leading-relaxed'>
                                    We encountered an error while loading your
                                    company data. Please try again or contact
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
                                    <div className='inline-flex items-center justify-center size-10 sm:size-12 bg-gradient-to-br from-orange-400 via-orange-700 to-orange-900 rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300'>
                                        <Edit2 className='size-6 sm:size-8 text-white' />
                                    </div>
                                    <div className='absolute -top-1 -right-1 size-3 sm:size-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center'>
                                        <div className='size-1.5 sm:size-2 bg-white rounded-full'></div>
                                    </div>
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 bg-clip-text leading-tight'>
                                        Edit Company Profile
                                    </h1>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed max-w-2xl'>
                                        {companyData
                                            ? 'Update your company information and branding'
                                            : 'Create your company profile'}
                                    </p>
                                </div>
                            </div>

                            {/* Status indicators */}
                            <div className='flex flex-wrap gap-4 sm:gap-6'>
                                <div className='flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200'>
                                    <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-orange-700'>
                                        {companyData
                                            ? 'Edit Mode'
                                            : 'Create Mode'}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-emerald-700'>
                                        Auto-save Enabled
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200'>
                                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <span className='text-sm font-medium text-blue-700'>
                                        Form Validation
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Back button section */}
                        <div className='flex-shrink-0 w-full sm:w-auto'>
                            <Button
                                variant='outline'
                                onClick={handleCancel}
                                className='cursor-pointer w-full text-sm sm:w-auto h-9 sm:h-10 sm:px-6 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold sm:text-base group'
                            >
                                <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 group-hover:scale-110 transition-transform duration-200' />
                                <span className='hidden sm:inline'>
                                    Back to Profile
                                </span>
                                <span className='sm:hidden'>Back</span>
                            </Button>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'
                        >
                            {/* Company Information Card */}
                            <div className='bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200'>
                                <div className='p-6 sm:p-8'>
                                    <div className='flex items-center gap-3 mb-6'>
                                        <div className='size-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center'>
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
                                                <Label className='text-sm font-medium text-gray-600'>
                                                    Company Logo
                                                </Label>
                                                <div className='relative'>
                                                    <Avatar className='h-20 w-20 border-2 border-gray-200'>
                                                        <AvatarImage
                                                            src={
                                                                logoPreview ||
                                                                form.watch(
                                                                    'logo',
                                                                )
                                                            }
                                                        />
                                                        <AvatarFallback className='text-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white'>
                                                            {form
                                                                .watch('name')
                                                                ?.charAt(0) ||
                                                                'C'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className='absolute -bottom-1 -right-1'>
                                                        <input
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={
                                                                handleLogoUpload
                                                            }
                                                            className='hidden'
                                                            id='logo-upload'
                                                        />
                                                        <Button
                                                            type='button'
                                                            size='sm'
                                                            className='h-8 w-8 rounded-full p-0 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200'
                                                            onClick={() => {
                                                                (
                                                                    document.querySelector(
                                                                        '#logo-upload',
                                                                    ) as HTMLInputElement
                                                                )?.click();
                                                            }}
                                                        >
                                                            <Upload className='h-4 w-4 text-white' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-1 space-y-4'>
                                                <FormField
                                                    control={form.control}
                                                    name='name'
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormLabel className='text-sm font-medium text-gray-600'>
                                                                    Company Name
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder='Enter company name'
                                                                        className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'
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
                                                                        placeholder='contact@company.com'
                                                                        className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>;

                                        {
                                            /* Location Row */
                                        }
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='country'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                <MapPin className='h-4 w-4' />
                                                                Country
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
                                                                    <SelectTrigger className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'>
                                                                        <SelectValue placeholder='Select country' />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {countries.map(
                                                                        (
                                                                            country,
                                                                        ) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    key={
                                                                                        country
                                                                                    }
                                                                                    value={
                                                                                        country
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        country
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
                                                name='city'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='text-sm font-medium text-gray-600'>
                                                                City
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder='Enter city'
                                                                    className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>;

                                        {/* Industry and Website Row */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <FormField
                                                control={form.control}
                                                name='industry'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                <Briefcase className='h-4 w-4' />
                                                                Industry
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
                                                                    <SelectTrigger className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'>
                                                                        <SelectValue placeholder='Select industry' />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {industries.map(
                                                                        (
                                                                            industry,
                                                                        ) => {
                                                                            return (
                                                                                <SelectItem
                                                                                    key={
                                                                                        industry
                                                                                    }
                                                                                    value={
                                                                                        industry
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        industry
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
                                                name='website'
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                                <Globe className='h-4 w-4' />
                                                                Website
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder='https://company.com'
                                                                    className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>

                                        {/* Phone */}
                                        <FormField
                                            control={form.control}
                                            name='phone'
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                            <Phone className='h-4 w-4' />
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder='+1 (555) 123-4567'
                                                                className='border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />

                                        {/* Description */}
                                        <FormField
                                            control={form.control}
                                            name='description'
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                                                            <FileText className='h-4 w-4' />
                                                            Company Description
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                placeholder='Tell us about your company...'
                                                                className='min-h-[120px] border-gray-300 focus:border-orange-500 focus:ring-orange-500'
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

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row justify-end gap-3 sm:gap-4'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                    className='w-full sm:w-auto h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-semibold'
                                >
                                    <X className='h-4 w-4 mr-2' />
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='w-full sm:w-auto h-10 px-8 bg-gradient-to-br from-orange-400 via-orange-700 to-orange-900 text-white shadow-xl hover:shadow-2xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 font-semibold group'
                                >
                                    <Save className='h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200' />
                                    {isSubmitting
                                        ? 'Saving...'
                                        : companyData
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
