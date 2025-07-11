// eslint-disable-next-line @typescript-eslint/no-unused-vars
'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function GithubSignInButton() {
  const searchParams = useSearchParams();
  // callbackUrl is available but not used in this implementation
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={() => {
        // TODO: Implement GitHub authentication
        // console.log('continue with github clicked');
      }}
    >
      <Icons.github className='mr-2 h-4 w-4' />
      Continue with Github
    </Button>
  );
}
