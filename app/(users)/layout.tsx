import MainLayout from '@/components/layouts/main-layout';
import { AuthProvider } from '../AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<MainLayout>{children}</MainLayout>
		</AuthProvider>
	);
}
