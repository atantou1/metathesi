export const MALE_COLORS = [
    "bg-blue-600", "bg-indigo-600", "bg-slate-700", "bg-cyan-700", 
    "bg-sky-600", "bg-zinc-800", "bg-blue-800", "bg-indigo-800", 
    "bg-cyan-900", "bg-slate-900", "bg-blue-500", "bg-indigo-500"
];
export const FEMALE_COLORS = [
    "bg-rose-500", "bg-pink-500", "bg-orange-500", "bg-amber-500", 
    "bg-red-500", "bg-fuchsia-600", "bg-rose-700", "bg-pink-700", 
    "bg-orange-600", "bg-amber-600", "bg-red-600", "bg-fuchsia-500"
];
export const NEUTRAL_COLORS = [
    "bg-emerald-600", "bg-violet-600", "bg-purple-600", "bg-teal-600", 
    "bg-lime-600", "bg-yellow-600", "bg-emerald-700", "bg-violet-700",
    "bg-purple-700", "bg-teal-700"
];

export const getGenderFromName = (name: string) => {
    const n = name.trim().toLowerCase();
    if (!n) return "neutral";
    
    // Male endings
    if (n.endsWith('ος') || n.endsWith('ας') || n.endsWith('ης') || n.endsWith('ες') ||
        n.endsWith('ός') || n.endsWith('άς') || n.endsWith('ής') || n.endsWith('ές')) {
        return "male";
    }
    
    // Female endings
    if (n.endsWith('α') || n.endsWith('η') || n.endsWith('ω') ||
        n.endsWith('ά') || n.endsWith('ή') || n.endsWith('ώ')) {
        return "female";
    }
    
    return "neutral";
};


export const getRandomColorForGender = (gender: string) => {
    const pool = gender === "male" ? MALE_COLORS : 
                 gender === "female" ? FEMALE_COLORS : 
                 NEUTRAL_COLORS;
    return pool[Math.floor(Math.random() * pool.length)];
};
