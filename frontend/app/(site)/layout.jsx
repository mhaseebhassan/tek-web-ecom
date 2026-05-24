import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundShapes from '@/components/BackgroundShapes';

export default function SiteLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            <BackgroundShapes />
            {/* Dynamic Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[0%] left-[-10%] w-[55%] h-[55%] bg-cyan-500/28 blur-[180px] rounded-full animate-pulse"></div>
                <div className="absolute top-[0%] right-[-15%] w-[60%] h-[60%] bg-blue-500/26 blur-[200px] rounded-full animate-pulse [animation-delay:2s]"></div>
                <div className="absolute top-[38%] right-[5%] w-[45%] h-[45%] bg-teal-500/22 blur-[180px] rounded-full animate-pulse [animation-delay:4s]"></div>
            </div>

            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
