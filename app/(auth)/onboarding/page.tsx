import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { RoleSelector } from '@/components/onboarding/role-selector';

export default async function Onboarding() {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const userKindeId = user?.id;

    // Todo: redirect to proper page if user is not authenticated
    if (!(await isAuthenticated())) {
        redirect('/home');
    }

    return (
        <>
            <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-md w-full space-y-8'>
                    Hello,{' '}
                    <span className='font-semibold'>{user?.username}</span>!
                    Please select your role to continue.
                    <RoleSelector userKindeId={userKindeId || ''} />
                </div>
            </div>
        </>
    );
}
