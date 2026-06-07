import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid2x2PlusIcon } from 'lucide-react';
import { Particles } from '@/components/ui/particles';
import logo from '@/assets/steam.png';

export function Login() {
    // This will eventually point to your Express/Node backend route 
    // e.g., window.location.href = 'http://localhost:3000/auth/steam'
    const handleSteamLogin = () => {
        console.log("Redirecting to Steam OpenID...");
        // window.location.href = '/api/auth/steam'; 
    };

    return (
        <div className="relative md:h-screen md:overflow-hidden w-full bg-background text-foreground">
            <Particles
                color="#666666"
                quantity={120}
                ease={20}
                className="absolute inset-0"
            />
            
            {/* Background Gradients for depth */}
            <div
                aria-hidden
                className="absolute inset-0 isolate -z-10 contain-strict"
            >
                <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[21rem] -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-[80rem] w-[15rem] [translate:5%_-50%] -rotate-45 rounded-full" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
                <div className="mx-auto space-y-6 sm:w-[24rem]">
                    
                    {/* Brand Header */}
                    <div className="flex items-center gap-2 justify-center mb-8">
                        <Grid2x2PlusIcon className="size-8 text-primary" />
                        <p className="text-3xl font-bold tracking-tight">Ludex</p>
                    </div>
                    
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="font-heading text-2xl font-bold tracking-wide">
                            Connect your Library
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Sign in securely via Steam to aggregate your games, playtime, and achievements.
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button 
                            type="button" 
                            size="lg" 
                            className="w-full bg-[#171a21] hover:bg-[#2a475e] text-white transition-colors border border-[#66c0f4]/20"
                            onClick={handleSteamLogin}
                        >
                            Sign In with Steam
                            <SteamIcon className="me-2 size-6 bg-white rounded-4xl" />
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-8 text-xs text-center leading-relaxed">
                        We use Steam OpenID. Ludex will never see or store your password. <br/>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Clean SVG icon for Steam
const SteamIcon = (props: React.ComponentProps<'img'>) => (
<img src={logo} {...props} alt="steam" />
);