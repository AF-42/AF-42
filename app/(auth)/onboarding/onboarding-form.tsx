'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingFormProps {
	isNewUser: boolean;
}

export function OnboardingForm({ isNewUser }: OnboardingFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Here you would typically save the onboarding data to your database
			// For now, we'll just simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to dashboard after successful onboarding
			router.push('/dashboard');
		} catch (error) {
			console.error('Onboarding error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSkip = () => {
		router.push('/dashboard');
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="displayName">Display Name</Label>
						<Input id="displayName" type="text" placeholder="Enter your display name" required />
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Bio (Optional)</Label>
						<Input id="bio" type="text" placeholder="Tell us about yourself" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="interests">Interests (Optional)</Label>
						<Input id="interests" type="text" placeholder="What are you interested in?" />
					</div>

					<div className="flex flex-col space-y-3 pt-4">
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Setting up...' : isNewUser ? 'Complete Setup' : 'Update Profile'}
						</Button>

						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={handleSkip}
							disabled={isLoading}
						>
							Skip for Now
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
