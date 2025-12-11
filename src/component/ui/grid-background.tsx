export function GridBackground({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:80px_80px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
            </div>
            
            {/* Content */}
            {children}
        </div>
    );
}
