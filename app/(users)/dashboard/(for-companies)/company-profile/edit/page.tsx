'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Briefcase, Building2, Globe, Mail, MapPin, Save, Upload, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';

// Form validation schema
const companyProfileSchema = z.object({
    name        : z.string().min(1, 'Company name is required'),
    email       : z.string().email('Invalid email address'),
    country     : z.string().min(1, 'Country is required'),
    city        : z.string().min(1, 'City is required'),
    industry    : z.string().min(1, 'Industry is required'),
    description : z.string().min(10, 'Description must be at least 10 characters'),
    website     : z.string().url('Invalid website URL').optional().or(z.literal('')),
    phone       : z.string().optional(),
    logo        : z.string().optional(),
    banner      : z.string().optional()
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
    'Other'
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
    'Belgium'
];

export default function EditCompanyProfilePage() {
    const { user, isAuthenticated } = useKindeBrowserClient();
    const router = useRouter();
    const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
    const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyData, setCompanyData] = useState<CompanyProfileForm | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const form = useForm<CompanyProfileForm>({
        resolver      : zodResolver(companyProfileSchema),
        defaultValues : {
            name        : '',
            email       : '',
            country     : '',
            city        : '',
            industry    : '',
            description : '',
            website     : '',
            logo        : ''
        }
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
                        name        : company.name || '',
                        email       : company.email || '',
                        country     : company.country || '',
                        city        : company.city || '',
                        industry    : company.industry || '',
                        description : company.description || '',
                        website     : company.website || '',
                        phone       : company.phone || '',
                        logo        : company.logo || '',
                        banner      : company.banner || ''
                    };
                    setCompanyData(formattedData);
                    form.reset(formattedData);
                }
                else {
                    setCompanyData(undefined);
                    form.reset(form.getValues());
                }
            }
            catch (error_) {
                console.error('Error fetching company data:', error_);
                setError('Failed to load company data');
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchCompanyData();
    }, [form, isAuthenticated, user?.id]);

    const onSubmit = async (data: CompanyProfileForm) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/companies/profile', {
                method  : 'PUT',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to save company profile');
            }

            // Redirect to the profile page after successful save
            router.push('/dashboard/company-profile');
        }
        catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save company profile');
        }
        finally {
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
            <div className="container mx-auto py-8 px-4 max-w-full">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Edit Company Profile</h1>
                            <p className="text-muted-foreground">Loading company information...</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
                        <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-full">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Edit Company Profile</h1>
                            <p className="text-muted-foreground text-destructive">{error}</p>
                        </div>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Failed to load company data. Please try again.</p>
                        <Button onClick={() => {
                            globalThis.location.reload();
                        }} className="mt-4">
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-full">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Company Profile</h1>
                            <p className="text-muted-foreground">
                                {companyData
                                    ? 'Update your company information and branding'
                                    : 'Create your company profile'}
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Company Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo and Name Row */}
                                <div className="flex items-start gap-6">
                                    <div className="space-y-2">
                                        <Label>Company Logo</Label>
                                        <div className="relative">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={logoPreview || form.watch('logo')} />
                                                <AvatarFallback className="text-lg">
                                                    {form.watch('name')?.charAt(0) || 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                    id="logo-upload"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    className="h-8 w-8 rounded-full p-0"
                                                    onClick={() => {
                                                        return (document.querySelector('#logo-upload') as HTMLInputElement)?.click();
                                                    }}
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Company Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Enter company name" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                placeholder="contact@company.com"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Location Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        Country
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {countries.map((country) => {
                                                                return (
                                                                    <SelectItem key={country} value={country}>
                                                                        {country}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter city" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>

                                {/* Industry and Website Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="industry"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Briefcase className="h-4 w-4" />
                                                        Industry
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select industry" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {industries.map((industry) => {
                                                                return (
                                                                    <SelectItem key={industry} value={industry}>
                                                                        {industry}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="https://company.com" />
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
                                    name="phone"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="+1 (555) 123-4567" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Company Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Tell us about your company..."
                                                        className="min-h-[120px]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={handleCancel} className="gap-2">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                <Save className="h-4 w-4" />
                                {isSubmitting ? 'Saving...' : (companyData ? 'Save Changes' : 'Create Profile')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
