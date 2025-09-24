import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/main-layout';

export default function LoginPage() {
	return (
		<MainLayout>
			<LoginLink>
				<Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm">
					Login
				</Button>
			</LoginLink>
		</MainLayout>
	);
}
