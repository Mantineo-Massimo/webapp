import Image from "next/image";

interface ArmoniIconProps {
    className?: string;
    size?: number;
}

export default function ArmoniIcon({ className = "", size = 20 }: ArmoniIconProps) {
    return (
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <Image
                    src="/100.png"
                    alt="Armoni"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    );
}
