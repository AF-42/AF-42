import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { AuthProvider } from '../AuthProvider';
import { AppSidebar, DynamicBreadcrumb } from '@/components/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getUserByKindeIdController } from '@/backend/controllers/users/getUserByKindeId.controller';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const { getUser, isAuthenticated } = getKindeServerSession();
    // Todo: redirect to proper page if user is not authenticated
    if (!(await isAuthenticated())) {
        redirect('/home');
    }

    const user = await getUser();
    const userKindeId = user?.id;

    const currentUser = await getUserByKindeIdController(userKindeId || '');

    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar currentUser={currentUser[0]} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                            <DynamicBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}
