import Link from 'next/link';
import { type ChallengeType } from '@/types/challenge.type';
import {
    Card, CardContent, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AllChallengeCardComponent(challenge: ChallengeType) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Challenge Name:{challenge.challenge_name}</CardTitle>
                <CardTitle>Challenge Id:{challenge.id}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Challenge Industry:{challenge.challenge_industry}</p>
                <p>Challenge Difficulty:{challenge.challenge_difficulty}</p>
                <p>Challenge Type:{challenge.challenge_type}</p>
                <p>Challenge Status:{challenge.challenge_status}</p>
                <p>Is Published:{challenge.is_published.toString()}</p>
                <p>Engineer ID:{challenge.engineer_id}</p>
                <p>Company ID:{challenge.company_id}</p>
                <p>Github URL:{challenge.github_url}</p>
                <p>Created At:{challenge.created_at.toLocaleString()}</p>
                <p>Updated At:{challenge.updated_at.toLocaleString()}</p>
            </CardContent>
            <CardFooter>
                <Link href={`/challenge/${challenge.id}`}>
                    <Button variant="outline">View Challenge</Button>
                </Link>
                <Link href={`/challenge/${challenge.id}/edit`}>
                    <Button variant="outline">Edit Challenge</Button>
                </Link>
                <Button variant="outline">Delete Challenge</Button>
            </CardFooter>
        </Card>
    );
}
